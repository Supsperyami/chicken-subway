import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';
import { gsap } from 'gsap';

export class CheckpointUI extends PIXI.Container {
  constructor() {
    super();
    this.visible = false;
    this.setup();
  }
  
  setup() {
    // Semi-transparent overlay
    this.overlay = new PIXI.Graphics();
    this.overlay.rect(0, 0, 100, 100);
    this.overlay.fill({ color: 0x000000, alpha: 0.7 });
    this.overlay.eventMode = 'static';
    this.addChild(this.overlay);
    
    // Title text
    this.titleText = new PIXI.Text({
      text: 'CHOOSE YOUR LANE',
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
        align: 'center',
      },
    });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);
    
    // Lane buttons
    this.laneButtons = [];
    for (let i = 0; i < Config.LANE_COUNT; i++) {
      const button = this.createLaneButton(i);
      this.laneButtons.push(button);
      this.addChild(button);
    }
  }
  
  createLaneButton(laneIndex) {
    const button = new PIXI.Container();
    button.eventMode = 'static';
    button.cursor = 'pointer';
    
    // Button background
    const bg = new PIXI.Graphics();
    bg.roundRect(0, 0, Config.LANE_WIDTH, 120, 10);
    bg.fill(Config.COLORS.NEUTRAL);
    button.addChild(bg);
    
    // Lane label
    const labels = ['LEFT', 'MIDDLE', 'RIGHT'];
    const labelText = new PIXI.Text({
      text: labels[laneIndex],
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
      },
    });
    labelText.anchor.set(0.5);
    labelText.x = Config.LANE_WIDTH / 2;
    labelText.y = 30;
    button.addChild(labelText);
    
    // Multiplier display
    const multiplierText = new PIXI.Text({
      text: 'x1.0',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
      },
    });
    multiplierText.anchor.set(0.5);
    multiplierText.x = Config.LANE_WIDTH / 2;
    multiplierText.y = 70;
    button.multiplierText = multiplierText;
    button.addChild(multiplierText);
    
    // Interaction
    button.on('pointerdown', () => {
      this.selectLane(laneIndex);
    });
    
    button.on('pointerenter', () => {
      gsap.to(bg, { alpha: 0.8, duration: 0.2 });
    });
    
    button.on('pointerleave', () => {
      gsap.to(bg, { alpha: 1, duration: 0.2 });
    });
    
    return button;
  }
  
  show(checkpointIndex, checkpointData) {
    this.visible = true;
    this.alpha = 0;
    
    // Update multiplier displays
    const baseMultiplier = checkpointData.multiplier || 1.0;
    this.laneButtons.forEach((button, index) => {
      const multiplier = baseMultiplier + (index * 0.1);
      button.multiplierText.text = `x${multiplier.toFixed(1)}`;
      
      // Highlight safe lane
      if (checkpointData.lane === index) {
        button.children[0].clear();
        button.children[0].roundRect(0, 0, Config.LANE_WIDTH, 120, 10);
        button.children[0].fill(Config.COLORS.SAFE);
      } else {
        button.children[0].clear();
        button.children[0].roundRect(0, 0, Config.LANE_WIDTH, 120, 10);
        button.children[0].fill(Config.COLORS.NEUTRAL);
      }
    });
    
    gsap.to(this, {
      alpha: 1,
      duration: Config.TRANSITION_DURATION,
    });
  }
  
  hide() {
    gsap.to(this, {
      alpha: 0,
      duration: Config.TRANSITION_DURATION,
      onComplete: () => {
        this.visible = false;
      },
    });
  }
  
  selectLane(laneIndex) {
    eventBus.emit('checkpoint:laneSelected', laneIndex);
    this.hide();
  }
  
  onResize(data) {
    // Resize overlay
    this.overlay.clear();
    this.overlay.rect(0, 0, data.vpw, data.vph);
    this.overlay.fill({ color: 0x000000, alpha: 0.7 });
    
    // Position title
    this.titleText.x = data.vpw / 2;
    this.titleText.y = data.vph / 2 - 150;
    
    // Position lane buttons
    const centerX = data.vpw / 2;
    const totalWidth = Config.LANE_COUNT * Config.LANE_WIDTH + (Config.LANE_COUNT - 1) * Config.LANE_SPACING;
    const startX = centerX - totalWidth / 2;
    
    this.laneButtons.forEach((button, index) => {
      button.x = startX + index * (Config.LANE_WIDTH + Config.LANE_SPACING);
      button.y = data.vph / 2 - 60;
    });
  }
}

