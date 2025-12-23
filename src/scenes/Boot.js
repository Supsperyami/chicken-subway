import { SceneContainer } from './SceneContainer.js';
import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';

export class Boot extends SceneContainer {
  constructor() {
    super('Boot');
    this.setup();
  }
  
  setup() {
    // Simple boot screen - just transition to preloader
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, 100, 100);
    bg.fill(Config.COLORS.BG_DARK);
    this.addChild(bg);
    
    // Immediately transition to preloader
    setTimeout(() => {
      eventBus.emit('scene:change', 'Preloader');
    }, 100);
  }
}

