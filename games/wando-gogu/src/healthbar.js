import * as THREE from 'three'
import { TEAM } from './config.js'

// Floating HP bars over towers, creeps, and bot heroes (not Wando — her own
// mesh is invisible in the cockpit view). Every bar shares one geometry and
// one material per team for both the background and fill planes — only
// position/scale differ per instance — to stay cheap with many units on
// screen at once (see effects.js for the same approach applied to shots).
const WIDTH = 1.1
const HEIGHT = 0.14

const BAR_GEOMETRY = new THREE.PlaneGeometry(1, 1)
const BG_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x14161c })
const FILL_MATERIAL = {
  [TEAM.ALLY]: new THREE.MeshBasicMaterial({ color: 0x5ad1ff }),
  [TEAM.ENEMY]: new THREE.MeshBasicMaterial({ color: 0xff5a5a }),
}

export function attachHealthBar(unit, yOffset) {
  const pivot = new THREE.Object3D()
  pivot.position.y = yOffset

  const bg = new THREE.Mesh(BAR_GEOMETRY, BG_MATERIAL)
  bg.scale.set(WIDTH, HEIGHT, 1)
  pivot.add(bg)

  const fill = new THREE.Mesh(BAR_GEOMETRY, FILL_MATERIAL[unit.team])
  fill.scale.set(WIDTH, HEIGHT * 0.7, 1)
  fill.position.z = 0.01 // avoid z-fighting with the background
  pivot.add(fill)

  unit.mesh.add(pivot)
  unit.healthBar = { pivot, fill }
}

// Called once per frame with every unit that might have a bar; billboards
// each bar to face the camera and resizes the fill to the current HP
// fraction. Units never rotate their own mesh in this game, so copying the
// camera's world quaternion directly onto a bar parented under the unit's
// mesh billboards it correctly without any extra math.
export function updateHealthBars(units, camera) {
  for (const unit of units) {
    const bar = unit.healthBar
    if (!unit.alive || !bar) continue
    bar.pivot.quaternion.copy(camera.quaternion)
    const frac = Math.max(0.001, unit.hp / unit.maxHp)
    bar.fill.scale.x = WIDTH * frac
    bar.fill.position.x = -(WIDTH / 2) * (1 - frac)
  }
}
