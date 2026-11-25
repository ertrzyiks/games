import * as THREE from 'three'
import { Unit } from './Unit.js'
import {
  HERO_ROLES,
  HERO_STATS,
  HERO_ABILITY,
  BASE_Z,
  TEAM,
  otherTeam,
  RESPAWN_MS,
  STEER_TURN_RATE,
  PITCH_LIMIT,
  WANDO_ATTACK_RANGE,
  ALTITUDE_MIN,
  ALTITUDE_MAX,
  LANE_HALF,
  LANE_WIDTH,
} from '../config.js'
import { createHeroMesh } from '../visuals.js'

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v))
}

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
    if (isPlayer) this.attackRange = WANDO_ATTACK_RANGE
    this.spawnPoint = new THREE.Vector3(spawnX, mesh.position.y, spawnZ)
    this.ability = HERO_ABILITY[role]
    this.lastAbilityAt = -Infinity
    this.deadUntil = 0

    // Piloting state — only meaningful for the player's hero (Wando), but
    // harmless to carry on every hero. yaw=0 faces -Z (an ally's "forward");
    // an enemy hero never pilots, so it's never actually flown this way.
    this.yaw = team === TEAM.ALLY ? 0 : Math.PI
    this.pitch = 0
    this.steer = { x: 0, y: 0 } // set every frame by input.js's steering controller
  }

  getForwardVector() {
    const cosPitch = Math.cos(this.pitch)
    return new THREE.Vector3(
      Math.sin(this.yaw) * cosPitch,
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * cosPitch
    )
  }

  // Constant forward flight — steering only changes heading, never stops or
  // reverses. Pitch/yaw hold wherever you leave them (pure trim — releasing
  // the stick does not level the ship out), per the 2026-11-25 correction in
  // .scratch/wando-gogu-arts/issues/06-controls-camera.md.
  flyForward(dt) {
    this.yaw += this.steer.x * STEER_TURN_RATE * dt
    this.pitch = clamp(this.pitch + this.steer.y * STEER_TURN_RATE * dt, -PITCH_LIMIT, PITCH_LIMIT)

    const forward = this.getForwardVector()
    this.mesh.position.addScaledVector(forward, this.speed * dt)

    const clampX = LANE_WIDTH * 3
    const clampZ = LANE_HALF * 1.1
    this.mesh.position.x = clamp(this.mesh.position.x, -clampX, clampX)
    this.mesh.position.y = clamp(this.mesh.position.y, ALTITUDE_MIN, ALTITUDE_MAX)
    this.mesh.position.z = clamp(this.mesh.position.z, -clampZ, clampZ)
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

  // Bot heroes only — the player's hero flies via flyForward() instead,
  // called directly from ai.js.
  getAdvanceTarget() {
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
    this.mesh.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z)
    this.yaw = this.team === TEAM.ALLY ? 0 : Math.PI
    this.pitch = 0
    this.lastAttackAt = now
    this.lastAbilityAt = now
  }
}
