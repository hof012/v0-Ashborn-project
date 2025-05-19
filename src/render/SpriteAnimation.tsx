"use client"

import type React from "react"

interface SpriteAnimationProps {
  emoji: string
  frameRate?: number // Frames per second
  width: number
  height: number
  scale?: number
  playing?: boolean
  loop?: boolean
  flipX?: boolean
  className?: string
  style?: React.CSSProperties
  onComplete?: () => void
}

export default function SpriteAnimation({
  emoji,
  frameRate = 10,
  width,
  height,
  scale = 1,
  playing = true,
  loop = true,
  flipX = false,
  className = "",
  style = {},
  onComplete,
}: SpriteAnimationProps) {
  // For now, we'll just use the emoji directly
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: width * scale,
        height: height * scale,
        transform: flipX ? "scaleX(-1)" : undefined,
        fontSize: `${Math.max(width, height) * scale * 0.75}px`,
        lineHeight: 1,
        ...style,
      }}
    >
      {emoji}
    </div>
  )
}
