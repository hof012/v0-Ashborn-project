"use client"

import { useEffect, useState } from "react"

export function useHitFlash(damageTrigger: number) {
  const [isFlashing, setIsFlashing] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    if (damageTrigger > 0) {
      setIsFlashing(true)
      setIsShaking(true)

      const flashTimeout = setTimeout(() => setIsFlashing(false), 200)
      const shakeTimeout = setTimeout(() => setIsShaking(false), 200)

      return () => {
        clearTimeout(flashTimeout)
        clearTimeout(shakeTimeout)
      }
    }
  }, [damageTrigger])

  return {
    isFlashing,
    shakeClass: isShaking ? "shake-screen" : "",
  }
}
