import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';
import { gsap } from 'gsap';

export class GameUI extends PIXI.Container {
  constructor() {
    super();
    this.visible = false;
    this.setup();
  }
  
  setup() {
    // Multiplier display
    this.multiplierContainer = new PIXI.Container();
    this.addChild(this.multiplierContainer);
    
    const multiplierBg = new PIXI.Graphics();
    multiplierBg.roundRect(0, 0, 200, 80, 10);
    multiplierBg.fill({ color: 0x000000, alpha: 0.7 });
    this.multiplierContainer.addChild(multiplierBg);
    
    this.multiplierLabel = new PIXI.Text({
      text: 'MULTIPLIER',
      style: {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: Config.COLORS.TEXT,
        align: 'center',
      },
    });
    this.multiplierLabel.anchor.set(0.5);
    this.multiplierLabel.x = 100;
    this.multiplierLabel.y = 20;
    this.multiplierContainer.addChild(this.multiplierLabel);
    
    this.multiplierValue = new PIXI.Text({
      text: 'x1.0',
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: Config.COLORS.SAFE,
        fontWeight: 'bold',
        align: 'center',
      },
    });
    this.multiplierValue.anchor.set(0.5);
    this.multiplierValue.x = 100;
    this.multiplierValue.y = 50;
    this.multiplierContainer.addChild(this.multiplierValue);
    
    // Winnings display
    this.winningsContainer = new PIXI.Container();
    this.addChild(this.winningsContainer);
    
    const winningsBg = new PIXI.Graphics();
    winningsBg.roundRect(0, 0, 200, 60, 10);
    winningsBg.fill({ color: 0x000000, alpha: 0.7 });
    this.winningsContainer.addChild(winningsBg);
    
    this.winningsLabel = new PIXI.Text({
      text: 'WINNINGS',
      style: {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: Config.COLORS.TEXT,
        align: 'center',
      },
    });
    this.winningsLabel.anchor.set(0.5);
    this.winningsLabel.x = 100;
    this.winningsLabel.y = 15;
    this.winningsContainer.addChild(this.winningsLabel);
    
    this.winningsValue = new PIXI.Text({
      text: '$0.00',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xFFD700,
        fontWeight: 'bold',
        align: 'center',
      },
    });
    this.winningsValue.anchor.set(0.5);
    this.winningsValue.x = 100;
    this.winningsValue.y = 40;
    this.winningsContainer.addChild(this.winningsValue);
    
    // Cash out button
    this.cashOutButton = new PIXI.Container();
    this.cashOutButton.eventMode = 'static';
    this.cashOutButton.cursor = 'pointer';
    
    const cashOutBg = new PIXI.Graphics();
    cashOutBg.roundRect(0, 0, 180, 60, 10);
    cashOutBg.fill(Config.COLORS.SAFE);
    this.cashOutButton.addChild(cashOutBg);
    
    const cashOutText = new PIXI.Text({
      text: 'CASH OUT',
      style: {
        fontFamily: 'Arial',
        fontSize: 22,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
      },
    });
    cashOutText.anchor.set(0.5);
    cashOutText.x = 90;
    cashOutText.y = 30;
    this.cashOutButton.addChild(cashOutText);
    
    this.addChild(this.cashOutButton);
    
    this.cashOutButton.on('pointerdown', () => {
      eventBus.emit('game:cashOut');
    });
    
    this.cashOutButton.on('pointerenter', () => {
      gsap.to(this.cashOutButton, { alpha: 0.8, duration: 0.2 });
    });
    
    this.cashOutButton.on('pointerleave', () => {
      gsap.to(this.cashOutButton, { alpha: 1, duration: 0.2 });
    });
    
    // Win/Crash message (hidden initially)
    this.messageContainer = new PIXI.Container();
    this.messageContainer.visible = false;
    this.addChild(this.messageContainer);
    
    const messageBg = new PIXI.Graphics();
    messageBg.roundRect(0, 0, 400, 200, 15);
    messageBg.fill({ color: 0x000000, alpha: 0.9 });
    this.messageContainer.addChild(messageBg);
    
    this.messageText = new PIXI.Text({
      text: '',
      style: {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: Config.COLORS.TEXT,
        fontWeight: 'bold',
        align: 'center',
      },
    });
    this.messageText.anchor.set(0.5);
    this.messageText.x = 200;
    this.messageText.y = 100;
    this.messageContainer.addChild(this.messageText);
    
    // Listen for cash out event - will be handled by Gameplay scene
  }
  
  show() {
    this.visible = true;
    this.alpha = 0;
    gsap.to(this, {
      alpha: 1,
      duration: Config.TRANSITION_DURATION,
    });
  }
  
  updateMultiplier(multiplier, winnings) {
    this.multiplierValue.text = `x${multiplier.toFixed(1)}`;
    this.winningsValue.text = `$${winnings.toFixed(2)}`;
    
    // Pulse animation
    gsap.to(this.multiplierValue.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  }
  
  showWin(winnings, multiplier) {
    this.messageText.text = `CASHED OUT!\n$${winnings.toFixed(2)}\nx${multiplier.toFixed(1)}`;
    this.messageText.style.fill = Config.COLORS.SAFE;
    this.messageContainer.visible = true;
    this.messageContainer.alpha = 0;
    this.messageContainer.scale.set(0.5);
    
    gsap.to(this.messageContainer, {
      alpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out',
    });
  }
  
  showCrash() {
    this.messageText.text = 'CRASHED!\nYou Lost';
    this.messageText.style.fill = Config.COLORS.DANGER;
    this.messageContainer.visible = true;
    this.messageContainer.alpha = 0;
    this.messageContainer.scale.set(0.5);
    
    gsap.to(this.messageContainer, {
      alpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out',
    });
  }
  
  onResize(data) {
    // Position multiplier display (top left)
    this.multiplierContainer.x = 20;
    this.multiplierContainer.y = 20;
    
    // Position winnings display (top center)
    this.winningsContainer.x = data.vpw / 2 - 100;
    this.winningsContainer.y = 20;
    
    // Position cash out button (bottom center)
    this.cashOutButton.x = data.vpw / 2 - 90;
    this.cashOutButton.y = data.vph - 100;
    
    // Position message (center)
    this.messageContainer.x = data.vpw / 2 - 200;
    this.messageContainer.y = data.vph / 2 - 100;
  }
}

