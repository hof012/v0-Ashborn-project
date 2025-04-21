// Slime sprite mapping with GitHub URLs
export const SLIME_SPRITES = {
  idle: [
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-1.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-2.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-3.png",
  ],
  move: [
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-0.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-1.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-2.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-move-3.png",
  ],
  attack: [
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-0.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-1.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-2.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-3.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-attack-4.png",
  ],
  hit: [
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-0.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-1.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-2.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-hurt-3.png",
  ],
  death: [
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-0.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-1.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-2.png",
    "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-die-3.png",
  ],
}

// Get sprite for a specific animation frame
export function getSlimeSprite(animation: string, frame: number): string {
  const sprites = SLIME_SPRITES[animation as keyof typeof SLIME_SPRITES]
  if (!sprites || sprites.length === 0) {
    return "https://raw.githubusercontent.com/hof012/Ashborn/main/slime-idle-0.png" // Default fallback
  }

  // Loop through available frames
  return sprites[frame % sprites.length]
}

// Get all slime sprites as a flat array (useful for preloading)
export function getAllSlimeSprites(): string[] {
  const allSprites: string[] = []

  Object.values(SLIME_SPRITES).forEach((sprites) => {
    if (Array.isArray(sprites)) {
      sprites.forEach((sprite) => {
        if (!allSprites.includes(sprite)) {
          allSprites.push(sprite)
        }
      })
    }
  })

  return allSprites
}
