import { COLORS } from '../config.js'

// Shared helper: every sprite in this game is drawn once with Phaser's
// Graphics API and baked into a texture (procedural art, no image assets —
// see .scratch/wando-gogu-xwing-shooter/issues/10-art.md).
export function makeTexture(scene, key, size, drawFn) {
  if (scene.textures.exists(key)) return
  const g = scene.add.graphics()
  drawFn(g, size)
  g.generateTexture(key, size, size)
  g.destroy()
}

export function createCommonTextures(scene) {
  makeTexture(scene, 'xwing', 48, (g, s) => {
    const c = s / 2
    g.fillStyle(COLORS.xwingWing, 1)
    g.fillTriangle(c - 22, c + 10, c - 2, c - 10, c - 2, c + 16)
    g.fillTriangle(c + 22, c + 10, c + 2, c - 10, c + 2, c + 16)
    g.fillTriangle(c - 20, c - 14, c - 2, c - 10, c - 2, c + 2)
    g.fillTriangle(c + 20, c - 14, c + 2, c - 10, c + 2, c + 2)
    g.fillStyle(COLORS.xwingBody, 1)
    g.fillEllipse(c, c, 14, 24)
    g.fillStyle(COLORS.xwingAccent, 1)
    g.fillCircle(c, c - 10, 4)
  })

  makeTexture(scene, 'bullet-player', 10, (g, s) => {
    g.fillStyle(COLORS.bulletPlayer, 1)
    g.fillRoundedRect(s / 2 - 2, 0, 4, s, 2)
  })

  makeTexture(scene, 'bullet-enemy', 10, (g, s) => {
    g.fillStyle(COLORS.bulletEnemy, 1)
    g.fillCircle(s / 2, s / 2, 4)
  })

  makeTexture(scene, 'shield-bubble', 56, (g, s) => {
    g.lineStyle(3, COLORS.shield, 0.9)
    g.strokeCircle(s / 2, s / 2, s / 2 - 3)
    g.fillStyle(COLORS.shield, 0.15)
    g.fillCircle(s / 2, s / 2, s / 2 - 3)
  })

  makeTexture(scene, 'powerup-twin', 28, (g, s) => {
    g.fillStyle(COLORS.twinBlaster, 1)
    g.fillRoundedRect(4, 4, s - 8, s - 8, 6)
    g.fillStyle(0xffffff, 1)
    g.fillRect(s / 2 - 6, 6, 3, s - 12)
    g.fillRect(s / 2 + 3, 6, 3, s - 12)
  })

  makeTexture(scene, 'powerup-shield', 28, (g, s) => {
    g.fillStyle(COLORS.shieldOrb, 1)
    g.fillCircle(s / 2, s / 2, s / 2 - 2)
    g.lineStyle(2, 0xffffff, 0.8)
    g.strokeCircle(s / 2, s / 2, s / 2 - 6)
  })

  makeTexture(scene, 'powerup-meter', 28, (g, s) => {
    g.fillStyle(COLORS.meterCharge, 1)
    const c = s / 2
    g.fillTriangle(c, 2, c - 10, c, c + 4, c)
    g.fillTriangle(c + 4, c, c - 6, s - 2, c + 10, c - 2)
  })

  makeTexture(scene, 'gogu-icon', 40, (g, s) => {
    const c = s / 2
    g.fillStyle(COLORS.gogu, 1)
    g.fillEllipse(c, c + 4, s * 0.42, s * 0.36)
    g.fillStyle(COLORS.goguEye, 1)
    g.fillEllipse(c - 7, c, 5, 7)
    g.fillEllipse(c + 7, c, 5, 7)
  })

  makeTexture(scene, 'poof', 40, (g, s) => {
    g.fillStyle(0xffffff, 0.8)
    g.fillCircle(s / 2, s / 2, s / 2 - 4)
  })
}
