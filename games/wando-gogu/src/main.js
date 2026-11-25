import * as THREE from 'three'
import { World } from './World.js'
import { Hero } from './entities/Hero.js'
import { Tower } from './entities/Tower.js'
import { Stronghold } from './entities/Stronghold.js'
import { createGround } from './visuals.js'
import { createSteeringController } from './input.js'
import { manualAttack, fireRocket, activateTurbo } from './ai.js'
import { updateHealthBars } from './healthbar.js'
import { createHud } from './hud.js'
import {
  TEAM,
  TOWER_Z,
  BASE_Z,
  LANE_LENGTH,
  LANE_WIDTH,
  HERO_ROLES,
  PITCH_LIMIT,
  CRASH_FALL_MS,
  RESPAWN_MS,
  ROCKET_COOLDOWN_MS,
  TURBO_COOLDOWN_MS,
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

// Exposed for debugging/automated smoke tests only.
window.__debug = { world, wando, camera, ground, scene }

const hud = createHud(container)
window.__debug.hud = hud // debugging/automated smoke tests only

const steering = createSteeringController(renderer)

hud.abilityButton.addEventListener('pointerdown', () => {
  const now = performance.now()
  if (wando.alive && wando.canUseAbility(now)) {
    wando.useAbility(null, world, now)
  }
})

// Holding the button fires continuously (gated by Wando's own fire-rate
// cooldown below), like a machine gun trigger rather than requiring rapid
// taps — see .scratch/wando-gogu-arts/issues/06-controls-camera.md.
let firing = false
hud.fireButton.addEventListener('pointerdown', () => {
  firing = true
})
hud.fireButton.addEventListener('pointerup', () => {
  firing = false
})
hud.fireButton.addEventListener('pointerleave', () => {
  firing = false
})

// Space/Enter mirror the fire button for desktop dev/testing.
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault() // space otherwise scrolls the page
    firing = true
  }
})
window.addEventListener('keyup', (e) => {
  if (e.key === ' ' || e.key === 'Enter') firing = false
})

function tryFireRocket() {
  if (wando.alive) fireRocket(wando, world, performance.now())
}
hud.rocketButton.addEventListener('pointerdown', tryFireRocket)

function tryActivateTurbo() {
  if (wando.alive) activateTurbo(wando, performance.now())
}
hud.turboButton.addEventListener('pointerdown', tryActivateTurbo)

window.addEventListener('keydown', (e) => {
  if (e.key === '1' || e.key.toLowerCase() === 'b') tryFireRocket()
  if (e.key === '2' || e.key.toLowerCase() === 't') tryActivateTurbo()
})

const clock = new THREE.Clock()
let matchOverShown = false
let lastGold = 0

// Third-person chase camera offsets (2026-11-25 — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md): behind and above
// Wando so the whole ship is visible, replacing the earlier cockpit view.
const CHASE_DISTANCE = 7
const CHASE_HEIGHT = 3

// Wando's death sequence (2026-11-25): fall to the ground, camera cuts to
// an external crash-site view on impact, count down, respawn. Driven here
// rather than through Hero's generic respawn timer because it needs the
// camera and HUD, which only main.js has — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md. `crash` is null
// outside of this sequence.
let crash = null
let wasAlive = true

function startCrash(now) {
  wando.mesh.visible = true
  wando.mesh.rotation.set(0, wando.yaw, 0)
  crash = { phase: 'falling', fallStart: now, startY: wando.position.y }
}

function updateCrash(now, dt) {
  if (crash.phase === 'falling') {
    const t = Math.min(1, (now - crash.fallStart) / CRASH_FALL_MS)
    const eased = t * t
    const forward = wando.getForwardVector()
    wando.mesh.position.x += forward.x * wando.speed * (1 - t) * dt
    wando.mesh.position.z += forward.z * wando.speed * (1 - t) * dt
    wando.mesh.position.y = crash.startY * (1 - eased)
    wando.mesh.rotation.x = -eased * 1.1
    if (t >= 1) {
      wando.mesh.position.y = 0.3
      crash.phase = 'grounded'
      crash.crashPoint = wando.mesh.position.clone()
      crash.countdownStart = now
    }
  } else if (now - crash.countdownStart >= RESPAWN_MS) {
    wando.respawn(now)
    wando.mesh.rotation.set(0, 0, 0)
    crash = null
  }
}

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.1)
  const now = performance.now()

  wando.steer = steering.getSteer()
  if (firing && wando.alive) {
    const hit = manualAttack(wando, world, now)
    if (hit) hud.showHitMarker()
  }

  if (!world.matchOver) {
    world.update(dt, now)
  } else if (!matchOverShown) {
    matchOverShown = true
    hud.showMatchOver(world.winner === TEAM.ALLY)
  }

  if (wasAlive && !wando.alive) startCrash(now)
  wasAlive = wando.alive
  if (crash) updateCrash(now, dt)

  if (wando.alive) {
    // Visible third-person ship: orient it to face its actual travel
    // direction, not just translate, so it reads as flying rather than
    // sliding — see .scratch/wando-gogu-arts/issues/06-controls-camera.md.
    const forward = wando.getForwardVector()
    wando.mesh.lookAt(wando.position.clone().add(forward))
  }

  if (wando.alive || crash?.phase === 'falling') {
    // Third-person chase camera, positioned behind and above Wando so the
    // whole ship stays in view. Looks exactly along her forward vector
    // (not *at* her) — that's the same direction the gun/rocket actually
    // fire, so the screen-center crosshair is accurate, and looking past
    // her rather than at her is what puts the ship low in frame instead of
    // dead center — see .scratch/wando-gogu-arts/issues/06-controls-camera.md.
    const forward = wando.getForwardVector()
    const camPos = wando.position.clone().addScaledVector(forward, -CHASE_DISTANCE)
    camPos.y += CHASE_HEIGHT
    camera.position.copy(camPos)
    camera.lookAt(camPos.clone().add(forward))
  } else if (crash?.phase === 'grounded') {
    const viewPos = crash.crashPoint.clone().add(new THREE.Vector3(6, 9, 9))
    camera.position.copy(viewPos)
    camera.lookAt(crash.crashPoint)
  }

  hud.setWandoHp(wando.hp / wando.maxHp)
  hud.setAllyBaseHp(world.strongholds[TEAM.ALLY].hp / world.strongholds[TEAM.ALLY].maxHp)
  hud.setEnemyBaseHp(world.strongholds[TEAM.ENEMY].hp / world.strongholds[TEAM.ENEMY].maxHp)
  const abilityElapsed = now - wando.lastAbilityAt
  hud.setAbilityCooldown(Math.max(0, 1 - abilityElapsed / wando.ability.cooldownMs))
  const fireElapsed = now - wando.lastAttackAt
  hud.setFireCooldown(Math.max(0, 1 - fireElapsed / wando.attackIntervalMs))
  const rocketElapsed = now - wando.lastRocketAt
  hud.setRocketCooldown(Math.max(0, 1 - rocketElapsed / ROCKET_COOLDOWN_MS))
  const turboElapsed = now - wando.lastTurboAt
  hud.setTurboCooldown(Math.max(0, 1 - turboElapsed / TURBO_COOLDOWN_MS))
  hud.setGyro(wando.yaw, wando.pitch / PITCH_LIMIT)
  hud.setGold(world.gold)
  if (world.gold > lastGold) hud.spawnGoldGain(world.gold - lastGold)
  lastGold = world.gold
  hud.setTowerCounts(
    world.towers.filter((t) => t.team === TEAM.ALLY && t.alive).length,
    world.towers.filter((t) => t.team === TEAM.ALLY).length,
    world.towers.filter((t) => t.team === TEAM.ENEMY && t.alive).length,
    world.towers.filter((t) => t.team === TEAM.ENEMY).length
  )
  hud.setCrosshairVisible(!crash)
  hud.setRespawnCountdown(
    crash?.phase === 'grounded' ? Math.ceil((RESPAWN_MS - (now - crash.countdownStart)) / 1000) : null
  )

  updateHealthBars([...world.towers, ...world.creeps, ...world.heroes.filter((h) => !h.isPlayer)], camera)

  renderer.render(scene, camera)
}

animate()

hud.restartButton.addEventListener('pointerdown', () => {
  window.location.reload()
})
