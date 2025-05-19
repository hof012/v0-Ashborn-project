"use client"

import { useRef, useEffect } from "react"

interface BackgroundProps {
  scrollSpeed: number
}

export default function Background({ scrollSpeed }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgPositionRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create a simple pattern for the background
    const drawBackground = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87CEEB") // Sky blue
      gradient.addColorStop(1, "#E0F7FA") // Light cyan
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Ground
      const groundHeight = canvas.height * 0.15
      ctx.fillStyle = "#3a5c38" // Dark green for ground
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

      // Far mountains (slowest parallax)
      ctx.fillStyle = "#5d7b6d" // Grayish green for distant mountains
      for (let i = 0; i < canvas.width + 200; i += 200) {
        const x = ((i + bgPositionRef.current * 0.2) % (canvas.width + 200)) - 200
        ctx.beginPath()
        ctx.moveTo(x, canvas.height - groundHeight)
        ctx.lineTo(x + 100, canvas.height - groundHeight - 100)
        ctx.lineTo(x + 200, canvas.height - groundHeight)
        ctx.fill()
      }

      // Mid mountains (medium parallax)
      ctx.fillStyle = "#4a6c4a" // Medium green for mid mountains
      for (let i = 0; i < canvas.width + 150; i += 150) {
        const x = ((i + bgPositionRef.current * 0.5) % (canvas.width + 150)) - 150
        ctx.beginPath()
        ctx.moveTo(x, canvas.height - groundHeight)
        ctx.lineTo(x + 75, canvas.height - groundHeight - 80)
        ctx.lineTo(x + 150, canvas.height - groundHeight)
        ctx.fill()
      }

      // Near trees/objects (fastest parallax)
      ctx.fillStyle = "#2d4c2d" // Darker green for near objects
      for (let i = 0; i < canvas.width + 100; i += 100) {
        const x = ((i + bgPositionRef.current) % (canvas.width + 100)) - 100
        // Tree-like shapes
        ctx.beginPath()
        ctx.moveTo(x + 25, canvas.height - groundHeight)
        ctx.lineTo(x + 25, canvas.height - groundHeight - 50)
        ctx.lineTo(x + 50, canvas.height - groundHeight - 50)
        ctx.lineTo(x + 50, canvas.height - groundHeight)
        ctx.fill()

        // Tree tops
        ctx.fillStyle = "#1a3a1a"
        ctx.beginPath()
        ctx.arc(x + 37.5, canvas.height - groundHeight - 70, 30, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#2d4c2d"
      }
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      bgPositionRef.current += scrollSpeed
      drawBackground()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [scrollSpeed])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-label="Scrolling Background" />
}
