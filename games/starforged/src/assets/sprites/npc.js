import { HUMANOID_TEMPLATE, buildSprite } from '../spriteTemplates.js'
import { registerSprites } from './registry.js'

export const npcSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#7a6a52',
  V: '#2a2d36',
  T: '#c9a876',
  A: '#8a7a5c',
  L: '#4a4034',
})

registerSprites({ npc: npcSprite })
