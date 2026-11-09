import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'

// Placeholder — replaced by the full Scrapfleet Graveyard implementation
// (Scavenger Drone / Salvage Bot enemies, The Reassembler final boss). See
// .scratch/wando-gogu-xwing-shooter/issues/06-enemies.md and 09-boss3.md.
export class Stage3Scene extends Phaser.Scene {
  constructor() {
    super('Stage3')
  }

  create() {
    this.cameras.main.setBackgroundColor(0x1c1c24)
    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 20, 'Scrapfleet Graveyard\n(coming soon)', {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)
    const back = this.add
      .text(WIDTH / 2, HEIGHT / 2 + 60, 'Back', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#5ad1ff',
        backgroundColor: '#1a1c24',
        padding: { x: 16, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    back.on('pointerup', () => this.scene.start('StageSelect'))
  }
}
