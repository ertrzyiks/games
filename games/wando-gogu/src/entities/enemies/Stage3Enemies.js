import { Enemy } from '../Enemy.js'

const FIRE_RATE_SCALE = 1 // multiplier hook for future difficulty tuning

function rand(min, max) {
  return Math.random() * (max - min) + min
}

// Scavenger Drone — small, fast, low-HP scrap scuttler. Meant to be spawned
// in clusters of 4-6 (see Stage3Scene's wave schedule). Pure swarm/contact
// threat: no weapon, just fast erratic movement that's hard to track.
// See .scratch/wando-gogu-xwing-shooter/issues/06-enemies.md.
export class ScavengerDrone extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'scavenger-drone', 4)
    this.setDisplaySize(26, 26)
    this.baseX = x
    this.wobbleAmp = rand(50, 95)
    this.wobbleSpeed = rand(2.5, 4.5)
    this.wobblePhase = rand(0, Math.PI * 2)
    this.body.setVelocityY(rand(150, 195))
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    const t = time / 1000
    this.x = this.baseX + Math.sin(t * this.wobbleSpeed + this.wobblePhase) * this.wobbleAmp
  }
}

// Salvage Bot — tanky, slow-moving, fires a 5-shot fan spread aimed at the
// player every cycle (denser/faster than Stage 1's Cliff Turret burst).
export class SalvageBot extends Enemy {
  constructor(scene, x, y, onFire, playerRef) {
    super(scene, x, y, 'salvage-bot', 35)
    this.onFire = onFire
    this.playerRef = playerRef
    this.body.setVelocityY(32)
    this.fireTimer = scene.time.addEvent({
      delay: 2200 / FIRE_RATE_SCALE,
      loop: true,
      callback: () => this._fanFire(),
    })
  }

  _fanFire() {
    if (!this.active || !this.playerRef?.active) return
    const dx = this.playerRef.x - this.x
    const dy = this.playerRef.y - this.y
    const baseAngle = Math.atan2(dy, dx)
    const speed = 170
    ;[-40, -20, 0, 20, 40].forEach((deg) => {
      const angle = baseAngle + (deg * Math.PI) / 180
      this.onFire(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed)
    })
  }

  destroy(fromScene) {
    this.fireTimer?.remove()
    super.destroy(fromScene)
  }
}
