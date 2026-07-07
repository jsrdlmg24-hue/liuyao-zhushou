export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

export type WuXing = '木' | '火' | '土' | '金' | '水'

export type BaGua = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

export type GuaGong = BaGua

export type LiuQin = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼'

export type LiuShen = '青龙' | '朱雀' | '勾陈' | '腾蛇' | '白虎' | '玄武'

export type ShenShaType =
  | '天乙贵人'
  | '驿马'
  | '桃花'
  | '劫煞'
  | '亡神'
  | '禄神'
  | '羊刃'
  | '文昌'
  | '华盖'
  | '将星'
  | '谋星'
  | '灾煞'
  | '天马'
  | '香闺'
  | '床帐'
  | '天喜'
  | '皇恩'
  | '天德'
  | '月德'
  | '天医'
  | '世身'
  | '卦身'
  | '胎爻'

export type WangShuai = '旺' | '相' | '休' | '囚' | '死'

export type ChangSheng = '长生' | '沐浴' | '冠带' | '临官' | '帝旺' | '衰' | '病' | '死' | '墓' | '绝' | '胎' | '养'

export type YaoNumber = 6 | 7 | 8 | 9

export type YaoType = '老阴' | '少阳' | '少阴' | '老阳'

export type YinYang = '阴' | '阳'

export type Role = '' | '世' | '应'

export interface Zhu {
  gan: TianGan
  zhi: DiZhi
  wuxing: WuXing
}

export interface BaZi {
  nian: Zhu
  yue: Zhu
  ri: Zhu
  shi: Zhu
}

export interface KongWang {
  xun: string
  zhi1: DiZhi
  zhi2: DiZhi
}

export interface AllKongWang {
  nian: KongWang
  yue: KongWang
  ri: KongWang
  shi: KongWang
}

export interface ShenShaMark {
  /** 0=初爻，5=上爻 */
  position: number
  type: ShenShaType
}

export interface TimeShenSha {
  name: ShenShaType
  value: string
}

export interface ChangShengKeyPositions {
  dayGan: TianGan
  changsheng: DiZhi
  diwang: DiZhi
  mu: DiZhi
  jue: DiZhi
}

export interface HexagramInfo {
  /** 卦名 */
  name: string
  /** 二进制编码：从初爻到上爻，阳=1，阴=0 */
  code: string
  /** 上卦 */
  upper: BaGua
  /** 下卦 */
  lower: BaGua
  /** 所属卦宫 */
  palace: GuaGong
  /** 宫内位置：0纯卦，1一世，2二世，3三世，4四世，5五世，6游魂，7归魂 */
  palacePos: number
}

export interface FuShen {
  liuqin: LiuQin
  gan: TianGan
  zhi: DiZhi
  wuxing: WuXing
}

export interface YaoDetail {
  /** 1=初爻，6=上爻 */
  position: number
  number: YaoNumber
  type: YaoType
  yinYang: YinYang
  changing: boolean
  changedYinYang: YinYang
  gan: TianGan
  zhi: DiZhi
  ganzhi: string
  wuxing: WuXing
  liuqin: LiuQin
  role: Role
  fushen?: FuShen
}

export interface PaipanResult {
  inputNumbers: YaoNumber[]
  movingPositions: number[]
  original: {
    name: string
    code: string
    upper: BaGua
    lower: BaGua
    palace: GuaGong
    palacePos: number
    yaos: YaoDetail[]
  }
  changed: {
    name: string
    code: string
    upper: BaGua
    lower: BaGua
    palace: GuaGong
    palacePos: number
  }
}

export interface TimeContext {
  castTime: Date
  bazi: BaZi
  kongwang: AllKongWang
  liushen: LiuShen[]
  changsheng: ChangShengKeyPositions
  timeShensha: TimeShenSha[]
}
