export class EssenceDrop {
  id: string
  position: number
  y = 32 // height above ground
  collected = false
  collectedTime = 0

  constructor(position: number) {
    // Generate a unique ID without using uuid library
    this.id = `essence-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    this.position = position
  }

  update(playerPos: number): boolean {
    if (this.collected) return false // skip already collected drops

    // Float down
    if (this.y > 0) this.y -= 1

    // Auto-collect logic
    const dist = Math.abs(this.position - playerPos)
    const isGrounded = this.y <= 2

    // More forgiving collection radius and allow collection even when not fully grounded
    // This helps when player is right on top of where the monster died
    if ((dist < 32 && isGrounded) || dist < 20) {
      this.collected = true
      this.collectedTime = Date.now()
      return true
    }

    return false
  }

  // Keep the drop in the game state for animation purposes
  shouldRemove(): boolean {
    return this.collected && Date.now() - this.collectedTime > 800
  }
}

// Export the function that was missing
export function updateEssenceDrops(essenceDrops: EssenceDrop[], playerPos: number): void {
  // Update each essence drop
  essenceDrops.forEach((drop) => {
    drop.update(playerPos)
  })

  // Filter out drops that should be removed
  // Note: This doesn't modify the original array, so the calling code needs to handle this
}

// Helper function to clean up collected essence drops
export function cleanupEssenceDrops(essenceDrops: EssenceDrop[]): EssenceDrop[] {
  return essenceDrops.filter((drop) => !drop.shouldRemove())
}
