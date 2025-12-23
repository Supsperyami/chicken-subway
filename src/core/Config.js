// Global configuration for game balance and tuning
export const Config = {
  // Gameplay
  INITIAL_BET: 1.0,
  INITIAL_MULTIPLIER: 1.0,
  MULTIPLIER_INCREMENT: 0.2,
  MAX_MULTIPLIER: 25.0,

  // Checkpoints
  CHECKPOINT_DISTANCE: 300, // pixels between checkpoints
  CHECKPOINT_PAUSE_DURATION: 1.5, // seconds to show lane selection

  // Lanes
  LANE_COUNT: 3,
  LANE_WIDTH: 120,
  LANE_SPACING: 20,

  // Character
  CHICKEN_SPEED: 100, // pixels per second
  CHICKEN_WALK_FPS: 8,
  CHICKEN_JUMP_FPS: 10,
  CHICKEN_JUMP_HEIGHT: 40,
  CHICKEN_JUMP_DURATION: 0.6,

  // Obstacles
  OBSTACLE_SPAWN_CHANCE: 0.3, // 30% chance per checkpoint
  SAFE_LANE_MULTIPLIER_BOOST: [0.2, 0.3, 0.5], // random boost per safe lane

  // Visual
  TRACK_SCROLL_SPEED: 150,
  BACKGROUND_SCROLL_SPEED: 50,

  // Colors
  COLORS: {
    SAFE: 0x4caf50,
    DANGER: 0xf44336,
    NEUTRAL: 0x2196f3,
    TEXT: 0xffffff,
    BG_DARK: 0x1a1a1a,
  },

  // Timing
  IDLE_HINT_DELAY: 3.0, // seconds before showing hint
  TRANSITION_DURATION: 0.5,

  // Scripted win sequence (deterministic)
  WIN_SEQUENCE: [
    { lane: 1, multiplier: 1.2 }, // middle lane, safe
    { lane: 0, multiplier: 1.5 }, // left lane, safe
    { lane: 2, multiplier: 2.0 }, // right lane, safe
    { lane: 1, multiplier: 3.0 }, // middle lane, safe
    { lane: 0, multiplier: 5.0 }, // left lane, safe
    { lane: 2, multiplier: 10.0 }, // right lane, safe - cash out opportunity
  ],

  // Crash probabilities (higher multiplier = higher crash risk)
  CRASH_PROBABILITY_BASE: 0.1,
  CRASH_PROBABILITY_MULTIPLIER: 0.05, // per multiplier point
};
