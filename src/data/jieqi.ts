export interface SolarTerm {
  name: string
  index: number
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

export const SOLAR_TERM_NAMES = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
] as const

function getTargetLongitude(index: number): number {
  return (index * 15 + 315) % 360
}

function sunLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0
  const l = 280.46646 + 36000.76983 * t + 0.0003032 * t * t
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t
  const mRad = m * Math.PI / 180
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * mRad)
    + 0.000289 * Math.sin(3 * mRad)
  return ((l + c) % 360 + 360) % 360
}

function calcTermJD(year: number, termIndex: number): number {
  const targetLon = getTargetLongitude(termIndex)
  const approxLichunJD = 2451545.0 + 365.25 * (year - 2000) + 3.5
  let jd = approxLichunJD + termIndex * 15.218
  for (let i = 0; i < 5; i++) {
    const lon = sunLongitude(jd)
    let diff = targetLon - lon
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    jd += diff * 365.25 / 360
  }
  return jd
}

function jdToDate(jd: number): { year: number; month: number; day: number; hour: number; minute: number } {
  const ms = (jd - 2440587.5) * 86400000
  const d = new Date(ms)
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  }
}

export function getSolarTermDates(year: number): SolarTerm[] {
  const terms: SolarTerm[] = []
  for (let i = 0; i < 24; i++) {
    const jd = calcTermJD(year, i)
    const dt = jdToDate(jd)
    if (dt.year !== year) continue
    terms.push({
      name: SOLAR_TERM_NAMES[i]!,
      index: i,
      year,
      month: dt.month,
      day: dt.day,
      hour: dt.hour,
      minute: dt.minute,
    })
  }
  terms.sort((a, b) => new Date(a.year, a.month - 1, a.day, a.hour, a.minute).getTime()
    - new Date(b.year, b.month - 1, b.day, b.hour, b.minute).getTime())
  return terms
}

export function getCurrentSolarTerm(date: Date): SolarTerm | null {
  const terms = [...getSolarTermDates(date.getFullYear() - 1), ...getSolarTermDates(date.getFullYear())]
  let current: SolarTerm | null = null
  for (const term of terms) {
    const termDate = new Date(term.year, term.month - 1, term.day, term.hour, term.minute)
    if (termDate.getTime() <= date.getTime()) {
      current = term
    }
  }
  return current
}

export function getNextSolarTerm(date: Date): SolarTerm | null {
  const terms = [...getSolarTermDates(date.getFullYear()), ...getSolarTermDates(date.getFullYear() + 1)]
  for (const term of terms) {
    const termDate = new Date(term.year, term.month - 1, term.day, term.hour, term.minute)
    if (termDate.getTime() > date.getTime()) return term
  }
  return null
}
