import { AGGRO_RADIUS } from './config.js'

// One shared behavior loop for every unit that can act — creeps, bot heroes,
// and the player's hero alike (attacking is always automatic, per
// .scratch/wando-gogu-arts/issues/05-ai-behavior.md and 06-controls-camera.md).
// Only where the "advance" destination comes from differs per unit
// (unit.getAdvanceTarget()): lane point for creeps/bot heroes, player input
// for the player's hero. Towers/bases don't move — attack only.
export function aiStep(unit, world, now, dt) {
  if (!unit.alive) return

  const nearestEnemy = world.nearestEnemyInRadius(unit, AGGRO_RADIUS)

  if (nearestEnemy) {
    const dist = unit.distanceTo(nearestEnemy)
    if (dist <= unit.attackRange) {
      if (unit.canAttack(now)) unit.attack(nearestEnemy, now)
      // Bot heroes use their ability automatically; the player's hero only
      // uses theirs via the dedicated button (see hud.js / main.js) — see
      // .scratch/wando-gogu-arts/issues/06-controls-camera.md.
      if (unit.kind === 'hero' && !unit.isPlayer && unit.canUseAbility(now)) {
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
  }
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
