"use client"

import { useState, useEffect } from "react"

// TODO: Define more specific GameSystemStateType and PlayerType interfaces globally
interface GameStateDebugProps {
  gameSystemState: any; // Renamed from gameState
  player: any;
}

export default function GameStateDebug({ gameSystemState, player }: GameStateDebugProps) { // Renamed gameState to gameSystemState
  const [isOpen, setIsOpen] = useState(false)
  const [gameStateInfo, setGameStateInfo] = useState<any>({})

  useEffect(() => {
    if (!isOpen) return

    // Update game state info every 100ms
    const interval = setInterval(() => {
      setGameStateInfo({
        gameState: gameSystemState.current, // Changed from gameState.current
        previousState: gameSystemState.getPreviousState?.() || "unknown", // Changed from gameState.getPreviousState
        isTransitioning: gameSystemState.isTransitioning, // Changed from gameState.isTransitioning
        transitionProgress: gameSystemState.transitionProgress, // Changed from gameState.transitionProgress
        playerHealth: player.health,
        playerMaxHealth: player.maxHealth,
        playerLevel: player.level,
        playerXP: player.xp,
        playerXPToNextLevel: player.xpToNextLevel,
        playerInCombat: player.inCombat,
        playerInAttackAnimation: player.inAttackAnimation,
        playerAttackCooldown: player.attackCooldown,
        playerLastAttackTime: player.lastAttackTime ? new Date(player.lastAttackTime).toISOString() : "none",
        pendingTrait: player.pendingTrait,
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isOpen, gameSystemState, player]) // Added gameSystemState to dependency array

  if (!isOpen) {
    return (
      <button
        className="fixed top-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-md z-50 opacity-70 hover:opacity-100"
        onClick={() => setIsOpen(true)}
      >
        Debug
      </button>
    )
  }

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-80 z-50 p-4 max-w-md max-h-screen overflow-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-lg font-bold">Game State Debug</h2>
        <button className="text-white" onClick={() => setIsOpen(false)}>
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {Object.entries(gameStateInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-400">{key}:</span>
            <span className="text-white font-mono">{JSON.stringify(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
