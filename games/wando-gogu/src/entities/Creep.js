import * as THREE from 'three'
import { Unit } from './Unit.js'
import { CREEP_STATS, BASE_Z, LANE_WIDTH, otherTeam } from '../config.js'
import { createCreepMesh } from '../visuals.js'

// Land-only lane unit — see .scratch/wando-gogu-arts/issues/03-creeps.md. Locked
// to a fixed X offset so a wave stays readable as a line, unlike heroes which
// can move freely in X.
export class Creep extends Unit {
  constructor(team, spawnX, spawnZ) {
    const mesh = createCreepMesh(team)
    mesh.position.set(spawnX, mesh.position.y, spawnZ)
    super({
      team,
      kind: 'creep',
      hp: CREEP_STATS.hp,
      damage: CREEP_STATS.damage,
      attackRange: CREEP_STATS.attackRange,
      attackIntervalMs: CREEP_STATS.attackIntervalMs,
      speed: CREEP_STATS.speed,
      mesh,
    })
    this.laneX = spawnX
  }

  getAdvanceTarget() {
    return new THREE.Vector3(this.laneX, 0, BASE_Z[otherTeam(this.team)])
  }
}

export function randomLaneX() {
  return (Math.random() - 0.5) * (LANE_WIDTH * 0.6)
}
