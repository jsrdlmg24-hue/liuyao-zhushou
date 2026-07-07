import type { TimeContext } from '../types'
import { calcBaZi } from './bazi'
import { getChangShengKeyPositions } from './changsheng'
import { calcAllKongWang } from './kongwang'
import { calcLiuShen } from './liushen'
import { calcTimeShenSha } from './shensha'

export interface TimeContextInput {
  castTime: Date | string
}

export function parseCastTime(castTime: Date | string): Date {
  if (castTime instanceof Date) return new Date(castTime.getTime())
  const date = new Date(castTime)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`无法解析起卦时间：${castTime}`)
  }
  return date
}

export function buildTimeContext(input: TimeContextInput): TimeContext {
  const castTime = parseCastTime(input.castTime)
  const bazi = calcBaZi(castTime)
  const kongwang = calcAllKongWang(bazi)
  const liushen = calcLiuShen(bazi.ri.gan)
  const changsheng = getChangShengKeyPositions(bazi.ri.gan)
  const timeShensha = calcTimeShenSha(bazi)
  return { castTime, bazi, kongwang, liushen, changsheng, timeShensha }
}
