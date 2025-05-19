"use client"

import type { BaseStats } from "../game/Stats"

interface StatsDisplayProps {
  stats: {
    current: BaseStats
    descriptions: Record<keyof BaseStats, string>
  }
  unlockedAbilities: string[]
}

export default function StatsDisplay({ stats, unlockedAbilities }: StatsDisplayProps) {
  const { current, descriptions } = stats

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <span className="mr-2">🧬</span> Stats
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">STR: {current.strength}</span>
          <span className="text-gray-300 text-sm">{descriptions.strength}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">DEX: {current.dexterity}</span>
          <span className="text-gray-300 text-sm">{descriptions.dexterity}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">INT: {current.intelligence}</span>
          <span className="text-gray-300 text-sm">{descriptions.intelligence}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">LUK: {current.luck}</span>
          <span className="text-gray-300 text-sm">{descriptions.luck}</span>
        </div>
      </div>

      {unlockedAbilities.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-1 flex items-center">
            <span className="mr-2">✨</span> Special Abilities
          </h3>
          <ul className="space-y-1">
            {unlockedAbilities.includes("mightyBlow") && <li className="text-red-300">💪 Mighty Blow</li>}
            {unlockedAbilities.includes("swiftStrike") && <li className="text-green-300">⚡ Swift Strike</li>}
            {unlockedAbilities.includes("arcaneInsight") && <li className="text-blue-300">🧠 Arcane Insight</li>}
            {unlockedAbilities.includes("fortunesFavor") && <li className="text-yellow-300">🍀 Fortune's Favor</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
