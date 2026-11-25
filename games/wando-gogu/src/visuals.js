import * as THREE from 'three'
import { HERO_ROLES, TEAM_COLOR } from './config.js'

// Procedural primitive meshes only — no textures/models, per
// .scratch/wando-gogu-arts/issues/07-visual-style.md. Each hero role gets a
// distinct simple shape/size so silhouettes read even without detail.
export function createHeroMesh(role, team) {
  const color = TEAM_COLOR[team]
  const material = new THREE.MeshStandardMaterial({ color })
  let geometry

  switch (role) {
    case HERO_ROLES.VANGUARD:
      geometry = new THREE.BoxGeometry(1.4, 1.8, 1.4)
      break
    case HERO_ROLES.MYSTIC:
      geometry = new THREE.SphereGeometry(0.9, 12, 10)
      break
    case HERO_ROLES.MARKSMAN:
      geometry = new THREE.CylinderGeometry(0.4, 0.6, 2.2, 8)
      break
    case HERO_ROLES.SKIRMISHER:
      geometry = new THREE.ConeGeometry(0.8, 1.8, 6)
      break
    case HERO_ROLES.SENTINEL:
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2)
      break
  }

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = role === HERO_ROLES.MYSTIC ? 2.2 : 1 // Mystic hovers higher — flavor only.
  return mesh
}

export function createCreepMesh(team) {
  const material = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team] })
  const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.45
  return mesh
}

export function createTowerMesh(team) {
  const material = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team] })
  const geometry = new THREE.CylinderGeometry(1.2, 1.6, 6, 10)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 3
  return mesh
}

export function createBaseMesh(team) {
  const material = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team] })
  const geometry = new THREE.BoxGeometry(6, 5, 6)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 2.5
  return mesh
}

export function createGround(laneLength, laneWidth) {
  // Generous margin beyond Hero.flyForward's movement clamp (±laneWidth*3,
  // ±laneHalf*1.1) so the camera — offset slightly ahead of the player's
  // hero — never pokes past the ground's edge into empty background.
  const geometry = new THREE.PlaneGeometry(laneWidth * 10, laneLength * 1.8)
  const material = new THREE.MeshStandardMaterial({ color: 0x3f6b3a })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}
