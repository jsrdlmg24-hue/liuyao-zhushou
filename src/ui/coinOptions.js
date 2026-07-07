export const DEFAULT_NUMBERS = [8, 8, 8, 8, 8, 8]
export const LINE_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

export const COIN_THROW_OPTIONS = [
  {
    value: 6,
    throwLabel: '三字',
    type: '老阴',
    meaning: '阴动 → 变阳',
    text: '三字｜6 老阴｜阴动变阳'
  },
  {
    value: 7,
    throwLabel: '两字一背',
    type: '少阳',
    meaning: '阳静',
    text: '两字一背｜7 少阳｜阳静'
  },
  {
    value: 8,
    throwLabel: '一字两背',
    type: '少阴',
    meaning: '阴静',
    text: '一字两背｜8 少阴｜阴静'
  },
  {
    value: 9,
    throwLabel: '三背',
    type: '老阳',
    meaning: '阳动 → 变阴',
    text: '三背｜9 老阳｜阳动变阴'
  }
]

export function coinThrowName(value) {
  return COIN_THROW_OPTIONS.find(item => item.value === Number(value))?.throwLabel || String(value)
}

export function isValidYaoNumber(value) {
  return [6, 7, 8, 9].includes(Number(value))
}
