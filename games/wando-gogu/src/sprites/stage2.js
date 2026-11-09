import { makeTexture } from './common.js'

// Frostholt Reaches — icy mountain palette. Bold flat shapes, no outlines
// needed beyond color contrast (see .scratch/wando-gogu-xwing-shooter/issues/10-art.md).
const ICE = 0xd8f1ff
const ICE_DARK = 0x8fc9e8
const STEEL = 0x5b7a8c
const GLOW = 0x4fe3ff
const ENRAGED_GLOW = 0xff9a3c

export function createStage2Textures(scene) {
  // Frost Walker — small round-bodied droid that zigzags down the slope,
  // firing twin shots.
  makeTexture(scene, 'frost-walker', 34, (g, s) => {
    const c = s / 2
    g.fillStyle(ICE, 1)
    g.fillCircle(c, c, c - 5)
    g.fillStyle(STEEL, 1)
    g.fillCircle(c, c, 6)
    g.fillStyle(GLOW, 1)
    g.fillCircle(c - 5, c - 3, 2.5)
    g.fillCircle(c + 5, c - 3, 2.5)
  })

  // Snow Skimmer — small flying sled/disc, flies in V-formation squads of 3.
  makeTexture(scene, 'snow-skimmer', 28, (g, s) => {
    const c = s / 2
    g.fillStyle(0xffffff, 1)
    g.fillTriangle(c, 2, 2, s - 6, s - 2, s - 6)
    g.fillStyle(ICE_DARK, 1)
    g.fillRoundedRect(c - 5, s * 0.55, 10, 8, 3)
  })

  // Frostclaw Walker — Stage 2 boss, a big quadruped ice mech striding
  // across the glacier.
  makeTexture(scene, 'boss2-frostclaw', 190, (g, s) => {
    const c = s / 2
    g.fillStyle(STEEL, 1)
    g.fillRoundedRect(s * 0.1, s * 0.62, s * 0.18, s * 0.3, 6)
    g.fillRoundedRect(s * 0.72, s * 0.62, s * 0.18, s * 0.3, 6)
    g.fillRoundedRect(s * 0.28, s * 0.62, s * 0.16, s * 0.34, 6)
    g.fillRoundedRect(s * 0.56, s * 0.62, s * 0.16, s * 0.34, 6)
    g.fillStyle(ICE, 1)
    g.fillRoundedRect(s * 0.14, s * 0.18, s * 0.72, s * 0.5, 22)
    g.fillStyle(ICE_DARK, 1)
    g.fillRoundedRect(s * 0.22, s * 0.3, s * 0.56, s * 0.22, 14)
    g.fillStyle(GLOW, 1)
    g.fillCircle(c - 18, s * 0.4, 7)
    g.fillCircle(c + 18, s * 0.4, 7)
  })

  // Phase-2 "enraged" recolor — brighter warm glow signals the faster,
  // stomp-happy phase that kicks in at 50% HP.
  makeTexture(scene, 'boss2-frostclaw-enraged', 190, (g, s) => {
    const c = s / 2
    g.fillStyle(STEEL, 1)
    g.fillRoundedRect(s * 0.1, s * 0.62, s * 0.18, s * 0.3, 6)
    g.fillRoundedRect(s * 0.72, s * 0.62, s * 0.18, s * 0.3, 6)
    g.fillRoundedRect(s * 0.28, s * 0.62, s * 0.16, s * 0.34, 6)
    g.fillRoundedRect(s * 0.56, s * 0.62, s * 0.16, s * 0.34, 6)
    g.fillStyle(ICE, 1)
    g.fillRoundedRect(s * 0.14, s * 0.18, s * 0.72, s * 0.5, 22)
    g.fillStyle(ICE_DARK, 1)
    g.fillRoundedRect(s * 0.22, s * 0.3, s * 0.56, s * 0.22, 14)
    g.fillStyle(ENRAGED_GLOW, 1)
    g.fillCircle(c - 18, s * 0.4, 8)
    g.fillCircle(c + 18, s * 0.4, 8)
  })

  // Stomp-shockwave telegraph ring — scaled up and faded out by a tween in
  // Boss2 before the radial burst actually fires, so the player sees it coming.
  makeTexture(scene, 'boss2-stomp-telegraph', 60, (g, s) => {
    g.lineStyle(4, GLOW, 0.9)
    g.strokeCircle(s / 2, s / 2, s / 2 - 4)
  })
}
