"use client"

import type { Trait } from "../game/TraitSystem"

interface TraitsListProps {
  traits: Trait[]
}

export default function TraitsList({ traits }: TraitsListProps) {
  if (traits.length === 0) {
    return (
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 text-white border border-gray-700 shadow-lg font-pixel w-64">
        <h2 className="text-sm font-bold mb-2 flex items-center border-b border-gray-700 pb-2">
          <span className="mr-2">✨</span> Traits
        </h2>
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-xs text-gray-400 italic">Defeat monsters to unlock traits</p>
          <div className="mt-2 text-yellow-300 text-xs">
            <span className="animate-pulse">⚔️ Keep fighting!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 text-white border border-gray-700 shadow-lg font-pixel w-64">
      <h2 className="text-sm font-bold mb-3 flex items-center border-b border-gray-700 pb-2">
        <span className="mr-2">✨</span> Traits
      </h2>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {traits.map((trait) => (
          <div
            key={trait.id}
            className="border border-gray-700 rounded-md p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition-colors"
          >
            <div className="font-bold text-yellow-300 text-xs flex items-center">
              {trait.level > 1 && (
                <div className="bg-yellow-600 text-black rounded-full w-5 h-5 flex items-center justify-center mr-1 text-[10px]">
                  {trait.level}
                </div>
              )}
              {trait.name}
            </div>
            <div className="text-xs text-gray-300 mt-1">{trait.description}</div>
            <div className="mt-2 text-[10px] text-gray-400">
              {trait.monsterType.charAt(0).toUpperCase() + trait.monsterType.slice(1)} trait
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
