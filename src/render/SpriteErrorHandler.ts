// Tracks which sprites have failed to load to avoid repeated fetch attempts
const failedSprites = new Set<string>()

// Tracks which sprites have successfully loaded
const loadedSprites = new Set<string>()

// Fallback emojis for different entity types
export const FALLBACK_EMOJIS: Record<string, Record<string, string>> = {
  player: {
    idle: "🧙‍♂️",
    run: "🏃",
    attack1: "⚔️",
    attack2: "🗡️",
    attack3: "💥",
    hit: "😵",
    shield: "🛡️",
    death: "💀",
  },
  wolf: {
    idle: "🐺",
    move: "🐺",
    attack: "🐺",
    hit: "🐺",
    death: "🐺",
  },
  goblin: {
    idle: "👺",
    move: "👺",
    attack: "👺",
    hit: "👺",
    death: "👺",
  },
  slime: {
    idle: "🫧",
    move: "🫧",
    attack: "🫧",
    hit: "🫧",
    death: "💦",
  },
  pet: {
    paw: "🐾",
    star: "🌟",
    teddy: "🧸",
    ghost: "👻",
  },
  essence: {
    idle: "✨",
  },
}

// Get fallback emoji for an entity type and state
export function getFallbackEmoji(type: string, state: string): string {
  const entityEmojis = FALLBACK_EMOJIS[type]
  if (!entityEmojis) return "❓"

  return entityEmojis[state] || entityEmojis.idle || "❓"
}

// Check if a sprite has failed to load previously
export function hasSpriteFailed(src: string): boolean {
  return failedSprites.has(src)
}

// Mark a sprite as failed
export function markSpriteFailed(src: string): void {
  failedSprites.add(src)
  console.warn(`Sprite failed to load and marked as failed: ${src}`)
}

// Mark a sprite as loaded successfully
export function markSpriteLoaded(src: string): void {
  loadedSprites.add(src)
  // If it was previously marked as failed, remove it
  if (failedSprites.has(src)) {
    failedSprites.delete(src)
  }
}

// Check if a sprite is already loaded
export function isSpriteLoaded(src: string): boolean {
  return loadedSprites.has(src)
}

// Get statistics about sprite loading
export function getSpriteLoadingStats(): { loaded: number; failed: number } {
  return {
    loaded: loadedSprites.size,
    failed: failedSprites.size,
  }
}

// Preload a sprite and return a promise that resolves when loaded or rejects on error
export function preloadSprite(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (loadedSprites.has(src)) {
      resolve()
      return
    }

    // If already failed, reject immediately
    if (failedSprites.has(src)) {
      reject(new Error(`Sprite already failed to load: ${src}`))
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      markSpriteLoaded(src)
      resolve()
    }
    img.onerror = () => {
      markSpriteFailed(src)
      reject(new Error(`Failed to load sprite: ${src}`))
    }
    img.src = src
  })
}

// Clear all sprite loading history (useful for testing)
export function clearSpriteLoadingHistory(): void {
  failedSprites.clear()
  loadedSprites.clear()
}
