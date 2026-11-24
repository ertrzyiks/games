import { Unit } from './Unit.js'
import { TOWER_STATS } from '../config.js'
import { createTowerMesh } from '../visuals.js'

export class Tower extends Unit {
  constructor(team, x, z) {
    const mesh = createTowerMesh(team)
    mesh.position.x = x
    mesh.position.z = z
    super({
      team,
      kind: 'tower',
      hp: TOWER_STATS.hp,
      damage: TOWER_STATS.damage,
      attackRange: TOWER_STATS.attackRange,
      attackIntervalMs: TOWER_STATS.attackIntervalMs,
      mesh,
    })
  }
}
