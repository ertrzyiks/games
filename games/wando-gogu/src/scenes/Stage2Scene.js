import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'

// Placeholder — replaced by the full Frostholt Reaches implementation
// (Frost Walker / Snow Skimmer enemies, Frostclaw Walker boss). See
// .scratch/wando-gogu-xwing-shooter/issues/06-enemies.md and 08-boss2.md.
export class Stage2Scene extends Phaser.Scene {
  constructor() {
    super('Stage2')
  }

  create() {
    this.cameras.main.setBackgroundColor(0x2a3a52)
    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 20, 'Frostholt Reaches\n(coming soon)', {
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
