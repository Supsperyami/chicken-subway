import { SceneContainer } from './SceneContainer.js';
import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';
import { textureRegistry } from '../core/TextureRegistry.js';
import { State } from '../core/State.js';
import { gsap } from 'gsap';
import { Chicken } from '../game/Chicken.js';
import { TrackManager } from '../game/TrackManager.js';
import { CheckpointUI } from '../game/CheckpointUI.js';
import { GameUI } from '../game/GameUI.js';

export class Gameplay extends SceneContainer {
  constructor() {
    super('Gameplay');
    this.state = new State();
    this.ticker = null;
    this.isSetup = false;
    // Don't call setup() here - wait for assets to be loaded
  }
  
  setup() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Gameplay.js:21',message:'Gameplay.setup called',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Skip setup if already done or assets not loaded
    if (this.isSetup || !textureRegistry.assets) {
      return;
    }
    this.isSetup = true;
    
    // Background
    const bgTexture = textureRegistry.get('background_houses');
    this.bg = new PIXI.TilingSprite({
      texture: bgTexture,
      width: 1000,
      height: 1000,
    });
    this.addChild(this.bg);
    
    // Track manager
    this.trackManager = new TrackManager();
    this.addChild(this.trackManager);
    
    // Chicken character
    this.chicken = new Chicken();
    this.addChild(this.chicken);
    
    // Checkpoint UI (hidden initially)
    this.checkpointUI = new CheckpointUI();
    this.addChild(this.checkpointUI);
    
    // Game UI (multiplier, cash out button, etc.)
    this.gameUI = new GameUI();
    this.addChild(this.gameUI);
    
    // Idle hint
    this.hintSprite = null;
    
    // Event listeners
    eventBus.on('state:checkpointReached', this.onCheckpointReached.bind(this));
    eventBus.on('state:laneSafe', this.onLaneSafe.bind(this));
    eventBus.on('state:crashed', this.onCrashed.bind(this));
    eventBus.on('state:cashedOut', this.onCashedOut.bind(this));
    eventBus.on('checkpoint:laneSelected', this.onLaneSelected.bind(this));
    eventBus.on('game:cashOut', this.onCashOutRequested.bind(this));
    eventBus.on('idle:hintShow', this.showHint.bind(this));
    eventBus.on('idle:hintHide', this.hideHint.bind(this));
    
    // Start button
    this.createStartButton();
  }
  
  createStartButton() {
    const startBtn = new PIXI.Graphics();
    startBtn.roundRect(0, 0, 200, 60, 10);
    startBtn.fill(Config.COLORS.NEUTRAL);
    startBtn.x = 0;
    startBtn.y = 0;
    startBtn.eventMode = 'static';
    startBtn.cursor = 'pointer';
    
    const startText = new PIXI.Text({
      text: 'START',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
      },
    });
    startText.anchor.set(0.5);
    startText.x = 100;
    startText.y = 30;
    startBtn.addChild(startText);
    
    startBtn.on('pointerdown', () => {
      this.startGame();
      startBtn.visible = false;
    });
    
    this.startButton = startBtn;
    this.addChild(startBtn);
  }
  
  reset() {
    // Reset game state
    this.state.reset();
    this.chicken.stop();
    this.trackManager.isScrolling = false;
    this.gameUI.visible = false;
    this.checkpointUI.hide();
    this.hideHint();
    
    // Show start button again
    if (this.startButton) {
      this.startButton.visible = true;
    }
    
    // Remove ticker if active
    if (this.ticker) {
      this.ticker.remove(this.update.bind(this));
    }
  }
  
  startGame() {
    this.state.startRun();
    this.chicken.startRunning();
    this.trackManager.start();
    this.gameUI.show();
    
    // Start game loop
    this.ticker = PIXI.Ticker.shared;
    this.ticker.add(this.update.bind(this));
  }
  
  update(ticker) {
    const deltaTime = ticker.deltaTime / 60; // normalize to 60fps
    const deltaPixels = Config.CHICKEN_SPEED * deltaTime;
    
    if (this.state.isRunning && !this.state.isPaused) {
      this.state.updateDistance(deltaPixels);
      
      // Update chicken position based on lane
      const targetX = this.getLaneX(this.state.currentLane);
      this.chicken.update(deltaTime, targetX);
      
      // Update track scrolling
      this.trackManager.update(deltaTime, deltaPixels);
      
      // Update background scrolling
      this.bg.tilePosition.y += Config.BACKGROUND_SCROLL_SPEED * deltaTime;
    }
    
    this.chicken.updateAnimation(deltaTime);
  }
  
  getLaneX(laneIndex) {
    const centerX = this.vpw / 2;
    const totalWidth = Config.LANE_COUNT * Config.LANE_WIDTH + (Config.LANE_COUNT - 1) * Config.LANE_SPACING;
    const startX = centerX - totalWidth / 2;
    return startX + laneIndex * (Config.LANE_WIDTH + Config.LANE_SPACING) + Config.LANE_WIDTH / 2;
  }
  
  onCheckpointReached(data) {
    // Show checkpoint UI with lane selection
    const checkpointData = Config.WIN_SEQUENCE[data.checkpointIndex - 1] || {
      lane: Math.floor(Math.random() * 3),
      multiplier: data.currentMultiplier + Config.MULTIPLIER_INCREMENT,
    };
    
    this.checkpointUI.show(data.checkpointIndex, checkpointData);
  }
  
  onLaneSelected(laneIndex) {
    // Determine if lane is safe based on scripted sequence
    const checkpointData = Config.WIN_SEQUENCE[this.state.checkpointIndex - 1];
    const isSafe = checkpointData && checkpointData.lane === laneIndex;
    
    // Use scripted sequence for first few checkpoints, then random
    if (checkpointData) {
      // Scripted win sequence - guaranteed safe if correct lane
      this.state.selectLane(laneIndex, isSafe, checkpointData.multiplier);
    } else {
      // After scripted sequence, use probability
      const crashChance = Config.CRASH_PROBABILITY_BASE + 
        (this.state.currentMultiplier * Config.CRASH_PROBABILITY_MULTIPLIER);
      const isRandomSafe = Math.random() > crashChance;
      this.state.selectLane(laneIndex, isRandomSafe);
    }
  }
  
  onLaneSafe(data) {
    this.checkpointUI.hide();
    this.chicken.jump();
    this.gameUI.updateMultiplier(data.newMultiplier, data.winnings);
    
    // Show coin collection effect
    this.showCoinEffect();
  }
  
  onCrashed(data) {
    this.ticker?.remove(this.update.bind(this));
    this.checkpointUI.hide();
    this.chicken.crash();
    this.gameUI.showCrash();
    
    setTimeout(() => {
      this.end();
    }, 2000);
  }
  
  onCashOutRequested() {
    this.state.cashOut();
  }
  
  onCashedOut(data) {
    this.ticker?.remove(this.update.bind(this));
    this.checkpointUI.hide();
    this.chicken.stop();
    this.gameUI.showWin(data.winnings, data.multiplier);
    
    setTimeout(() => {
      this.end();
    }, 3000);
  }
  
  showCoinEffect() {
    // Simple coin collection animation
    const coin = new PIXI.Graphics();
    coin.circle(0, 0, 15);
    coin.fill(0xFFD700);
    coin.x = this.chicken.x;
    coin.y = this.chicken.y - 30;
    this.addChild(coin);
    
    gsap.to(coin, {
      y: coin.y - 50,
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        coin.destroy();
      },
    });
  }
  
  showHint() {
    if (this.hintSprite) return;
    
    const hint = new PIXI.Graphics();
    hint.circle(0, 0, 20);
    hint.fill({ color: 0xFFFFFF, alpha: 0.8 });
    hint.x = this.vpw / 2;
    hint.y = this.vph - 100;
    
    this.hintSprite = hint;
    this.addChild(hint);
    
    // Pulse animation
    gsap.to(hint.scale, {
      x: 1.3,
      y: 1.3,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut',
    });
  }
  
  hideHint() {
    if (this.hintSprite) {
      gsap.to(this.hintSprite, {
        alpha: 0,
        duration: 0.3,
        onComplete: () => {
          if (this.hintSprite) {
            this.hintSprite.destroy();
            this.hintSprite = null;
          }
        },
      });
    }
  }
  
  onResize(data) {
    this.vpw = data.vpw;
    this.vph = data.vph;
    
    // Resize background (only if setup has been called)
    if (this.bg) {
      this.bg.width = data.vpw;
      this.bg.height = data.vph;
    }
    
    // Reposition elements
    if (this.startButton) {
      this.startButton.x = data.vpw / 2 - 100;
      this.startButton.y = data.vph / 2 - 30;
    }
    
    this.trackManager?.onResize(data);
    this.chicken?.onResize(data);
    this.checkpointUI?.onResize(data);
    this.gameUI?.onResize(data);
    
    if (this.hintSprite) {
      this.hintSprite.x = data.vpw / 2;
      this.hintSprite.y = data.vph - 100;
    }
  }
  
  end() {
    this.ticker?.remove(this.update.bind(this));
    eventBus.emit('scene:change', 'Endcard');
  }
  
  destroy(options) {
    this.ticker?.remove(this.update.bind(this));
    eventBus.off('state:checkpointReached', this.onCheckpointReached);
    eventBus.off('state:laneSafe', this.onLaneSafe);
    eventBus.off('state:crashed', this.onCrashed);
    eventBus.off('state:cashedOut', this.onCashedOut);
    eventBus.off('checkpoint:laneSelected', this.onLaneSelected);
    eventBus.off('game:cashOut', this.onCashOutRequested);
    eventBus.off('idle:hintShow', this.showHint);
    eventBus.off('idle:hintHide', this.hideHint);
    super.destroy(options);
  }
}

