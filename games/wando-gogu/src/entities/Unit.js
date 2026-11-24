// Shared base for every combat entity (hero, creep, tower, base). Holds game
// state; the Three.js mesh is a plain property, not inherited — see
// .scratch/wando-gogu-arts/map.md for the overall design.
export class Unit {
  constructor({ team, kind, hp, damage, attackRange, attackIntervalMs, mesh, speed = 0 }) {
    this.team = team
    this.kind = kind // 'hero' | 'creep' | 'tower' | 'base'
    this.maxHp = hp
    this.hp = hp
    this.shield = 0
    this.damage = damage
    this.attackRange = attackRange
    this.attackIntervalMs = attackIntervalMs
    this.mesh = mesh
    this.speed = speed
    this.alive = true
    this.lastAttackAt = -Infinity
    this.target = null
  }

  get position() {
    return this.mesh.position
  }

  distanceTo(other) {
    return this.position.distanceTo(other.position)
  }

  canAttack(now) {
    return now - this.lastAttackAt >= this.attackIntervalMs
  }

  attack(target, now) {
    this.lastAttackAt = now
    target.takeDamage(this.damage)
  }

  takeDamage(amount) {
    if (!this.alive) return
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, amount)
      this.shield -= absorbed
      amount -= absorbed
    }
    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      this.die()
    }
  }

  die() {
    this.alive = false
  }
}
