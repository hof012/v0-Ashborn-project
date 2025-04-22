export interface Pet {
  id: string
  name: string
  description: string
  spriteUrl: string
  traits: string[]
  stats: {
    speed: number
    strength: number
    intelligence: number
  }
}

export type AssetType = "sprite" | "background" | "item" | "effect"

export interface AssetMetadata {
  id: string
  type: AssetType
  name: string
  blobUrl: string
  fallbackUrl?: string
  width: number
  height: number
  frames?: number
  frameRate?: number
}

export interface GameState {
  player: {
    level: number
    xp: number
    position: number
    health: number
    maxHealth: number
    pet: Pet | null
  }
  world: {
    biome: string
    distance: number
    obstacles: any[]
    enemies: any[]
  }
  stats: {
    kills: number
    distance: number
    itemsCollected: number
  }
}
