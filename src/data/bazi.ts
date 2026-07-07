import type { BaGua, DiZhi, GuaGong, TianGan, WuXing } from '../types'

export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

export const GAN_WU_XING: Record<TianGan, WuXing> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
}

export const ZHI_WU_XING: Record<DiZhi, WuXing> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
}

export const GUA_WU_XING: Record<GuaGong, WuXing> = {
  乾: '金',
  兑: '金',
  离: '火',
  震: '木',
  巽: '木',
  坎: '水',
  艮: '土',
  坤: '土',
}

export const WU_XING_SHENG_WO: Record<WuXing, WuXing> = {
  木: '水',
  火: '木',
  土: '火',
  金: '土',
  水: '金',
}

export const WU_XING_WO_SHENG: Record<WuXing, WuXing> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
}

export const WU_XING_KE_WO: Record<WuXing, WuXing> = {
  木: '金',
  火: '水',
  土: '木',
  金: '火',
  水: '土',
}

export const WU_XING_WO_KE: Record<WuXing, WuXing> = {
  木: '土',
  火: '金',
  土: '水',
  金: '木',
  水: '火',
}

export const BAGUA_ORDER: BaGua[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

export const XUN_KONG: Record<string, [DiZhi, DiZhi]> = {
  甲子: ['戌', '亥'],
  甲戌: ['申', '酉'],
  甲申: ['午', '未'],
  甲午: ['辰', '巳'],
  甲辰: ['寅', '卯'],
  甲寅: ['子', '丑'],
}

export const WU_HU_DUN: Record<TianGan, TianGan> = {
  甲: '丙',
  己: '丙',
  乙: '戊',
  庚: '戊',
  丙: '庚',
  辛: '庚',
  丁: '壬',
  壬: '壬',
  戊: '甲',
  癸: '甲',
}

export const WU_SHU_DUN: Record<TianGan, TianGan> = {
  甲: '甲',
  己: '甲',
  乙: '丙',
  庚: '丙',
  丙: '戊',
  辛: '戊',
  丁: '庚',
  壬: '庚',
  戊: '壬',
  癸: '壬',
}

export function getXunKey(gan: TianGan, zhi: DiZhi): keyof typeof XUN_KONG {
  const ganIdx = TIAN_GAN.indexOf(gan)
  const zhiIdx = DI_ZHI.indexOf(zhi)
  const xunStartZhiIdx = ((zhiIdx - ganIdx) % 12 + 12) % 12
  const xunStartZhi = DI_ZHI[xunStartZhiIdx]!
  const key = `甲${xunStartZhi}` as keyof typeof XUN_KONG
  if (!(key in XUN_KONG)) {
    throw new Error(`无法计算旬空：${gan}${zhi}`)
  }
  return key
}
