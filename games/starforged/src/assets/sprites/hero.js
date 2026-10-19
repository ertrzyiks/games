import { HUMANOID_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { PALETTE } from '../palette.js'

export const heroSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: PALETTE.heroDark,
  V: PALETTE.darkest,
  T: PALETTE.heroAccent,
  A: PALETTE.hero,
  L: PALETTE.darkest,
})
