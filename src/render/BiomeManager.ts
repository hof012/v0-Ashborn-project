// Manage different biomes based on distance traveled

export type BiomeType = "forest" | "desert" | "mountains" | "ruins"

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
