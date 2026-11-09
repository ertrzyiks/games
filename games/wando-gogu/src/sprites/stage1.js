import { makeTexture } from './common.js'

// Dustrim Canyons — sunlit desert canyon palette.
const SAND = 0xd9a35a
const SAND_DARK = 0xa5722f
const ROCK = 0xb5651d

export function createStage1Textures(scene) {
  makeTexture(scene, 'scout-pod', 32, (g, s) => {
    const c = s / 2
    g.fillStyle(SAND, 1)
    g.fillCircle(c, c, c - 4)
    g.fillStyle(SAND_DARK, 1)
    g.fillCircle(c, c, 5)
  })

  makeTexture(scene, 'cliff-turret', 36, (g, s) => {
    g.fillStyle(ROCK, 1)
    g.fillRoundedRect(2, s * 0.4, s - 4, s * 0.55, 4)
    g.fillStyle(SAND_DARK, 1)
    g.fillRect(s / 2 - 4, 0, 8, s * 0.5)
  })

  makeTexture(scene, 'boss1-canyon-turret', 180, (g, s) => {
    const c = s / 2
    g.fillStyle(ROCK, 1)
    g.fillRoundedRect(s * 0.1, s * 0.3, s * 0.8, s * 0.6, 10)
    g.fillStyle(SAND_DARK, 1)
    g.fillRoundedRect(s * 0.25, s * 0.1, s * 0.5, s * 0.35, 14)
    // core weak spot, drawn dim by default — Boss1 brightens it when exposed
    g.fillStyle(0x552211, 1)
    g.fillCircle(c, s * 0.55, s * 0.12)
  })

  makeTexture(scene, 'boss1-core-exposed', 180, (g, s) => {
    const c = s / 2
    g.fillStyle(ROCK, 1)
    g.fillRoundedRect(s * 0.1, s * 0.3, s * 0.8, s * 0.6, 10)
    g.fillStyle(SAND_DARK, 1)
    g.fillRoundedRect(s * 0.25, s * 0.1, s * 0.5, s * 0.35, 14)
    g.fillStyle(0xffcc33, 1)
    g.fillCircle(c, s * 0.55, s * 0.14)
    g.fillStyle(0xfff3c0, 1)
    g.fillCircle(c, s * 0.55, s * 0.07)
  })
}
