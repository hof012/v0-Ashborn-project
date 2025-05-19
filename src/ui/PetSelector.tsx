"use client"

import { useState } from "react"
import type { PetType } from "../game/Pet"
import type { PetTypeDefinition } from "../game/PetTypes"

interface PetSelectorProps {
  onSelect: (type: PetType) => void
  currentType: PetType
  petDefinition: PetTypeDefinition
  petLevel: number
  petXp: number
  nextLevelXp: number
}

export default function PetSelector({
  onSelect,
  currentType,
  petDefinition,
  petLevel,
  petXp,
  nextLevelXp,
}: PetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const petOptions: { type: PetType; emoji: string; name: string }[] = [
    { type: "paw", emoji: "🐾", name: "Wolf Cub" },
    { type: "star", emoji: "🌟", name: "Star Spirit" },
    { type: "teddy", emoji: "🧸", name: "Teddy Friend" },
    { type: "ghost", emoji: "👻", name: "Ghost Buddy" },
  ]

  if (!petDefinition) {
    console.warn(`PetSelector: petDefinition is undefined for currentType: ${currentType}`)
    return null
  }

  return (
    <div className="fixed top-20 left-2 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 bg-opacity-70 hover:bg-opacity-90 text-white rounded-lg px-2 py-1 text-xs border border-gray-700 shadow-lg font-pixel flex items-center"
      >
        <span className="text-lg mr-1">{petDefinition.emoji}</span>
        <span>Pet</span>
        <span className="ml-1">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-8 left-0 bg-gray-900 bg-opacity-80 rounded-lg p-3 shadow-lg border border-gray-700 w-48 font-pixel">
          <div className="flex items-center mb-2 border-b border-gray-700 pb-1">
            <span className="text-xl mr-2">{petDefinition.emoji}</span>
            <div>
              <h3 className="text-white font-bold text-sm">{petDefinition.name}</h3>
              <p className="text-gray-300 text-xs">{petDefinition.description}</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Level {petLevel}</span>
              <span className="tabular-nums">
                {petXp}/{nextLevelXp} XP
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${(petXp / nextLevelXp) * 100}%` }} />
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-white text-xs font-bold mb-1">Bonuses:</h4>
            <ul className="text-xs text-gray-300">
              {Object.entries(petDefinition.bonus).map(([stat, value]) => (
                <li key={stat} className="flex justify-between">
                  <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                  <span className="text-green-400">+{value * petLevel}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-2">
            <h4 className="text-white text-xs font-bold mb-1">Change Pet:</h4>
            <div className="space-y-1">
              {petOptions.map((pet) => (
                <button
                  key={pet.type}
                  onClick={() => {
                    onSelect(pet.type)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-1 rounded flex items-center text-xs ${
                    currentType === pet.type ? "bg-blue-700" : "hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg mr-2">{pet.emoji}</span>
                  <span className="text-white">{pet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
