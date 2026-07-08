import type {
  BaGua,
  DiZhi,
  FuShen,
  LiuQin,
  LiuShen,
  ShenShaType,
  TianGan,
  TimeContext,
  TimeShenSha,
  WuXing,
  YaoDetail,
  YaoNumber,
} from '../types'
import { GUA_WU_XING } from '../data/bazi'
import { requireHexagramByCode } from '../data/hexagrams'
import { GUA_NA_GAN, GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { buildPaipan } from './paipanCore'
import { formatBaZi, formatZhu } from './bazi'
import { formatKongWang, isKong } from './kongwang'
import { getLiuQin } from './liuqin'
import { getShiYing } from './shiying'
import { buildTimeContext } from './timeContext'
import { getShenShaForYao } from './shensha'

export interface PlateViewModelInput {
  question?: string
  castTime: Date | string
  numbers: readonly YaoNumber[]
}

export interface PlateHeaderViewModel {
  question: string
  castTimeText: string
  baziText: string
  pillars: {
    nian: string
    yue: string
    ri: string
    shi: string
  }
  kongwangText: {
    nian: string
    yue: string
    ri: string
    shi: string
  }
  monthZhi: DiZhi
  dayGan: TianGan
  dayZhi: DiZhi
  liushen: LiuShen[]
  changshengText: {
    changsheng: string
    diwang: string
    mu: string
    jue: string
  }
  timeShensha: TimeShenSha[]
}

export interface HexagramSummaryViewModel {
  name: string
  code: string
  upper: BaGua
  lower: BaGua
  palace: BaGua
  palacePos: number
  palacePosName: string
}

export interface ChangedYaoViewModel {
  position: number
  yinYang: '阴' | '阳'
  gan: TianGan
  zhi: DiZhi
  ganzhi: string
  wuxing: WuXing
  liuqin: LiuQin
  role: '' | '世' | '应'
}

export interface PlateYaoRowViewModel {
  position: number
  positionName: string
  liushen: LiuShen
  number: YaoNumber
  type: string
  yinYang: '阴' | '阳'
  changing: boolean
  changedYinYang: '阴' | '阳'
  movingMark: '' | '动'
  role: '' | '世' | '应'
  fushen?: FuShen
  original: {
    liuqin: LiuQin
    gan: TianGan
    zhi: DiZhi
    ganzhi: string
    wuxing: WuXing
  }
  changed: ChangedYaoViewModel
  highlights: {
    isMonthZhi: boolean
    isDayZhi: boolean
    isDayKong: boolean
    isYearKong: boolean
    isMonthKong: boolean
    isHourKong: boolean
    isMoving: boolean
    isShi: boolean
    isYing: boolean
    shensha: ShenShaType[]
  }
}

export interface PlateViewModel {
  header: PlateHeaderViewModel
  originalHexagram: HexagramSummaryViewModel
  changedHexagram: HexagramSummaryViewModel
  movingPositions: number[]
  rows: PlateYaoRowViewModel[]
  raw: {
    paipan: ReturnType<typeof buildPaipan>
    timeContext: TimeContext
  }
}

const PALACE_POS_NAMES: Record<number, string> = {
  0: '本宫',
  1: '一世',
  2: '二世',
  3: '三世',
  4: '四世',
  5: '五世',
  6: '游魂',
  7: '归魂',
}

const POSITION_NAMES: Record<number, string> = {
  1: '初爻',
  2: '二爻',
  3: '三爻',
  4: '四爻',
  5: '五爻',
  6: '上爻',
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

function palacePosName(palacePos: number): string {
  return PALACE_POS_NAMES[palacePos] ?? `第${palacePos}位`
}

function buildHexagramSummary(code: string): HexagramSummaryViewModel {
  const hex = requireHexagramByCode(code)
  return {
    name: hex.name,
    code: hex.code,
    upper: hex.upper,
    lower: hex.lower,
    palace: hex.palace,
    palacePos: hex.palacePos,
    palacePosName: palacePosName(hex.palacePos),
  }
}

function buildChangedRows(code: string, originalPalace: BaGua): ChangedYaoViewModel[] {
  const hex = requireHexagramByCode(code)
  const originalGongWuxing = GUA_WU_XING[originalPalace]
  const changedShiYing = getShiYing(hex.palacePos)
  const ganInner = GUA_NA_GAN[hex.lower].inner
  const ganOuter = GUA_NA_GAN[hex.upper].outer
  const zhiInner = GUA_NA_ZHI[hex.lower].inner
  const zhiOuter = GUA_NA_ZHI[hex.upper].outer
  const allGans: TianGan[] = [ganInner, ganInner, ganInner, ganOuter, ganOuter, ganOuter]
  const allZhis: DiZhi[] = [...zhiInner, ...zhiOuter]

  return allZhis.map((zhi, idx) => {
    const gan = allGans[idx]!
    const wuxing = ZHI_WU_XING_NAJA[zhi]
    const position = idx + 1
    return {
      position,
      yinYang: code[idx] === '1' ? '阳' : '阴',
      gan,
      zhi,
      ganzhi: `${gan}${zhi}`,
      wuxing,
      // 文王纳甲六爻排盘中，变爻六亲仍按本卦所属卦宫五行定六亲；不随变卦卦宫重定。
      liuqin: getLiuQin(originalGongWuxing, wuxing),
      role: position === changedShiYing.shi ? '世' : position === changedShiYing.ying ? '应' : '',
    }
  })
}

function buildHeader(question: string, timeContext: TimeContext): PlateHeaderViewModel {
  return {
    question,
    castTimeText: formatDateTime(timeContext.castTime),
    baziText: formatBaZi(timeContext.bazi),
    pillars: {
      nian: formatZhu(timeContext.bazi.nian),
      yue: formatZhu(timeContext.bazi.yue),
      ri: formatZhu(timeContext.bazi.ri),
      shi: formatZhu(timeContext.bazi.shi),
    },
    kongwangText: {
      nian: formatKongWang(timeContext.kongwang.nian),
      yue: formatKongWang(timeContext.kongwang.yue),
      ri: formatKongWang(timeContext.kongwang.ri),
      shi: formatKongWang(timeContext.kongwang.shi),
    },
    monthZhi: timeContext.bazi.yue.zhi,
    dayGan: timeContext.bazi.ri.gan,
    dayZhi: timeContext.bazi.ri.zhi,
    liushen: timeContext.liushen,
    changshengText: {
      changsheng: `长生-${timeContext.changsheng.changsheng}`,
      diwang: `帝旺-${timeContext.changsheng.diwang}`,
      mu: `墓-${timeContext.changsheng.mu}`,
      jue: `绝-${timeContext.changsheng.jue}`,
    },
    timeShensha: timeContext.timeShensha,
  }
}

function buildYaoRow(
  yao: YaoDetail,
  changed: ChangedYaoViewModel,
  timeContext: TimeContext,
): PlateYaoRowViewModel {
  const positionIndex = yao.position - 1
  const shensha = getShenShaForYao(timeContext.bazi.ri.gan, timeContext.bazi.ri.zhi, yao.zhi)
  const baseRow: PlateYaoRowViewModel = {
    position: yao.position,
    positionName: POSITION_NAMES[yao.position] ?? `${yao.position}爻`,
    liushen: timeContext.liushen[positionIndex]!,
    number: yao.number,
    type: yao.type,
    yinYang: yao.yinYang,
    changing: yao.changing,
    changedYinYang: yao.changedYinYang,
    movingMark: yao.changing ? '动' : '',
    role: yao.role,
    original: {
      liuqin: yao.liuqin,
      gan: yao.gan,
      zhi: yao.zhi,
      ganzhi: yao.ganzhi,
      wuxing: yao.wuxing,
    },
    changed,
    highlights: {
      isMonthZhi: yao.zhi === timeContext.bazi.yue.zhi,
      isDayZhi: yao.zhi === timeContext.bazi.ri.zhi,
      isDayKong: isKong(yao.zhi, timeContext.kongwang.ri),
      isYearKong: isKong(yao.zhi, timeContext.kongwang.nian),
      isMonthKong: isKong(yao.zhi, timeContext.kongwang.yue),
      isHourKong: isKong(yao.zhi, timeContext.kongwang.shi),
      isMoving: yao.changing,
      isShi: yao.role === '世',
      isYing: yao.role === '应',
      shensha,
    },
  }

  return yao.fushen ? { ...baseRow, fushen: yao.fushen } : baseRow
}

export function buildPlateViewModel(input: PlateViewModelInput): PlateViewModel {
  const paipan = buildPaipan({ numbers: input.numbers })
  const timeContext = buildTimeContext({ castTime: input.castTime })
  const changedRows = buildChangedRows(paipan.changed.code, paipan.original.palace)
  const rows = paipan.original.yaos.map((yao, idx) => buildYaoRow(yao, changedRows[idx]!, timeContext))

  return {
    header: buildHeader(input.question ?? '', timeContext),
    originalHexagram: buildHexagramSummary(paipan.original.code),
    changedHexagram: buildHexagramSummary(paipan.changed.code),
    movingPositions: paipan.movingPositions,
    rows,
    raw: {
      paipan,
      timeContext,
    },
  }
}
