"use client"

import { useEffect, useState } from "react"
import { BIOMES } from "../game/BiomeTypes" // Import from the new file

interface BiomeNotificationProps {
  biomeType: string
}

export default function BiomeNotification({ biomeType }: BiomeNotificationProps) {
  const [visible, setVisible] = useState(true)
  const biome = BIOMES.find((b) => b.type === biomeType) || BIOMES[0]

  useEffect(() => {
    // Show notification for 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [biomeType])

  if (!visible) return null

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-black bg-opacity-80 border-2 border-cyan-500 rounded-lg p-4 shadow-lg animate-float font-pixel">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">{biome.name}</h3>
          <div className="text-cyan-300 text-sm">A new area has been discovered!</div>
        </div>
      </div>
    </div>
  )
}
