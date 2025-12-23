import * as PIXI from 'pixi.js';
import { eventBus } from '../core/EventBus.js';

// Base class for all scenes
export class SceneContainer extends PIXI.Container {
  constructor(name) {
    super();
    this.label = name;
    this.isActive = false;
    this.resizeHandler = this.onResize.bind(this);
    
    eventBus.on('resize', this.resizeHandler);
  }
  
  // Override in subclasses
  setup() {}
  play() {}
  pause() {}
  resume() {}
  end() {}
  
  onResize(data) {
    // Override in subclasses
  }
  
  destroy(options) {
    eventBus.off('resize', this.resizeHandler);
    super.destroy(options);
  }
}

