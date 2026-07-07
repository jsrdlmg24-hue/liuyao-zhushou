import type { BaGua, DiZhi, FuShen, LiuQin, TianGan } from '../types'
import { GUA_WU_XING } from '../data/bazi'
import { ALL_HEXAGRAMS } from '../data/hexagrams'
import { GUA_NA_GAN, GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { getLiuQin } from './liuqin'

export interface FuShenSourceYao {
  liuqin: LiuQin
}

export function calcFuShen(palace: BaGua, yaos: readonly FuShenSourceYao[]): Array<FuShen | undefined> {
  const palaceHex = ALL_HEXAGRAMS.find(h => h.palace === palace && h.palacePos === 0)
  if (!palaceHex) return []

  const gongWuxing = GUA_WU_XING[palaceHex.palace]
  const ganInner = GUA_NA_GAN[palaceHex.lower].inner
  const ganOuter = GUA_NA_GAN[palaceHex.upper].outer
  const zhiInner = GUA_NA_ZHI[palaceHex.lower].inner
  const zhiOuter = GUA_NA_ZHI[palaceHex.upper].outer
  const allGans: [TianGan, TianGan, TianGan, TianGan, TianGan, TianGan] = [ganInner, ganInner, ganInner, ganOuter, ganOuter, ganOuter]
  const allZhis: [DiZhi, DiZhi, DiZhi, DiZhi, DiZhi, DiZhi] = [zhiInner[0], zhiInner[1], zhiInner[2], zhiOuter[0], zhiOuter[1], zhiOuter[2]]
  const existingLiuqin = new Set(yaos.map(y => y.liuqin))

  const result: Array<FuShen | undefined> = []
  for (let i = 0; i < 6; i++) {
    const zhi = allZhis[i]!
    const gan = allGans[i]!
    const palaceWuxing = ZHI_WU_XING_NAJA[zhi]
    const palaceLiuqin = getLiuQin(gongWuxing, palaceWuxing)
    if (existingLiuqin.has(palaceLiuqin)) {
      result.push(undefined)
    } else {
      result.push({ liuqin: palaceLiuqin, gan, zhi, wuxing: palaceWuxing })
    }
  }
  return result
}
