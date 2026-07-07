import type { LiuShen, TianGan } from '../types'
import { LIU_SHEN_ORDER, LIU_SHEN_START } from '../data/deities'

export function calcLiuShen(dayGan: TianGan): LiuShen[] {
  const start = LIU_SHEN_START[dayGan]
  const startIdx = LIU_SHEN_ORDER.indexOf(start)
  return Array.from({ length: 6 }, (_, i) => LIU_SHEN_ORDER[(startIdx + i) % 6]!)
}
