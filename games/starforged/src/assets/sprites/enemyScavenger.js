import { HUMANOID_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { PALETTE } from '../palette.js'
import { registerSprites } from './registry.js'

export const enemyScavengerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5a4a3a',
  V: PALETTE.danger,
  T: '#8a3a2a',
  A: PALETTE.rust,
  L: '#2a2018',
})

registerSprites({ enemyScavenger: enemyScavengerSprite })
