export interface ShiYingResult {
  shi: number
  ying: number
}

/** 世应规则：[世爻位置, 应爻位置]，1=初爻，6=上爻 */
const SHI_YING_RULES: Record<number, [number, number]> = {
  0: [6, 3],
  1: [1, 4],
  2: [2, 5],
  3: [3, 6],
  4: [4, 1],
  5: [5, 2],
  6: [4, 1],
  7: [3, 6],
}

export function getShiYing(palacePos: number): ShiYingResult {
  const rule = SHI_YING_RULES[palacePos]
  if (!rule) return { shi: 6, ying: 3 }
  return { shi: rule[0], ying: rule[1] }
}
