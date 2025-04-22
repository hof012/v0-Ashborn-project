"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import SpriteRenderer from "./SpriteRenderer"
import { getPetById } from "@/lib/assetManager"
import type { Pet } from "@/types/game"

interface GamePreviewProps {
  selectedPet: string | null
  debugMode: boolean
}

export default function GamePreview({ selectedPet, debugMode }: GamePreviewProps) {
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [playerPosition, setPlayerPosition] = useState(20)
  const [simulateNetworkIssue, setSimulateNetworkIssue] = useState(false)

  // Load pet data when selected
  useEffect(() => {
    if (!selectedPet) return

    async function loadPetData() {
      setLoading(true)
      try {
        const petData = await getPetById(selectedPet)
        setPet(petData)
      } catch (err) {
        console.error("Failed to load pet data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPetData()
  }, [selectedPet])

  // Game loop
  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      setGameTime((prev) => prev + 1)
      setPlayerPosition((prev) => Math.min(80, prev + 0.5))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted])

  const startGame = () => {
    setGameStarted(true)
    setGameTime(0)
    setPlayerPosition(20)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameTime(0)
    setPlayerPosition(20)
  }

  if (!selectedPet) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Game Preview</h2>
        <p className="mb-6 text-gray-400">Please select a pet from the Pet Selection tab to continue.</p>
        <Button
          variant="outline"
          onClick={() => document.querySelector('[value="pet-selection"]')?.dispatchEvent(new Event("click"))}
        >
          Go to Pet Selection
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Game Preview</h2>

      {debugMode && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Controls</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" size="sm" onClick={() => setSimulateNetworkIssue(!simulateNetworkIssue)}>
              {simulateNetworkIssue ? "Fix Network" : "Simulate Network Issues"}
            </Button>
          </div>
        </div>
      )}

      <div className="relative h-80 bg-gray-700 rounded-lg overflow-hidden mb-6">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-600"></div>

        {/* Pet sprite */}
        {pet && (
          <div
            className="absolute transition-all duration-1000"
            style={{
              bottom: "20px",
              left: `${playerPosition}%`,
              transform: "translateX(-50%)",
            }}
          >
            <SpriteRenderer
              spriteUrl={simulateNetworkIssue ? `${pet.spriteUrl}_broken` : pet.spriteUrl}
              alt={pet.name}
              width={80}
              height={80}
              showDebugInfo={debugMode}
              animationFrames={4}
              animationSpeed={200}
            />
          </div>
        )}

        {/* Game UI overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          <div className="bg-black/50 px-3 py-1 rounded-full text-sm">Time: {gameTime}s</div>
          <div className="bg-black/50 px-3 py-1 rounded-full text-sm">Pet: {pet?.name}</div>
        </div>

        {/* Game state overlay */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Run?</h3>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Game Controls</h3>
          <div className="flex gap-2">
            <Button onClick={startGame} disabled={gameStarted}>
              Start
            </Button>
            <Button onClick={resetGame} variant="outline">
              Reset
            </Button>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Pet Stats</h3>
          {pet ? (
            <div className="space-y-2">
              <div>
                <span className="text-gray-400">Speed:</span>
                <Slider defaultValue={[pet.stats.speed * 10]} max={100} step={1} className="mt-1" />
              </div>
              <div>
                <span className="text-gray-400">Strength:</span>
                <Slider defaultValue={[pet.stats.strength * 10]} max={100} step={1} className="mt-1" />
              </div>
              <div>
                <span className="text-gray-400">Intelligence:</span>
                <Slider defaultValue={[pet.stats.intelligence * 10]} max={100} step={1} className="mt-1" />
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Loading pet stats...</p>
          )}
        </div>
      </div>
    </div>
  )
}
