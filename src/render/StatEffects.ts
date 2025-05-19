// Visual effects based on player stats

export interface StatEffect {
  type: "glow" | "particles" | "aura" | "trail"
  color: string
  intensity: number // 0-1
  description: string
}

export function getStatEffects(stats: any): StatEffect[] {
  const effects: StatEffect[] = []

  // Strength effects (red)
  if (stats.current.strength >= 20) {
    effects.push({
      type: "aura",
      color: "#ff4444",
      intensity: Math.min(1, (stats.current.strength - 20) / 30),
      description: "Strength Aura",
    })
  }

  // Dexterity effects (green)
  if (stats.current.dexterity >= 20) {
    effects.push({
      type: "trail",
      color: "#44ff44",
      intensity: Math.min(1, (stats.current.dexterity - 20) / 30),
      description: "Speed Trail",
    })
  }

  // Intelligence effects (blue)
  if (stats.current.intelligence >= 20) {
    effects.push({
      type: "glow",
      color: "#4444ff",
      intensity: Math.min(1, (stats.current.intelligence - 20) / 30),
      description: "Arcane Glow",
    })
  }

  // Luck effects (yellow)
  if (stats.current.luck >= 20) {
    effects.push({
      type: "particles",
      color: "#ffff44",
      intensity: Math.min(1, (stats.current.luck - 20) / 30),
      description: "Lucky Sparkles",
    })
  }

  return effects
}
