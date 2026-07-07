import type { DiZhi, LiuShen, ShenShaType, TianGan, WangShuai, WuXing } from '../types'
import { DI_ZHI, ZHI_WU_XING } from './bazi'

export const LIU_SHEN_START: Record<TianGan, LiuShen> = {
  甲: '青龙',
  乙: '青龙',
  丙: '朱雀',
  丁: '朱雀',
  戊: '勾陈',
  己: '腾蛇',
  庚: '白虎',
  辛: '白虎',
  壬: '玄武',
  癸: '玄武',
}

export const LIU_SHEN_ORDER: LiuShen[] = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']

type ShenShaRuleKey = TianGan | DiZhi

export const SHEN_SHA_RULES: Record<ShenShaType, { name: string; rule: Partial<Record<ShenShaRuleKey, DiZhi[]>> }> = {
  天乙贵人: { name: '天乙贵人', rule: { 甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['寅', '午'], 乙: ['子', '申'], 己: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'], 辛: ['寅', '午'] } },
  驿马: { name: '驿马', rule: { 申: ['寅'], 子: ['寅'], 辰: ['寅'], 亥: ['巳'], 卯: ['巳'], 未: ['巳'], 寅: ['申'], 午: ['申'], 戌: ['申'], 巳: ['亥'], 酉: ['亥'], 丑: ['亥'] } },
  桃花: { name: '桃花', rule: { 申: ['酉'], 子: ['酉'], 辰: ['酉'], 亥: ['子'], 卯: ['子'], 未: ['子'], 寅: ['卯'], 午: ['卯'], 戌: ['卯'], 巳: ['午'], 酉: ['午'], 丑: ['午'] } },
  劫煞: { name: '劫煞', rule: { 申: ['巳'], 子: ['巳'], 辰: ['巳'], 亥: ['申'], 卯: ['申'], 未: ['申'], 寅: ['亥'], 午: ['亥'], 戌: ['亥'], 巳: ['寅'], 酉: ['寅'], 丑: ['寅'] } },
  亡神: { name: '亡神', rule: { 申: ['亥'], 子: ['亥'], 辰: ['亥'], 亥: ['寅'], 卯: ['寅'], 未: ['寅'], 寅: ['巳'], 午: ['巳'], 戌: ['巳'], 巳: ['申'], 酉: ['申'], 丑: ['申'] } },
  禄神: { name: '禄神', rule: { 甲: ['寅'], 乙: ['卯'], 丙: ['巳'], 丁: ['午'], 戊: ['巳'], 己: ['午'], 庚: ['申'], 辛: ['酉'], 壬: ['亥'], 癸: ['子'] } },
  羊刃: { name: '羊刃', rule: { 甲: ['卯'], 乙: ['寅'], 丙: ['午'], 丁: ['巳'], 戊: ['午'], 己: ['巳'], 庚: ['酉'], 辛: ['申'], 壬: ['子'], 癸: ['亥'] } },
  文昌: { name: '文昌', rule: { 甲: ['巳'], 乙: ['午'], 丙: ['申'], 丁: ['酉'], 戊: ['申'], 己: ['酉'], 庚: ['亥'], 辛: ['子'], 壬: ['寅'], 癸: ['卯'] } },
  华盖: { name: '华盖', rule: { 申: ['辰'], 子: ['辰'], 辰: ['辰'], 亥: ['未'], 卯: ['未'], 未: ['未'], 寅: ['戌'], 午: ['戌'], 戌: ['戌'], 巳: ['丑'], 酉: ['丑'], 丑: ['丑'] } },
  将星: { name: '将星', rule: { 申: ['子'], 子: ['子'], 辰: ['子'], 亥: ['卯'], 卯: ['卯'], 未: ['卯'], 寅: ['午'], 午: ['午'], 戌: ['午'], 巳: ['酉'], 酉: ['酉'], 丑: ['酉'] } },
  谋星: { name: '谋星', rule: { 申: ['辰'], 子: ['辰'], 辰: ['辰'], 亥: ['未'], 卯: ['未'], 未: ['未'], 寅: ['戌'], 午: ['戌'], 戌: ['戌'], 巳: ['丑'], 酉: ['丑'], 丑: ['丑'] } },
  灾煞: { name: '灾煞', rule: { 申: ['午'], 子: ['午'], 辰: ['午'], 亥: ['酉'], 卯: ['酉'], 未: ['酉'], 寅: ['子'], 午: ['子'], 戌: ['子'], 巳: ['卯'], 酉: ['卯'], 丑: ['卯'] } },
  天马: { name: '天马', rule: { 申: ['寅'], 子: ['寅'], 辰: ['寅'], 亥: ['巳'], 卯: ['巳'], 未: ['巳'], 寅: ['申'], 午: ['申'], 戌: ['申'], 巳: ['亥'], 酉: ['亥'], 丑: ['亥'] } },
  香闺: { name: '香闺', rule: { 申: ['巳'], 子: ['巳'], 辰: ['巳'], 亥: ['申'], 卯: ['申'], 未: ['申'], 寅: ['亥'], 午: ['亥'], 戌: ['亥'], 巳: ['寅'], 酉: ['寅'], 丑: ['寅'] } },
  床帐: { name: '床帐', rule: { 申: ['寅'], 子: ['寅'], 辰: ['寅'], 亥: ['巳'], 卯: ['巳'], 未: ['巳'], 寅: ['申'], 午: ['申'], 戌: ['申'], 巳: ['亥'], 酉: ['亥'], 丑: ['亥'] } },
  天喜: { name: '天喜', rule: {} },
  皇恩: { name: '皇恩', rule: {} },
  天德: { name: '天德', rule: {} },
  月德: { name: '月德', rule: {} },
  天医: { name: '天医', rule: {} },
  世身: { name: '世身', rule: {} },
  卦身: { name: '卦身', rule: {} },
  胎爻: { name: '胎爻', rule: {} },
}

export function getWangShuai(wuxing: WuXing, monthZhi: DiZhi): WangShuai {
  const monthWuxing = ZHI_WU_XING[monthZhi]
  const shengMap: Record<WuXing, WuXing> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }
  const shengWoMap: Record<WuXing, WuXing> = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }
  const keWoMap: Record<WuXing, WuXing> = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' }
  if (wuxing === monthWuxing) return '旺'
  if (shengMap[monthWuxing] === wuxing) return '相'
  if (shengWoMap[monthWuxing] === wuxing) return '休'
  if (keWoMap[monthWuxing] === wuxing) return '囚'
  return '死'
}

export function getGuiRenZhi(gan: TianGan): DiZhi[] {
  return SHEN_SHA_RULES.天乙贵人.rule[gan] ?? []
}

export function getShenShaZhi(type: ShenShaType, key: TianGan | DiZhi): DiZhi[] {
  return SHEN_SHA_RULES[type].rule[key] ?? []
}

export function getTianXi(yueZhi: DiZhi): DiZhi {
  if (['寅', '卯', '辰'].includes(yueZhi)) return '戌'
  if (['巳', '午', '未'].includes(yueZhi)) return '丑'
  if (['申', '酉', '戌'].includes(yueZhi)) return '辰'
  return '未'
}

const YIN_CHEN: DiZhi[] = ['未', '酉', '亥', '丑', '卯', '巳']
export function getHuangEn(yueZhi: DiZhi): DiZhi {
  const idx = DI_ZHI.indexOf(yueZhi)
  return YIN_CHEN[((idx - 2 + 12) % 6)]!
}

export function getTianDe(yueZhi: DiZhi): string {
  const map: Record<DiZhi, { gan: TianGan; zhi: DiZhi }> = {
    寅: { gan: '丁', zhi: '巳' }, 卯: { gan: '乙', zhi: '申' }, 辰: { gan: '壬', zhi: '亥' }, 巳: { gan: '辛', zhi: '酉' },
    午: { gan: '壬', zhi: '亥' }, 未: { gan: '甲', zhi: '寅' }, 申: { gan: '癸', zhi: '子' }, 酉: { gan: '丙', zhi: '寅' },
    戌: { gan: '丙', zhi: '午' }, 亥: { gan: '乙', zhi: '卯' }, 子: { gan: '辛', zhi: '巳' }, 丑: { gan: '庚', zhi: '申' },
  }
  const value = map[yueZhi]
  return `${value.gan}${value.zhi}`
}

export function getYueDe(yueZhi: DiZhi): TianGan {
  if (['寅', '午', '戌'].includes(yueZhi)) return '丙'
  if (['亥', '卯', '未'].includes(yueZhi)) return '甲'
  if (['申', '子', '辰'].includes(yueZhi)) return '壬'
  return '庚'
}

export function getTianYi(yueZhi: DiZhi): DiZhi {
  const idx = DI_ZHI.indexOf(yueZhi)
  return DI_ZHI[(idx + 2) % 12]!
}

export function getShiShen(palacePos: number): DiZhi {
  const map: Record<number, DiZhi> = { 0: '午', 1: '子', 2: '巳', 3: '辰', 4: '未', 5: '卯', 6: '申', 7: '亥' }
  return map[palacePos] ?? '子'
}

export function getGuaShen(shiPosition: number, isShiYang: boolean): DiZhi {
  const startIndex = isShiYang ? 0 : 6
  return DI_ZHI[(startIndex + shiPosition - 1) % 12]!
}

export function getTaiYao(yueZhi: DiZhi): DiZhi | '无' {
  if (['寅', '卯'].includes(yueZhi)) return '酉'
  if (['巳', '午'].includes(yueZhi)) return '子'
  if (['申', '酉'].includes(yueZhi)) return '卯'
  if (['亥', '子'].includes(yueZhi)) return '午'
  if (['辰', '戌', '丑', '未'].includes(yueZhi)) return '午'
  return '无'
}
