"use client"

import { useEffect, useState } from "react"
import { preloadSprite } from "../render/SpriteErrorHandler"
import { getAllPlayerSprites } from "../render/PlayerSprites"

// List of critical sprites that should be preloaded
const CRITICAL_SPRITES = [
  // First frame of each player animation
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-idle-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-run-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack1-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack2-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack3-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-hurt-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-die-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-jump-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-fall-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-cast-00.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-bow-00.png",

  // First frame of each slime animation
  "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-0.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-0.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-0.png",
  "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-0.png",
]

export default function SpritePreloader() {
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(CRITICAL_SPRITES.length)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let loadedCount = 0

    // Preload all critical sprites
    CRITICAL_SPRITES.forEach((src) => {
      preloadSprite(src)
        .then(() => {
          if (!mounted) return
          loadedCount++
          setLoaded(loadedCount)

          if (loadedCount === total) {
            setIsLoading(false)
          }
        })
        .catch((error) => {
          if (!mounted) return
          console.warn(`Failed to preload sprite: ${src}`, error)
          loadedCount++
          setLoaded(loadedCount)

          if (loadedCount === total) {
            setIsLoading(false)
          }
        })
    })

    // Preload the rest of the player sprites in the background
    const allPlayerSprites = getAllPlayerSprites()
    allPlayerSprites.forEach((src) => {
      if (!CRITICAL_SPRITES.includes(src)) {
        preloadSprite(src).catch((error) => {
          console.warn(`Failed to preload player sprite: ${src}`, error)
        })
      }
    })

    return () => {
      mounted = false
    }
  }, [total])

  // Don't render anything visible, this is just for preloading
  return null
}
