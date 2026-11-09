import { makeTexture } from './common.js'

// Scrapfleet Graveyard — asteroid-belt junkyard palette. Cheerful salvage-bot
// colors, not horror junk: warm rust, friendly teal-cyan highlights, bright
// bolt-yellow accents. See .scratch/wando-gogu-xwing-shooter/issues/10-art.md.
const SCRAP = 0x8d99ae
const SCRAP_DARK = 0x5c6472
const RUST = 0xd98a4f
const RUST_DARK = 0xa86636
const BOLT = 0xffe066
const EYE_DARK = 0x1a1a1a
const TELEGRAPH_GLOW = 0xfff066
const CORE_GLOW = 0xffcc33
const CORE_HOT = 0xfff3c0

export function createStage3Textures(scene) {
  // Scavenger Drone — tiny round scrap scuttler, single bright eye.
  makeTexture(scene, 'scavenger-drone', 28, (g, s) => {
    const c = s / 2
    g.lineStyle(2, EYE_DARK, 1)
    g.fillStyle(SCRAP, 1)
    g.fillCircle(c, c, c - 4)
    g.strokeCircle(c, c, c - 4)
    g.fillStyle(BOLT, 1)
    g.fillCircle(c, c, 5)
    g.fillStyle(SCRAP_DARK, 1)
    g.fillRect(c - 1, 1, 2, 5)
    g.fillRect(c - 1, s - 6, 2, 5)
  })

  // Salvage Bot — tanky boxy bot, stubby claw arms, big friendly eye.
  makeTexture(scene, 'salvage-bot', 48, (g, s) => {
    const c = s / 2
    g.lineStyle(3, EYE_DARK, 1)
    g.fillStyle(RUST, 1)
    g.fillRoundedRect(s * 0.14, s * 0.18, s * 0.72, s * 0.68, 10)
    g.strokeRoundedRect(s * 0.14, s * 0.18, s * 0.72, s * 0.68, 10)
    g.fillStyle(RUST_DARK, 1)
    g.fillRoundedRect(-s * 0.06, s * 0.36, s * 0.22, s * 0.3, 6)
    g.fillRoundedRect(s * 0.84, s * 0.36, s * 0.22, s * 0.3, 6)
    g.fillStyle(0xffffff, 1)
    g.fillCircle(c, s * 0.46, s * 0.2)
    g.fillStyle(EYE_DARK, 1)
    g.fillCircle(c, s * 0.46, s * 0.1)
    g.fillStyle(BOLT, 1)
    g.fillCircle(s * 0.26, s * 0.78, 3)
    g.fillCircle(s * 0.74, s * 0.78, 3)
  })

  // The Reassembler — final boss, three readable states driven by Boss3's
  // shield cycle: fully shielded, telegraphing (about to crack open), and
  // core exposed (shield broken, vulnerable).
  makeTexture(scene, 'boss3-shielded', 220, (g, s) => {
    const c = s / 2
    g.lineStyle(5, EYE_DARK, 1)
    g.fillStyle(SCRAP, 1)
    g.fillRoundedRect(s * 0.12, s * 0.22, s * 0.76, s * 0.6, 24)
    g.strokeRoundedRect(s * 0.12, s * 0.22, s * 0.76, s * 0.6, 24)
    g.fillStyle(SCRAP_DARK, 1)
    g.fillRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.3, 18)
    g.strokeRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.3, 18)
    // seam lines across the plating
    g.lineStyle(3, SCRAP_DARK, 1)
    g.lineBetween(s * 0.3, s * 0.4, s * 0.7, s * 0.4)
    g.lineBetween(s * 0.5, s * 0.22, s * 0.5, s * 0.82)
    // bolts
    g.fillStyle(BOLT, 1)
    ;[[0.22, 0.32], [0.78, 0.32], [0.22, 0.68], [0.78, 0.68]].forEach(([fx, fy]) => {
      g.fillCircle(s * fx, s * fy, 5)
    })
    // dim hidden core hint
    g.fillStyle(0x3a3a2a, 1)
    g.fillCircle(c, s * 0.5, s * 0.1)
  })

  makeTexture(scene, 'boss3-telegraph', 220, (g, s) => {
    const c = s / 2
    g.lineStyle(5, TELEGRAPH_GLOW, 1)
    g.fillStyle(SCRAP, 1)
    g.fillRoundedRect(s * 0.12, s * 0.22, s * 0.76, s * 0.6, 24)
    g.strokeRoundedRect(s * 0.12, s * 0.22, s * 0.76, s * 0.6, 24)
    g.fillStyle(SCRAP_DARK, 1)
    g.fillRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.3, 18)
    g.strokeRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.3, 18)
    // glowing crack seams — this is the "about to break" telegraph
    g.lineStyle(4, TELEGRAPH_GLOW, 1)
    g.lineBetween(s * 0.3, s * 0.4, s * 0.7, s * 0.4)
    g.lineBetween(s * 0.5, s * 0.22, s * 0.5, s * 0.82)
    g.fillStyle(BOLT, 1)
    ;[[0.22, 0.32], [0.78, 0.32], [0.22, 0.68], [0.78, 0.68]].forEach(([fx, fy]) => {
      g.fillCircle(s * fx, s * fy, 5)
    })
    // core glowing through the cracks
    g.fillStyle(TELEGRAPH_GLOW, 1)
    g.fillCircle(c, s * 0.5, s * 0.14)
  })

  makeTexture(scene, 'boss3-core-exposed', 220, (g, s) => {
    const c = s / 2
    g.lineStyle(5, EYE_DARK, 1)
    g.fillStyle(SCRAP_DARK, 1)
    g.fillRoundedRect(s * 0.1, s * 0.22, s * 0.3, s * 0.58, 18)
    g.strokeRoundedRect(s * 0.1, s * 0.22, s * 0.3, s * 0.58, 18)
    g.fillRoundedRect(s * 0.6, s * 0.22, s * 0.3, s * 0.58, 18)
    g.strokeRoundedRect(s * 0.6, s * 0.22, s * 0.3, s * 0.58, 18)
    g.fillStyle(SCRAP, 1)
    g.fillRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.26, 16)
    g.strokeRoundedRect(s * 0.3, s * 0.08, s * 0.4, s * 0.26, 16)
    // exposed glowing core, friendly bright sun-like face
    g.fillStyle(CORE_GLOW, 1)
    g.fillCircle(c, s * 0.52, s * 0.22)
    g.fillStyle(CORE_HOT, 1)
    g.fillCircle(c, s * 0.52, s * 0.12)
  })
}
