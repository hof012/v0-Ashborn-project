"use client"

import { useState, useEffect, useRef } from "react"
import { loadAsset } from "@/lib/assetManager"

interface SpriteRendererProps {
  spriteUrl: string
  alt: string
  width: number
  height: number
  className?: string
  showDebugInfo?: boolean
  animationFrames?: number
  animationSpeed?: number
}

export default function SpriteRenderer({
  spriteUrl,
  alt,
  width,
  height,
  className = "",
  showDebugInfo = false,
  animationFrames = 1,
  animationSpeed = 200,
}: SpriteRendererProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Load the sprite with fallback mechanisms
  useEffect(() => {
    let isMounted = true
    let img: HTMLImageElement | null = null

    async function loadSprite() {
      if (!isMounted) return

      setLoading(true)
      setError(null)

      try {
        // First try to load from the asset manager (which checks Redis, then Supabase, then Blob)
        const assetUrl = await loadAsset(spriteUrl)

        if (!isMounted) return

        // Create a new image element
        img = new Image()
        img.crossOrigin = "anonymous" // Prevent CORS issues

        // Set up event handlers
        img.onload = () => {
          if (!isMounted) return
          setImageSrc(assetUrl)
          setLoading(false)
          imageRef.current = img
          renderToCanvas()
        }

        img.onerror = () => {
          if (!isMounted) return

          // If we've tried less than 3 times, try again with a different source
          if (loadAttempts < 2) {
            setLoadAttempts((prev) => prev + 1)
            // Try fallback URLs
            const fallbackUrls = [
              `/placeholder.svg?height=${height}&width=${width}`,
              `/api/placeholder?name=${encodeURIComponent(alt)}&width=${width}&height=${height}`,
              "/placeholder-pet.png",
            ]
            img!.src = fallbackUrls[loadAttempts]
          } else {
            setError(`Failed to load sprite: ${spriteUrl}`)
            setLoading(false)
            // Use a default placeholder as last resort
            setImageSrc(`/placeholder.svg?height=${height}&width=${width}&text=Error`)
          }
        }

        // Start loading the image
        img.src = assetUrl
      } catch (err) {
        if (!isMounted) return
        console.error("Error loading sprite:", err)
        setError(`Failed to load sprite: ${err instanceof Error ? err.message : String(err)}`)
        setLoading(false)
        // Use a default placeholder
        setImageSrc(`/placeholder.svg?height=${height}&width=${width}&text=Error`)
      }
    }

    loadSprite()

    return () => {
      isMounted = false
      if (img) {
        img.onload = null
        img.onerror = null
      }
    }
  }, [spriteUrl, loadAttempts, height, width, alt])

  // Handle animation frames
  useEffect(() => {
    if (animationFrames <= 1) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % animationFrames)
    }, animationSpeed)

    return () => clearInterval(interval)
  }, [animationFrames, animationSpeed])

  // Render to canvas
  const renderToCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    if (animationFrames <= 1) {
      // Single frame sprite
      ctx.drawImage(imageRef.current, 0, 0, width, height)
    } else {
      // Animated sprite (assuming horizontal sprite sheet)
      const frameWidth = imageRef.current.width / animationFrames
      ctx.drawImage(
        imageRef.current,
        currentFrame * frameWidth,
        0,
        frameWidth,
        imageRef.current.height,
        0,
        0,
        width,
        height,
      )
    }
  }

  // Re-render when frame changes
  useEffect(() => {
    renderToCanvas()
  }, [currentFrame])

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
        </div>
      )}

      <canvas ref={canvasRef} width={width} height={height} className={`rounded-md ${error ? "opacity-50" : ""}`} />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-900/80 text-white p-2 rounded text-xs">Failed to load sprite</div>
        </div>
      )}

      {showDebugInfo && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-1 text-gray-300">
          <div>URL: {spriteUrl.substring(0, 20)}...</div>
          <div>Status: {loading ? "Loading" : error ? "Error" : "Loaded"}</div>
          <div>Attempts: {loadAttempts}</div>
        </div>
      )}
    </div>
  )
}
