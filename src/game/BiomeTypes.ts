// BiomeTypes.ts - A new file to replace BiomeManager.ts

export type BiomeType = "forest" | "desert" | "mountains" | "ruins" | "beach"

export interface Biome {
  type: BiomeType
  name: string
  colors: {
    sky: string
    ground: string
    accent: string
  }
  obstacles: string[]
  backgroundElements: string[]
  minDistance: number
  backgroundLayers: {
    sky: string
    farBackground?: string
    midBackground?: string
    foreground?: string
    ground: string
  }
  parallaxFactors: {
    sky: number
    farBackground?: number
    midBackground?: number
    foreground?: number
    ground: number
  }
  enemyTypes: string[] // Types of enemies that spawn in this biome
  musicTrack?: string // Background music for this biome
  ambientSounds?: string[] // Ambient sound effects
  transitionColor?: string // Color to use during biome transitions
}

export const BIOMES: Biome[] = [
  {
    type: "forest",
    name: "Verdant Forest",
    colors: {
      sky: "from-blue-300 to-blue-100",
      ground: "bg-green-800",
      accent: "bg-green-600",
    },
    obstacles: ["tree", "bush", "log"],
    backgroundElements: ["distant-trees", "hills"],
    minDistance: 0,
    backgroundLayers: {
      sky: "/backgrounds/forest/sky.png",
      farBackground: "/backgrounds/forest/mountains.png",
      midBackground: "/backgrounds/forest/trees.png",
      ground: "/backgrounds/forest/ground.png",
    },
    parallaxFactors: {
      sky: 0.1,
      farBackground: 0.3,
      midBackground: 0.5,
      ground: 0.7,
    },
    enemyTypes: ["wolf", "goblin", "slime"],
    musicTrack: "forest-theme",
  },
  {
    type: "beach",
    name: "Tropical Shores",
    colors: {
      sky: "from-blue-300 to-blue-200",
      ground: "bg-yellow-200",
      accent: "bg-cyan-500",
    },
    obstacles: ["palm", "rock", "crab"],
    backgroundElements: ["palm-trees", "waves"],
    minDistance: 500,
    backgroundLayers: {
      sky: "/backgrounds/beach/sky.png",
      farBackground: "/backgrounds/beach/clouds.png",
      midBackground: "/backgrounds/beach/ocean.png",
      foreground: "/backgrounds/beach/palm.png",
      ground: "/backgrounds/beach/ocean.png", // Bottom part of ocean with sand
    },
    parallaxFactors: {
      sky: 0.0,
      farBackground: 0.1,
      midBackground: 0.4,
      foreground: 0.7,
      ground: 0.9,
    },
    enemyTypes: ["crab", "seagull", "jellyfish"],
    musicTrack: "beach-theme",
    ambientSounds: ["waves", "seagulls"],
    transitionColor: "#87CEEB", // Sky blue
  },
  {
    type: "desert",
    name: "Scorched Sands",
    colors: {
      sky: "from-orange-200 to-yellow-100",
      ground: "bg-yellow-700",
      accent: "bg-yellow-600",
    },
    obstacles: ["cactus", "rock", "dune"],
    backgroundElements: ["mesa", "pyramid"],
    minDistance: 1000,
    backgroundLayers: {
      sky: "/backgrounds/desert/sky.png",
      farBackground: "/backgrounds/desert/mountains.png",
      midBackground: "/backgrounds/desert/dunes.png",
      ground: "/backgrounds/desert/sand.png",
    },
    parallaxFactors: {
      sky: 0.1,
      farBackground: 0.3,
      midBackground: 0.5,
      ground: 0.7,
    },
    enemyTypes: ["scorpion", "snake", "mummy"],
    musicTrack: "desert-theme",
  },
  {
    type: "mountains",
    name: "Frostpeak Heights",
    colors: {
      sky: "from-blue-400 to-blue-200",
      ground: "bg-gray-700",
      accent: "bg-gray-500",
    },
    obstacles: ["boulder", "pine", "cliff"],
    backgroundElements: ["peaks", "clouds"],
    minDistance: 2000,
    backgroundLayers: {
      sky: "/backgrounds/mountains/sky.png",
      farBackground: "/backgrounds/mountains/far-peaks.png",
      midBackground: "/backgrounds/mountains/mid-peaks.png",
      ground: "/backgrounds/mountains/snow.png",
    },
    parallaxFactors: {
      sky: 0.1,
      farBackground: 0.3,
      midBackground: 0.5,
      ground: 0.7,
    },
    enemyTypes: ["wolf", "yeti", "eagle"],
    musicTrack: "mountain-theme",
  },
  {
    type: "ruins",
    name: "Ancient Ruins",
    colors: {
      sky: "from-purple-400 to-purple-200",
      ground: "bg-stone-700",
      accent: "bg-stone-600",
    },
    obstacles: ["pillar", "statue", "wall"],
    backgroundElements: ["temple", "monolith"],
    minDistance: 3000,
    backgroundLayers: {
      sky: "/backgrounds/ruins/sky.png",
      farBackground: "/backgrounds/ruins/distant-ruins.png",
      midBackground: "/backgrounds/ruins/columns.png",
      ground: "/backgrounds/ruins/floor.png",
    },
    parallaxFactors: {
      sky: 0.1,
      farBackground: 0.3,
      midBackground: 0.5,
      ground: 0.7,
    },
    enemyTypes: ["skeleton", "ghost", "golem"],
    musicTrack: "ruins-theme",
  },
]

export function getCurrentBiome(distance: number): Biome {
  // Find the furthest biome the player has reached
  for (let i = BIOMES.length - 1; i >= 0; i--) {
    if (distance >= BIOMES[i].minDistance) {
      return BIOMES[i]
    }
  }

  // Default to first biome
  return BIOMES[0]
}

// Calculate transition progress between biomes
export function getBiomeTransition(distance: number): {
  fromBiome: Biome
  toBiome: Biome | null
  progress: number
} {
  const currentBiome = getCurrentBiome(distance)
  let nextBiomeIndex = -1

  // Find the next biome
  for (let i = 0; i < BIOMES.length; i++) {
    if (BIOMES[i].type === currentBiome.type) {
      if (i < BIOMES.length - 1) {
        nextBiomeIndex = i + 1
        break
      }
    }
  }

  if (nextBiomeIndex === -1) {
    // No next biome, we're at the last one
    return { fromBiome: currentBiome, toBiome: null, progress: 0 }
  }

  const nextBiome = BIOMES[nextBiomeIndex]
  const transitionDistance = 100 // Distance over which transition occurs
  const distanceToNextBiome = nextBiome.minDistance - distance

  if (distanceToNextBiome > transitionDistance) {
    // Not close enough to next biome for transition
    return { fromBiome: currentBiome, toBiome: null, progress: 0 }
  }

  // Calculate transition progress (0 to 1)
  const progress = 1 - distanceToNextBiome / transitionDistance
  return { fromBiome: currentBiome, toBiome: nextBiome, progress }
}

// Get enemy types for the current biome
export function getBiomeEnemies(biomeType: BiomeType): string[] {
  const biome = BIOMES.find((b) => b.type === biomeType)
  return biome ? biome.enemyTypes : BIOMES[0].enemyTypes
}

// Get music track for the current biome
export function getBiomeMusic(biomeType: BiomeType): string {
  const biome = BIOMES.find((b) => b.type === biomeType)
  return biome?.musicTrack || "default-theme"
}
