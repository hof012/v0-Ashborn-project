"use client"

import { useRef, useEffect, useState } from "react"

interface ParallaxBackgroundProps {
  biome: string
  playerPosition: number
  inCombat: boolean
}

export default function ParallaxBackground({ biome, playerPosition, inCombat }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })
  const [waveOffset, setWaveOffset] = useState(0)

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Simulate wave animation for beach biome
  useEffect(() => {
    if (biome === "beach") {
      const waveInterval = setInterval(() => {
        setWaveOffset((prev) => (prev + 1) % 100)
      }, 150)

      return () => clearInterval(waveInterval)
    }
  }, [biome])

  // Get background layers based on biome
  const getBackgroundLayers = () => {
    switch (biome) {
      case "beach":
        return {
          sky: "/sprites/backgrounds/beach/sky.png",
          clouds: "/sprites/backgrounds/beach/clouds.png",
          ocean: "/sprites/backgrounds/beach/ocean.png",
          palm: "/sprites/backgrounds/beach/palm.png",
          ground: "/sprites/backgrounds/beach/complete.png",
        }
      case "forest":
      default:
        return {
          sky: "/sprites/backgrounds/forest/sky.png",
          mountains: "/sprites/backgrounds/forest/mountains.png",
          trees: "/sprites/backgrounds/forest/trees.png",
          ground: "/sprites/backgrounds/forest/ground.png",
        }
    }
  }

  const layers = getBackgroundLayers()

  // Fallback to a solid color background if images aren't available
  const fallbackBackground = biome === "beach" ? "#87CEEB" : "#3a5c38"

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden -z-10">
      {/* Fallback solid background */}
      <div className="absolute inset-0" style={{ backgroundColor: fallbackBackground }} />

      {/* Sky Layer */}
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${layers.sky})`,
          backgroundSize: "cover",
          backgroundPosition: `${inCombat ? 0 : -playerPosition * 0.1}px center`,
          backgroundRepeat: "repeat-x",
          imageRendering: "pixelated",
          transition: inCombat ? "background-position 0.5s ease-out" : "none",
        }}
      />

      {/* Far Background Layer (Clouds or Mountains) */}
      {(layers.clouds || layers.mountains) && (
        <div
          className="absolute inset-0 top-auto h-2/3"
          style={{
            backgroundImage: `url(${layers.clouds || layers.mountains})`,
            backgroundSize: "cover",
            backgroundPosition: `${inCombat ? 0 : -playerPosition * 0.3}px bottom`,
            backgroundRepeat: "repeat-x",
            opacity: 0.8,
            imageRendering: "pixelated",
            transition: inCombat ? "background-position 0.5s ease-out" : "none",
          }}
        />
      )}

      {/* Mid Background Layer (Trees, Ocean, etc.) */}
      {(layers.trees || layers.ocean) && (
        <div
          className="absolute inset-0 top-auto h-1/2"
          style={{
            backgroundImage: `url(${layers.trees || layers.ocean})`,
            backgroundSize: "cover",
            backgroundPosition: `${inCombat ? 0 : -playerPosition * 0.5}px bottom`,
            backgroundRepeat: "repeat-x",
            opacity: 0.9,
            imageRendering: "pixelated",
            transition: inCombat ? "background-position 0.5s ease-out" : "none",
            ...(biome === "beach"
              ? {
                  transform: `translateY(${Math.sin(waveOffset * 0.1) * 3}px)`,
                }
              : {}),
          }}
        />
      )}

      {/* Foreground Layer (Palm trees, etc.) */}
      {layers.palm && (
        <div
          className="absolute inset-0 top-auto h-2/3"
          style={{
            backgroundImage: `url(${layers.palm})`,
            backgroundSize: "cover",
            backgroundPosition: `${inCombat ? 0 : -playerPosition * 0.7}px bottom`,
            backgroundRepeat: "repeat-x",
            opacity: 1,
            imageRendering: "pixelated",
            transition: inCombat ? "background-position 0.5s ease-out" : "none",
            zIndex: 5,
          }}
        />
      )}

      {/* Ground Layer */}
      <div
        className="absolute inset-0 top-auto h-1/4"
        style={{
          backgroundImage: `url(${layers.ground})`,
          backgroundSize: "cover",
          backgroundPosition: `${inCombat ? 0 : -playerPosition * 0.7}px bottom`,
          backgroundRepeat: "repeat-x",
          imageRendering: "pixelated",
          transition: inCombat ? "background-position 0.5s ease-out" : "none",
        }}
      />

      {/* Add CSS animations to the global stylesheet */}
      <style jsx global>{`
        @keyframes waveMotion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
