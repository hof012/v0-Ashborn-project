export type GameState = "running" | "combat" | "dead" | "levelup" | "traitselect"

// Camera and positioning constants
export const COMBAT_CAMERA = {
  PLAYER_POSITION: 0.35, // Player at 35% of screen width during combat
  MONSTER_POSITION: 0.65, // Monster at 65% of screen width during combat
  TRANSITION_DURATION: 500, // ms for smooth transitions
  CINEMATIC_BORDER_HEIGHT: 0.1, // 10% of screen height for cinematic borders
}

export class GameStateManager {
  private currentState: GameState = "running"
  private previousState: GameState = "running"
  private transitionStartTime = 0
  private isTransitioning = false
  private currentCombatMonsterId: string | null = null
  private cameraShakeIntensity = 0
  private cameraShakeDecay = 0.9
  private cameraOffset = { x: 0, y: 0 }

  constructor() {}

  // Get the current game state
  getState(): GameState {
    return this.currentState
  }

  // Check if we're in a specific state
  isState(state: GameState): boolean {
    return this.currentState === state
  }

  // Transition to a new state
  transitionTo(newState: GameState): void {
    this.previousState = this.currentState
    this.currentState = newState
    this.transitionStartTime = Date.now()
    this.isTransitioning = true
  }

  // Get transition progress (0-1)
  getTransitionProgress(): number {
    if (!this.isTransitioning) return 1

    const elapsed = Date.now() - this.transitionStartTime
    const progress = Math.min(1, elapsed / COMBAT_CAMERA.TRANSITION_DURATION)

    if (progress >= 1) {
      this.isTransitioning = false
    }

    return progress
  }

  // Set the current monster in combat
  setCurrentCombatMonster(monsterId: string | null): void {
    this.currentCombatMonsterId = monsterId
  }

  // Get the current monster in combat
  getCurrentCombatMonster(): string | null {
    return this.currentCombatMonsterId
  }

  // Trigger camera shake (for hits, crits, etc.)
  shakeCamera(intensity = 10): void {
    this.cameraShakeIntensity = intensity
  }

  // Update camera shake effect
  updateCameraShake(): void {
    if (this.cameraShakeIntensity > 0.1) {
      this.cameraOffset = {
        x: (Math.random() - 0.5) * this.cameraShakeIntensity,
        y: (Math.random() - 0.5) * this.cameraShakeIntensity,
      }
      this.cameraShakeIntensity *= this.cameraShakeDecay
    } else {
      this.cameraShakeIntensity = 0
      this.cameraOffset = { x: 0, y: 0 }
    }
  }

  // Get camera offset for shake effect
  getCameraOffset(): { x: number; y: number } {
    return this.cameraOffset
  }

  // Check if we're transitioning between states
  isInTransition(): boolean {
    return this.isTransitioning
  }

  // Get the previous state
  getPreviousState(): GameState {
    return this.previousState
  }
}
