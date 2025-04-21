// Background manager to handle different backgrounds based on biome
export const BACKGROUNDS = {
  beach: {
    main: "/sprites/backgrounds/beach/complete.png",
    layers: {
      sky: "/sprites/backgrounds/beach/sky.png",
      clouds: "/sprites/backgrounds/beach/clouds.png",
      ocean: "/sprites/backgrounds/beach/ocean.png",
      palm: "/sprites/backgrounds/beach/palm.png",
    },
  },
  forest: {
    main: "/sprites/backgrounds/forest/complete.png",
    layers: {
      sky: "/sprites/backgrounds/forest/sky.png",
      trees: "/sprites/backgrounds/forest/trees.png",
      ground: "/sprites/backgrounds/forest/ground.png",
    },
  },
}

// Get background for a specific biome
export function getBackground(biome: string): string {
  const biomeData = BACKGROUNDS[biome as keyof typeof BACKGROUNDS]
  if (!biomeData) {
    return BACKGROUNDS.beach.main // Default fallback
  }

  return biomeData.main
}

// Get background layers for parallax effect
export function getBackgroundLayers(biome: string): Record<string, string> {
  const biomeData = BACKGROUNDS[biome as keyof typeof BACKGROUNDS]
  if (!biomeData) {
    return BACKGROUNDS.beach.layers // Default fallback
  }

  return biomeData.layers
}
