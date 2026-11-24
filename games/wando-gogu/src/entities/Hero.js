import * as THREE from 'three'
import { Unit } from './Unit.js'
import { HERO_ROLES, HERO_STATS, HERO_ABILITY, BASE_Z, otherTeam, RESPAWN_MS } from '../config.js'
import { createHeroMesh } from '../visuals.js'

// A hero — player-controlled (Wando) or bot-controlled. Heroes move freely in
// X/Z, unlike lane-locked creeps (see .scratch/wando-gogu-arts/issues/02-heroes.md
// and 05-ai-behavior.md). Shares the same attack/movement AI loop as creeps
// (see ../ai.js) except for how its advance/move target is sourced.
export class Hero extends Unit {
  constructor(role, team, spawnX, spawnZ, { isPlayer = false } = {}) {
    const stats = HERO_STATS[role]
    const mesh = createHeroMesh(role, team)
    mesh.position.x = spawnX
    mesh.position.z = spawnZ
    super({
      team,
      kind: 'hero',
      hp: stats.hp,
      damage: stats.damage,
      attackRange: stats.attackRange,
      attackIntervalMs: stats.attackIntervalMs,
      speed: stats.speed,
      mesh,
    })
    this.role = role
    this.isPlayer = isPlayer
    this.spawnPoint = new THREE.Vector3(spawnX, mesh.position.y, spawnZ)
    this.ability = HERO_ABILITY[role]
    this.lastAbilityAt = -Infinity
    this.deadUntil = 0
    this.moveTarget = null // player input sets this; bots recompute every tick
  }

  canUseAbility(now) {
    return now - this.lastAbilityAt >= this.ability.cooldownMs
  }

  useAbility(target, world, now) {
    this.lastAbilityAt = now
    switch (this.role) {
      case HERO_ROLES.VANGUARD:
        this.shield += 30
        break
      case HERO_ROLES.SENTINEL:
        this.shield += this.ability.shieldAmount
        break
      case HERO_ROLES.MARKSMAN:
        target?.takeDamage(this.ability.damage)
        break
      case HERO_ROLES.MYSTIC: {
        const nearby = world.unitsInRadius(this.position, this.ability.radius, otherTeam(this.team))
        nearby.forEach((u) => u.takeDamage(this.ability.damage))
        break
      }
      case HERO_ROLES.SKIRMISHER:
        if (target) {
          this.mesh.position.x = target.position.x
          this.mesh.position.z = target.position.z
          target.takeDamage(this.ability.bonusDamage)
        }
        break
      default:
        break
    }
  }

  getAdvanceTarget() {
    if (this.isPlayer) {
      return this.moveTarget
    }
    return new THREE.Vector3(0, 0, BASE_Z[otherTeam(this.team)])
  }

  die() {
    super.die()
    this.deadUntil = performance.now() + RESPAWN_MS
    this.mesh.visible = false
  }

  respawn(now) {
    this.hp = this.maxHp
    this.shield = 0
    this.alive = true
    this.mesh.visible = true
    this.mesh.position.x = this.spawnPoint.x
    this.mesh.position.z = this.spawnPoint.z
    this.lastAttackAt = now
    this.lastAbilityAt = now
  }
}
