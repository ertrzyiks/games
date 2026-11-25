import {
  AGGRO_RADIUS,
  FIRE_RAY_TOLERANCE,
  FIRE_RAY_SPREAD,
  TOWER_AIM_MS,
  ROCKET_COOLDOWN_MS,
  ROCKET_DAMAGE,
  ROCKET_RADIUS,
  ROCKET_EXTRA_TOLERANCE,
  TURBO_DURATION_MS,
  TURBO_COOLDOWN_MS,
  otherTeam,
} from './config.js'

// One shared behavior loop for creeps and bot heroes: chase the nearest
// enemy, attack automatically once in range, else advance — see
// .scratch/wando-gogu-arts/issues/05-ai-behavior.md. The player's hero
// (Wando) is piloted instead: constant forward flight steered by input
// (Hero.flyForward), fire/ability are manual buttons, not automatic — see
// the 2026-11-25 entries in .scratch/wando-gogu-arts/issues/06-controls-camera.md.
export function aiStep(unit, world, now, dt) {
  if (!unit.alive) return

  if (unit.kind === 'hero' && unit.isPlayer) {
    unit.flyForward(dt, now)
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
  hit.target.takeDamage(unit.damage, unit)
  return hit.target
}

// Hit detection only (never changes the shot's direction): the nearest
// enemy within tolerance of the exact forward line, out to attackRange.
// Tolerance widens with distance (FIRE_RAY_TOLERANCE near, +FIRE_RAY_SPREAD
// per unit of range) — a flat tolerance made long-range hits require
// near-pixel-perfect alignment, which read as "shots do nothing far away."
// `extraTolerance` lets a bigger projectile (the rocket) be more forgiving
// than the gun without duplicating this whole scan.
// Returns { target, forwardDist } or null.
function findForwardTarget(unit, world, extraTolerance = 0) {
  const forward = unit.getForwardVector()
  let best = null
  let bestForwardDist = unit.attackRange
  for (const other of world.allAlive()) {
    if (other.team === unit.team || other === unit) continue
    const toOther = other.position.clone().sub(unit.position)
    const forwardDist = toOther.dot(forward) // how far along the ray
    if (forwardDist <= 0 || forwardDist > bestForwardDist) continue
    const lateralDist = toOther.addScaledVector(forward, -forwardDist).length() // perpendicular offset
    const tolerance = FIRE_RAY_TOLERANCE + forwardDist * FIRE_RAY_SPREAD + extraTolerance
    if (lateralDist > tolerance) continue
    best = { target: other, forwardDist }
    bestForwardDist = forwardDist
  }
  return best
}

// Wando's rocket — a special action, distinct from manual fire and Guard
// Up. Fires straight ahead along the same forward line as the gun (so it
// stays visible in view, unlike the original straight-down bomb drop,
// which fell behind her as she kept flying forward and was never actually
// seen) as one bigger, slower, more forgiving-to-aim projectile. Explodes
// in a radius wherever it lands — on a direct hit's position, or at max
// range if nothing was hit. Returns true if it actually fired (false if on
// cooldown).
export function fireRocket(unit, world, now) {
  if (!unit.alive || now - unit.lastRocketAt < ROCKET_COOLDOWN_MS) return false
  unit.lastRocketAt = now

  const forward = unit.getForwardVector()
  const hit = findForwardTarget(unit, world, ROCKET_EXTRA_TOLERANCE)
  const travelDistance = hit ? hit.forwardDist : unit.attackRange
  const impactPoint = unit.position.clone().addScaledVector(forward, travelDistance)
  const enemyTeam = otherTeam(unit.team)

  world.effects.fireRocket(unit, impactPoint, () => {
    world.unitsInRadius(impactPoint, ROCKET_RADIUS, enemyTeam).forEach((target) => {
      target.takeDamage(ROCKET_DAMAGE, unit)
    })
  })
  return true
}

// Wando's other special action: a temporary speed boost. Returns true if it
// actually activated (false if on cooldown).
export function activateTurbo(unit, now) {
  if (!unit.alive || now - unit.lastTurboAt < TURBO_COOLDOWN_MS) return false
  unit.lastTurboAt = now
  unit.turboUntil = now + TURBO_DURATION_MS
  return true
}

// Tower-only: telegraphs for TOWER_AIM_MS (a visible aim line to the locked
// target) before firing, instead of attacking instantly — see
// .scratch/wando-gogu-arts/issues/04-towers-base.md. attackIntervalMs gates
// how soon a *completed* shot can be followed by a new aim phase; a
// cancelled aim (target died/left range) can retry immediately.
export function towerStep(tower, world, now) {
  if (!tower.alive) return

  if (tower.aimTarget && (!tower.aimTarget.alive || tower.distanceTo(tower.aimTarget) > tower.attackRange)) {
    world.effects.cancelAimLine(tower)
    tower.aimTarget = null
  }

  if (tower.aimTarget) {
    world.effects.updateAimLine(tower, tower.aimTarget)
    if (now - tower.aimStart >= TOWER_AIM_MS) {
      const target = tower.aimTarget
      world.effects.cancelAimLine(tower)
      tower.aimTarget = null
      tower.attack(target, now)
      world.effects.triggerAttackEffect(tower, target)
    }
    return
  }

  if (!tower.canAttack(now)) return
  const candidate = world.nearestEnemyInRadius(tower, tower.attackRange)
  if (!candidate) return
  tower.aimTarget = candidate
  tower.aimStart = now
  world.effects.startAimLine(tower, candidate)
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
