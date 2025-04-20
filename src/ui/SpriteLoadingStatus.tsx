"use client"

import { useState, useEffect } from "react"
import { getSpriteLoadingStats, preloadSprite } from "../render/SpriteErrorHandler"

export default function SpriteLoadingStatus() {
  const [status, setStatus] = useState<"loading" | "partial" | "success" | "error">("loading")
  const [message, setMessage] = useState("Checking sprites...")
  const [stats, setStats] = useState({ loaded: 0, failed: 0 })
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Preload critical sprites
    const criticalSprites = [
      "/sprites/player/adventurer-run-00.png",
      "/sprites/player/adventurer-run-01.png",
      "/sprites/player/adventurer-run-02.png",
    ]

    // Try to preload all critical sprites
    Promise.allSettled(criticalSprites.map((src) => preloadSprite(src))).then((results) => {
      const loadedCount = results.filter((r) => r.status === "fulfilled").length
      const failedCount = results.filter((r) => r.status === "rejected").length

      if (failedCount === 0) {
        setStatus("success")
        setMessage("All critical sprites loaded successfully!")
      } else if (loadedCount > 0) {
        setStatus("partial")
        setMessage(`Loaded ${loadedCount}/${criticalSprites.length} sprites. Some sprites failed to load.`)
      } else {
        setStatus("error")
        setMessage("Failed to load any sprites. Using fallback emojis.")
      }

      // Update stats
      setStats(getSpriteLoadingStats())

      // Hide after 5 seconds if successful
      if (failedCount === 0) {
        setTimeout(() => setIsVisible(false), 5000)
      }
    })

    // Update stats periodically
    const interval = setInterval(() => {
      setStats(getSpriteLoadingStats())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "bg-blue-500"
      case "success":
        return "bg-green-500"
      case "partial":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div
      className={`fixed bottom-4 left-4 ${getStatusColor()} text-white px-3 py-2 rounded-md z-50 transition-all duration-300 max-w-xs`}
      style={{ opacity: expanded ? 1 : 0.8 }}
    >
      <div className="flex justify-between items-center">
        <div>{message}</div>
        <button onClick={() => setExpanded(!expanded)} className="ml-2 text-white hover:text-gray-200">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 text-sm border-t border-white/30 pt-2">
          <div className="flex justify-between">
            <span>Loaded sprites:</span>
            <span>{stats.loaded}</span>
          </div>
          <div className="flex justify-between">
            <span>Failed sprites:</span>
            <span>{stats.failed}</span>
          </div>
          <div className="mt-2 text-xs">
            <p>The game will use emoji fallbacks for any sprites that fail to load.</p>
            {status === "error" && <p className="mt-1">Try refreshing the page or check your internet connection.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
