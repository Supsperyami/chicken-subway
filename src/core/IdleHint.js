import { eventBus } from './EventBus.js';
import { Config } from './Config.js';

// Global timer to trigger hint after inactivity
export class IdleHint {
  constructor() {
    this.timer = 0;
    this.isActive = false;
    this.resetTimer = this.resetTimer.bind(this);
    
    // Reset on any pointer event
    eventBus.on('pointer:down', this.resetTimer);
    eventBus.on('pointer:move', this.resetTimer);
    eventBus.on('pointer:up', this.resetTimer);
    
    // Reset on game actions
    eventBus.on('state:runStarted', this.resetTimer);
    eventBus.on('state:laneSafe', this.resetTimer);
    eventBus.on('state:checkpointReached', this.resetTimer);
  }
  
  update(deltaTime) {
    if (this.isActive) return;
    
    this.timer += deltaTime;
    
    if (this.timer >= Config.IDLE_HINT_DELAY) {
      this.isActive = true;
      eventBus.emit('idle:hintShow');
    }
  }
  
  resetTimer() {
    this.timer = 0;
    if (this.isActive) {
      this.isActive = false;
      eventBus.emit('idle:hintHide');
    }
  }
  
  destroy() {
    eventBus.off('pointer:down', this.resetTimer);
    eventBus.off('pointer:move', this.resetTimer);
    eventBus.off('pointer:up', this.resetTimer);
    eventBus.off('state:runStarted', this.resetTimer);
    eventBus.off('state:laneSafe', this.resetTimer);
    eventBus.off('state:checkpointReached', this.resetTimer);
  }
}

