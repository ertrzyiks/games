import { HERO_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { PALETTE } from '../palette.js'

export const heroSprite = buildSprite(HERO_TEMPLATE, {
  H: PALETTE.heroDark,
  V: PALETTE.darkest,
  C: PALETTE.heroDark,
  T: PALETTE.heroAccent,
  A: PALETTE.hero,
  G: PALETTE.darkest,
  L: PALETTE.darkest,
})
