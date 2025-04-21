import type { PlayerState } from "./Player"
import type { Monster } from "./Monster"
import type { BackgroundLayer } from "./Background"
import type { EssenceDrop } from "./EssenceDrop"

// Define game state interface for type safety
export interface GameState {
  gameTime: number
  distance: number
  isPaused: boolean
  isGameOver: boolean
  player: PlayerState
  monsters: Monster[]
  backgroundLayers: BackgroundLayer[]
  essenceDrops: EssenceDrop[]
  currentBiomeIndex: number
  biomeLength: number
  showBiomeTransition: boolean
  biomeTransitionTime: number
}
