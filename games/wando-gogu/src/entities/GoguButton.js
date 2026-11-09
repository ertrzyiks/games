import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'

const RADIUS = 40
const LONG_PRESS_MS = 400

const NUDGE_COOLDOWN_MS = 8000
const WAVE_CHARGE_MAX = 100

// Bottom-right Gogu button: tap = Force Nudge, long-press = Force Wave.
// Two stacked rings show cooldown (nudge) and charge (wave) at a glance —
// see .scratch/wando-gogu-xwing-shooter/issues/03-controls.md and 04-gogu-skills.md.
export class GoguButton {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.x = WIDTH - 60
    this.y = HEIGHT - 60

    this.bg = scene.add.circle(this.x, this.y, RADIUS, 0x1a2230, 0.85).setScrollFactor(0)
    this.cooldownRing = scene.add.graphics().setScrollFactor(0)
    this.chargeRing = scene.add.graphics().setScrollFactor(0)
    this.icon = scene.add.image(this.x, this.y, 'gogu-icon').setScrollFactor(0)

    this.zone = scene.add
      .zone(this.x, this.y, RADIUS * 2.2, RADIUS * 2.2)
      .setInteractive()
      .setScrollFactor(0)

    player.setGoguButtonBounds(this.zone.getBounds())

    this.pressStart = null
    this.zone.on('pointerdown', () => {
      this.pressStart = scene.time.now
    })
    this.zone.on('pointerup', () => {
      if (this.pressStart === null) return
      const held = scene.time.now - this.pressStart
      this.pressStart = null
      if (held >= LONG_PRESS_MS) {
        player.tryForceWave()
      } else {
        player.tryForceNudge()
      }
    })
    this.zone.on('pointerout', () => {
      this.pressStart = null
    })
  }

  update() {
    const cooldownFrac = 1 - this.player.nudgeCooldownRemaining / NUDGE_COOLDOWN_MS
    const chargeFrac = this.player.waveCharge / WAVE_CHARGE_MAX

    this.cooldownRing.clear()
    this.cooldownRing.lineStyle(4, 0x5ad1ff, 0.9)
    this.cooldownRing.beginPath()
    this.cooldownRing.arc(
      this.x,
      this.y,
      RADIUS + 6,
      Phaser.Math.DegToRad(-90),
      Phaser.Math.DegToRad(-90 + 360 * cooldownFrac)
    )
    this.cooldownRing.strokePath()

    this.chargeRing.clear()
    this.chargeRing.lineStyle(4, 0xb06bff, 0.9)
    this.chargeRing.beginPath()
    this.chargeRing.arc(
      this.x,
      this.y,
      RADIUS + 12,
      Phaser.Math.DegToRad(-90),
      Phaser.Math.DegToRad(-90 + 360 * chargeFrac)
    )
    this.chargeRing.strokePath()
  }
}
