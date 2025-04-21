import type { GameState } from "./GameState"
import { updatePlayerState } from "./Player"
import { updateMonsters } from "./Monster"
import { updateBackground } from "./Background"
import { Combat } from "./Combat"
import { updateEssenceDrops, cleanupEssenceDrops } from "./EssenceDrop"

const DEBUG_MODE = false

export function updateGameState(gameState: GameState, deltaTime: number): void {
  // Skip updates if game is paused
  if (gameState.isPaused) return

  // Update game timer
  gameState.gameTime += deltaTime

  // Update distance based on player speed
  if (!gameState.player.isLevelingUp) {
    gameState.distance += (gameState.player.speed * deltaTime) / 1000
  }

  // Update background elements
  updateBackground(gameState, deltaTime)

  // Update player state
  updatePlayerState(gameState, deltaTime)

  // Update all monsters
  updateMonsters(gameState, deltaTime)

  // Process combat interactions
  Combat.update(gameState, deltaTime)

  // Update essence drops
  updateEssenceDrops(gameState.essenceDrops, gameState.player.position)

  // Clean up collected essence drops
  gameState.essenceDrops = cleanupEssenceDrops(gameState.essenceDrops)

  // Check for biome transitions
  checkBiomeTransition(gameState)

  if (DEBUG_MODE && gameState.gameTime % 1000 < 16) {
    console.log("Game state updated", {
      time: Math.floor(gameState.gameTime / 1000),
      distance: Math.floor(gameState.distance),
      monsters: gameState.monsters.length,
      playerState: gameState.player.state,
    })
  }
}

function checkBiomeTransition(gameState: GameState): void {
  // Check if we need to transition to a new biome based on distance
  const newBiomeIndex = Math.floor(gameState.distance / gameState.biomeLength)

  if (newBiomeIndex !== gameState.currentBiomeIndex) {
    gameState.currentBiomeIndex = newBiomeIndex
    gameState.showBiomeTransition = true
    gameState.biomeTransitionTime = gameState.gameTime

    // After 3 seconds, hide the transition notification
    setTimeout(() => {
      gameState.showBiomeTransition = false
    }, 3000)
  }
}
