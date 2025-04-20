"use client"

import type { Trait } from "../game/TraitSystem"

interface TraitNotificationProps {
  trait: Trait
}

export default function TraitNotification({ trait }: TraitNotificationProps) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-indigo-900 border-2 border-indigo-500 rounded-lg p-3 shadow-lg animate-bounce font-pixel">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">
            {trait.level > 1 ? "🔥 Trait Evolved!" : "✨ New Trait Unlocked!"}
          </h3>
          <div className="text-yellow-300 font-bold">{trait.name}</div>
          <div className="text-gray-300 text-sm">{trait.description}</div>
        </div>
      </div>
    </div>
  )
}
