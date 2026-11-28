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

// Wando's own ship — distinct from the generic Vanguard box every other
// hero (including bot Vanguards) uses: a sci-fi starfighter silhouette
// (X-wing-like fuselage + four S-foil wings in an X configuration), since
// she's specifically flown/viewed in third-person, not just a generic
// ground-based hero. Built along local -Z (the shared forward convention —
// see Hero.getForwardVector/mesh.lookAt) so it noses correctly once
// oriented each frame.
export function createPlayerShipMesh(team) {
  const hullMaterial = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team] })
  const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xd8dde3 })
  const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x1c2026 })

  const group = new THREE.Group()

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.6, 8), hullMaterial)
  body.rotation.x = -Math.PI / 2
  group.add(body)

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), accentMaterial)
  nose.rotation.x = -Math.PI / 2
  nose.position.z = -1.1
  group.add(nose)

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), cockpitMaterial)
  cockpit.position.set(0, 0.18, -0.2)
  group.add(cockpit)

  // Four S-foil wings in an X configuration, mounted toward the rear —
  // reads clearly from the trailing third-person chase camera, which
  // looks nearly straight down the ship's own forward axis.
  const wingGeometry = new THREE.BoxGeometry(1.7, 0.07, 0.55)
  ;[45, 135, 225, 315].forEach((deg) => {
    const wing = new THREE.Mesh(wingGeometry, hullMaterial)
    wing.position.z = 0.25
    wing.rotation.z = THREE.MathUtils.degToRad(deg)
    group.add(wing)
  })

  // Wingtip cannons — also visually matches where the twin-stream gun
  // actually fires from (see ai.js's manualAttack / WANDO_STREAM_OFFSET).
  const cannonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6)
  ;[-1, 1].forEach((side) => {
    const cannon = new THREE.Mesh(cannonGeometry, accentMaterial)
    cannon.rotation.x = -Math.PI / 2
    cannon.position.set(side * 1.1, 0, -0.2)
    group.add(cannon)
  })

  group.position.y = 1
  return group
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

const RUBBLE_COLORS = [0x6b5d52, 0x554940, 0x7a6a5c, 0x4a4039]

// A destroyed tower's replacement visual — a scattered pile of chunks
// instead of a clean geometric shape, so "destroyed" reads unmistakably
// different from "damaged." Built fresh per call (towers are few — at most
// 4 in a match — so this doesn't need the shared-geometry treatment the
// much-more-numerous projectiles and health bars get).
export function createRubbleMesh() {
  const group = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    const size = 0.5 + Math.random() * 0.7
    const geometry = new THREE.BoxGeometry(size, size * 0.6, size)
    const material = new THREE.MeshStandardMaterial({
      color: RUBBLE_COLORS[i % RUBBLE_COLORS.length],
    })
    const chunk = new THREE.Mesh(geometry, material)
    chunk.position.set((Math.random() - 0.5) * 2.2, size * 0.3, (Math.random() - 0.5) * 2.2)
    chunk.rotation.y = Math.random() * Math.PI
    group.add(chunk)
  }
  return group
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
