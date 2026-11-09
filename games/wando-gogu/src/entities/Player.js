import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'

const MOVE_EASE = 0.18 // fraction of the remaining distance closed per frame when drag-following
const KEYBOARD_SPEED = 320 // px/s
const AUTOFIRE_INTERVAL = 220 // ms
const RESPAWN_INVULN_MS = 1500
const NUDGE_COOLDOWN_MS = 8000
const NUDGE_DURATION_MS = 2000
const WAVE_CHARGE_PER_KILL = 8
const WAVE_CHARGE_MAX = 100

export const WEAPON_MAX_LEVEL = 3

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, onFire, onForceNudge, onForceWave, onDeath) {
    super(scene, WIDTH / 2, HEIGHT - 90, 'xwing')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCircle(16)
    this.body.setCollideWorldBounds(true)

    this.onFire = onFire
    this.onForceNudge = onForceNudge
    this.onForceWave = onForceWave
    this.onDeath = onDeath

    this.lives = 3
    this.weaponLevel = 1
    this.shieldActive = false
    this.invulnerableUntil = 0

    this.nudgeCooldownRemaining = 0
    this.nudgeActiveUntil = 0
    this.waveCharge = 0

    this.dragTarget = null // {x, y} while a movement pointer is held
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.wasd = scene.input.keyboard.addKeys('W,A,S,D')

    this._setupInput(scene)

    this.autofireTimer = scene.time.addEvent({
      delay: AUTOFIRE_INTERVAL,
      loop: true,
      callback: () => this._autofire(),
    })
  }

  _setupInput(scene) {
    // The Gogu button (see GoguButton) claims its own screen area; a pointer
    // that starts there must never also drive ship movement.
    scene.input.on('pointerdown', (pointer) => {
      if (this._isOverGoguButton(pointer)) return
      this.dragTarget = { x: pointer.x, y: pointer.y }
    })
    scene.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return
      if (this._isOverGoguButton(pointer)) return
      this.dragTarget = { x: pointer.x, y: pointer.y }
    })
    scene.input.on('pointerup', () => {
      this.dragTarget = null
    })
  }

  // Set by the scene once the Gogu button's hit-zone exists.
  setGoguButtonBounds(bounds) {
    this.goguButtonBounds = bounds
  }

  _isOverGoguButton(pointer) {
    const b = this.goguButtonBounds
    if (!b) return false
    return Phaser.Geom.Rectangle.Contains(b, pointer.x, pointer.y)
  }

  _autofire() {
    if (!this.active) return
    const offsets =
      this.weaponLevel === 1 ? [0] : this.weaponLevel === 2 ? [-6, 6] : [-10, 0, 10]
    offsets.forEach((dx) => this.onFire(this.x + dx, this.y - 20))
  }

  // Called by the Gogu button UI on a short tap.
  tryForceNudge() {
    if (this.nudgeCooldownRemaining > 0) return false
    this.nudgeCooldownRemaining = NUDGE_COOLDOWN_MS
    this.nudgeActiveUntil = this.scene.time.now + NUDGE_DURATION_MS
    this.onForceNudge(this.x, this.y)
    return true
  }

  // Called by the Gogu button UI on a long-press.
  tryForceWave() {
    if (this.waveCharge < WAVE_CHARGE_MAX) return false
    this.waveCharge = 0
    this.onForceWave(this.x, this.y)
    return true
  }

  isNudgeActive() {
    return this.scene.time.now < this.nudgeActiveUntil
  }

  onEnemyKilled() {
    this.waveCharge = Math.min(WAVE_CHARGE_MAX, this.waveCharge + WAVE_CHARGE_PER_KILL)
  }

  addWaveCharge(amount) {
    this.waveCharge = Math.min(WAVE_CHARGE_MAX, this.waveCharge + amount)
  }

  upgradeWeapon() {
    this.weaponLevel = Math.min(WEAPON_MAX_LEVEL, this.weaponLevel + 1)
  }

  grantShield() {
    this.shieldActive = true
    if (this.shieldSprite) this.shieldSprite.setVisible(true)
  }

  isInvulnerable() {
    return this.scene.time.now < this.invulnerableUntil
  }

  // Returns true if this hit actually cost a life (used by the scene to
  // decide whether to show the "poof" + respawn flow).
  takeHit() {
    if (this.isInvulnerable()) return false
    if (this.shieldActive) {
      this.shieldActive = false
      if (this.shieldSprite) this.shieldSprite.setVisible(false)
      this.invulnerableUntil = this.scene.time.now + 400
      return false
    }
    this.lives -= 1
    if (this.lives <= 0) {
      this.onDeath(true)
      return true
    }
    this._respawn()
    this.onDeath(false)
    return true
  }

  _respawn() {
    this.weaponLevel = 1
    this.shieldActive = false
    if (this.shieldSprite) this.shieldSprite.setVisible(false)
    this.setPosition(WIDTH / 2, HEIGHT - 90)
    this.invulnerableUntil = this.scene.time.now + RESPAWN_INVULN_MS
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.nudgeCooldownRemaining > 0) {
      this.nudgeCooldownRemaining = Math.max(0, this.nudgeCooldownRemaining - delta)
    }

    if (this.dragTarget) {
      this.x += (this.dragTarget.x - this.x) * MOVE_EASE
      this.y += (this.dragTarget.y - this.y) * MOVE_EASE
    } else {
      let vx = 0
      let vy = 0
      if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1
      if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1
      if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1
      if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1
      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy)
        this.x += (vx / len) * KEYBOARD_SPEED * (delta / 1000)
        this.y += (vy / len) * KEYBOARD_SPEED * (delta / 1000)
      }
    }

    this.x = Phaser.Math.Clamp(this.x, 24, WIDTH - 24)
    this.y = Phaser.Math.Clamp(this.y, 24, HEIGHT - 24)

    if (this.shieldSprite) {
      this.shieldSprite.setPosition(this.x, this.y)
    }
    if (this.isInvulnerable()) {
      this.setAlpha(Math.sin(time / 60) > 0 ? 1 : 0.35)
    } else {
      this.setAlpha(1)
    }
  }
}
