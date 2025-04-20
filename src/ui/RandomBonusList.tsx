"use client"

import type { RandomBonus } from "../game/Player"

interface RandomBonusListProps {
  bonuses: RandomBonus[]
}

export default function RandomBonusList({ bonuses }: RandomBonusListProps) {
  if (bonuses.length === 0) {
    return (
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 text-white border border-gray-700 shadow-lg font-pixel w-64">
        <h2 className="text-sm font-bold mb-2 flex items-center border-b border-gray-700 pb-2">
          <span className="mr-2">🎲</span> Random Bonuses
        </h2>
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-xs text-gray-400 italic">Level up to earn random bonuses</p>
          <div className="mt-2 text-purple-300 text-xs">
            <span className="animate-pulse">🎲 Luck awaits!</span>
          </div>
        </div>
      </div>
    )
  }

  // Format bonus text
  const formatBonus = (bonus: RandomBonus): string => {
    if (bonus.type === "stat") {
      return `+${bonus.value} ${bonus.stat?.toUpperCase()}`
    } else if (bonus.type === "percentage") {
      // Format percentage bonuses
      switch (bonus.percentageType) {
        case "attackSpeed":
          return `+${Math.round((bonus.value - 1) * 100)}% Attack Speed`
        case "critChance":
          return `+${Math.round(bonus.value * 100)}% Crit Chance`
        case "dodgeChance":
          return `+${Math.round(bonus.value * 100)}% Dodge Chance`
        case "xpGain":
          return `+${Math.round((bonus.value - 1) * 100)}% XP Gain`
        case "essenceFind":
          return `+${Math.round((bonus.value - 1) * 100)}% Essence Find`
        case "damageBonus":
          return `+${Math.round((bonus.value - 1) * 100)}% Damage`
        default:
          return `+${Math.round((bonus.value - 1) * 100)}% Bonus`
      }
    }
    return "Unknown Bonus"
  }

  // Get bonus color based on type
  const getBonusColor = (bonus: RandomBonus): string => {
    if (bonus.type === "stat") {
      switch (bonus.stat) {
        case "strength":
          return "text-red-300"
        case "dexterity":
          return "text-green-300"
        case "intelligence":
          return "text-blue-300"
        case "luck":
          return "text-yellow-300"
        default:
          return "text-white"
      }
    } else {
      return "text-purple-300"
    }
  }

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 text-white border border-gray-700 shadow-lg font-pixel w-64">
      <h2 className="text-sm font-bold mb-3 flex items-center border-b border-gray-700 pb-2">
        <span className="mr-2">🎲</span> Random Bonuses
      </h2>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {bonuses.map((bonus, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-md p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="bg-purple-900 text-white rounded-md px-2 py-1 text-[10px]">Level {bonus.level}</div>
              <div className={`${getBonusColor(bonus)} font-bold text-xs`}>{formatBonus(bonus)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
