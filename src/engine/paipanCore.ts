import type { DiZhi, PaipanResult, Role, TianGan, WuXing, YaoDetail, YaoNumber, YaoType, YinYang } from '../types'
import { GUA_WU_XING } from '../data/bazi'
import { requireHexagramByCode } from '../data/hexagrams'
import { GUA_NA_GAN, GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { lineFromNumber } from './coinCasting'
import { calcFuShen } from './fushen'
import { getLiuQin } from './liuqin'
import { getShiYing } from './shiying'

export interface PaipanInput {
  /** 六个爻，从初爻到上爻。6老阴、7少阳、8少阴、9老阳。 */
  numbers: readonly YaoNumber[]
}

function assertSixLines(numbers: readonly YaoNumber[]): void {
  if (numbers.length !== 6) {
    throw new Error(`排盘必须正好 6 个爻，收到：${numbers.length}`)
  }
}

function lineToCode(yinYang: YinYang): '0' | '1' {
  return yinYang === '阳' ? '1' : '0'
}

function roleForPosition(position: number, shi: number, ying: number): Role {
  if (position === shi) return '世'
  if (position === ying) return '应'
  return ''
}

export function buildPaipan(input: PaipanInput): PaipanResult {
  const numbers = [...input.numbers]
  assertSixLines(numbers)

  const lineResults = numbers.map(number => lineFromNumber(number))
  const originalCode = lineResults.map(line => lineToCode(line.yinYang)).join('')
  const changedCode = lineResults.map(line => lineToCode(line.changesTo ?? line.yinYang)).join('')
  const originalHex = requireHexagramByCode(originalCode)
  const changedHex = requireHexagramByCode(changedCode)

  const gongWuxing = GUA_WU_XING[originalHex.palace]
  const ganInner = GUA_NA_GAN[originalHex.lower].inner
  const ganOuter = GUA_NA_GAN[originalHex.upper].outer
  const zhiInner = GUA_NA_ZHI[originalHex.lower].inner
  const zhiOuter = GUA_NA_ZHI[originalHex.upper].outer
  const allGans: TianGan[] = [ganInner, ganInner, ganInner, ganOuter, ganOuter, ganOuter]
  const allZhis: DiZhi[] = [...zhiInner, ...zhiOuter]
  const { shi, ying } = getShiYing(originalHex.palacePos)

  const yaosWithoutFushen: YaoDetail[] = []
  for (let i = 0; i < 6; i++) {
    const line = lineResults[i]!
    const zhi = allZhis[i]!
    const gan = allGans[i]!
    const wuxing: WuXing = ZHI_WU_XING_NAJA[zhi]
    const position = i + 1
    yaosWithoutFushen.push({
      position,
      number: numbers[i]!,
      type: line.name as YaoType,
      yinYang: line.yinYang,
      changing: line.changing,
      changedYinYang: line.changesTo ?? line.yinYang,
      gan,
      zhi,
      ganzhi: `${gan}${zhi}`,
      wuxing,
      liuqin: getLiuQin(gongWuxing, wuxing),
      role: roleForPosition(position, shi, ying),
    })
  }

  const fushen = calcFuShen(originalHex.palace, yaosWithoutFushen)
  const yaos = yaosWithoutFushen.map((yao, idx): YaoDetail => {
    const hidden = fushen[idx]
    return hidden ? { ...yao, fushen: hidden } : yao
  })

  const movingPositions = yaos.filter(yao => yao.changing).map(yao => yao.position)

  return {
    inputNumbers: numbers,
    movingPositions,
    original: {
      name: originalHex.name,
      code: originalHex.code,
      upper: originalHex.upper,
      lower: originalHex.lower,
      palace: originalHex.palace,
      palacePos: originalHex.palacePos,
      yaos,
    },
    changed: {
      name: changedHex.name,
      code: changedHex.code,
      upper: changedHex.upper,
      lower: changedHex.lower,
      palace: changedHex.palace,
      palacePos: changedHex.palacePos,
    },
  }
}
