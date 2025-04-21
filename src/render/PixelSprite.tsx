"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { getPlayerSprite } from "./PlayerSprites"
import { getSlimeSprite } from "./SlimeSprites"
import {
  getFallbackEmoji,
  hasSpriteFailed,
  markSpriteFailed,
  markSpriteLoaded,
  preloadSprite,
} from "./SpriteErrorHandler"

interface PixelSpriteProps {
  type: string
  state?: string
  variant?: string
  alt?: string
  width?: number
  height?: number
  scale?: number
  className?: string
  style?: React.CSSProperties
  animate?: "bob" | "pulse" | "shake" | "none"
  flipX?: boolean
  tier?: number
  onAnimationComplete?: () => void
  frameRate?: number
}

export default function PixelSprite({
  type = "player",
  state = "idle",
  variant = "normal",
  alt = "",
  width = 32,
  height = 32,
  scale = 1,
  className = "",
  style = {},
  animate = "none",
  flipX = false,
  tier = 0,
  onAnimationComplete,
  frameRate = 8,
}: PixelSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(true) // Default to fallback until image loads
  const [imageError, setImageError] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const loadAttemptedRef = useRef(false)

  // Get color theme for this entity type based on tier
  const tierClass =
    tier === 2
      ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50"
      : tier === 1
        ? "ring-1 ring-yellow-300 shadow-md shadow-yellow-300/30"
        : ""

  // Animation classes based on the animate prop
  const animationClass =
    animate === "bob"
      ? "animate-bob"
      : animate === "pulse"
        ? "animate-pulse"
        : animate === "shake"
          ? "animate-shake"
          : ""

  // Special effects based on state
  const stateEffects =
    state === "attack1" || state === "attack2" || state === "attack3" || state === "attack"
      ? "after:content-[''] after:absolute after:inset-0 after:bg-yellow-400 after:opacity-50 after:animate-flash"
      : state === "hit"
        ? "after:content-[''] after:absolute after:inset-0 after:bg-red-500 after:opacity-50 after:animate-flash"
        : ""

  // Load sprite based on type
  useEffect(() => {
    let spriteSrc: string | null = null
    loadAttemptedRef.current = false
    setImageLoaded(false)
    setUseFallback(true)
    setImageError(false)

    if (type === "player") {
      // Use our player sprite mapping
      spriteSrc = getPlayerSprite(state, currentFrame)
    } else if (type === "slime") {
      // Use our slime sprite mapping
      spriteSrc = getSlimeSprite(state, currentFrame)
    } else if (type === "wolf" || type === "goblin") {
      // For other monster types, use slime sprites as fallback for now
      spriteSrc = getSlimeSprite("idle", currentFrame)
    } else {
      // For other entity types, use appropriate fallbacks
      spriteSrc = null
    }

    if (spriteSrc) {
      // Check if this sprite has already failed to load
      if (hasSpriteFailed(spriteSrc)) {
        console.log(`Using fallback for previously failed sprite: ${spriteSrc}`)
        setImageError(true)
        setUseFallback(true)
        return
      }

      setCurrentImageSrc(spriteSrc)
      loadAttemptedRef.current = true

      // Attempt to preload the sprite
      preloadSprite(spriteSrc)
        .then(() => {
          console.log(`Successfully loaded sprite: ${spriteSrc}`)
          setImageLoaded(true)
          setUseFallback(false)
          setImageError(false)
        })
        .catch((error) => {
          console.warn(`Failed to load sprite: ${spriteSrc}`, error)
          setImageError(true)
          setUseFallback(true)
        })
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, state, variant, currentFrame])

  // Handle sprite animation
  useEffect(() => {
    if (useFallback || !currentImageSrc || !imageLoaded) return

    const frameInterval = 1000 / frameRate

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp
      }

      const elapsed = timestamp - lastFrameTimeRef.current

      if (elapsed >= frameInterval) {
        setCurrentFrame((prevFrame) => prevFrame + 1)
        lastFrameTimeRef.current = timestamp
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [useFallback, currentImageSrc, imageLoaded, frameRate])

  // If we're using a fallback or don't have sprite data, render the emoji
  if (useFallback || !currentImageSrc || !imageLoaded || imageError) {
    return (
      <div
        className={`relative inline-block ${animationClass} ${className} ${stateEffects} ${tierClass}`}
        style={{
          width: width * scale,
          height: height * scale,
          transform: flipX ? "scaleX(-1)" : undefined,
          ...style,
        }}
        role="img"
        aria-label={alt || type}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{
              fontSize: `${Math.max(width, height) * scale * 0.6}px`,
              lineHeight: 1,
            }}
          >
            {getFallbackEmoji(type, state)}
          </span>
        </div>

        {/* Show a small indicator that we're using a fallback */}
        {imageError && loadAttemptedRef.current && (
          <div
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
            title="Sprite failed to load, using fallback"
          ></div>
        )}
      </div>
    )
  }

  // Render the sprite image
  return (
    <div
      className={`relative inline-block ${animationClass} ${className} ${stateEffects} ${tierClass}`}
      style={{
        width: width * scale,
        height: height * scale,
        transform: flipX ? "scaleX(-1)" : undefined,
        ...style,
      }}
      role="img"
      aria-label={alt || type}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: animate === "bob" ? "translateY(2px)" : undefined,
        }}
      >
        {currentImageSrc && (
          <img
            src={currentImageSrc || "/placeholder.svg"}
            alt={alt || type}
            className="w-full h-full object-contain pixel-art"
            style={{
              imageRendering: "pixelated",
            }}
            crossOrigin="anonymous" // Make sure this is set to "anonymous"
            onLoad={() => {
              markSpriteLoaded(currentImageSrc)
              setImageLoaded(true)
              setUseFallback(false)
              setImageError(false)
            }}
            onError={() => {
              console.warn(`Failed to load sprite: ${currentImageSrc}, using fallback emoji`)
              markSpriteFailed(currentImageSrc)
              setImageError(true)
              setUseFallback(true)
            }}
          />
        )}
      </div>
    </div>
  )
}
