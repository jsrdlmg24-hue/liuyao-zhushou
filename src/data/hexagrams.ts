import type { BaGua, GuaGong, HexagramInfo } from '../types'

/** 八卦二进制编码：三爻从下到上，阳=1，阴=0 */
export const TRIGRAM_TO_BIN: Record<BaGua, string> = {
  乾: '111',
  兑: '110',
  离: '101',
  震: '100',
  巽: '011',
  坎: '010',
  艮: '001',
  坤: '000',
}

const BIN_TO_TRIGRAM = Object.fromEntries(
  Object.entries(TRIGRAM_TO_BIN).map(([gua, code]) => [code, gua]),
) as Record<string, BaGua>

export function getHexagramCode(upper: BaGua, lower: BaGua): string {
  return TRIGRAM_TO_BIN[lower] + TRIGRAM_TO_BIN[upper]
}

export function parseHexagramCode(code: string): { upper: BaGua; lower: BaGua } {
  if (!/^[01]{6}$/.test(code)) {
    throw new Error(`卦码必须是 6 位 0/1 字符串，收到：${code}`)
  }
  const lower = BIN_TO_TRIGRAM[code.slice(0, 3)]
  const upper = BIN_TO_TRIGRAM[code.slice(3, 6)]
  if (!lower || !upper) {
    throw new Error(`无法解析卦码：${code}`)
  }
  return { upper, lower }
}

const PALACE_ROWS: Array<{ palace: GuaGong; rows: Array<[string, BaGua, BaGua]> }> = [
  {
    palace: '乾',
    rows: [
      ['乾为天', '乾', '乾'],
      ['天风姤', '乾', '巽'],
      ['天山遁', '乾', '艮'],
      ['天地否', '乾', '坤'],
      ['风地观', '巽', '坤'],
      ['山地剥', '艮', '坤'],
      ['火地晋', '离', '坤'],
      ['火天大有', '离', '乾'],
    ],
  },
  {
    palace: '兑',
    rows: [
      ['兑为泽', '兑', '兑'],
      ['泽水困', '兑', '坎'],
      ['泽地萃', '兑', '坤'],
      ['泽山咸', '兑', '艮'],
      ['水山蹇', '坎', '艮'],
      ['地山谦', '坤', '艮'],
      ['雷山小过', '震', '艮'],
      ['雷泽归妹', '震', '兑'],
    ],
  },
  {
    palace: '离',
    rows: [
      ['离为火', '离', '离'],
      ['火山旅', '离', '艮'],
      ['火风鼎', '离', '巽'],
      ['火水未济', '离', '坎'],
      ['山水蒙', '艮', '坎'],
      ['风水涣', '巽', '坎'],
      ['天水讼', '乾', '坎'],
      ['天火同人', '乾', '离'],
    ],
  },
  {
    palace: '震',
    rows: [
      ['震为雷', '震', '震'],
      ['雷地豫', '震', '坤'],
      ['雷水解', '震', '坎'],
      ['雷风恒', '震', '巽'],
      ['地风升', '坤', '巽'],
      ['水风井', '坎', '巽'],
      ['泽风大过', '兑', '巽'],
      ['泽雷随', '兑', '震'],
    ],
  },
  {
    palace: '巽',
    rows: [
      ['巽为风', '巽', '巽'],
      ['风天小畜', '巽', '乾'],
      ['风火家人', '巽', '离'],
      ['风雷益', '巽', '震'],
      ['天雷无妄', '乾', '震'],
      ['火雷噬嗑', '离', '震'],
      ['山雷颐', '艮', '震'],
      ['山风蛊', '艮', '巽'],
    ],
  },
  {
    palace: '坎',
    rows: [
      ['坎为水', '坎', '坎'],
      ['水泽节', '坎', '兑'],
      ['水雷屯', '坎', '震'],
      ['水火既济', '坎', '离'],
      ['泽火革', '兑', '离'],
      ['雷火丰', '震', '离'],
      ['地火明夷', '坤', '离'],
      ['地水师', '坤', '坎'],
    ],
  },
  {
    palace: '艮',
    rows: [
      ['艮为山', '艮', '艮'],
      ['山火贲', '艮', '离'],
      ['山天大畜', '艮', '乾'],
      ['山泽损', '艮', '兑'],
      ['火泽睽', '离', '兑'],
      ['天泽履', '乾', '兑'],
      ['风泽中孚', '巽', '兑'],
      ['风山渐', '巽', '艮'],
    ],
  },
  {
    palace: '坤',
    rows: [
      ['坤为地', '坤', '坤'],
      ['地雷复', '坤', '震'],
      ['地泽临', '坤', '兑'],
      ['地天泰', '坤', '乾'],
      ['雷天大壮', '震', '乾'],
      ['泽天夬', '兑', '乾'],
      ['水天需', '坎', '乾'],
      ['水地比', '坎', '坤'],
    ],
  },
]

export const ALL_HEXAGRAMS: HexagramInfo[] = PALACE_ROWS.flatMap(({ palace, rows }) =>
  rows.map(([name, upper, lower], palacePos) => ({
    name,
    code: getHexagramCode(upper, lower),
    upper,
    lower,
    palace,
    palacePos,
  })),
)

const HEXAGRAM_MAP = new Map<string, HexagramInfo>()
const HEXAGRAM_NAME_MAP = new Map<string, HexagramInfo>()
for (const h of ALL_HEXAGRAMS) {
  HEXAGRAM_MAP.set(h.code, h)
  HEXAGRAM_NAME_MAP.set(h.name, h)
}

export function findHexagramByCode(code: string): HexagramInfo | undefined {
  return HEXAGRAM_MAP.get(code)
}

export function findHexagramByName(name: string): HexagramInfo | undefined {
  return HEXAGRAM_NAME_MAP.get(name)
}

export function getHexagramsByPalace(palace: GuaGong): HexagramInfo[] {
  return ALL_HEXAGRAMS.filter(h => h.palace === palace)
}

export function requireHexagramByCode(code: string): HexagramInfo {
  const hexagram = findHexagramByCode(code)
  if (!hexagram) {
    throw new Error(`找不到卦码：${code}`)
  }
  return hexagram
}
