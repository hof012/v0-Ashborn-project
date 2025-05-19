"use client"

import { useEffect, useState } from "react"
import { preloadSprites } from "../render/SpriteMap"

export default function SpritePreloader() {
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadSprites = async () => {
      try {
        // Start loading progress animation
        let currentProgress = 0
        const progressInterval = setInterval(() => {
          if (isMounted) {
            currentProgress += 5
            setProgress(Math.min(currentProgress, 95)) // Cap at 95% until actually loaded
          }
        }, 100)

        // Actually preload sprites
        const success = await preloadSprites()

        // Clear interval and set to 100% when done
        clearInterval(progressInterval)

        if (isMounted) {
          setProgress(100)
          setLoaded(true)

          // Log success for debugging
          console.log("Sprite preloading complete:", success ? "success" : "some sprites failed")
        }
      } catch (error) {
        console.error("Error in sprite preloader:", error)
        if (isMounted) {
          setLoaded(true) // Continue anyway
          setProgress(100)
        }
      }
    }

    loadSprites()

    return () => {
      isMounted = false
    }
  }, [])

  // Don't render anything once loaded
  if (loaded) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="text-white text-2xl mb-4">Loading Game Assets...</div>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-gray-400 mt-2">{progress}%</div>
    </div>
  )
}
