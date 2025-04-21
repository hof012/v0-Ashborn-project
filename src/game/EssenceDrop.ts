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
