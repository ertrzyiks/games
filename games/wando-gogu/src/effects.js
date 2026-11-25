import * as THREE from 'three'
import { TEAM } from './config.js'

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

// Visual feedback for an attack — every attack in the game routes through
// here (see ai.js), not just the player's, so bot-vs-bot and creep fights
// are legible too. Ranged units (attackRange > 4) get a small travelling
// projectile; melee units get a brief emissive flash on their target.
export function createEffectsSystem(scene) {
  const projectiles = []
  const flashes = []

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
  function triggerStraightShot(attacker, endpoint) {
    spawnProjectileTo(attacker, endpoint)
  }

  function spawnProjectileTo(attacker, targetPoint) {
    const mesh = new THREE.Mesh(PROJECTILE_GEOMETRY, PROJECTILE_MATERIAL[attacker.team])
    const height = attacker.mesh.position.y + 0.5
    const from = new THREE.Vector3(attacker.position.x, height, attacker.position.z)
    const to = new THREE.Vector3(targetPoint.x, height, targetPoint.z)
    mesh.position.copy(from)
    scene.add(mesh)
    projectiles.push({ mesh, from, to, start: performance.now(), duration: 120 })
  }

  function spawnFlash(target) {
    if (!target.mesh.material?.emissive) return
    flashes.push({ unit: target, until: performance.now() + 120 })
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
  }

  return { triggerAttackEffect, triggerStraightShot, update }
}
