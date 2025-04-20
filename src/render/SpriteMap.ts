// This file maps entity types to their sprite sheets

export type SpriteState =
  | "idle"
  | "walk"
  | "run"
  | "attack1"
  | "attack2"
  | "attack3"
  | "hit"
  | "shield"
  | "death"
  | "collect"
  | "move"
  | "attack"
export type EntityType = "player" | "wolf" | "goblin" | "slime" | "pet" | "essence"
export type EntityVariant = "normal" | "miniboss" | "boss" | "evolved"

export interface SpriteSheetData {
  src: string
  frameCount: number
  frameWidth: number
  frameHeight: number
  frameDuration: number // in milliseconds
  loop?: boolean
  scale?: number
}

export interface EntitySpriteData {
  [key: string]: SpriteSheetData
}

// Player sprite sheets (using adventurer sprites)
const playerSprites: EntitySpriteData = {
  idle: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-idle-00.png",
    frameCount: 4,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 150,
    loop: true,
  },
  run: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-run-00.png",
    frameCount: 6,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 100,
    loop: true,
  },
  attack1: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack1-00.png",
    frameCount: 5,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 80,
    loop: false,
  },
  attack2: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack2-00.png",
    frameCount: 6,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 80,
    loop: false,
  },
  attack3: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-attack3-00.png",
    frameCount: 6,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 80,
    loop: false,
  },
  hit: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-hurt-00.png",
    frameCount: 3,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 100,
    loop: false,
  },
  death: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-die-00.png",
    frameCount: 7,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 120,
    loop: false,
  },
  jump: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-jump-00.png",
    frameCount: 4,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 100,
    loop: false,
  },
  fall: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-fall-00.png",
    frameCount: 2,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 100,
    loop: true,
  },
  cast: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-cast-00.png",
    frameCount: 4,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 100,
    loop: false,
  },
  bow: {
    src: "https://raw.githubusercontent.com/hof012/Ashborn/main/adventurer-bow-00.png",
    frameCount: 9,
    frameWidth: 50,
    frameHeight: 37,
    frameDuration: 80,
    loop: false,
  },
}

// Monster sprite sheets
const monsterSprites: Record<string, EntitySpriteData> = {
  slime: {
    idle: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 200,
      loop: true,
    },
    move: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 200,
      loop: true,
    },
    attack: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-0.png",
      frameCount: 5,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 150,
      loop: false,
    },
    hit: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 150,
      loop: false,
    },
    death: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 200,
      loop: false,
    },
  },
  // Keep other monster types for future use but make them use slime sprites for now
  wolf: {
    idle: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 200,
      loop: true,
    },
    attack: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-0.png",
      frameCount: 5,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 150,
      loop: false,
    },
  },
  goblin: {
    idle: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png",
      frameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 200,
      loop: true,
    },
    attack: {
      src: "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-0.png",
      frameCount: 5,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 150,
      loop: false,
    },
  },
}

// Pet sprite sheets - using emoji fallbacks for now
const petSprites: Record<string, EntitySpriteData> = {
  paw: {
    idle: {
      src: "/sprites/pet/paw_idle.png", // Fallback will be used if file doesn't exist
      frameCount: 1,
      frameWidth: 16,
      frameHeight: 16,
      frameDuration: 200,
      loop: true,
    },
    collect: {
      src: "/sprites/pet/paw_collect.png", // Fallback will be used if file doesn't exist
      frameCount: 1,
      frameWidth: 16,
      frameHeight: 16,
      frameDuration: 100,
      loop: false,
    },
  },
  star: {
    idle: {
      src: "/sprites/pet/star_idle.png", // Fallback will be used if file doesn't exist
      frameCount: 1,
      frameWidth: 16,
      frameHeight: 16,
      frameDuration: 200,
      loop: true,
    },
    collect: {
      src: "/sprites/pet/star_collect.png", // Fallback will be used if file doesn't exist
      frameCount: 1,
      frameWidth: 16,
      frameHeight: 16,
      frameDuration: 100,
      loop: false,
    },
  },
}

// Item sprite sheets
const itemSprites: EntitySpriteData = {
  essence: {
    idle: {
      src: "/sprites/items/essence.png", // Fallback will be used if file doesn't exist
      frameCount: 1,
      frameWidth: 16,
      frameHeight: 16,
      frameDuration: 200,
      loop: true,
    },
  },
}

// Background layers for parallax
export const backgroundLayers = {
  forest: {
    sky: {
      src: "/backgrounds/sky.png",
      parallaxFactor: 0.1,
    },
    mountains: {
      src: "/backgrounds/mountains.png",
      parallaxFactor: 0.3,
    },
    trees: {
      src: "/backgrounds/trees.png",
      parallaxFactor: 0.5,
    },
    ground: {
      src: "/backgrounds/ground.png",
      parallaxFactor: 0.7,
    },
  },
}

// Emoji fallbacks for when sprites aren't available
export const emojiFallbacks: Record<EntityType, Record<string, string>> = {
  player: {
    idle: "🧙‍♂️",
    walk: "🚶",
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
    attack: "🐺",
    miniboss: "🐻",
    boss: "🐗",
  },
  goblin: {
    idle: "👺",
    attack: "👺",
    miniboss: "👹",
    boss: "👿",
  },
  slime: {
    idle: "🫧",
    move: "🫧",
    attack: "🫧",
    hit: "🫧",
    death: "💦",
    miniboss: "🦠",
    boss: "🌊",
  },
  pet: {
    paw: "🐾",
    paw_evolved: "🐺",
    star: "🌟",
    star_evolved: "⭐",
    teddy: "🧶",
    teddy_evolved: "🧸",
    ghost: "🌫️",
    ghost_evolved: "👻",
  },
  essence: {
    idle: "✨",
  },
}

// Get sprite data for an entity
export function getSpriteData(type: EntityType, state = "idle", variant = "normal"): SpriteSheetData | null {
  switch (type) {
    case "player":
      return playerSprites[state] || null
    case "wolf":
    case "goblin":
    case "slime":
      return monsterSprites[type]?.[state] || null
    case "pet":
      // Variant here would be the pet type (paw, star, etc.)
      return petSprites[variant]?.[state] || null
    case "essence":
      return itemSprites[state] || null
    default:
      return null
  }
}

// Get emoji fallback for an entity
export function getEmojiFallback(type: EntityType, state = "idle", variant = "normal"): string {
  if (type === "pet") {
    // For pets, the variant is the pet type
    const evolved = variant.includes("evolved")
    const petType = variant.replace("_evolved", "")
    return emojiFallbacks[type][`${petType}${evolved ? "_evolved" : ""}`] || "❓"
  }

  // For monsters, check if there's a variant-specific emoji
  if (["wolf", "goblin", "slime"].includes(type) && ["miniboss", "boss"].includes(variant)) {
    return emojiFallbacks[type as EntityType][variant] || emojiFallbacks[type as EntityType][state] || "❓"
  }

  return emojiFallbacks[type]?.[state] || "❓"
}

// Check if a sprite sheet exists
export async function spriteSheetExists(src: string): Promise<boolean> {
  try {
    const response = await fetch(src, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}
