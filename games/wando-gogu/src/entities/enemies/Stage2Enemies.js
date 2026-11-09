import { Enemy } from '../Enemy.js'

// Frost Walker — weaves side to side while descending (faster than Stage 1's
// Scout Pod) and fires twin shots. See
// .scratch/wando-gogu-xwing-shooter/issues/06-enemies.md.
const ZIGZAG_PERIOD_MS = 650
const ZIGZAG_SPEED = 110
const DESCEND_SPEED = 100 // Scout Pod descends at 70 — ~40% faster
const TWIN_FIRE_DELAY = 1700 // Scout Pod fires every 2000ms
const TWIN_BULLET_SPEED = 200

export class FrostWalker extends Enemy {
  constructor(scene, x, y, onFire) {
    super(scene, x, y, 'frost-walker', 12)
    this.onFire = onFire
    this.dir = Math.random() < 0.5 ? -1 : 1
    this.body.setVelocity(ZIGZAG_SPEED * this.dir, DESCEND_SPEED)

    this.zigzagTimer = scene.time.addEvent({
      delay: ZIGZAG_PERIOD_MS,
      loop: true,
      callback: () => {
        if (!this.active) return
        this.dir *= -1
        this.body.setVelocityX(ZIGZAG_SPEED * this.dir)
      },
    })

    this.fireTimer = scene.time.addEvent({
      delay: TWIN_FIRE_DELAY,
      loop: true,
      callback: () => {
        if (!this.active) return
        this.onFire(this.x - 7, this.y + 14, 0, TWIN_BULLET_SPEED)
        this.onFire(this.x + 7, this.y + 14, 0, TWIN_BULLET_SPEED)
      },
    })
  }

  destroy(fromScene) {
    this.zigzagTimer?.remove()
    this.fireTimer?.remove()
    super.destroy(fromScene)
  }
}

// Snow Skimmer — spawned in V-formation squads of 3 (see Stage2Scene). Each
// skimmer approaches, dives toward whatever lane the player is in when it
// crosses the dive line, then retreats back off the top of the screen.
// Pure ramming threat, no projectiles.
const APPROACH_SPEED = 95
const DIVE_Y = 230
const DIVE_VX = 170
const DIVE_VY = 190
const RETREAT_Y = 460
const RETREAT_VY = -260

export class SnowSkimmer extends Enemy {
  constructor(scene, x, y, playerRef) {
    super(scene, x, y, 'snow-skimmer', 7)
    this.playerRef = playerRef
    this.state = 'approach'
    this.body.setVelocity(0, APPROACH_SPEED)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (!this.active) return

    if (this.state === 'approach' && this.y >= DIVE_Y) {
      this.state = 'dive'
      const targetX = this.playerRef?.active ? this.playerRef.x : this.x
      const vx = targetX > this.x ? DIVE_VX : targetX < this.x ? -DIVE_VX : 0
      this.body.setVelocity(vx, DIVE_VY)
    } else if (this.state === 'dive' && this.y >= RETREAT_Y) {
      this.state = 'retreat'
      this.body.setVelocity(0, RETREAT_VY)
    } else if (this.state === 'retreat' && this.y < -40) {
      // BaseStageScene only auto-despawns enemies that exit past the
      // bottom; a retreating skimmer flies off the top, so it must clean
      // itself up or it would block the "wave cleared" check forever.
      this.destroy()
    }
  }
}
