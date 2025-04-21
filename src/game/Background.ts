import type { GameState } from "./GameState"

export interface BackgroundLayer {
  image: string
  position: number
  parallaxFactor: number
  width: number
  height: number
}

export function updateBackground(gameState: GameState, deltaTime: number): void {
  // Update each background layer based on player movement and parallax factor
  gameState.backgroundLayers.forEach((layer) => {
    // Calculate new position based on player movement and parallax factor
    // Lower parallax factor = slower movement (background)
    // Higher parallax factor = faster movement (foreground)
    const playerMovement = (gameState.player.speed * deltaTime) / 1000
    layer.position -= playerMovement * layer.parallaxFactor

    // Wrap background layers for infinite scrolling
    if (layer.position <= -layer.width) {
      layer.position += layer.width
    }
  })

  // Update biome-specific elements
  updateBiomeElements(gameState, deltaTime)
}

function updateBiomeElements(gameState: GameState, deltaTime: number): void {
  // Update any biome-specific elements like particles, weather effects, etc.
  const currentBiome = getBiomeData(gameState.currentBiomeIndex)

  // Example: Update particles
  if (gameState.particles) {
    gameState.particles.forEach((particle) => {
      // Update particle position
      particle.x -= (gameState.player.speed * deltaTime * particle.speed) / 1000
      particle.y += (particle.fallSpeed * deltaTime) / 1000

      // Update particle lifetime
      particle.lifetime -= deltaTime
    })

    // Remove expired particles
    gameState.particles = gameState.particles.filter((p) => p.lifetime > 0)

    // Add new particles if needed
    if (currentBiome.hasParticles && Math.random() < 0.05) {
      addParticle(gameState, currentBiome.particleType)
    }
  }
}

function getBiomeData(biomeIndex: number): any {
  // Return data for the current biome
  const biomes = [
    { name: "Forest", hasParticles: true, particleType: "leaf" },
    { name: "Desert", hasParticles: true, particleType: "dust" },
    { name: "Mountains", hasParticles: true, particleType: "snow" },
    { name: "Cave", hasParticles: false, particleType: null },
  ]

  return biomes[biomeIndex % biomes.length]
}

function addParticle(gameState: GameState, type: string): void {
  // Add a new particle to the game state
  if (!gameState.particles) {
    gameState.particles = []
  }

  const particle = {
    x: gameState.player.position + 800, // Start ahead of the player
    y: Math.random() * 200,
    speed: 0.5 + Math.random() * 0.5,
    fallSpeed: type === "snow" || type === "leaf" ? 0.5 + Math.random() * 0.5 : 0,
    type,
    lifetime: 5000 + Math.random() * 5000,
  }

  gameState.particles.push(particle)
}
