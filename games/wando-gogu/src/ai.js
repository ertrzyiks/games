import { AGGRO_RADIUS } from './config.js'

// One shared behavior loop for creeps and bot heroes: chase the nearest
// enemy, attack automatically once in range, else advance — see
// .scratch/wando-gogu-arts/issues/05-ai-behavior.md. The player's hero
// (Wando) is piloted instead: constant forward flight steered by input
// (Hero.flyForward), fire/ability are manual buttons, not automatic — see
// the 2026-11-25 entries in .scratch/wando-gogu-arts/issues/06-controls-camera.md.
export function aiStep(unit, world, now, dt) {
  if (!unit.alive) return

  if (unit.kind === 'hero' && unit.isPlayer) {
    unit.flyForward(dt)
    return
  }

  const nearestEnemy = world.nearestEnemyInRadius(unit, AGGRO_RADIUS)

  if (nearestEnemy) {
    const dist = unit.distanceTo(nearestEnemy)
    if (dist <= unit.attackRange) {
      if (unit.canAttack(now)) {
        unit.attack(nearestEnemy, now)
        world.effects.triggerAttackEffect(unit, nearestEnemy)
      }
      if (unit.kind === 'hero' && unit.canUseAbility(now)) {
        unit.useAbility(nearestEnemy, world, now)
      }
      return
    }
    moveToward(unit, nearestEnemy.position, dt)
    return
  }

  const dest = unit.getAdvanceTarget ? unit.getAdvanceTarget() : null
  if (dest) moveToward(unit, dest, dt)
}

export function attackOnlyStep(unit, world, now) {
  if (!unit.alive) return
  const nearestEnemy = world.nearestEnemyInRadius(unit, unit.attackRange)
  if (nearestEnemy && unit.canAttack(now)) {
    unit.attack(nearestEnemy, now)
    world.effects.triggerAttackEffect(unit, nearestEnemy)
  }
}

// Manual fire for the player's hero — called from main.js's fire button.
// Returns the target it hit, or null if nothing was in range / on cooldown.
export function manualAttack(unit, world, now) {
  if (!unit.alive || !unit.canAttack(now)) return null
  const target = world.nearestEnemyInRadius(unit, unit.attackRange)
  if (!target) return null
  unit.attack(target, now)
  world.effects.triggerAttackEffect(unit, target)
  return target
}

function moveToward(unit, dest, dt) {
  const dx = dest.x - unit.mesh.position.x
  const dz = dest.z - unit.mesh.position.z
  const dist = Math.hypot(dx, dz)
  if (dist < 0.05) return
  const step = Math.min(dist, unit.speed * dt)
  unit.mesh.position.x += (dx / dist) * step
  unit.mesh.position.z += (dz / dist) * step
}
