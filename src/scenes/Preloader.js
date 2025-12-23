import { SceneContainer } from './SceneContainer.js';
import * as PIXI from 'pixi.js';
import { Config } from '../core/Config.js';
import { eventBus } from '../core/EventBus.js';
import { textureRegistry } from '../core/TextureRegistry.js';
import { Assets } from 'pixi.js';

export class Preloader extends SceneContainer {
  constructor() {
    super('Preloader');
    this.assetsLoaded = false;
    this.setup();
  }
  
  setup() {
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, 100, 100);
    bg.fill(Config.COLORS.BG_DARK);
    this.addChild(bg);
    
    // Loading text
    const loadingText = new PIXI.Text({
      text: 'Loading...',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: Config.COLORS.TEXT,
        align: 'center',
      },
    });
    loadingText.anchor.set(0.5);
    this.addChild(loadingText);
    
    this.loadingText = loadingText;
    this.loadAssets();
  }
  
  async loadAssets() {
    try {
      // Load all assets - PixiJS v8 format: array with src and alias properties
      const assetManifest = [
        { alias: 'background_houses', src: './assets/background_houses.png' },
        { alias: 'barricade', src: './assets/barricade.png' },
        { alias: 'button_x10', src: './assets/button_x10.png' },
        { alias: 'button_x15', src: './assets/button_x15.png' },
        { alias: 'button_x25', src: './assets/button_x25.png' },
        { alias: 'chicken_jump1', src: './assets/chicken_jump1.png' },
        { alias: 'chicken_jump2', src: './assets/chicken_jump2.png' },
        { alias: 'chicken_jump3', src: './assets/chicken_jump3.png' },
        { alias: 'chicken_jump4', src: './assets/chicken_jump4.png' },
        { alias: 'chicken_jump5', src: './assets/chicken_jump5.png' },
        { alias: 'chicken_walk1', src: './assets/chicken_walk1.png' },
        { alias: 'chicken_walk2', src: './assets/chicken_walk2.png' },
        { alias: 'chicken_walk3', src: './assets/chicken_walk3.png' },
        { alias: 'chicken_walk4', src: './assets/chicken_walk4.png' },
        { alias: 'train_tracks_center', src: './assets/train_tracks_center.png' },
        { alias: 'train_tracks_left', src: './assets/train_tracks_left.png' },
        { alias: 'train_tracks_right', src: './assets/train_tracks_right.png' },
        { alias: 'signposts', src: './assets/signposts_x10_x25_x15.png' },
        { alias: 'logo', src: './assets/logo.png' },
      ];
      // #region agent log
      const manifestValues = assetManifest.map(a => a.src);
      const undefinedValues = manifestValues.filter(v => v === undefined || v === null);
      fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Preloader.js:63',message:'About to call Assets.load',data:{manifestIsArray:Array.isArray(assetManifest),manifestLength:assetManifest.length,firstItem:assetManifest[0],firstSrc:assetManifest[0]?.src,undefinedCount:undefinedValues.length,allSrcs:manifestValues},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const assets = await Assets.load(assetManifest);
      // #region agent log
      const assetKeys = assets ? Object.keys(assets) : [];
      const firstKey = assetKeys[0];
      const firstAssetValue = assets && firstKey ? assets[firstKey] : null;
      const sampleAsset = assets && assetKeys.length > 0 ? assets[assetKeys[0]] : null;
      const logData = {
        location: 'Preloader.js:68',
        message: 'Assets.load completed',
        data: {
          assetsType: typeof assets,
          assetsIsArray: Array.isArray(assets),
          assetsIsNull: assets === null,
          assetsIsUndefined: assets === undefined,
          assetsKeys: assetKeys,
          assetsKeysLength: assetKeys.length,
          assetsLength: assets?.length,
          firstKey: firstKey,
          firstAssetType: firstAssetValue ? (firstAssetValue.constructor?.name) : null,
          sampleAssetType: sampleAsset ? typeof sampleAsset : null,
          sampleAssetConstructor: sampleAsset ? sampleAsset.constructor?.name : null,
          hasBackgroundHouses: assets ? ('background_houses' in assets) : false,
          hasTrainTracksLeft: assets ? ('train_tracks_left' in assets) : false,
          hasChickenWalk1: assets ? ('chicken_walk1' in assets) : false,
          hasLogo: assets ? ('logo' in assets) : false,
          manifestAliases: assetManifest.map(a => a.alias),
          allKeysMatch: assetManifest.every(m => assetKeys.includes(m.alias))
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B'
      };
      fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch(()=>{});
      // #endregion
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Preloader.js:87',message:'About to setAssets',data:{assetsType:typeof assets,assetsIsArray:Array.isArray(assets),assetsKeys:assets?Object.keys(assets):null,assetsKeysLength:assets?Object.keys(assets).length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      textureRegistry.setAssets(assets);
      // #region agent log
      const registryKeys = textureRegistry.assets ? Object.keys(textureRegistry.assets) : [];
      const logData2 = {
        location: 'Preloader.js:89',
        message: 'Assets set in textureRegistry',
        data: {
          registryHasAssets: textureRegistry.assets !== null,
          registryKeys: registryKeys,
          registryKeysLength: registryKeys.length,
          registryHasBackgroundHouses: textureRegistry.assets ? ('background_houses' in textureRegistry.assets) : false,
          registryHasTrainTracksLeft: textureRegistry.assets ? ('train_tracks_left' in textureRegistry.assets) : false
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E'
      };
      fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
      // #endregion
      
      this.assetsLoaded = true;
      this.loadingText.text = 'Loaded!';
      
      setTimeout(() => {
        eventBus.emit('scene:change', 'Gameplay');
      }, 500);
    } catch (error) {
      console.error('Failed to load assets:', error);
      this.loadingText.text = 'Load Error';
    }
  }
  
  onResize(data) {
    this.loadingText.x = data.vpw / 2;
    this.loadingText.y = data.vph / 2;
  }
}

