import * as THREE from 'three'
import { World } from './World.js'
import { Hero } from './entities/Hero.js'
import { Tower } from './entities/Tower.js'
import { Stronghold } from './entities/Stronghold.js'
import { createGround } from './visuals.js'
import { createSteeringController } from './input.js'
import { manualAttack } from './ai.js'
import { createHud } from './hud.js'
import {
  TEAM,
  TOWER_Z,
  BASE_Z,
  LANE_LENGTH,
  LANE_WIDTH,
  HERO_ROLES,
  PITCH_LIMIT,
} from './config.js'

const container = document.getElementById('game-container')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

scene.add(new THREE.AmbientLight(0xffffff, 0.7))
const sun = new THREE.DirectionalLight(0xffffff, 0.8)
sun.position.set(20, 40, 10)
scene.add(sun)

const ground = createGround(LANE_LENGTH, LANE_WIDTH)
scene.add(ground)

const world = new World(scene)

world.addStronghold(TEAM.ALLY, new Stronghold(TEAM.ALLY))
world.addStronghold(TEAM.ENEMY, new Stronghold(TEAM.ENEMY))

for (const team of [TEAM.ALLY, TEAM.ENEMY]) {
  for (const z of TOWER_Z[team]) {
    world.addTower(new Tower(team, 0, z))
  }
}

const ROLE_ORDER = [
  HERO_ROLES.VANGUARD,
  HERO_ROLES.MYSTIC,
  HERO_ROLES.MARKSMAN,
  HERO_ROLES.SKIRMISHER,
  HERO_ROLES.SENTINEL,
]

let wando = null
for (const team of [TEAM.ALLY, TEAM.ENEMY]) {
  const baseZ = BASE_Z[team]
  ROLE_ORDER.forEach((role, i) => {
    const spawnX = (i - 2) * 4
    const spawnZ = baseZ - Math.sign(baseZ) * 6
    const isPlayer = team === TEAM.ALLY && role === HERO_ROLES.VANGUARD
    const hero = new Hero(role, team, spawnX, spawnZ, { isPlayer })
    world.addHero(hero)
    if (isPlayer) wando = hero
  })
}

// First-person cockpit view (2026-11-25): the player's own ship is never
// rendered, since the camera sits inside it — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md.
wando.mesh.visible = false

// Exposed for debugging/automated smoke tests only.
window.__debug = { world, wando, camera, ground, scene }

const hud = createHud(container)

const steering = createSteeringController(renderer)

hud.abilityButton.addEventListener('pointerdown', () => {
  const now = performance.now()
  if (wando.alive && wando.canUseAbility(now)) {
    wando.useAbility(null, world, now)
  }
})

hud.fireButton.addEventListener('pointerdown', () => {
  const now = performance.now()
  if (wando.alive) manualAttack(wando, world, now)
})

const clock = new THREE.Clock()
let matchOverShown = false

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.1)
  const now = performance.now()

  wando.steer = steering.getSteer()

  if (!world.matchOver) {
    world.update(dt, now)
  } else if (!matchOverShown) {
    matchOverShown = true
    hud.showMatchOver(world.winner === TEAM.ALLY)
  }

  wando.mesh.visible = false // stays hidden through death/respawn too

  if (wando.alive) {
    const forward = wando.getForwardVector()
    const eye = wando.position.clone().addScaledVector(forward, 0.6)
    eye.y += 0.4
    camera.position.copy(eye)
    camera.lookAt(eye.clone().addScaledVector(forward, 10))
  }

  hud.setWandoHp(wando.hp / wando.maxHp)
  hud.setAllyBaseHp(world.strongholds[TEAM.ALLY].hp / world.strongholds[TEAM.ALLY].maxHp)
  hud.setEnemyBaseHp(world.strongholds[TEAM.ENEMY].hp / world.strongholds[TEAM.ENEMY].maxHp)
  const abilityElapsed = now - wando.lastAbilityAt
  hud.setAbilityCooldown(Math.max(0, 1 - abilityElapsed / wando.ability.cooldownMs))
  const fireElapsed = now - wando.lastAttackAt
  hud.setFireCooldown(Math.max(0, 1 - fireElapsed / wando.attackIntervalMs))
  hud.setGyro(wando.yaw, wando.pitch / PITCH_LIMIT)

  renderer.render(scene, camera)
}

animate()

hud.restartButton.addEventListener('pointerdown', () => {
  window.location.reload()
})
