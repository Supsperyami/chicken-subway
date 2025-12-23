import { eventBus } from './EventBus.js';

export class ResizeManager {
  constructor() {
    this.vpw = 0; // viewport width
    this.vph = 0; // viewport height
    this.aspectRatio = 0;
    this.isPortrait = false;
    
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    
    this.handleResize();
  }
  
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.vpw = width;
    this.vph = height;
    this.aspectRatio = width / height;
    this.isPortrait = height > width;
    
    eventBus.emit('resize', {
      vpw: this.vpw,
      vph: this.vph,
      aspectRatio: this.aspectRatio,
      isPortrait: this.isPortrait,
    });
  }
  
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
  }
}

