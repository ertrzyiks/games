import { Enemy } from '../Enemy.js'
import { WIDTH } from '../../config.js'

// Frostclaw Walker — Stage 2 boss. Win-mechanic: massive-HP attrition, no
// weak-spot/shield gimmick — a big health pool and constant strafing the
// player must keep dodging while chipping away damage. Phase 2 kicks in at
// 50% HP: faster strafing plus a telegraphed stomp-shockwave attack.
// Clearly harder than Boss1 (active movement + two phases vs. a stationary
// single-phase fight), leaving room for Boss3 to top it via its own
// Gogu-skill-dependent mechanic. See
// .scratch/wando-gogu-xwing-shooter/issues/08-boss2.md.
const MAX_HP = 240 // Boss1 is 40 — roughly 6x the attrition check, since Boss1 has
// invulnerability windows and this boss is always vulnerable.
const PHASE2_HP_FRACTION = 0.5
const PATROL_MARGIN = 70
const PHASE1_SPEED = 75
const PHASE2_SPEED = 130 // ~70% faster once enraged
const PHASE1_FAN_DELAY = 2200
const PHASE2_FAN_DELAY = 1600
const FAN_BULLET_SPEED = 170
const STOMP_DELAY = 3400
const STOMP_TELEGRAPH_MS = 650
const STOMP_BULLET_COUNT = 14
const STOMP_BULLET_SPEED = 190

export class Boss2 extends Enemy {
  constructor(scene, onFire) {
    super(scene, WIDTH / 2, 150, 'boss2-frostclaw', MAX_HP)
    this.setDisplaySize(170, 150)
    this.maxHp = MAX_HP
    this.onFire = onFire
    this.phase = 1
    this.dir = 1
    this.body.setVelocityX(PHASE1_SPEED * this.dir)

    this.fanTimer = scene.time.addEvent({
      delay: PHASE1_FAN_DELAY,
      loop: true,
      callback: () => this._fanAttack(),
    })
    this.stompTimer = null
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (!this.active) return
    const speed = this.phase === 1 ? PHASE1_SPEED : PHASE2_SPEED
    if (this.x <= PATROL_MARGIN && this.dir < 0) {
      this.dir = 1
      this.body.setVelocityX(speed)
    } else if (this.x >= WIDTH - PATROL_MARGIN && this.dir > 0) {
      this.dir = -1
      this.body.setVelocityX(speed)
    }
  }

  damage(amount) {
    const died = super.damage(amount)
    if (!died && this.phase === 1 && this.hp <= this.maxHp * PHASE2_HP_FRACTION) {
      this._enterPhase2()
    }
    return died
  }

  _enterPhase2() {
    this.phase = 2
    this.setTexture('boss2-frostclaw-enraged')
    this.body.setVelocityX(PHASE2_SPEED * this.dir)

    this.fanTimer?.remove()
    this.fanTimer = this.scene.time.addEvent({
      delay: PHASE2_FAN_DELAY,
      loop: true,
      callback: () => this._fanAttack(),
    })
    this.stompTimer = this.scene.time.addEvent({
      delay: STOMP_DELAY,
      loop: true,
      callback: () => this._stomp(),
    })
  }

  _fanAttack() {
    if (!this.active) return
    const spreadAngles = [-0.5, -0.25, 0, 0.25, 0.5]
    spreadAngles.forEach((offset) => {
      const angle = Math.PI / 2 + offset
      this.onFire(
        this.x,
        this.y + 50,
        Math.cos(angle) * FAN_BULLET_SPEED,
        Math.sin(angle) * FAN_BULLET_SPEED
      )
    })
  }

  // Telegraphed stomp shockwave (phase 2 only): an expanding ring warns the
  // player for STOMP_TELEGRAPH_MS, then a full radial burst of bullets fires
  // that the player must dodge through the gaps.
  _stomp() {
    if (!this.active) return
    const ring = this.scene.add.image(this.x, this.y + 40, 'boss2-stomp-telegraph').setAlpha(0.9)
    this.scene.tweens.add({
      targets: ring,
      scale: 2.6,
      alpha: 0,
      duration: STOMP_TELEGRAPH_MS,
      onComplete: () => {
        ring.destroy()
        this._radialBurst()
      },
    })
  }

  _radialBurst() {
    if (!this.active) return
    const cx = this.x
    const cy = this.y + 40
    for (let i = 0; i < STOMP_BULLET_COUNT; i++) {
      const angle = (i / STOMP_BULLET_COUNT) * Math.PI * 2
      this.onFire(cx, cy, Math.cos(angle) * STOMP_BULLET_SPEED, Math.sin(angle) * STOMP_BULLET_SPEED)
    }
  }

  destroy(fromScene) {
    this.fanTimer?.remove()
    this.stompTimer?.remove()
    super.destroy(fromScene)
  }
}
