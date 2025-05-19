"use client"

import { useState, useEffect } from "react"
import { SPRITE_PATHS } from "../render/SpriteAssets"

export default function SpriteDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [spriteStatus, setSpriteStatus] = useState<Record<string, boolean>>({})
  const [backgroundStatus, setBackgroundStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isOpen) return

    // Check sprite paths
    const checkSprites = async () => {
      const status: Record<string, boolean> = {}

      // Check player sprites
      for (const [state, paths] of Object.entries(SPRITE_PATHS.player)) {
        if (Array.isArray(paths) && paths.length > 0) {
          try {
            const response = await fetch(paths[0], { method: "HEAD" })
            status[`player/${state}`] = response.ok
          } catch (e) {
            status[`player/${state}`] = false
          }
        }
      }

      // Check monster sprites
      for (const monsterType of ["wolf", "goblin", "slime"]) {
        for (const [state, paths] of Object.entries(SPRITE_PATHS[monsterType] || {})) {
          if (Array.isArray(paths) && paths.length > 0) {
            try {
              const response = await fetch(paths[0], { method: "HEAD" })
              status[`${monsterType}/${state}`] = response.ok
            } catch (e) {
              status[`${monsterType}/${state}`] = false
            }
          }
        }
      }

      setSpriteStatus(status)
    }

    // Check background paths
    const checkBackgrounds = async () => {
      const status: Record<string, boolean> = {}

      const backgroundPaths = [
        "/sprites/backgrounds/beach/complete.png",
        "/sprites/backgrounds/beach/sky.png",
        "/sprites/backgrounds/beach/clouds.png",
        "/sprites/backgrounds/beach/ocean.png",
        "/sprites/backgrounds/beach/palm.png",
      ]

      for (const path of backgroundPaths) {
        try {
          const response = await fetch(path, { method: "HEAD" })
          status[path] = response.ok
        } catch (e) {
          status[path] = false
        }
      }

      setBackgroundStatus(status)
    }

    checkSprites()
    checkBackgrounds()
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-md z-50 opacity-70 hover:opacity-100"
        onClick={() => setIsOpen(true)}
      >
        Debug Sprites
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-auto p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Sprite Debug Panel</h2>
          <button className="text-white" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-white text-md font-bold mb-2">Sprite Status</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(spriteStatus).map(([path, exists]) => (
              <div key={path} className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${exists ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="text-white text-sm">{path}</span>
                {!exists && <span className="ml-2 text-red-400 text-xs">Not found</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white text-md font-bold mb-2">Background Status</h3>
          <div className="space-y-1">
            {Object.entries(backgroundStatus).map(([path, exists]) => (
              <div key={path} className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${exists ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="text-white text-sm">{path}</span>
                {!exists && <span className="ml-2 text-red-400 text-xs">Not found</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          <p>
            Sprite files should be placed in the <code>/public/sprites/</code> directory.
          </p>
          <p>
            Background files should be in <code>/public/sprites/backgrounds/</code>.
          </p>
          <p className="mt-2 text-yellow-300">
            If files are missing, try uploading them individually rather than in a zip.
          </p>
        </div>
      </div>
    </div>
  )
}
