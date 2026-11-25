import { aiStep, attackOnlyStep } from './ai.js'
import { Creep, randomLaneX } from './entities/Creep.js'
import { createEffectsSystem } from './effects.js'
import {
  TEAM,
  BASE_Z,
  CREEP_WAVE_SIZE,
  CREEP_WAVE_INTERVAL_MS,
  CREEP_SPAWN_STAGGER_MS,
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
  }

  addHero(hero) {
    this.heroes.push(hero)
    this.scene.add(hero.mesh)
  }

  addTower(tower) {
    this.towers.push(tower)
    this.scene.add(tower.mesh)
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
        if (now >= hero.deadUntil) hero.respawn(now)
        continue
      }
      aiStep(hero, this, now, dt)
    }

    for (const creep of this.creeps) {
      aiStep(creep, this, now, dt)
    }

    for (const tower of this.towers) {
      attackOnlyStep(tower, this, now)
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
