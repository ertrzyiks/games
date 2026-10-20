import { GOGU_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { PALETTE } from '../palette.js'

export const mossSprite = buildSprite(GOGU_TEMPLATE, {
  H: PALETTE.moss,
  P: PALETTE.moss,
  E: PALETTE.darkest,
  R: PALETTE.sand,
  B: PALETTE.sandDark,
})
