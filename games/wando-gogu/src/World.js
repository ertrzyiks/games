import { aiStep, attackOnlyStep, towerStep } from './ai.js'
import { Creep, randomLaneX } from './entities/Creep.js'
import { createEffectsSystem } from './effects.js'
import { createRubbleMesh } from './visuals.js'
import {
  TEAM,
  BASE_Z,
  CREEP_WAVE_SIZE,
  CREEP_WAVE_INTERVAL_MS,
  CREEP_SPAWN_STAGGER_MS,
  GOLD_FOR_CREEP_KILL,
  GOLD_FOR_TOWER_KILL,
  otherTeam,
} from './config.js'

// Orchestrates every unit's AI/movement/attack tick, creep spawning, hero
// respawns, and the win/lose check. See .scratch/wando-gogu-arts/map.md.
export class World {
  constructor(scene) {
    this.scene = scene
    this.heroes = []
    this.towers = []
    this.strongholds = {}
    this.creeps = []
    this.matchOver = false
    this.winner = null
    this._waveTimer = {
      [TEAM.ALLY]: CREEP_WAVE_INTERVAL_MS,
      [TEAM.ENEMY]: CREEP_WAVE_INTERVAL_MS,
    }
    this._pendingSpawns = []
    this.effects = createEffectsSystem(scene)
    this.gold = 0 // see GOLD_FOR_*; a later effort spends this in a shop
  }

  addHero(hero) {
    this.heroes.push(hero)
    this.scene.add(hero.mesh)
  }

  addTower(tower) {
    this.towers.push(tower)
    this.scene.add(tower.mesh)
    tower.onDeath = () => this._onTowerDestroyed(tower)
  }

  // Stops shooting happens for free (towerStep already skips !alive units)
  // — this just adds the visual: swap the tower out for a rubble pile
  // instead of leaving a dead-but-still-standing tower, plus gold.
  _onTowerDestroyed(tower) {
    this.awardGold(tower, GOLD_FOR_TOWER_KILL)
    this.effects.cancelAimLine(tower) // in case it died mid-telegraph
    tower.mesh.visible = false // also hides its health-bar child
    const rubble = createRubbleMesh()
    rubble.position.copy(tower.mesh.position)
    this.scene.add(rubble)
  }

  // Gold only counts if the player's own hero landed the killing blow — not
  // kills by bot allies or towers — per
  // .scratch/wando-gogu-arts/issues/04-towers-base.md.
  awardGold(unit, amount) {
    if (unit.team === TEAM.ENEMY && unit.lastDamagedBy?.isPlayer) {
      this.gold += amount
    }
  }

  addStronghold(team, stronghold) {
    this.strongholds[team] = stronghold
    this.scene.add(stronghold.mesh)
  }

  allAlive() {
    const result = [...this.heroes, ...this.towers, ...this.creeps, Object.values(this.strongholds)].flat()
    return result.filter((u) => u && u.alive)
  }

  nearestEnemyInRadius(unit, radius) {
    let nearest = null
    let nearestDist = radius
    for (const other of this.allAlive()) {
      if (other.team === unit.team || other === unit) continue
      const dist = unit.distanceTo(other)
      if (dist <= nearestDist) {
        nearest = other
        nearestDist = dist
      }
    }
    return nearest
  }

  unitsInRadius(position, radius, team) {
    return this.allAlive().filter((u) => u.team === team && u.mesh.position.distanceTo(position) <= radius)
  }

  update(dt, now) {
    if (this.matchOver) return

    for (const hero of this.heroes) {
      if (!hero.alive) {
        // The player's hero respawns through main.js's crash-sequence state
        // machine instead of this generic timer — see
        // .scratch/wando-gogu-arts/issues/06-controls-camera.md.
        if (!hero.isPlayer && now >= hero.deadUntil) hero.respawn(now)
        continue
      }
      aiStep(hero, this, now, dt)
    }

    for (const creep of this.creeps) {
      aiStep(creep, this, now, dt)
    }

    for (const tower of this.towers) {
      towerStep(tower, this, now)
    }
    for (const stronghold of Object.values(this.strongholds)) {
      attackOnlyStep(stronghold, this, now)
    }

    this._cleanupDeadCreeps()
    this._spawnWaves(dt)
    this._checkWinCondition()
    this.effects.update(now)
  }

  _cleanupDeadCreeps() {
    this.creeps = this.creeps.filter((creep) => {
      if (creep.alive) return true
      this.scene.remove(creep.mesh)
      creep.mesh.geometry.dispose()
      creep.mesh.material.dispose()
      return false
    })
  }

  _spawnWaves(dt) {
    for (const team of [TEAM.ALLY, TEAM.ENEMY]) {
      this._waveTimer[team] -= dt * 1000
      if (this._waveTimer[team] <= 0) {
        this._waveTimer[team] = CREEP_WAVE_INTERVAL_MS
        for (let i = 0; i < CREEP_WAVE_SIZE; i++) {
          this._pendingSpawns.push({ team, at: i * CREEP_SPAWN_STAGGER_MS })
        }
      }
    }

    this._pendingSpawns = this._pendingSpawns.filter((spawn) => {
      spawn.at -= dt * 1000
      if (spawn.at > 0) return true
      this._spawnCreep(spawn.team)
      return false
    })
  }

  _spawnCreep(team) {
    const laneX = randomLaneX()
    const creep = new Creep(team, laneX, BASE_Z[team])
    creep.onDeath = () => this.awardGold(creep, GOLD_FOR_CREEP_KILL)
    this.creeps.push(creep)
    this.scene.add(creep.mesh)
  }

  _checkWinCondition() {
    for (const team of [TEAM.ALLY, TEAM.ENEMY]) {
      if (this.strongholds[team].hp <= 0) {
        this.matchOver = true
        this.winner = otherTeam(team)
      }
    }
  }
}
