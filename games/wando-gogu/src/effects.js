import * as THREE from 'three'
import { TEAM } from './config.js'

// Visual feedback for an attack — every attack in the game routes through
// here (see ai.js), not just the player's, so bot-vs-bot and creep fights
// are legible too. Ranged units (attackRange > 4) get a small travelling
// projectile; melee units get a brief emissive flash on their target.
export function createEffectsSystem(scene) {
  const projectiles = []
  const flashes = []

  function triggerAttackEffect(attacker, target) {
    if (attacker.attackRange > 4) {
      spawnProjectile(attacker, target)
    } else {
      spawnFlash(target)
    }
  }

  function spawnProjectile(attacker, target) {
    const color = attacker.team === TEAM.ALLY ? 0xbfe6ff : 0xffcdbf
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), new THREE.MeshBasicMaterial({ color }))
    const height = attacker.mesh.position.y + 0.5
    const from = new THREE.Vector3(attacker.position.x, height, attacker.position.z)
    const to = new THREE.Vector3(target.position.x, height, target.position.z)
    mesh.position.copy(from)
    scene.add(mesh)
    projectiles.push({ mesh, from, to, start: performance.now(), duration: 180 })
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
        p.mesh.geometry.dispose()
        p.mesh.material.dispose()
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

  return { triggerAttackEffect, update }
}
