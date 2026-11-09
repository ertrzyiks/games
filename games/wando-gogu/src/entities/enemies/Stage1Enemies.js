import { Enemy } from '../Enemy.js'

const FIRE_RATE_SCALE = 1 // multiplier hook for future difficulty tuning

export class ScoutPod extends Enemy {
  constructor(scene, x, y, onFire) {
    super(scene, x, y, 'scout-pod', 10)
    this.onFire = onFire
    this.body.setVelocityY(70)
    this.fireTimer = scene.time.addEvent({
      delay: 2000 / FIRE_RATE_SCALE,
      loop: true,
      callback: () => {
        if (!this.active) return
        this.onFire(this.x, this.y + 14, 0, 160)
      },
    })
  }

  destroy(fromScene) {
    this.fireTimer?.remove()
    super.destroy(fromScene)
  }
}

export class CliffTurret extends Enemy {
  constructor(scene, x, y, onFire, playerRef) {
    super(scene, x, y, 'cliff-turret', 20)
    this.onFire = onFire
    this.playerRef = playerRef
    this.body.setVelocityY(20)
    this.fireTimer = scene.time.addEvent({
      delay: 2600 / FIRE_RATE_SCALE,
      loop: true,
      callback: () => this._burstFire(),
    })
  }

  _burstFire() {
    if (!this.active || !this.playerRef?.active) return
    const dx = this.playerRef.x - this.x
    const dy = this.playerRef.y - this.y
    const len = Math.hypot(dx, dy) || 1
    const vx = (dx / len) * 150
    const vy = (dy / len) * 150
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 150, () => {
        if (!this.active) return
        this.onFire(this.x, this.y, vx, vy)
      })
    }
  }

  destroy(fromScene) {
    this.fireTimer?.remove()
    super.destroy(fromScene)
  }
}
