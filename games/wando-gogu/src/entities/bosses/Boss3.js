import Phaser from 'phaser'
import { Enemy } from '../Enemy.js'
import { WIDTH } from '../../config.js'

const MAX_HP = 160

// Shield-break cycle + attack pattern per phase, keyed by HP fraction
// remaining. Phases tighten (shorter windows, denser fire) as HP drops, per
// "a final boss benefits from multiple phases" in the design ticket.
const PHASES = [
  { minHpFrac: 0.66, shieldMs: 3000, telegraphMs: 1200, exposedMs: 1800, fireMs: 1800, pattern: 'single' },
  { minHpFrac: 0.33, shieldMs: 2200, telegraphMs: 900, exposedMs: 1400, fireMs: 1500, pattern: 'fan3' },
  { minHpFrac: 0, shieldMs: 1500, telegraphMs: 700, exposedMs: 1000, fireMs: 1100, pattern: 'fan5' },
]

// The Reassembler — Scrapfleet Graveyard's final boss. Gogu-skill-dependent
// win-mechanic: a scrap-shield blocks all regular damage except during a
// brief telegraphed window, when only a successful Force Wave (the
// scene-level 'forcewave' event BaseStageScene emits on long-press) breaks
// it open. Once broken, the exposed core takes normal bullet damage for a
// short window before the shield rebuilds. See
// .scratch/wando-gogu-xwing-shooter/issues/09-boss3.md and 04-gogu-skills.md.
export class Boss3 extends Enemy {
  constructor(scene, onFire) {
    super(scene, WIDTH / 2, 160, 'boss3-shielded', MAX_HP)
    this.setDisplaySize(170, 170)
    this.onFire = onFire

    this.shieldState = 'shielded' // 'shielded' | 'telegraph' | 'exposed'
    this.invulnerable = true
    this.phaseTimer = null
    this.fireTimer = null

    this._onForceWave = (payload) => this._handleForceWave(payload)
    scene.events.on('forcewave', this._onForceWave)

    this._enterShielded()
    this._scheduleNextShot(1200)
  }

  _currentPhase() {
    const frac = Math.max(0, this.hp / MAX_HP)
    return PHASES.find((p) => frac > p.minHpFrac) || PHASES[PHASES.length - 1]
  }

  _enterShielded() {
    if (!this.active) return
    this.shieldState = 'shielded'
    this.invulnerable = true
    this.setTexture('boss3-shielded')
    this.phaseTimer?.remove()
    this.phaseTimer = this.scene.time.addEvent({
      delay: this._currentPhase().shieldMs,
      callback: () => this._enterTelegraph(),
    })
  }

  _enterTelegraph() {
    if (!this.active) return
    this.shieldState = 'telegraph'
    this.invulnerable = true
    this.setTexture('boss3-telegraph')
    this.phaseTimer?.remove()
    this.phaseTimer = this.scene.time.addEvent({
      delay: this._currentPhase().telegraphMs,
      callback: () => this._enterShielded(),
    })
  }

  _enterExposed() {
    if (!this.active) return
    this.shieldState = 'exposed'
    this.invulnerable = false
    this.setTexture('boss3-core-exposed')
    this.phaseTimer?.remove()
    this.phaseTimer = this.scene.time.addEvent({
      delay: this._currentPhase().exposedMs,
      callback: () => this._enterShielded(),
    })
  }

  // Called on the scene-wide 'forcewave' event. Only breaks the shield if
  // the boss is currently telegraphing AND the wave actually reaches it.
  _handleForceWave({ x, y, radius }) {
    if (!this.active || this.shieldState !== 'telegraph') return
    const dist = Phaser.Math.Distance.Between(x, y, this.x, this.y)
    // The boss is large, so be generous about what counts as "in range" —
    // the wave only needs to reach its body, not its exact center.
    if (dist <= radius + this.displayWidth * 0.5) {
      this.phaseTimer?.remove()
      this._enterExposed()
    }
  }

  _scheduleNextShot(delay) {
    this.fireTimer?.remove()
    this.fireTimer = this.scene.time.addEvent({
      delay,
      callback: () => {
        if (!this.active) return
        const phase = this._currentPhase()
        this._fire(phase.pattern)
        this._scheduleNextShot(phase.fireMs)
      },
    })
  }

  _fire(pattern) {
    const cx = this.x
    const cy = this.y + this.displayHeight * 0.3
    if (pattern === 'single') {
      this.onFire(cx, cy, 0, 170)
    } else if (pattern === 'fan3') {
      ;[-25, 0, 25].forEach((deg) => this._fireAtAngle(cx, cy, deg, 190))
    } else {
      ;[-50, -25, 0, 25, 50].forEach((deg) => this._fireAtAngle(cx, cy, deg, 210))
    }
  }

  _fireAtAngle(x, y, deg, speed) {
    const rad = ((90 + deg) * Math.PI) / 180 // 0deg == straight down
    this.onFire(x, y, Math.cos(rad) * speed, Math.sin(rad) * speed)
  }

  damage(amount) {
    if (this.invulnerable) return false
    return super.damage(amount)
  }

  destroy(fromScene) {
    const scene = this.scene
    this.phaseTimer?.remove()
    this.fireTimer?.remove()
    scene?.events.off('forcewave', this._onForceWave)
    super.destroy(fromScene)
  }
}
