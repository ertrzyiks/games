import * as THREE from 'three'
import { TEAM, ROCKET_SPEED } from './config.js'

// Shared, module-level geometry/materials — with a machine-gun fire rate
// and potentially dozens of units attacking at once, allocating a fresh
// geometry+material per shot (the original implementation) is exactly the
// kind of per-frame GC churn that causes stutter. Every projectile reuses
// the same tiny geometry and one of two team-colored materials; only
// position/scale are ever per-instance.
const PROJECTILE_GEOMETRY = new THREE.SphereGeometry(0.09, 5, 4)
const PROJECTILE_MATERIAL = {
  [TEAM.ALLY]: new THREE.MeshBasicMaterial({ color: 0xbfe6ff }),
  [TEAM.ENEMY]: new THREE.MeshBasicMaterial({ color: 0xffcdbf }),
}

// A cone, not a sphere — oriented to point along its travel direction so it
// visibly reads as a fired projectile, not a dropped object. Bigger and
// slower than the gun's bullets (ROCKET_SPEED vs. the bullets' fixed
// 120ms-regardless-of-distance), so it's clearly a heavier single shot.
const ROCKET_GEOMETRY = new THREE.ConeGeometry(0.22, 0.9, 8)
const ROCKET_MATERIAL = new THREE.MeshStandardMaterial({ color: 0xff6a00 })

const AIM_LINE_MATERIAL = new THREE.LineBasicMaterial({ color: 0xff3b1f })

// Visual feedback for an attack — every attack in the game routes through
// here (see ai.js), not just the player's, so bot-vs-bot and creep fights
// are legible too. Ranged units (attackRange > 4) get a small travelling
// projectile; melee units get a brief emissive flash on their target.
export function createEffectsSystem(scene) {
  const projectiles = []
  const flashes = []
  const rockets = []
  const explosions = []

  function triggerAttackEffect(attacker, target) {
    if (attacker.attackRange > 4) {
      spawnProjectileTo(attacker, target.position)
    } else {
      spawnFlash(target)
    }
  }

  // Wando's manual fire (see ai.js's manualAttack): always a straight shot
  // along her exact forward line to the given endpoint — never bent toward
  // a target, so there's no auto-aim, matching a fixed forward-firing gun.
  // `fromOverride` lets the twin wingtip streams visually originate left/
  // right of her center instead of dead-center.
  function triggerStraightShot(attacker, endpoint, fromOverride) {
    spawnProjectileTo(attacker, endpoint, fromOverride)
  }

  function spawnProjectileTo(attacker, targetPoint, fromOverride) {
    const mesh = new THREE.Mesh(PROJECTILE_GEOMETRY, PROJECTILE_MATERIAL[attacker.team])
    // Use each end's own height — forcing both ends flat (a leftover from
    // when every shot was ground-to-ground) is exactly what made Wando's
    // shots fire level regardless of her pitch: her endpoint's Y (computed
    // correctly in ai.js's manualAttack from her actual forward vector) was
    // being discarded here.
    const fromSource = fromOverride || attacker.position
    const from = new THREE.Vector3(fromSource.x, attacker.mesh.position.y + 0.5, fromSource.z)
    const to = new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z)
    mesh.position.copy(from)
    scene.add(mesh)
    projectiles.push({ mesh, from, to, start: performance.now(), duration: 120 })
  }

  function spawnFlash(target) {
    if (!target.mesh.material?.emissive) return
    flashes.push({ unit: target, until: performance.now() + 120 })
  }

  // Wando's rocket (see ai.js's fireRocket): travels forward from her
  // position to the impact point at ROCKET_SPEED (so, unlike a bullet, it's
  // slow enough to actually see in flight), then calls onImpact (AoE
  // damage) and shows a brief expanding/fading burst.
  function fireRocket(attacker, impactPoint, onImpact) {
    const from = new THREE.Vector3(attacker.position.x, attacker.mesh.position.y, attacker.position.z)
    const mesh = new THREE.Mesh(ROCKET_GEOMETRY, ROCKET_MATERIAL)
    mesh.position.copy(from)
    const direction = impactPoint.clone().sub(from).normalize()
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    scene.add(mesh)
    const distance = from.distanceTo(impactPoint)
    const duration = Math.max(120, (distance / ROCKET_SPEED) * 1000)
    rockets.push({ mesh, from, to: impactPoint.clone(), start: performance.now(), duration, onImpact })
  }

  function spawnExplosion(point) {
    const geometry = new THREE.SphereGeometry(0.6, 8, 6)
    const material = new THREE.MeshBasicMaterial({ color: 0xffa03c, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(point)
    scene.add(mesh)
    explosions.push({ mesh, start: performance.now(), duration: 320 })
  }

  // Tower telegraph line (see ai.js's towerStep) — one persistent line per
  // tower, stored on the tower itself since there are only ever a handful.
  function startAimLine(tower, target) {
    const from = new THREE.Vector3(tower.position.x, tower.position.y + 3, tower.position.z)
    const geometry = new THREE.BufferGeometry().setFromPoints([from, target.position])
    tower._aimLine = new THREE.Line(geometry, AIM_LINE_MATERIAL)
    scene.add(tower._aimLine)
  }

  function updateAimLine(tower, target) {
    if (!tower._aimLine) return
    const positions = tower._aimLine.geometry.attributes.position
    positions.setXYZ(0, tower.position.x, tower.position.y + 3, tower.position.z)
    positions.setXYZ(1, target.position.x, target.position.y, target.position.z)
    positions.needsUpdate = true
  }

  function cancelAimLine(tower) {
    if (!tower._aimLine) return
    scene.remove(tower._aimLine)
    tower._aimLine.geometry.dispose()
    tower._aimLine = null
  }

  function update(now) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]
      const t = Math.min(1, (now - p.start) / p.duration)
      p.mesh.position.lerpVectors(p.from, p.to, t)
      if (t >= 1) {
        scene.remove(p.mesh)
        // Geometry/material are shared module-level singletons — never
        // dispose them here, only the per-shot mesh goes away.
        projectiles.splice(i, 1)
      }
    }

    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]
      if (!f.unit.alive || now >= f.until) {
        f.unit.mesh.material.emissive.setHex(0x000000)
        flashes.splice(i, 1)
      } else {
        f.unit.mesh.material.emissive.setHex(0xffffff)
      }
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]
      const t = Math.min(1, (now - r.start) / r.duration)
      r.mesh.position.lerpVectors(r.from, r.to, t)
      if (t >= 1) {
        scene.remove(r.mesh)
        // ROCKET_GEOMETRY/ROCKET_MATERIAL are shared singletons, like the
        // projectile ones — never dispose them here.
        spawnExplosion(r.to)
        r.onImpact()
        rockets.splice(i, 1)
      }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
      const ex = explosions[i]
      const t = Math.min(1, (now - ex.start) / ex.duration)
      const scale = 1 + t * 6
      ex.mesh.scale.set(scale, scale, scale)
      ex.mesh.material.opacity = 0.9 * (1 - t)
      if (t >= 1) {
        scene.remove(ex.mesh)
        ex.mesh.geometry.dispose()
        ex.mesh.material.dispose()
        explosions.splice(i, 1)
      }
    }
  }

  return {
    triggerAttackEffect,
    triggerStraightShot,
    fireRocket,
    startAimLine,
    updateAimLine,
    cancelAimLine,
    update,
  }
}
