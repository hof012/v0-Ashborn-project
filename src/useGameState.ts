"use client"

import { useState, useEffect, useRef } from "react"
import { GameLoop } from "./game/GameLoop"
import type { WorldSnapshot } from "./game/WorldState"
import type { PetType } from "./game/Pet"
import type { GameState } from "./game/GameStateManager"

// Create a singleton instance of the game loop
let gameInstance: GameLoop | null = null

function getGameInstance(): GameLoop {
  if (!gameInstance) {
    console.log("Creating new GameLoop instance")
    gameInstance = new GameLoop()
  }
  return gameInstance
}

// Hook to use the game state in React components
export function useGameState(): WorldSnapshot & {
  resetGame: () => void
  applyTrait: (trait: string) => void
  changePetType: (type: PetType) => void
  currentPetType: PetType
  gameState: GameState
} {
  const [snapshot, setSnapshot] = useState<WorldSnapshot>(() => {
    try {
      return getGameInstance().getSnapshot()
    } catch (error) {
      console.error("Error getting initial snapshot:", error)
      // Return a minimal valid snapshot
      return {
        player: {
          health: 100,
          maxHealth: 100,
          xp: 0,
          xpToNextLevel: 10,
          essence: 0,
          level: 1,
          position: 0,
          inCombat: false,
          isAlive: true,
          pendingTrait: false,
          traits: [],
          mp: 10,
          maxMP: 10,
          stats: {
            base: { str: 1, dex: 1, int: 1, luk: 1 },
            current: { str: 1, dex: 1, int: 1, luk: 1 },
            derived: {
              maxHealth: 100,
              maxMP: 10,
              physicalDamage: 1,
              magicalDamage: 1,
              critChance: 0.05,
              critDamage: 1.5,
              dodgeChance: 0.05,
              movementSpeed: 1,
              attackSpeed: 1,
            },
            descriptions: {
              str: "Strength",
              dex: "Dexterity",
              int: "Intelligence",
              luk: "Luck",
            },
          },
          unlockedAbilities: [],
          unlockedTraits: [],
          monsterKills: {},
          traitProgress: {},
          randomBonuses: [],
          inAttackAnimation: false,
        },
        monsters: [],
        distance: 0,
        gameOver: false,
        showLevelUp: false,
        showTraitNotification: false,
        showRandomBonusNotification: false,
        traitNotification: null,
        randomBonusNotification: null,
        damageEvents: {
          playerHits: [],
          monsterHits: [],
          playerDodges: [],
        },
        essenceDrops: [],
        pet: {
          x: 0,
          y: 0,
          level: 1,
          emoji: "🐱",
          isCollecting: false,
          reactionEmoji: "",
          xp: 0,
          nextLevelXp: 5,
        },
        petDefinition: {
          id: "paw",
          name: "Cat",
          description: "A loyal cat companion",
          emoji: "🐱",
          statBonuses: { str: 0, dex: 0, int: 0, luk: 0 },
          abilities: [],
        },
        petTrails: [],
        gameState: {
          current: "running",
          isTransitioning: false,
          transitionProgress: 1,
          cameraOffset: { x: 0, y: 0 },
          combatMonsterId: null,
        },
        currentBiome: "forest",
      }
    }
  })

  const [currentPetType, setCurrentPetType] = useState<PetType>("paw")
  const gameInitialized = useRef(false)
  const updateIntervalRef = useRef<number | null>(null)
  const renderIntervalRef = useRef<number | null>(null)

  // Initialize game and set up update intervals
  useEffect(() => {
    console.log("Initializing game state...")

    try {
      const game = getGameInstance()

      // Update the game at 60 FPS
      if (!updateIntervalRef.current) {
        updateIntervalRef.current = window.setInterval(() => {
          try {
            game.update()
          } catch (error) {
            console.error("Error in game update:", error)
          }
        }, 1000 / 60)
      }

      // Update the snapshot at 30 FPS for rendering
      if (!renderIntervalRef.current) {
        renderIntervalRef.current = window.setInterval(() => {
          try {
            setSnapshot(game.getSnapshot())
          } catch (error) {
            console.error("Error getting snapshot:", error)
          }
        }, 1000 / 30)
      }

      gameInitialized.current = true
      console.log("Game state initialized successfully")
    } catch (error) {
      console.error("Error initializing game state:", error)
    }

    // Cleanup intervals on unmount
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
        updateIntervalRef.current = null
      }
      if (renderIntervalRef.current) {
        clearInterval(renderIntervalRef.current)
        renderIntervalRef.current = null
      }
    }
  }, [])

  // Reset game function
  const resetGame = () => {
    try {
      const game = getGameInstance()
      game.restart()
      setSnapshot(game.getSnapshot())
    } catch (error) {
      console.error("Error resetting game:", error)
    }
  }

  // Apply trait function
  const applyTrait = (trait: string) => {
    try {
      const game = getGameInstance()
      game.applyTrait(trait)
    } catch (error) {
      console.error("Error applying trait:", error)
    }
  }

  // Change pet type function
  const changePetType = (type: PetType) => {
    try {
      const game = getGameInstance()
      game.changePetType(type)
      setCurrentPetType(type)
    } catch (error) {
      console.error("Error changing pet type:", error)
    }
  }

  return {
    ...snapshot,
    resetGame,
    applyTrait,
    changePetType,
    currentPetType,
    gameState: snapshot.gameState.current as GameState,
  }
}
