import type { BaGua, BaZi, DiZhi, ShenShaMark, ShenShaType, TianGan, TimeShenSha } from '../types'
import {
  getGuiRenZhi,
  getGuaShen,
  getHuangEn,
  getShenShaZhi,
  getShiShen,
  getTaiYao,
  getTianDe,
  getTianXi,
  getTianYi,
  getYueDe,
  SHEN_SHA_RULES,
} from '../data/deities'

const YAO_SHEN_SHA: ShenShaType[] = ['天乙贵人', '驿马', '桃花', '劫煞', '亡神', '禄神', '羊刃', '文昌', '华盖']

export function calcYaoShenSha(riGan: TianGan, riZhi: DiZhi, yaoZhis: readonly DiZhi[]): ShenShaMark[] {
  const result: ShenShaMark[] = []
  for (let pos = 0; pos < yaoZhis.length; pos++) {
    const yaoZhi = yaoZhis[pos]!
    for (const type of YAO_SHEN_SHA) {
      const zhisToMatch = getShenshaTargetZhis(type, riGan, riZhi)
      if (zhisToMatch.includes(yaoZhi)) {
        result.push({ position: pos, type })
      }
    }
  }
  return result
}

export function getShenShaForYao(riGan: TianGan, riZhi: DiZhi, yaoZhi: DiZhi): ShenShaType[] {
  return YAO_SHEN_SHA.filter(type => getShenshaTargetZhis(type, riGan, riZhi).includes(yaoZhi))
}

function getShenshaTargetZhis(type: ShenShaType, riGan: TianGan, riZhi: DiZhi): DiZhi[] {
  if (type === '天乙贵人') return getGuiRenZhi(riGan)
  if (type === '禄神' || type === '羊刃' || type === '文昌') return getShenShaZhi(type, riGan)
  return getShenShaZhi(type, riZhi)
}

export function calcTimeShenSha(
  bazi: BaZi,
  hexagramInfo?: { palace: BaGua; palacePos: number; shiPosition: number; isShiYang: boolean },
): TimeShenSha[] {
  const result: TimeShenSha[] = []
  const riGan = bazi.ri.gan
  const riZhi = bazi.ri.zhi
  const yueZhi = bazi.yue.zhi

  const sanHeBased: ShenShaType[] = ['驿马', '桃花', '劫煞', '亡神', '华盖', '将星', '谋星', '灾煞', '天马', '香闺', '床帐']
  for (const type of sanHeBased) {
    const zhis = getShenShaZhi(type, riZhi)
    if (zhis.length > 0) result.push({ name: type, value: zhis.join('') })
  }

  const ganBased: ShenShaType[] = ['禄神', '羊刃', '文昌']
  for (const type of ganBased) {
    const zhis = SHEN_SHA_RULES[type].rule[riGan] ?? []
    if (zhis.length > 0) result.push({ name: type, value: zhis.join('') })
  }

  const guiRenZhis = getGuiRenZhi(riGan)
  if (guiRenZhis.length > 0) result.push({ name: '天乙贵人', value: guiRenZhis.join('') })

  result.push({ name: '天喜', value: getTianXi(yueZhi) })
  result.push({ name: '皇恩', value: getHuangEn(yueZhi) })
  result.push({ name: '天德', value: getTianDe(yueZhi) })
  result.push({ name: '月德', value: getYueDe(yueZhi) })
  result.push({ name: '天医', value: getTianYi(yueZhi) })

  if (hexagramInfo) {
    result.push({ name: '世身', value: getShiShen(hexagramInfo.palacePos) })
    result.push({ name: '卦身', value: getGuaShen(hexagramInfo.shiPosition, hexagramInfo.isShiYang) })
  } else {
    result.push({ name: '世身', value: '—' })
    result.push({ name: '卦身', value: '—' })
  }

  const taiYao = getTaiYao(yueZhi)
  result.push({ name: '胎爻', value: taiYao })

  return result
}
