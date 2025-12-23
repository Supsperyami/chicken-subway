import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { textureRegistry } from '../core/TextureRegistry.js';

export class TrackManager extends PIXI.Container {
  constructor() {
    super();
    this.scrollOffset = 0;
    this.isScrolling = false;
    this.setup();
  }
  
  setup() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TrackManager.js:13',message:'TrackManager.setup called',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Create three lane tracks
    this.lanes = [];
    
    const leftTexture = textureRegistry.get('train_tracks_left');
    const centerTexture = textureRegistry.get('train_tracks_center');
    const rightTexture = textureRegistry.get('train_tracks_right');
    
    for (let i = 0; i < Config.LANE_COUNT; i++) {
      const lane = new PIXI.Container();
      
      let texture;
      if (i === 0) texture = leftTexture;
      else if (i === 1) texture = centerTexture;
      else texture = rightTexture;
      
      // Create tiling sprites for infinite scrolling
      const track1 = new PIXI.TilingSprite({
        texture: texture,
        width: Config.LANE_WIDTH,
        height: 1000,
      });
      
      const track2 = new PIXI.TilingSprite({
        texture: texture,
        width: Config.LANE_WIDTH,
        height: 1000,
      });
      
      track2.y = -1000; // Position second track above first
      
      lane.addChild(track1);
      lane.addChild(track2);
      
      this.lanes.push({
        container: lane,
        tracks: [track1, track2],
      });
      
      this.addChild(lane);
    }
  }
  
  start() {
    this.isScrolling = true;
  }
  
  update(deltaTime, deltaPixels) {
    if (!this.isScrolling) return;
    
    this.scrollOffset += deltaPixels;
    
    // Update each lane's track scrolling
    this.lanes.forEach((lane, index) => {
      const x = this.getLaneX(index);
      lane.container.x = x - Config.LANE_WIDTH / 2;
      
      lane.tracks.forEach(track => {
        track.tilePosition.y = this.scrollOffset % 1000;
      });
    });
  }
  
  getLaneX(laneIndex) {
    if (!this.vpw) return 0;
    const centerX = this.vpw / 2;
    const totalWidth = Config.LANE_COUNT * Config.LANE_WIDTH + (Config.LANE_COUNT - 1) * Config.LANE_SPACING;
    const startX = centerX - totalWidth / 2;
    return startX + laneIndex * (Config.LANE_WIDTH + Config.LANE_SPACING) + Config.LANE_WIDTH / 2;
  }
  
  onResize(data) {
    this.vpw = data.vpw;
    this.vph = data.vph;
    
    // Reposition lanes
    this.lanes.forEach((lane, index) => {
      const x = this.getLaneX(index);
      lane.container.x = x - Config.LANE_WIDTH / 2;
      lane.container.y = 0;
      
      // Resize tracks
      lane.tracks.forEach(track => {
        track.width = Config.LANE_WIDTH;
        track.height = data.vph + 200;
      });
    });
  }
}

