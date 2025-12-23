import * as PIXI from 'pixi.js';

// Central texture store to prevent redundant texture creation
export class TextureRegistry {
  constructor() {
    this.textures = new Map();
    this.assets = null;
  }
  
  setAssets(assets) {
    // #region agent log
    const assetKeys = assets ? Object.keys(assets) : [];
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TextureRegistry.js:10',message:'setAssets called',data:{assetsType:typeof assets,assetsIsArray:Array.isArray(assets),assetsIsNull:assets===null,assetsIsUndefined:assets===undefined,assetsKeys:assetKeys,assetsKeysLength:assetKeys.length,hasBackgroundHouses:assets?('background_houses' in assets):false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    this.assets = assets;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TextureRegistry.js:12',message:'setAssets completed',data:{registryHasAssets:this.assets!==null,registryKeys:this.assets?Object.keys(this.assets):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  }
  
  get(name) {
    // #region agent log
    const assetKeys = this.assets ? Object.keys(this.assets) : [];
    const hasAssetKey = this.assets ? (name in this.assets) : false;
    const assetValue = this.assets ? this.assets[name] : null;
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TextureRegistry.js:14',message:'Texture requested',data:{name,hasCachedTexture:this.textures.has(name),hasAssets:this.assets!==null,assetsType:typeof this.assets,assetsIsArray:Array.isArray(this.assets),assetsKeys:assetKeys,assetsKeysLength:assetKeys.length,hasAssetKey:hasAssetKey,assetValueType:assetValue?typeof assetValue:null,assetValueConstructor:assetValue?assetValue.constructor?.name:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (this.textures.has(name)) {
      return this.textures.get(name);
    }
    
    if (this.assets && this.assets[name]) {
      const asset = this.assets[name];
      // Assets.load() returns Texture objects directly in PixiJS v8, not paths
      let texture;
      if (asset instanceof PIXI.Texture) {
        texture = asset;
      } else {
        texture = PIXI.Texture.from(asset);
      }
      this.textures.set(name, texture);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TextureRegistry.js:32',message:'Texture created from asset',data:{name,textureCreated:true,assetIsTexture:asset instanceof PIXI.Texture},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return texture;
    }
    
    console.warn(`Texture not found: ${name}`);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TextureRegistry.js:28',message:'Texture not found - returning EMPTY',data:{name,hasAssets:this.assets!==null,hasAssetKey:hasAssetKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return PIXI.Texture.EMPTY;
  }
  
  clear() {
    this.textures.forEach(texture => {
      if (texture && texture !== PIXI.Texture.EMPTY) {
        texture.destroy();
      }
    });
    this.textures.clear();
  }
}

export const textureRegistry = new TextureRegistry();

