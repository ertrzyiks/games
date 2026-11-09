import { BaseStageScene } from './BaseStageScene.js'
import { createStage2Textures } from '../sprites/stage2.js'
import { FrostWalker, SnowSkimmer } from '../entities/enemies/Stage2Enemies.js'
import { Boss2 } from '../entities/bosses/Boss2.js'

// Frostholt Reaches — icy mountain range, tighter/faster-paced midgame. See
// .scratch/wando-gogu-xwing-shooter/issues/02-stages.md and 06-enemies.md.
export class Stage2Scene extends BaseStageScene {
  constructor() {
    super('Stage2', 2)
  }

  getBackgroundColor() {
    return 0x2a3a52
  }

  getStageName() {
    return 'Stage 2: Frostholt Reaches'
  }

  createStageTextures(scene) {
    createStage2Textures(scene)
  }

  getWaveSchedule() {
    const spawnWalker = (x) => (scene) => {
      const walker = new FrostWalker(scene, x, -20, (bx, by, vx, vy) =>
        scene.fireEnemyBullet(bx, by, vx, vy)
      )
      scene.enemies.add(walker)
    }
    const spawnSkimmerSquad = (centerX) => (scene) => {
      // V-formation: the middle skimmer leads, the wings trail behind.
      const offsets = [-40, 0, 40]
      const yOffsets = [-30, -10, -30]
      offsets.forEach((dx, i) => {
        const skimmer = new SnowSkimmer(scene, centerX + dx, yOffsets[i], scene.player)
        scene.enemies.add(skimmer)
      })
    }

    // Pacing per issues/06-enemies.md: zigzag Frost Walkers first, then
    // V-formation Skimmer squads, escalating to overlapping waves of both.
    // 5 lone walkers + 3 squads (9 skimmers) = 14 enemy units, roughly 50%
    // denser than Stage 1's 9, delivered over a tighter ~8s window (vs.
    // Stage 1's ~11s) for the faster midgame pace.
    return [
      { delay: 400, spawn: spawnWalker(140) },
      { delay: 1000, spawn: spawnWalker(340) },
      { delay: 2800, spawn: spawnWalker(100) },
      { delay: 4200, spawn: spawnSkimmerSquad(200) },
      { delay: 5600, spawn: spawnWalker(380) },
      { delay: 6200, spawn: spawnSkimmerSquad(300) },
      // Overlapping finale: a walker and a squad arrive almost together.
      { delay: 7600, spawn: spawnWalker(240) },
      { delay: 7900, spawn: spawnSkimmerSquad(150) },
    ]
  }

  createBoss(scene, onFire) {
    return new Boss2(scene, onFire)
  }
}
