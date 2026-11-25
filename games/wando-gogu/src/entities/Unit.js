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
    this.lastDamagedBy = null // who most recently hit this unit — see World.awardGold
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
    target.takeDamage(this.damage, this)
  }

  // `attacker` is optional (e.g. nothing currently damages without one, but
  // this stays permissive) and is recorded on every hit, not just the killing
  // one, so by the time HP reaches 0 it already reflects whoever landed it —
  // World.js uses this to credit gold only for the player's own kills.
  takeDamage(amount, attacker) {
    if (!this.alive) return
    this.lastDamagedBy = attacker
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

  // Subclasses override this for a visual death state (e.g. Tower's rubble
  // pile). `onDeath` is a separate, optional callback assigned externally
  // (World.js uses it for gold) so World doesn't need subclass-specific
  // knowledge and subclasses don't need a World reference.
  die() {
    this.alive = false
    this.onDeath?.(this)
  }
}
