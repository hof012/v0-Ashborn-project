"use client"

// Removed useState, useEffect, useContext as they are now in GameProvider or not needed here directly
// import { useState, useEffect, useContext } from "react"; 
import type { WorldSnapshot } from "./game/WorldState"
import type { PetType } from "./game/Pet"
import type { GameState as GameStateType } from "./game/GameStateManager"
import { useGameContext } from "@/components/game-provider" // Adjust path as needed
import { GameLoop } from "./game/GameLoop" // Import for default snapshot if truly needed, though ideally avoided.

// TODO: Create a GameContext to provide the GameLoop instance
// const GameContext = React.createContext<GameLoop | null>(null);

// // Initialize the game loop - THIS WILL BE MOVED
// const game = new GameLoop(); 

// // Update the game at 60 FPS - THIS WILL BE MOVED & CHANGED TO requestAnimationFrame
// setInterval(() => {
//   game.update();
// }, 1000 / 60);

export interface UseGameStateReturn extends WorldSnapshot {
  resetGame: () => void
  applyTrait: (trait: string) => void
  changePetType: (type: PetType) => void
  currentPetType: PetType
  rawGameState: GameStateType
}

// Hook to use the game state in React components
export function useGameState(): UseGameStateReturn {
  const context = useGameContext()

  // GameProvider now initializes snapshot, so context.snapshot should not be null.
  // If it were possible for it to be null here due to timing, a loading state or error is more appropriate.
  if (!context.snapshot) {
    // This case should ideally not be reached if GameProvider guarantees an initial snapshot.
    // If it can, proper loading state propagation is needed.
    // For now, if it still happens, create a default empty-ish snapshot to prevent crashes downstream.
    console.error("useGameState: context.snapshot is null. This should not happen if GameProvider initializes it.");
    const defaultLoop = new GameLoop(); // Create a temporary loop to get a default snapshot structure
    const defaultSnapshot = defaultLoop.getSnapshot();
    return {
      ...defaultSnapshot,
      resetGame: () => defaultLoop.restart(), // Point to temp loop methods
      applyTrait: (trait: string) => defaultLoop.applyTrait(trait),
      changePetType: (type: PetType) => defaultLoop.changePetType(type),
      currentPetType: 'paw', // Default
      rawGameState: defaultSnapshot.gameState.current as GameStateType,
    }
  }

  return {
    ...context.snapshot, // Spread all properties from the snapshot
    resetGame: context.resetGame,
    applyTrait: context.applyTrait,
    changePetType: context.changePetType,
    currentPetType: context.currentPetType, // Sourced from context (which still has its own local state for this)
    rawGameState: context.snapshot.gameState.current as GameStateType,
  }
}
