import { Unit } from './Unit.js'
import { BASE_STATS, BASE_Z } from '../config.js'
import { createBaseMesh } from '../visuals.js'

// The team's base — called "Stronghold" in code to avoid clashing with the
// "base class" sense of the word. Destroying the enemy one wins the match.
export class Stronghold extends Unit {
  constructor(team) {
    const mesh = createBaseMesh(team)
    mesh.position.z = BASE_Z[team]
    super({
      team,
      kind: 'base',
      hp: BASE_STATS.hp,
      damage: BASE_STATS.damage,
      attackRange: BASE_STATS.attackRange,
      attackIntervalMs: BASE_STATS.attackIntervalMs,
      mesh,
    })
  }
}
