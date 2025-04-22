"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import SpriteRenderer from "./SpriteRenderer"
import { getPets } from "@/lib/assetManager"
import type { Pet } from "@/types/game"

interface PetSelectionProps {
  onSelectPet: (petId: string) => void
  selectedPet: string | null
  debugMode: boolean
}

export default function PetSelection({ onSelectPet, selectedPet, debugMode }: PetSelectionProps) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forceError, setForceError] = useState(false)

  useEffect(() => {
    async function loadPets() {
      try {
        setLoading(true)
        const petsData = await getPets()
        setPets(petsData)
        setError(null)
      } catch (err) {
        console.error("Failed to load pets:", err)
        setError("Failed to load pets. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadPets()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <Skeleton className="h-40 w-40 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-700">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Pets</h3>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Select Your Pet Companion</h2>

      {debugMode && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Controls</h3>
          <Button variant="destructive" size="sm" onClick={() => setForceError(!forceError)} className="mr-2">
            {forceError ? "Fix Sprite URLs" : "Simulate Broken Sprites"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pets.map((pet) => {
          // In debug mode with force error, we'll intentionally break the sprite URL
          const spriteUrl = forceError ? `${pet.spriteUrl.split(".")[0]}_broken.png` : pet.spriteUrl

          return (
            <Card
              key={pet.id}
              className={`bg-gray-700 cursor-pointer transition-all hover:scale-105 ${
                selectedPet === pet.id ? "ring-2 ring-amber-400" : ""
              }`}
              onClick={() => onSelectPet(pet.id)}
            >
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-40 h-40 mb-4 relative">
                  <SpriteRenderer
                    spriteUrl={spriteUrl}
                    alt={pet.name}
                    width={160}
                    height={160}
                    showDebugInfo={debugMode}
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{pet.name}</h3>
                <p className="text-sm text-gray-300">{pet.description}</p>
                <div className="mt-3 flex gap-2">
                  {pet.traits.map((trait) => (
                    <span key={trait} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
