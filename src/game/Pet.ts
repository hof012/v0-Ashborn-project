import type { EssenceDrop } from "./EssenceDrop"
import type { PetTypeDefinition } from "./PetTypes"

export type PetType = "paw" | "star" | "teddy" | "ghost"

export class Pet {
  x = 0
  y = 20
  targetDrop: EssenceDrop | null = null
  level = 1
  xp = 0
  type: PetType = "paw"
  collectingAnimation = false
  lastCollectTime = 0
  lastReactionTime = 0
  reactionType: "levelUp" | "death" | "none" = "none"
  petDefinition: PetTypeDefinition | null = null

  constructor(type: PetType = "paw", petDefinition: PetTypeDefinition | null = null) {
    this.type = type
    this.petDefinition = petDefinition
  }

  update(playerX: number, drops: EssenceDrop[], playerAlive = true, playerLevel = 1): EssenceDrop | null {
    const followX = playerX - 24

    // Handle reactions
    if (this.reactionType !== "none" && Date.now() - this.lastReactionTime > 2000) {
      this.reactionType = "none"
    }

    // If player died and we haven't reacted yet
    if (!playerAlive && this.reactionType === "none") {
      this.reactionType = "death"
      this.lastReactionTime = Date.now()
    }

    // Check for level up reaction
    if (playerLevel > this.level && this.reactionType === "none") {
      this.reactionType = "levelUp"
      this.lastReactionTime = Date.now()
      this.level = playerLevel
    }

    // Follow player when no target
    if (!this.targetDrop || this.targetDrop.collected) {
      // Find closest uncollected drop
      this.targetDrop = drops.find((d) => !d.collected && Math.abs(d.position - playerX) < 200)
      this.collectingAnimation = false
    }

    if (this.targetDrop && !this.targetDrop.collected) {
      const dir = this.targetDrop.position > this.x ? 1 : -1
      this.x += dir * 3

      // Collecting animation
      if (Math.abs(this.x - this.targetDrop.position) < 20 && !this.collectingAnimation) {
        this.collectingAnimation = true
      }

      // Reached?
      if (Math.abs(this.x - this.targetDrop.position) < 10) {
        this.targetDrop.collected = true
        this.lastCollectTime = Date.now()
        const collectedDrop = this.targetDrop
        this.targetDrop = null

        // Gain XP for collecting
        this.xp += 1
        if (this.xp >= this.level * 5) {
          this.level++
          this.xp = 0
        }

        return collectedDrop
      }
    } else {
      // Hover near player with slight bobbing motion
      this.x += (followX - this.x) * 0.1
      this.y = 20 + Math.sin(Date.now() / 300) * 3
    }

    return null
  }

  getEmoji(): string {
    if (this.petDefinition) {
      return this.level >= 3 ? this.petDefinition.evolvedEmoji : this.petDefinition.emoji
    }

    // Fallback to original behavior
    switch (this.type) {
      case "paw":
        return this.level >= 3 ? "🐺" : "🐾"
      case "star":
        return this.level >= 3 ? "⭐" : "🌟"
      case "teddy":
        return this.level >= 3 ? "🧸" : "🧶"
      case "ghost":
        return this.level >= 3 ? "👻" : "🌫️"
      default:
        return "🐾"
    }
  }

  getReactionEmoji(): string {
    if (this.reactionType === "levelUp") return "🎉"
    if (this.reactionType === "death") return "😢"
    return ""
  }

  isCollecting(): boolean {
    return this.collectingAnimation || Date.now() - this.lastCollectTime < 500
  }

  // Get the stat bonuses this pet provides
  getStatBonuses(): Record<string, number> {
    if (!this.petDefinition) return {}

    const bonuses = { ...this.petDefinition.bonus }

    // Scale bonuses with pet level
    for (const stat in bonuses) {
      bonuses[stat as keyof typeof bonuses] = (bonuses[stat as keyof typeof bonuses] || 0) * this.level
    }

    return bonuses
  }

  // Get the name of the pet
  getName(): string {
    return this.petDefinition?.name || "Pet"
  }

  // Get the description of the pet
  getDescription(): string {
    return this.petDefinition?.description || "A helpful companion"
  }
}
