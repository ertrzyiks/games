import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'
import { getLastCompletedStage } from '../save.js'

const STAGE_NAMES = {
  1: 'Dustrim Canyons',
  2: 'Frostholt Reaches',
  3: 'Scrapfleet Graveyard',
}

// See .scratch/wando-gogu-xwing-shooter/issues/11-lives.md: play Stage 1, or
// jump to the next uncompleted stage, or replay any already-completed stage.
export class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelect')
  }

  create() {
    this.cameras.main.setBackgroundColor(0x12141c)
    const completed = getLastCompletedStage()
    const unlocked = Math.min(3, completed + 1)

    this.add
      .text(WIDTH / 2, 90, 'WANDO & GOGU', {
        fontFamily: 'sans-serif',
        fontSize: '34px',
        color: '#5ad1ff',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 130, 'Canyon Run', {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#aaa',
      })
      .setOrigin(0.5)

    for (let stage = 1; stage <= 3; stage++) {
      const y = 260 + (stage - 1) * 110
      const locked = stage > unlocked
      const label = locked ? `🔒 Stage ${stage}` : `Stage ${stage}: ${STAGE_NAMES[stage]}`
      const color = locked ? '#555' : '#fff'
      const btn = this.add
        .text(WIDTH / 2, y, label, {
          fontFamily: 'sans-serif',
          fontSize: '20px',
          color,
          backgroundColor: locked ? '#1a1c24' : '#243247',
          padding: { x: 16, y: 12 },
        })
        .setOrigin(0.5)

      if (!locked) {
        btn.setInteractive({ useHandCursor: true })
        btn.on('pointerup', () => this.scene.start(`Stage${stage}`))
      }
    }
  }
}
