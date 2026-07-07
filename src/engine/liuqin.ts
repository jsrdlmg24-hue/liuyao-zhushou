import type { LiuQin, WuXing } from '../types'
import { WU_XING_KE_WO, WU_XING_SHENG_WO, WU_XING_WO_KE, WU_XING_WO_SHENG } from '../data/bazi'

/**
 * 装六亲：以卦宫五行为“我”。
 * 生我者父母，我生者子孙，克我者官鬼，我克者妻财，同我者兄弟。
 */
export function getLiuQin(gongWuxing: WuXing, yaoWuxing: WuXing): LiuQin {
  if (gongWuxing === yaoWuxing) return '兄弟'
  if (WU_XING_SHENG_WO[gongWuxing] === yaoWuxing) return '父母'
  if (WU_XING_WO_SHENG[gongWuxing] === yaoWuxing) return '子孙'
  if (WU_XING_KE_WO[gongWuxing] === yaoWuxing) return '官鬼'
  if (WU_XING_WO_KE[gongWuxing] === yaoWuxing) return '妻财'
  return '兄弟'
}
