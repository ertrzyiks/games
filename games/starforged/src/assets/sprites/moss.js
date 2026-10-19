import { CHILD_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { PALETTE } from '../palette.js'

export const mossSprite = buildSprite(CHILD_TEMPLATE, {
  H: PALETTE.moss,
  E: PALETTE.darkest,
  R: PALETTE.mossDark,
  B: PALETTE.mossAccent,
})
