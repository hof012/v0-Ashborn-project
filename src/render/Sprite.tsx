"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { getSpriteData, getEmojiFallback, type SpriteSheetData, type EntityType } from "./SpriteMap"

interface SpriteProps {
  type: EntityType
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
}

export default function Sprite({
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
}: SpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [spriteData, setSpriteData] = useState<SpriteSheetData | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const loadAttemptedRef = useRef<boolean>(false)

  // Get the emoji fallback for this sprite
  const emoji = getEmojiFallback(type, state, variant)

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
    state === "attack1" || state === "attack2" || state === "attack3"
      ? "after:content-[''] after:absolute after:inset-0 after:bg-yellow-400 after:opacity-50 after:animate-flash"
      : state === "hit"
        ? "after:content-[''] after:absolute after:inset-0 after:bg-red-500 after:opacity-50 after:animate-flash"
        : ""

  // Load sprite data
  useEffect(() => {
    const loadSprite = () => {
      try {
        loadAttemptedRef.current = true
        const data = getSpriteData(type, state, variant)
        setSpriteData(data)

        // Check if the sprite sheet exists
        if (data) {
          const img = new Image()
          img.crossOrigin = "anonymous" // Add this to avoid CORS issues
          img.src = data.src
          img.onload = () => setUseFallback(false)
          img.onerror = (e) => {
            console.warn(`Failed to load sprite: ${data.src}`, e)
            setUseFallback(true)
          }
        } else {
          console.warn(`No sprite data for ${type}-${state}-${variant}`)
          setUseFallback(true)
        }
      } catch (error) {
        console.error("Error loading sprite:", error)
        setUseFallback(true)
      }
    }

    // Reset animation
    setCurrentFrame(0)
    lastFrameTimeRef.current = 0

    // Load the sprite
    loadSprite()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, state, variant])

  // Handle sprite animation
  useEffect(() => {
    if (!spriteData || useFallback) return

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp
      }

      const elapsed = timestamp - lastFrameTimeRef.current

      if (elapsed >= spriteData.frameDuration) {
        setCurrentFrame((prevFrame) => {
          const nextFrame = prevFrame + 1

          // If we've reached the end of the animation
          if (nextFrame >= spriteData.frameCount) {
            // If the animation should loop, go back to the beginning
            if (spriteData.loop) {
              return 0
            }
            // Otherwise, stay on the last frame and call the completion callback
            else {
              if (onAnimationComplete) {
                onAnimationComplete()
              }
              return prevFrame
            }
          }

          return nextFrame
        })

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
  }, [spriteData, useFallback, onAnimationComplete])

  // If we're using a fallback or don't have sprite data, render the emoji
  if (useFallback || !spriteData) {
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
        {/* Stylized container with pixel art feel */}
        <div
          className="absolute inset-0 rounded-md bg-gray-700 overflow-hidden"
          style={{
            transform: animate === "bob" ? "translateY(2px)" : undefined,
          }}
        >
          {/* Highlight effect */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gray-500 opacity-70 rounded-t-md"></div>

          {/* Shadow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-black opacity-20 rounded-b-md"></div>

          {/* Emoji centered in container */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontSize: `${Math.max(width, height) * scale * 0.6}px`,
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>

          {/* Accent details */}
          <div className="absolute bottom-1 right-1 w-1/4 h-1/4 rounded-full bg-white opacity-70"></div>
        </div>
      </div>
    )
  }

  // Render the sprite sheet
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
        <div
          className="absolute"
          style={{
            width: spriteData.frameWidth * spriteData.frameCount * scale,
            height: spriteData.frameHeight * scale,
            backgroundImage: `url(${spriteData.src})`,
            backgroundSize: `${spriteData.frameWidth * spriteData.frameCount * scale}px ${spriteData.frameHeight * scale}px`,
            backgroundPosition: `-${currentFrame * spriteData.frameWidth * scale}px 0px`,
            imageRendering: "pixelated",
            transform: `scale(${width / spriteData.frameWidth})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  )
}
