"use client"

import { useState, useEffect } from "react"
import { GameLoop } from "./game/GameLoop"
import type { WorldSnapshot } from "./game/WorldState"
import type { PetType } from "./game/Pet"
import type { GameState } from "./game/GameStateManager"

// Initialize the game loop
const game = new GameLoop()

// Update the game at 60 FPS
setInterval(() => {
  game.update()
}, 1000 / 60)

// Hook to use the game state in React components
export function useGameState(): WorldSnapshot & {
  resetGame: () => void
  applyTrait: (trait: string) => void
  changePetType: (type: PetType) => void
  currentPetType: PetType
  gameState: GameState
} {
  const [snapshot, setSnapshot] = useState<WorldSnapshot>(game.getSnapshot())
  const [currentPetType, setCurrentPetType] = useState<PetType>("paw")

  useEffect(() => {
    // Update the snapshot at 30 FPS for rendering
    const interval = setInterval(() => {
      setSnapshot(game.getSnapshot())
    }, 1000 / 30)

    return () => clearInterval(interval)
  }, [])

  return {
    ...snapshot,
    resetGame: () => game.restart(),
    applyTrait: (trait: string) => {
      // Use the GameLoop's applyTrait method which handles random bonuses
      game.applyTrait(trait)
    },
    changePetType: (type: PetType) => {
      game.changePetType(type)
      setCurrentPetType(type)
    },
    currentPetType,
    gameState: snapshot.gameState.current as GameState,
  }
}
