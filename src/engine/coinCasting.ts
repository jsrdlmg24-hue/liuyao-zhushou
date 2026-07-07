export type LineNumber = 6 | 7 | 8 | 9
export type LineName = '老阴' | '少阳' | '少阴' | '老阳'
export type YinYang = '阴' | '阳'

export interface LineResult {
  number: LineNumber
  name: LineName
  yinYang: YinYang
  changing: boolean
  changesTo?: YinYang
}

export interface CoinFaceRole {
  /** UI label chosen by the user, e.g. 字面 / 背面 / heads / tails / 数字面 / 国徽面 */
  label: string
  /** Traditional line value: yin side counts as 2, yang side counts as 3. */
  value: 2 | 3
}

export interface CoinProfile {
  id: string
  name: string
  yinFace: CoinFaceRole
  yangFace: CoinFaceRole
  note: string
}

export const LINE_BY_NUMBER: Record<LineNumber, LineResult> = {
  6: { number: 6, name: '老阴', yinYang: '阴', changing: true, changesTo: '阳' },
  7: { number: 7, name: '少阳', yinYang: '阳', changing: false },
  8: { number: 8, name: '少阴', yinYang: '阴', changing: false },
  9: { number: 9, name: '老阳', yinYang: '阳', changing: true, changesTo: '阴' },
}

export const TRADITIONAL_CASH_COIN_PROFILE: CoinProfile = {
  id: 'traditional-cash-coin',
  name: '传统铜钱：字面为阴，背面为阳',
  yinFace: { label: '字面/有字/年号面', value: 2 },
  yangFace: { label: '背面/无字/无年号面', value: 3 },
  note: '三个字面为 6 老阴；三个背面为 9 老阳。',
}

export function createUserDefinedCoinProfile(params: {
  id?: string
  name?: string
  yinFaceLabel: string
  yangFaceLabel: string
  note?: string
}): CoinProfile {
  const yinFaceLabel = params.yinFaceLabel.trim()
  const yangFaceLabel = params.yangFaceLabel.trim()
  if (!yinFaceLabel || !yangFaceLabel) {
    throw new Error('必须指定阴面和阳面的显示名称。')
  }
  if (yinFaceLabel === yangFaceLabel) {
    throw new Error('阴面和阳面不能使用同一个名称。')
  }

  return {
    id: params.id ?? 'user-defined-coin',
    name: params.name ?? '用户自定义硬币',
    yinFace: { label: yinFaceLabel, value: 2 },
    yangFace: { label: yangFaceLabel, value: 3 },
    note: params.note ?? '用户先指定哪一面算阴/2、哪一面算阳/3，再投掷。',
  }
}

export function lineFromNumber(number: number): LineResult {
  if (number !== 6 && number !== 7 && number !== 8 && number !== 9) {
    throw new Error(`六爻铜钱数只能是 6/7/8/9，收到：${number}`)
  }
  return LINE_BY_NUMBER[number]
}

export function castLineFromFaceValues(values: readonly (2 | 3)[]): LineResult {
  if (values.length !== 3) {
    throw new Error(`三枚硬币必须正好有 3 个结果，收到：${values.length}`)
  }
  const total = values.reduce<number>((sum, value) => sum + value, 0)
  return lineFromNumber(total)
}

export function castLineFromFaces(
  faces: readonly string[],
  profile: CoinProfile = TRADITIONAL_CASH_COIN_PROFILE,
): LineResult {
  if (faces.length !== 3) {
    throw new Error(`三枚硬币必须正好有 3 个面，收到：${faces.length}`)
  }

  const values = faces.map(face => {
    if (face === profile.yinFace.label) return profile.yinFace.value
    if (face === profile.yangFace.label) return profile.yangFace.value
    throw new Error(`未知硬币面：${face}。必须是 ${profile.yinFace.label} 或 ${profile.yangFace.label}。`)
  })

  return castLineFromFaceValues(values)
}

export function explainCoinProfile(profile: CoinProfile = TRADITIONAL_CASH_COIN_PROFILE): string[] {
  const yin = profile.yinFace.label
  const yang = profile.yangFace.label
  return [
    `${yin} = 阴 = 2`,
    `${yang} = 阳 = 3`,
    `${yin}+${yin}+${yin} = 6 = 老阴 = 阴动变阳`,
    `${yin}+${yin}+${yang} = 7 = 少阳 = 阳静`,
    `${yin}+${yang}+${yang} = 8 = 少阴 = 阴静`,
    `${yang}+${yang}+${yang} = 9 = 老阳 = 阳动变阴`,
  ]
}
