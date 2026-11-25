import { AGGRO_RADIUS, FIRE_RAY_TOLERANCE } from './config.js'

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

// Manual fire for the player's hero — called from main.js's fire button, a
// fixed forward-firing gun like a WWII fighter's: no auto-aim, no bending
// toward a target. It fires dead straight along the exact forward line on
// every trigger pull (subject to the fire-rate cooldown), hit or miss.
// Whether something was in the line of fire is a separate hit-detection
// check (findForwardTarget) that only ever affects damage, never the shot's
// direction. Returns the target it hit, or null on a miss/cooldown.
export function manualAttack(unit, world, now) {
  if (!unit.alive || !unit.canAttack(now)) return null
  unit.lastAttackAt = now

  const forward = unit.getForwardVector()
  const hit = findForwardTarget(unit, world)
  const shotDistance = hit ? hit.forwardDist : unit.attackRange
  const endpoint = unit.position.clone().addScaledVector(forward, shotDistance)
  world.effects.triggerStraightShot(unit, endpoint)

  if (!hit) return null
  hit.target.takeDamage(unit.damage)
  return hit.target
}

// Hit detection only (never changes the shot's direction): the nearest
// enemy within FIRE_RAY_TOLERANCE of the exact forward line, out to
// attackRange. Returns { target, forwardDist } or null.
function findForwardTarget(unit, world) {
  const forward = unit.getForwardVector()
  let best = null
  let bestForwardDist = unit.attackRange
  for (const other of world.allAlive()) {
    if (other.team === unit.team || other === unit) continue
    const toOther = other.position.clone().sub(unit.position)
    const forwardDist = toOther.dot(forward) // how far along the ray
    if (forwardDist <= 0 || forwardDist > bestForwardDist) continue
    const lateralDist = toOther.addScaledVector(forward, -forwardDist).length() // perpendicular offset
    if (lateralDist > FIRE_RAY_TOLERANCE) continue
    best = { target: other, forwardDist }
    bestForwardDist = forwardDist
  }
  return best
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
