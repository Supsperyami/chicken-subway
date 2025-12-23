import * as PIXI from "pixi.js";
import { Config } from "../core/Config.js";
import { textureRegistry } from "../core/TextureRegistry.js";
import { gsap } from "gsap";

export class Chicken extends PIXI.Container {
  constructor() {
    super();
    this.isRunning = false;
    this.isJumping = false;
    this.currentLane = 1;
    this.animationTime = 0;
    this.walkFrame = 0;
    this.jumpFrame = 0;

    this.setup();
  }

  setup() {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/40e1d23b-dcdd-4ed1-ab98-8f982cf42cf0", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "Chicken.js:19",
        message: "Chicken.setup called",
        data: {
          registryHasAssets: textureRegistry.assets !== null,
          registryKeys: textureRegistry.assets
            ? Object.keys(textureRegistry.assets)
            : null,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    // Load walk animation frames
    this.walkFrames = [
      textureRegistry.get("chicken_walk1"),
      textureRegistry.get("chicken_walk2"),
      textureRegistry.get("chicken_walk3"),
      textureRegistry.get("chicken_walk4"),
    ];

    // Load jump animation frames
    this.jumpFrames = [
      textureRegistry.get("chicken_jump1"),
      textureRegistry.get("chicken_jump2"),
      textureRegistry.get("chicken_jump3"),
      textureRegistry.get("chicken_jump4"),
      textureRegistry.get("chicken_jump5"),
    ];

    // Create sprite
    this.sprite = new PIXI.Sprite(this.walkFrames[0]);
    this.sprite.anchor.set(0.5, 1);
    this.addChild(this.sprite);

    // Set initial position (at bottom)
    this.y = 0; // Will be set properly in onResize
  }

  startRunning() {
    this.isRunning = true;
    this.isJumping = false;
    this.animationTime = 0;
    this.walkFrame = 0;
  }

  jump() {
    if (this.isJumping) return;

    this.isJumping = true;
    this.jumpFrame = 0;
    // Use vph as base position (bottom of screen)
    const baseY = this.vph || this.y;

    // Jump animation
    gsap.to(this, {
      y: baseY - Config.CHICKEN_JUMP_HEIGHT,
      duration: Config.CHICKEN_JUMP_DURATION / 2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(this, {
          y: baseY,
          duration: Config.CHICKEN_JUMP_DURATION / 2,
          ease: "power2.in",
          onComplete: () => {
            this.isJumping = false;
            // Ensure chicken is at bottom after jump
            if (this.vph) {
              this.y = this.vph;
            }
          },
        });
      },
    });
  }

  crash() {
    this.isRunning = false;
    this.isJumping = false;

    // Crash animation - rotate and fall
    gsap.to(this, {
      rotation: Math.PI / 2,
      y: this.y + 50,
      duration: 0.5,
      ease: "power2.in",
    });
  }

  stop() {
    this.isRunning = false;
    this.isJumping = false;
  }

  update(deltaTime, targetX) {
    // Smooth lane transition
    const speed = 10;
    this.x += (targetX - this.x) * speed * deltaTime;

    // Keep chicken at bottom of screen (only when not jumping)
    if (!this.vph) return;
    if (!this.isJumping) {
      this.y = this.vph;
    }
  }

  updateAnimation(deltaTime) {
    this.animationTime += deltaTime;

    if (this.isJumping) {
      // Jump animation
      const fps = Config.CHICKEN_JUMP_FPS;
      const frameIndex =
        Math.floor(this.animationTime * fps) % this.jumpFrames.length;
      if (frameIndex !== this.jumpFrame) {
        this.jumpFrame = frameIndex;
        this.sprite.texture = this.jumpFrames[frameIndex];
      }
    } else {
      // Always use walk animation (chicken_walk1-4) when not jumping
      const fps = Config.CHICKEN_WALK_FPS;
      const frameIndex =
        Math.floor(this.animationTime * fps) % this.walkFrames.length;
      if (frameIndex !== this.walkFrame) {
        this.walkFrame = frameIndex;
        this.sprite.texture = this.walkFrames[frameIndex];
      }
    }
  }

  onResize(data) {
    this.vph = data.vph;
    this.y = data.vph;
  }
}
