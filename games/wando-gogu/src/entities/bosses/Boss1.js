import { Enemy } from '../Enemy.js'
import { WIDTH } from '../../config.js'

const CLOSED_MS = 2600
const OPEN_MS = 1500

// Old Canyon Turret — Stage 1 boss. Weak-spot mechanic: the shell is
// invulnerable while closed and only exposes its glowing core (vulnerable)
// during a brief window every cycle, when it also fires one big charged
// shot. See .scratch/wando-gogu-xwing-shooter/issues/07-boss1.md.
export class Boss1 extends Enemy {
  constructor(scene, onFire) {
    super(scene, WIDTH / 2, 140, 'boss1-canyon-turret', 40)
    this.setDisplaySize(140, 140)
    this.onFire = onFire
    this.exposed = false
    this.invulnerable = true
    this.phase = 'closed'
    this.phaseTimer = scene.time.addEvent({
      delay: CLOSED_MS,
      callback: () => this._open(),
    })
  }

  _open() {
    if (!this.active) return
    this.phase = 'open'
    this.exposed = true
    this.invulnerable = false
    this.setTexture('boss1-core-exposed')
    this.onFire(this.x, this.y + 70, 0, 180)
    this.phaseTimer = this.scene.time.addEvent({ delay: OPEN_MS, callback: () => this._close() })
  }

  _close() {
    if (!this.active) return
    this.phase = 'closed'
    this.exposed = false
    this.invulnerable = true
    this.setTexture('boss1-canyon-turret')
    this.phaseTimer = this.scene.time.addEvent({ delay: CLOSED_MS, callback: () => this._open() })
  }

  damage(amount) {
    if (this.invulnerable) return false
    return super.damage(amount)
  }

  destroy(fromScene) {
    this.phaseTimer?.remove()
    super.destroy(fromScene)
  }
}
