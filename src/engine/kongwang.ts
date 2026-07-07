import type { AllKongWang, DiZhi, KongWang, TianGan, Zhu } from '../types'
import { getXunKey, XUN_KONG } from '../data/bazi'

export function calcKongWang(gan: TianGan, zhi: DiZhi): KongWang {
  const xun = getXunKey(gan, zhi)
  const pair = XUN_KONG[xun]
  if (!pair) {
    throw new Error(`无法找到旬空：${gan}${zhi} -> ${xun}`)
  }
  const [zhi1, zhi2] = pair
  return { xun, zhi1, zhi2 }
}

export function calcAllKongWang(pillars: { nian: Zhu; yue: Zhu; ri: Zhu; shi: Zhu }): AllKongWang {
  return {
    nian: calcKongWang(pillars.nian.gan, pillars.nian.zhi),
    yue: calcKongWang(pillars.yue.gan, pillars.yue.zhi),
    ri: calcKongWang(pillars.ri.gan, pillars.ri.zhi),
    shi: calcKongWang(pillars.shi.gan, pillars.shi.zhi),
  }
}

export function isKong(zhi: DiZhi, kongwang: KongWang): boolean {
  return zhi === kongwang.zhi1 || zhi === kongwang.zhi2
}

export function formatKongWang(kongwang: KongWang): string {
  return `${kongwang.zhi1}${kongwang.zhi2}`
}
