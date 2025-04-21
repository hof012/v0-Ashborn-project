import type { GameState } from "./GameState"

// This is the named export that was missing
export function updateBackground(gameState: GameState, deltaTime: number): void {
  // Basic stub implementation
  if (gameState.backgroundLayers) {
    gameState.backgroundLayers.forEach((layer) => {
      // Calculate new position based on player movement and parallax factor
      const playerMovement = (gameState.player.speed * deltaTime) / 1000
      layer.position -= playerMovement * layer.parallaxFactor

      // Wrap background layers for infinite scrolling
      if (layer.position <= -layer.width) {
        layer.position += layer.width
      }
    })
  }
}

// Define background layer interface for type safety
export interface BackgroundLayer {
  image: string
  position: number
  parallaxFactor: number
  width: number
  height: number
}
