"use client"

import { useState, useEffect } from "react"
import { SPRITE_PATHS } from "../render/SpriteAssets"

export default function SpriteDebug() {
  const [showDebug, setShowDebug] = useState(false)
  const [loadedSprites, setLoadedSprites] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!showDebug) return

    // Check if sprites exist
    const checkSprites = async () => {
      const results: Record<string, boolean> = {}

      for (const [entityType, states] of Object.entries(SPRITE_PATHS)) {
        for (const [state, paths] of Object.entries(states)) {
          if (Array.isArray(paths) && paths.length > 0) {
            const path = paths[0]
            try {
              const response = await fetch(path, { method: "HEAD" })
              results[`${entityType}/${state}`] = response.ok
            } catch (error) {
              results[`${entityType}/${state}`] = false
            }
          }
        }
      }

      setLoadedSprites(results)
    }

    checkSprites()
  }, [showDebug])

  if (!showDebug) {
    return (
      <button
        className="fixed bottom-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded z-50 opacity-50 hover:opacity-100"
        onClick={() => setShowDebug(true)}
      >
        Debug Sprites
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Sprite Debug</h2>
          <button className="text-white" onClick={() => setShowDebug(false)}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(loadedSprites).map(([key, loaded]) => (
            <div key={key} className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${loaded ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="text-white">{key}</span>
              {!loaded && <span className="ml-2 text-red-400 text-xs">Not found - check path in public folder</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          <p>
            Sprites should be placed in the <code>/public/sprites/</code> folder with the correct paths as defined in
            SpriteAssets.ts
          </p>
        </div>
      </div>
    </div>
  )
}
