"use client"

import { useState, useEffect } from "react"

interface GameStateDebugProps {
  gameState: any
  player: any
}

export default function GameStateDebug({ gameState, player }: GameStateDebugProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [gameStateInfo, setGameStateInfo] = useState<any>({})

  useEffect(() => {
    if (!isOpen) return

    // Update game state info every 100ms
    const interval = setInterval(() => {
      setGameStateInfo({
        gameState: gameState.current,
        previousState: gameState.getPreviousState?.() || "unknown",
        isTransitioning: gameState.isTransitioning,
        transitionProgress: gameState.transitionProgress,
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
  }, [isOpen, gameState, player])

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
