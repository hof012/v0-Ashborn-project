"use client"

import type { RandomBonus } from "../game/Player"

interface RandomBonusNotificationProps {
  bonus: RandomBonus
}

export default function RandomBonusNotification({ bonus }: RandomBonusNotificationProps) {
  // Format the bonus text
  const getBonusText = () => {
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

  return (
    <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-purple-900 border-2 border-purple-500 rounded-lg p-3 shadow-lg animate-bounce">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">🎲 Random Bonus!</h3>
          <div className="text-yellow-300 font-bold">{getBonusText()}</div>
        </div>
      </div>
    </div>
  )
}
