import type { BaZi, DiZhi, TianGan, Zhu } from '../types'
import { DI_ZHI, GAN_WU_XING, TIAN_GAN, WU_HU_DUN, WU_SHU_DUN } from '../data/bazi'
import { getSolarTermDates } from '../data/jieqi'

const MONTH_TERM_INDICES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] as const
const MONTH_ZHI: DiZhi[] = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']

function termDateValue(term: { year: number; month: number; day: number; hour: number; minute: number }): number {
  return new Date(term.year, term.month - 1, term.day, term.hour, term.minute).getTime()
}

export function calcMonthZhi(date: Date): DiZhi {
  const terms = [
    ...getSolarTermDates(date.getFullYear() - 1),
    ...getSolarTermDates(date.getFullYear()),
  ].sort((a, b) => termDateValue(a) - termDateValue(b))

  let currentJieIndex: number | undefined
  for (const term of terms) {
    if (termDateValue(term) <= date.getTime() && MONTH_TERM_INDICES.includes(term.index as typeof MONTH_TERM_INDICES[number])) {
      currentJieIndex = term.index
    }
  }

  if (currentJieIndex === undefined) return '丑'
  const idx = MONTH_TERM_INDICES.indexOf(currentJieIndex as typeof MONTH_TERM_INDICES[number])
  return MONTH_ZHI[idx] ?? '丑'
}

export function calcYearPillar(year: number, month: number, day: number, hour = 0): Zhu {
  let realYear = year
  const liChun = getSolarTermDates(year).find(t => t.index === 0)
  if (liChun) {
    const inputTime = new Date(year, month - 1, day, hour).getTime()
    const liChunTime = termDateValue(liChun)
    if (inputTime < liChunTime) realYear = year - 1
  } else if (month < 2 || (month === 2 && day < 4)) {
    realYear = year - 1
  }

  const gan = TIAN_GAN[((realYear - 4) % 10 + 10) % 10]!
  const zhi = DI_ZHI[((realYear - 4) % 12 + 12) % 12]!
  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

export function calcMonthPillar(yearGan: TianGan, date: Date): Zhu {
  const zhi = calcMonthZhi(date)
  const zhiIdx = MONTH_ZHI.indexOf(zhi)
  const startGan = WU_HU_DUN[yearGan]
  const startGanIdx = TIAN_GAN.indexOf(startGan)
  const gan = TIAN_GAN[(startGanIdx + zhiIdx) % 10]!
  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

export function calcDayPillar(year: number, month: number, day: number, hour = 0): Zhu {
  let adjustedYear = year
  let adjustedMonth = month
  let adjustedDay = day
  if (hour >= 23) {
    adjustedDay += 1
    const daysInMonth = new Date(year, month, 0).getDate()
    if (adjustedDay > daysInMonth) {
      adjustedDay = 1
      adjustedMonth += 1
      if (adjustedMonth > 12) {
        adjustedMonth = 1
        adjustedYear += 1
      }
    }
  }

  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(adjustedYear, adjustedMonth - 1, adjustedDay)
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000)
  const gan = TIAN_GAN[((diffDays % 10) + 10) % 10]!
  const zhi = DI_ZHI[((diffDays + 10) % 12 + 12) % 12]!
  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

const SHI_CHEN_ZHI: Record<number, DiZhi> = {
  23: '子', 0: '子',
  1: '丑', 2: '丑',
  3: '寅', 4: '寅',
  5: '卯', 6: '卯',
  7: '辰', 8: '辰',
  9: '巳', 10: '巳',
  11: '午', 12: '午',
  13: '未', 14: '未',
  15: '申', 16: '申',
  17: '酉', 18: '酉',
  19: '戌', 20: '戌',
  21: '亥', 22: '亥',
}

export function calcHourPillar(dayGan: TianGan, hour: number): Zhu {
  const zhi = SHI_CHEN_ZHI[hour] ?? '子'
  const startGan = WU_SHU_DUN[dayGan]
  const startGanIdx = TIAN_GAN.indexOf(startGan)
  const zhiIdx = DI_ZHI.indexOf(zhi)
  const gan = TIAN_GAN[(startGanIdx + zhiIdx) % 10]!
  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

export function calcBaZi(date: Date): BaZi {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const nian = calcYearPillar(year, month, day, hour)
  const yue = calcMonthPillar(nian.gan, date)
  const ri = calcDayPillar(year, month, day, hour)
  const shi = calcHourPillar(ri.gan, hour)
  return { nian, yue, ri, shi }
}

export function formatZhu(zhu: Zhu): string {
  return `${zhu.gan}${zhu.zhi}`
}

export function formatBaZi(bazi: BaZi): string {
  return `${formatZhu(bazi.nian)}年 ${formatZhu(bazi.yue)}月 ${formatZhu(bazi.ri)}日 ${formatZhu(bazi.shi)}时`
}
