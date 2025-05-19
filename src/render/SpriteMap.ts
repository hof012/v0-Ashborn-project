"use client"

// Define types for sprite data
export interface SpriteSheetData {
  src: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  frameDuration: number
  loop: boolean
}

export type EntityType = "player" | "slime" | "goblin" | "wolf" | "pet" | "essence" | "effect"

// Cache for sprite data
const spriteCache = new Map<string, SpriteSheetData>()

// Fallback emoji mapping for when sprites fail to load
const emojiFallbacks: Record<string, Record<string, Record<string, string>>> = {
  player: {
    idle: { normal: "🧙" },
    run: { normal: "🏃" },
    attack1: { normal: "⚔️" },
    attack2: { normal: "🗡️" },
    attack3: { normal: "🔥" },
    hit: { normal: "😵" },
    death: { normal: "💀" },
  },
  slime: {
    idle: { normal: "🟢", miniboss: "🔵", boss: "🟣" },
    move: { normal: "🟢", miniboss: "🔵", boss: "🟣" },
    attack: { normal: "🟢", miniboss: "🔵", boss: "🟣" },
    hit: { normal: "🟢", miniboss: "🔵", boss: "🟣" },
    death: { normal: "💧", miniboss: "💦", boss: "🌊" },
  },
  goblin: {
    idle: { normal: "👺", miniboss: "👹", boss: "😈" },
    move: { normal: "👺", miniboss: "👹", boss: "😈" },
    attack: { normal: "👺", miniboss: "👹", boss: "😈" },
    hit: { normal: "👺", miniboss: "👹", boss: "😈" },
    death: { normal: "💀", miniboss: "💀", boss: "💀" },
  },
  wolf: {
    idle: { normal: "🐺", miniboss: "🐺", boss: "🐺" },
    move: { normal: "🐺", miniboss: "🐺", boss: "🐺" },
    attack: { normal: "🐺", miniboss: "🐺", boss: "🐺" },
    hit: { normal: "🐺", miniboss: "🐺", boss: "🐺" },
    death: { normal: "🐺", miniboss: "🐺", boss: "🐺" },
  },
  pet: {
    idle: { paw: "🐱", fang: "🐶", scale: "🐲", feather: "🦅" },
    collect: { paw: "😺", fang: "🐕", scale: "🐉", feather: "🦢" },
  },
  essence: {
    idle: { normal: "✨" },
  },
  effect: {
    slash: { normal: "⚔️" },
    impact: { normal: "💥" },
    critical: { normal: "⭐" },
  },
}

// Helper function to get emoji fallback
export function getEmojiFallback(type: EntityType, state = "idle", variant = "normal"): string {
  try {
    return (
      emojiFallbacks[type]?.[state]?.[variant] ||
      emojiFallbacks[type]?.idle?.[variant] ||
      emojiFallbacks[type]?.idle?.normal ||
      "❓"
    )
  } catch (error) {
    console.error("Error getting emoji fallback:", error)
    return "❓"
  }
}

// Get sprite data for a specific entity type, state, and variant
export function getSpriteData(type: EntityType, state = "idle", variant = "normal"): SpriteSheetData | null {
  try {
    const cacheKey = `${type}-${state}-${variant}`

    // Return cached data if available
    if (spriteCache.has(cacheKey)) {
      return spriteCache.get(cacheKey)!
    }

    let data: SpriteSheetData | null = null

    // Player sprites
    if (type === "player") {
      switch (state) {
        case "idle":
          data = {
            src: "/sprites/player/idle.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 200,
            loop: true,
          }
          break
        case "run":
          data = {
            src: "/sprites/player/run.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 6,
            frameDuration: 100,
            loop: true,
          }
          break
        case "attack1":
          data = {
            src: "/sprites/player/attack1.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 100,
            loop: false,
          }
          break
        case "attack2":
          data = {
            src: "/sprites/player/attack2.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 100,
            loop: false,
          }
          break
        case "attack3":
          data = {
            src: "/sprites/player/attack3.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 100,
            loop: false,
          }
          break
        case "hit":
          data = {
            src: "/sprites/player/hit-front.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 2,
            frameDuration: 150,
            loop: false,
          }
          break
        default:
          data = {
            src: "/sprites/player/idle.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 200,
            loop: true,
          }
      }
    }

    // Slime sprites
    else if (type === "slime") {
      const tierPrefix = variant === "boss" ? "boss-" : variant === "miniboss" ? "mini-" : ""
      switch (state) {
        case "idle":
        case "move":
          data = {
            src: `/sprites/slime/${tierPrefix}slime-move-0.png`,
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 200,
            loop: true,
          }
          break
        case "attack":
          data = {
            src: `/sprites/slime/${tierPrefix}slime-attack-0.png`,
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 2,
            frameDuration: 150,
            loop: false,
          }
          break
        case "hit":
          data = {
            src: `/sprites/slime/${tierPrefix}slime-hurt-0.png`,
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 2,
            frameDuration: 150,
            loop: false,
          }
          break
        case "death":
          data = {
            src: `/sprites/slime/${tierPrefix}slime-die-0.png`,
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 2,
            frameDuration: 200,
            loop: false,
          }
          break
        default:
          data = {
            src: `/sprites/slime/${tierPrefix}slime-move-0.png`,
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 200,
            loop: true,
          }
      }
    }

    // Essence sprites
    else if (type === "essence") {
      data = {
        src: "/sprites/items/essence.png",
        frameWidth: 16,
        frameHeight: 16,
        frameCount: 4,
        frameDuration: 150,
        loop: true,
      }
    }

    // Effect sprites
    else if (type === "effect") {
      switch (state) {
        case "slash":
          data = {
            src: "/effects/slash-1.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 80,
            loop: false,
          }
          break
        case "impact":
          data = {
            src: "/effects/impact-1.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 3,
            frameDuration: 80,
            loop: false,
          }
          break
        case "critical":
          data = {
            src: "/effects/critical-1.png",
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 4,
            frameDuration: 80,
            loop: false,
          }
          break
      }
    }

    // Pet sprites
    else if (type === "pet") {
      // For now, just use a placeholder
      data = {
        src: "/sprites/pet_wolf.png",
        frameWidth: 16,
        frameHeight: 16,
        frameCount: 1,
        frameDuration: 200,
        loop: true,
      }
    }

    // Cache the data
    if (data) {
      spriteCache.set(cacheKey, data)
    }

    return data
  } catch (error) {
    console.error(`Error getting sprite data for ${type}-${state}-${variant}:`, error)
    return null
  }
}

// Function to preload all sprites
export async function preloadSprites(): Promise<boolean> {
  try {
    console.log("Preloading sprites...")

    // List of all sprite combinations we want to preload
    const spritesToPreload: [EntityType, string, string][] = [
      ["player", "idle", "normal"],
      ["player", "run", "normal"],
      ["player", "attack1", "normal"],
      ["player", "attack2", "normal"],
      ["player", "attack3", "normal"],
      ["player", "hit", "normal"],
      ["slime", "idle", "normal"],
      ["slime", "move", "normal"],
      ["slime", "attack", "normal"],
      ["slime", "hit", "normal"],
      ["slime", "death", "normal"],
      ["slime", "idle", "miniboss"],
      ["slime", "idle", "boss"],
      ["essence", "idle", "normal"],
      ["effect", "slash", "normal"],
      ["effect", "impact", "normal"],
      ["effect", "critical", "normal"],
      ["pet", "idle", "paw"],
    ]

    // Preload each sprite
    const preloadPromises = spritesToPreload.map(([type, state, variant]) => {
      return new Promise<boolean>((resolve) => {
        const data = getSpriteData(type, state, variant)
        if (!data) {
          console.warn(`No sprite data for ${type}-${state}-${variant}`)
          resolve(false)
          return
        }

        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => {
          console.warn(`Failed to load sprite: ${data.src}`)
          resolve(false)
        }
        img.src = data.src
      })
    })

    // Wait for all sprites to load
    const results = await Promise.all(preloadPromises)
    const successCount = results.filter(Boolean).length
    console.log(`Preloaded ${successCount}/${spritesToPreload.length} sprites`)

    return successCount > 0
  } catch (error) {
    console.error("Error preloading sprites:", error)
    return false
  }
}
