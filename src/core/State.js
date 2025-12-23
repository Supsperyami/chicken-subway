import { eventBus } from './EventBus.js';
import { Config } from './Config.js';

export class State {
  constructor() {
    this.bet = Config.INITIAL_BET;
    this.currentMultiplier = Config.INITIAL_MULTIPLIER;
    this.currentWinnings = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.currentLane = 1; // 0 = left, 1 = middle, 2 = right
    this.checkpointIndex = 0;
    this.distanceTraveled = 0;
    this.hasCrashed = false;
    this.hasCashedOut = false;
  }
  
  startRun() {
    this.isRunning = true;
    this.isPaused = false;
    this.currentMultiplier = Config.INITIAL_MULTIPLIER;
    this.currentWinnings = 0;
    this.checkpointIndex = 0;
    this.distanceTraveled = 0;
    this.hasCrashed = false;
    this.hasCashedOut = false;
    eventBus.emit('state:runStarted');
  }
  
  reachCheckpoint() {
    this.isPaused = true;
    this.checkpointIndex++;
    eventBus.emit('state:checkpointReached', {
      checkpointIndex: this.checkpointIndex,
      currentMultiplier: this.currentMultiplier,
    });
  }
  
  selectLane(laneIndex, isSafe, targetMultiplier = null) {
    this.currentLane = laneIndex;
    this.isPaused = false;
    
    if (isSafe) {
      if (targetMultiplier !== null) {
        // Use scripted multiplier
        this.currentMultiplier = targetMultiplier;
      } else {
        // Random boost
        const boost = Config.SAFE_LANE_MULTIPLIER_BOOST[
          Math.floor(Math.random() * Config.SAFE_LANE_MULTIPLIER_BOOST.length)
        ];
        this.currentMultiplier += boost;
      }
      this.currentMultiplier = Math.min(this.currentMultiplier, Config.MAX_MULTIPLIER);
      this.currentWinnings = this.bet * this.currentMultiplier;
      eventBus.emit('state:laneSafe', {
        lane: laneIndex,
        newMultiplier: this.currentMultiplier,
        winnings: this.currentWinnings,
      });
    } else {
      this.hasCrashed = true;
      this.isRunning = false;
      eventBus.emit('state:crashed', { lane: laneIndex });
    }
  }
  
  cashOut() {
    if (!this.isRunning || this.hasCrashed) return;
    this.hasCashedOut = true;
    this.isRunning = false;
    eventBus.emit('state:cashedOut', {
      winnings: this.currentWinnings,
      multiplier: this.currentMultiplier,
    });
  }
  
  updateDistance(delta) {
    if (!this.isRunning || this.isPaused) return;
    this.distanceTraveled += delta;
    
    // Check if reached checkpoint
    if (this.distanceTraveled >= this.checkpointIndex * Config.CHECKPOINT_DISTANCE + Config.CHECKPOINT_DISTANCE) {
      this.reachCheckpoint();
    }
  }
  
  reset() {
    this.bet = Config.INITIAL_BET;
    this.currentMultiplier = Config.INITIAL_MULTIPLIER;
    this.currentWinnings = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.currentLane = 1;
    this.checkpointIndex = 0;
    this.distanceTraveled = 0;
    this.hasCrashed = false;
    this.hasCashedOut = false;
    eventBus.emit('state:reset');
  }
}

