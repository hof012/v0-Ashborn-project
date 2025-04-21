"use client"

import { useState, useEffect } from "react"
import Sprite from "./Sprite"
import { getAsset } from "./SpriteAssets"

interface PetEvolutionProps {
  petType: string
  oldLevel: number
  newLevel: number
  onComplete: () => void
}

export default function PetEvolution({ petType, oldLevel, newLevel, onComplete }: PetEvolutionProps) {
  const [stage, setStage] = useState(0)
  const [opacity, setOpacity] = useState(1)

  // Evolution only happens at level 3
  const isEvolving = oldLevel < 3 && newLevel >= 3

  useEffect(() => {
    if (!isEvolving) {
      onComplete()
      return
    }

    // Animation sequence
    const sequence = async () => {
      // Stage 0: Show pre-evolution form
      await new Promise((r) => setTimeout(r, 1000))

      // Stage 1: Fade out
      setOpacity(0)
      await new Promise((r) => setTimeout(r, 500))

      // Stage 2: Switch to evolved form
      setStage(1)
      await new Promise((r) => setTimeout(r, 100))

      // Stage 3: Fade in evolved form
      setOpacity(1)
      await new Promise((r) => setTimeout(r, 500))

      // Stage 4: Show particles and effects
      setStage(2)
      await new Promise((r) => setTimeout(r, 2000))

      // Complete
      onComplete()
    }

    sequence()
  }, [isEvolving, oldLevel, newLevel, onComplete])

  if (!isEvolving) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {stage < 2 ? "Your pet is evolving!" : "Evolution complete!"}
        </h2>

        <div className="relative w-48 h-48 mx-auto">
          {/* Pet sprite */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{ opacity }}
          >
            <Sprite
              src={getAsset("pets", petType, stage >= 1 ? "evolved" : "normal")}
              alt="Pet"
              width={96}
              height={96}
              scale={2}
              animate={stage === 2 ? "bob" : "none"}
            />
          </div>

          {/* Evolution particles */}
          {stage === 2 && (
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random() * 1}s`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-yellow-300 text-xl font-bold">
          {stage < 2 ? "..." : `Your ${petType.charAt(0).toUpperCase() + petType.slice(1)} has evolved!`}
        </div>
      </div>
    </div>
  )
}
