import { SceneContainer } from './SceneContainer.js';
import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';
import { textureRegistry } from '../core/TextureRegistry.js';
import { gsap } from 'gsap';

export class Endcard extends SceneContainer {
  constructor() {
    super('Endcard');
    this.isSetup = false;
    // Don't call setup() here - wait for assets to be loaded
  }
  
  setup() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Endcard.js:14',message:'Endcard.setup called',data:{registryHasAssets:textureRegistry.assets!==null,registryKeys:textureRegistry.assets?Object.keys(textureRegistry.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Skip setup if already done or assets not loaded
    if (this.isSetup || !textureRegistry.assets) {
      return;
    }
    this.isSetup = true;
    
    // Background
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, 100, 100);
    bg.fill(Config.COLORS.BG_DARK);
    this.addChild(bg);
    this.bg = bg;
    
    // Logo
    const logoTexture = textureRegistry.get('logo');
    if (logoTexture && logoTexture !== PIXI.Texture.EMPTY) {
      const logo = new PIXI.Sprite(logoTexture);
      logo.anchor.set(0.5);
      logo.scale.set(0.5);
      this.addChild(logo);
      this.logo = logo;
    }
    
    // CTA Button
    const ctaButton = new PIXI.Graphics();
    ctaButton.roundRect(0, 0, 250, 70, 10);
    ctaButton.fill(Config.COLORS.NEUTRAL);
    ctaButton.eventMode = 'static';
    ctaButton.cursor = 'pointer';
    this.addChild(ctaButton);
    this.ctaButton = ctaButton;
    
    const ctaText = new PIXI.Text({
      text: 'PLAY AGAIN',
      style: {
        fontFamily: 'Arial',
        fontSize: 28,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
      },
    });
    ctaText.anchor.set(0.5);
    ctaText.x = 125;
    ctaText.y = 35;
    ctaButton.addChild(ctaText);
    
    ctaButton.on('pointerdown', () => {
      eventBus.emit('scene:change', 'Gameplay');
    });
    
    // Pulse animation for CTA
    gsap.to(ctaButton.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut',
    });
    
    // Fade in
    this.alpha = 0;
    gsap.to(this, {
      alpha: 1,
      duration: Config.TRANSITION_DURATION,
    });
  }
  
  onResize(data) {
    // Resize background (only if setup has been called)
    if (this.bg) {
      this.bg.clear();
      this.bg.rect(0, 0, data.vpw, data.vph);
      this.bg.fill(Config.COLORS.BG_DARK);
    }
    
    // Position logo
    if (this.logo) {
      this.logo.x = data.vpw / 2;
      this.logo.y = data.vph / 2 - 100;
    }
    
    // Position CTA button (only if setup has been called)
    if (this.ctaButton) {
      this.ctaButton.x = data.vpw / 2 - 125;
      this.ctaButton.y = data.vph / 2 + 50;
    }
  }
}

