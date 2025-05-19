// Force use of sprite images instead of emojis
export const USE_SPRITE_IMAGES = true

// Map entity types to their sprite paths
export const SPRITE_PATHS = {
  player: {
    idle: [
      "/sprites/adventurer/adventurer-idle-00.png",
      "/sprites/adventurer/adventurer-idle-01.png",
      "/sprites/adventurer/adventurer-idle-02.png",
      "/sprites/adventurer/adventurer-idle-03.png",
    ],
    run: [
      "/sprites/adventurer/adventurer-run-00.png",
      "/sprites/adventurer/adventurer-run-01.png",
      "/sprites/adventurer/adventurer-run-02.png",
      "/sprites/adventurer/adventurer-run-03.png",
      "/sprites/adventurer/adventurer-run-04.png",
      "/sprites/adventurer/adventurer-run-05.png",
    ],
    attack1: [
      "/sprites/adventurer/adventurer-attack1-00.png",
      "/sprites/adventurer/adventurer-attack1-01.png",
      "/sprites/adventurer/adventurer-attack1-02.png",
      "/sprites/adventurer/adventurer-attack1-03.png",
      "/sprites/adventurer/adventurer-attack1-04.png",
    ],
    attack2: [
      "/sprites/adventurer/adventurer-attack2-00.png",
      "/sprites/adventurer/adventurer-attack2-01.png",
      "/sprites/adventurer/adventurer-attack2-02.png",
      "/sprites/adventurer/adventurer-attack2-03.png",
      "/sprites/adventurer/adventurer-attack2-04.png",
      "/sprites/adventurer/adventurer-attack2-05.png",
    ],
    hit: [
      "/sprites/adventurer/adventurer-hurt-00.png",
      "/sprites/adventurer/adventurer-hurt-01.png",
      "/sprites/adventurer/adventurer-hurt-02.png",
    ],
    death: [
      "/sprites/adventurer/adventurer-die-00.png",
      "/sprites/adventurer/adventurer-die-01.png",
      "/sprites/adventurer/adventurer-die-02.png",
      "/sprites/adventurer/adventurer-die-03.png",
      "/sprites/adventurer/adventurer-die-04.png",
      "/sprites/adventurer/adventurer-die-05.png",
      "/sprites/adventurer/adventurer-die-06.png",
    ],
  },
  slime: {
    idle: [
      "/sprites/slime/slime-idle-0.png",
      "/sprites/slime/slime-idle-1.png",
      "/sprites/slime/slime-idle-2.png",
      "/sprites/slime/slime-idle-3.png",
    ],
    move: [
      "/sprites/slime/slime-move-0.png",
      "/sprites/slime/slime-move-1.png",
      "/sprites/slime/slime-move-2.png",
      "/sprites/slime/slime-move-3.png",
    ],
    attack: [
      "/sprites/slime/slime-attack-0.png",
      "/sprites/slime/slime-attack-1.png",
      "/sprites/slime/slime-attack-2.png",
      "/sprites/slime/slime-attack-3.png",
      "/sprites/slime/slime-attack-4.png",
    ],
    hit: [
      "/sprites/slime/slime-hurt-0.png",
      "/sprites/slime/slime-hurt-1.png",
      "/sprites/slime/slime-hurt-2.png",
      "/sprites/slime/slime-hurt-3.png",
    ],
    death: [
      "/sprites/slime/slime-die-0.png",
      "/sprites/slime/slime-die-1.png",
      "/sprites/slime/slime-die-2.png",
      "/sprites/slime/slime-die-3.png",
    ],
  },
  wolf: {
    idle: [
      "/sprites/wolf/wolf-idle-0.png",
      "/sprites/wolf/wolf-idle-1.png",
      "/sprites/wolf/wolf-idle-2.png",
      "/sprites/wolf/wolf-idle-3.png",
    ],
    move: [
      "/sprites/wolf/wolf-run-0.png",
      "/sprites/wolf/wolf-run-1.png",
      "/sprites/wolf/wolf-run-2.png",
      "/sprites/wolf/wolf-run-3.png",
      "/sprites/wolf/wolf-run-4.png",
      "/sprites/wolf/wolf-run-5.png",
    ],
    attack: [
      "/sprites/wolf/wolf-attack-0.png",
      "/sprites/wolf/wolf-attack-1.png",
      "/sprites/wolf/wolf-attack-2.png",
      "/sprites/wolf/wolf-attack-3.png",
      "/sprites/wolf/wolf-attack-4.png",
    ],
    hit: ["/sprites/wolf/wolf-hurt-0.png", "/sprites/wolf/wolf-hurt-1.png", "/sprites/wolf/wolf-hurt-2.png"],
    death: [
      "/sprites/wolf/wolf-die-0.png",
      "/sprites/wolf/wolf-die-1.png",
      "/sprites/wolf/wolf-die-2.png",
      "/sprites/wolf/wolf-die-3.png",
    ],
  },
  goblin: {
    idle: [
      "/sprites/goblin/goblin-idle-0.png",
      "/sprites/goblin/goblin-idle-1.png",
      "/sprites/goblin/goblin-idle-2.png",
      "/sprites/goblin/goblin-idle-3.png",
    ],
    move: [
      "/sprites/goblin/goblin-run-0.png",
      "/sprites/goblin/goblin-run-1.png",
      "/sprites/goblin/goblin-run-2.png",
      "/sprites/goblin/goblin-run-3.png",
      "/sprites/goblin/goblin-run-4.png",
      "/sprites/goblin/goblin-run-5.png",
    ],
    attack: [
      "/sprites/goblin/goblin-attack-0.png",
      "/sprites/goblin/goblin-attack-1.png",
      "/sprites/goblin/goblin-attack-2.png",
      "/sprites/goblin/goblin-attack-3.png",
      "/sprites/goblin/goblin-attack-4.png",
    ],
    hit: [
      "/sprites/goblin/goblin-hurt-0.png",
      "/sprites/goblin/goblin-hurt-1.png",
      "/sprites/goblin/goblin-hurt-2.png",
    ],
    death: [
      "/sprites/goblin/goblin-die-0.png",
      "/sprites/goblin/goblin-die-1.png",
      "/sprites/goblin/goblin-die-2.png",
      "/sprites/goblin/goblin-die-3.png",
    ],
  },
  pet: {
    paw: [
      "/sprites/pets/wolf-pet-idle-0.png",
      "/sprites/pets/wolf-pet-idle-1.png",
      "/sprites/pets/wolf-pet-idle-2.png",
      "/sprites/pets/wolf-pet-idle-3.png",
    ],
    star: [
      "/sprites/pets/star-pet-idle-0.png",
      "/sprites/pets/star-pet-idle-1.png",
      "/sprites/pets/star-pet-idle-2.png",
      "/sprites/pets/star-pet-idle-3.png",
    ],
    teddy: [
      "/sprites/pets/teddy-pet-idle-0.png",
      "/sprites/pets/teddy-pet-idle-1.png",
      "/sprites/pets/teddy-pet-idle-2.png",
      "/sprites/pets/teddy-pet-idle-3.png",
    ],
    ghost: [
      "/sprites/pets/ghost-pet-idle-0.png",
      "/sprites/pets/ghost-pet-idle-1.png",
      "/sprites/pets/ghost-pet-idle-2.png",
      "/sprites/pets/ghost-pet-idle-3.png",
    ],
  },
  essence: {
    idle: [
      "/sprites/items/essence-0.png",
      "/sprites/items/essence-1.png",
      "/sprites/items/essence-2.png",
      "/sprites/items/essence-3.png",
    ],
  },
}

// Fallback emojis if sprites aren't available
export const EMOJI_FALLBACKS = {
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

// Helper function to get the appropriate sprite paths
export function getSpritePaths(type: string, state: string): string[] {
  const entityType = type as keyof typeof SPRITE_PATHS

  if (entityType === "pet") {
    // For pets, the state is the pet type
    return SPRITE_PATHS[entityType][state as keyof typeof SPRITE_PATHS.pet] || []
  }

  // For other entities
  if (SPRITE_PATHS[entityType]) {
    return SPRITE_PATHS[entityType][state as keyof (typeof SPRITE_PATHS)[typeof entityType]] || []
  }

  return []
}

// Helper function to get emoji fallback
export function getEmojiFallback(type: string, state: string): string {
  const entityType = type as keyof typeof EMOJI_FALLBACKS

  if (entityType === "pet") {
    // For pets, the state is the pet type
    return EMOJI_FALLBACKS[entityType][state as keyof typeof EMOJI_FALLBACKS.pet] || "❓"
  }

  // For other entities
  if (EMOJI_FALLBACKS[entityType]) {
    return EMOJI_FALLBACKS[entityType][state as keyof (typeof EMOJI_FALLBACKS)[typeof entityType]] || "❓"
  }

  return "❓"
}

// Helper to get asset path
export const getAsset = (assetType: string, name: string, variant = "") => {
  return `/sprites/${assetType}/${name}${variant ? `_${variant}` : ""}.png`
}
