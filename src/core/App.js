import * as PIXI from 'pixi.js';
import { ResizeManager } from './ResizeManager.js';
import { IdleHint } from './IdleHint.js';
import { eventBus } from './EventBus.js';
import { textureRegistry } from './TextureRegistry.js';
import { Boot } from '../scenes/Boot.js';
import { Preloader } from '../scenes/Preloader.js';
import { Gameplay } from '../scenes/Gameplay.js';
import { Endcard } from '../scenes/Endcard.js';

export class App {
  constructor() {
    this.app = null;
    this.currentScene = null;
    this.scenes = new Map();
    this.resizeManager = null;
    this.idleHint = null;
  }
  
  async init() {
    // Create PixiJS application
    this.app = new PIXI.Application();
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    
    // Append canvas to DOM
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.appendChild(this.app.canvas);
    }
    
    // Initialize managers
    this.resizeManager = new ResizeManager();
    this.idleHint = new IdleHint();
    
    // Setup scene management
    this.setupScenes();
    
    // Listen for scene changes
    eventBus.on('scene:change', this.changeScene.bind(this));
    
    // Setup pointer events for idle hint
    this.setupPointerEvents();
    
    // Start idle hint update loop
    this.app.ticker.add(() => {
      const deltaTime = this.app.ticker.deltaTime / 60;
      this.idleHint.update(deltaTime);
    });
    
    // Start with Boot scene
    this.changeScene('Boot');
  }
  
  setupScenes() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:61',message:'setupScenes called - creating scenes BEFORE assets loaded',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Create scene instances
    this.scenes.set('Boot', new Boot());
    this.scenes.set('Preloader', new Preloader());
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:68',message:'About to create Gameplay scene',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    this.scenes.set('Gameplay', new Gameplay());
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:71',message:'About to create Endcard scene',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    this.scenes.set('Endcard', new Endcard());
    
    // Add all scenes to stage (initially hidden)
    this.scenes.forEach(scene => {
      scene.visible = false;
      this.app.stage.addChild(scene);
    });
  }
  
  changeScene(sceneName) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:84',message:'changeScene called',data:{sceneName,hasAssets:textureRegistry.assets!==null,assetsKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Hide current scene
    if (this.currentScene) {
      this.currentScene.visible = false;
      this.currentScene.isActive = false;
    }
    
    // Show new scene
    const newScene = this.scenes.get(sceneName);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:95',message:'Got newScene from scenes map',data:{sceneName,hasNewScene:!!newScene,newSceneType:newScene?typeof newScene:null,hasSetup:newScene?!!newScene.setup:null,isSetup:newScene?newScene.isSetup:null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (newScene) {
      newScene.visible = true;
      newScene.isActive = true;
      this.currentScene = newScene;
      
      // Call scene lifecycle methods - setup BEFORE resize
      if (sceneName === 'Gameplay') {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:107',message:'Checking Gameplay setup conditions',data:{hasSetup:!!newScene.setup,hasAssets:textureRegistry.assets!==null,isSetup:newScene.isSetup,willCallSetup:newScene.setup && textureRegistry.assets && !newScene.isSetup},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Setup Gameplay scene if assets are loaded and not already setup
        if (newScene.setup && textureRegistry.assets && !newScene.isSetup) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:105',message:'Calling Gameplay.setup from changeScene',data:{hasAssets:textureRegistry.assets!==null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          newScene.setup();
        }
        // Reset gameplay scene when returning to it
        if (newScene.reset) {
          newScene.reset();
        }
        newScene.play();
      } else if (sceneName === 'Endcard') {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:113',message:'Checking Endcard setup conditions',data:{hasSetup:!!newScene.setup,hasAssets:textureRegistry.assets!==null,isSetup:newScene.isSetup,willCallSetup:newScene.setup && textureRegistry.assets && !newScene.isSetup},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Setup Endcard scene if assets are loaded and not already setup
        if (newScene.setup && textureRegistry.assets && !newScene.isSetup) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.js:116',message:'Calling Endcard.setup from changeScene',data:{hasAssets:textureRegistry.assets!==null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          newScene.setup();
        }
      }
      
      // Trigger resize for new scene (AFTER setup)
      this.resizeManager.handleResize();
    }
  }
  
  setupPointerEvents() {
    const emitPointerEvent = (type, event) => {
      eventBus.emit(`pointer:${type}`, {
        x: event.globalX,
        y: event.globalY,
      });
    };
    
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, 10000, 10000);
    
    this.app.stage.on('pointerdown', (e) => emitPointerEvent('down', e));
    this.app.stage.on('pointermove', (e) => emitPointerEvent('move', e));
    this.app.stage.on('pointerup', (e) => emitPointerEvent('up', e));
  }
  
  destroy() {
    this.resizeManager?.destroy();
    this.idleHint?.destroy();
    this.app?.destroy(true);
  }
}

