"use client"

import type { BaseStats } from "../game/Stats"
import type { PetTypeDefinition } from "../game/PetTypes"

interface StatsPanelProps {
  stats: {
    current: BaseStats
    descriptions: Record<keyof BaseStats, string>
  }
  unlockedAbilities: string[]
  petDefinition?: PetTypeDefinition
  petLevel?: number
}

export default function StatsPanel({ stats, unlockedAbilities, petDefinition, petLevel = 1 }: StatsPanelProps) {
  const { current, descriptions } = stats

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 text-white border border-gray-700 shadow-lg font-pixel w-64">
      <h2 className="text-sm font-bold mb-3 flex items-center border-b border-gray-700 pb-2">
        <span className="mr-2">🧬</span> Character Stats
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-red-900 rounded-md mr-2">
              <span>S</span>
            </div>
            <span className="font-medium">{current.strength}</span>
          </div>
          <span className="text-gray-300 text-xs">{descriptions.strength}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-green-900 rounded-md mr-2">
              <span>D</span>
            </div>
            <span className="font-medium">{current.dexterity}</span>
          </div>
          <span className="text-gray-300 text-xs">{descriptions.dexterity}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-900 rounded-md mr-2">
              <span>I</span>
            </div>
            <span className="font-medium">{current.intelligence}</span>
          </div>
          <span className="text-gray-300 text-xs">{descriptions.intelligence}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-yellow-900 rounded-md mr-2">
              <span>L</span>
            </div>
            <span className="font-medium">{current.luck}</span>
          </div>
          <span className="text-gray-300 text-xs">{descriptions.luck}</span>
        </div>
      </div>

      {/* Pet Info */}
      {petDefinition && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <h3 className="text-sm font-bold mb-2 flex items-center">
            <span className="mr-2">{petDefinition.emoji}</span> {petDefinition.name} (Lv.{petLevel})
          </h3>
          <p className="text-xs text-gray-300 mb-2">{petDefinition.description}</p>

          <div className="text-xs bg-gray-800 p-2 rounded-md">
            <div className="font-medium mb-1 text-yellow-300">Bonuses:</div>
            {Object.entries(petDefinition.bonus).map(([stat, value]) => (
              <div key={stat} className="flex justify-between">
                <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <span className="text-green-300">+{value * petLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abilities */}
      {unlockedAbilities.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <h3 className="text-sm font-bold mb-2 flex items-center">
            <span className="mr-2">✨</span> Special Abilities
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {unlockedAbilities.includes("mightyBlow") && (
              <div className="bg-red-900 bg-opacity-50 p-2 rounded-md text-xs">
                <div className="text-red-300 font-bold">💪 Mighty Blow</div>
                <div className="text-gray-300 text-xs">+20% crit damage</div>
              </div>
            )}
            {unlockedAbilities.includes("swiftStrike") && (
              <div className="bg-green-900 bg-opacity-50 p-2 rounded-md text-xs">
                <div className="text-green-300 font-bold">⚡ Swift Strike</div>
                <div className="text-gray-300 text-xs">+10% attack speed</div>
              </div>
            )}
            {unlockedAbilities.includes("arcaneInsight") && (
              <div className="bg-blue-900 bg-opacity-50 p-2 rounded-md text-xs">
                <div className="text-blue-300 font-bold">🧠 Arcane Insight</div>
                <div className="text-gray-300 text-xs">+15% XP gain</div>
              </div>
            )}
            {unlockedAbilities.includes("fortunesFavor") && (
              <div className="bg-yellow-900 bg-opacity-50 p-2 rounded-md text-xs">
                <div className="text-yellow-300 font-bold">🍀 Fortune's Favor</div>
                <div className="text-gray-300 text-xs">+20% essence drops</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
