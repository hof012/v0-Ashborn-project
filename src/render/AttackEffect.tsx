"use client"

import { useEffect, useState } from "react"

interface AttackEffectProps {
  x: number
  y: number
  direction: "left" | "right"
  type?: "slash" | "impact" | "critical"
  onComplete?: () => void
}

export default function AttackEffect({ x, y, direction, type = "slash", onComplete }: AttackEffectProps) {
  const [frame, setFrame] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Effect frames
  const frames = {
    slash: ["/effects/slash-1.png", "/effects/slash-2.png", "/effects/slash-3.png", "/effects/slash-4.png"],
    impact: ["/effects/impact-1.png", "/effects/impact-2.png", "/effects/impact-3.png"],
    critical: [
      "/effects/critical-1.png",
      "/effects/critical-2.png",
      "/effects/critical-3.png",
      "/effects/critical-4.png",
    ],
  }

  // Use emoji fallbacks if images aren't available
  const fallbacks = {
    slash: ["⚔️", "🗡️", "⚔️", "🗡️"],
    impact: ["💥", "💢", "💥"],
    critical: ["✨", "⚡", "✨", "⚡"],
  }

  useEffect(() => {
    // Animate through frames
    const totalFrames = frames[type].length
    let currentFrame = 0

    const interval = setInterval(() => {
      currentFrame++
      setFrame(currentFrame)

      if (currentFrame >= totalFrames) {
        clearInterval(interval)
        setIsVisible(false)
        if (onComplete) onComplete()
      }
    }, 100) // 100ms per frame

    return () => clearInterval(interval)
  }, [type, onComplete])

  if (!isVisible) return null

  // Use fallback emoji if needed
  const currentFrame = frame < fallbacks[type].length ? frame : 0

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: x,
        top: y,
        transform: `translateX(-50%) ${direction === "left" ? "scaleX(-1)" : ""}`,
      }}
    >
      {/* Try to load image first */}
      <img
        src={frames[type][currentFrame] || "/placeholder.svg"}
        alt={`${type} effect`}
        className="w-16 h-16 object-contain"
        style={{ imageRendering: "pixelated" }}
        onError={(e) => {
          // If image fails to load, hide it and show fallback
          e.currentTarget.style.display = "none"
          e.currentTarget.nextElementSibling!.style.display = "block"
        }}
      />

      {/* Fallback emoji */}
      <div
        className="text-4xl hidden"
        style={{
          filter: type === "critical" ? "drop-shadow(0 0 5px gold)" : "drop-shadow(0 0 3px white)",
        }}
      >
        {fallbacks[type][currentFrame]}
      </div>
    </div>
  )
}
