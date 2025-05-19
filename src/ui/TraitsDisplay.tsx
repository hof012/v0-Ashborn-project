"use client"

import type { Trait } from "../game/TraitSystem"

interface TraitsDisplayProps {
  unlockedTraits: Trait[]
  monsterKills: Record<string, number>
  traitProgress: Record<string, { kills: number; nextUnlock: number | null }>
}

export default function TraitsDisplay({ unlockedTraits, monsterKills, traitProgress }: TraitsDisplayProps) {
  if (unlockedTraits.length === 0) {
    return (
      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <span className="mr-2">🧠</span> Traits
        </h2>
        <p className="text-gray-400 text-sm italic">Defeat monsters to unlock traits</p>

        <div className="mt-3 text-xs text-gray-400">
          {Object.entries(traitProgress).map(([monsterType, progress]) => (
            <div key={monsterType} className="flex justify-between">
              <span>{monsterType.charAt(0).toUpperCase() + monsterType.slice(1)}s killed:</span>
              <span>
                {progress.kills}/{progress.nextUnlock || 10}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <span className="mr-2">🧠</span> Traits
      </h2>
      <div className="space-y-3">
        {unlockedTraits.map((trait) => (
          <div key={trait.id} className="border border-gray-700 rounded p-2">
            <div className="font-bold text-yellow-300">{trait.name}</div>
            <div className="text-sm text-gray-300">{trait.description}</div>
            <div className="mt-1 text-xs text-gray-400">
              {trait.monsterType} kills: {monsterKills[trait.monsterType] || 0}
              {/* Show progress to next level if available */}
              {traitProgress[trait.monsterType]?.nextUnlock && (
                <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full"
                    style={{
                      width: `${Math.min(100, (monsterKills[trait.monsterType] / traitProgress[trait.monsterType].nextUnlock!) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {Object.entries(traitProgress).map(([monsterType, progress]) => (
          <div key={monsterType} className="flex justify-between">
            <span>{monsterType.charAt(0).toUpperCase() + monsterType.slice(1)}s killed:</span>
            <span>
              {progress.kills}
              {progress.nextUnlock && <span>/{progress.nextUnlock}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
