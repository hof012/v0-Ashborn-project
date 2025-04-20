export enum MonsterTier {
  Normal = 0,
  MiniBoss = 1,
  Boss = 2,
}

// Define the trait interface
export interface Trait {
  id: string
  monsterType: string
  name: string
  description: string
  effects: TraitEffect[]
  level: number // Adding level for trait evolution
  killsToUnlock: number // Kills required to unlock this level
}

// Define the trait effect interface
export interface TraitEffect {
  type: "stat" | "dropRate" | "damage" | "health" | "essence"
  target?: string // For specific monster types
  value: number
}

export class TraitSystem {
  // Track kills for each monster type
  private monsterKills: Record<string, number> = {
    wolf: 0,
    goblin: 0,
    slime: 0,
    boss: 0,
  }

  // List of all available traits with evolution levels
  private availableTraits: Trait[] = [
    // Wolf traits - Level 1
    {
      id: "keen_senses_1",
      monsterType: "wolf",
      name: "Keen Senses I",
      description: "+2 DEX, +10% wolf drop rate",
      level: 1,
      killsToUnlock: 10,
      effects: [
        { type: "stat", target: "dexterity", value: 2 },
        { type: "dropRate", target: "wolf", value: 0.1 },
      ],
    },
    // Wolf traits - Level 2
    {
      id: "keen_senses_2",
      monsterType: "wolf",
      name: "Keen Senses II",
      description: "+4 DEX, +20% wolf drop rate",
      level: 2,
      killsToUnlock: 25,
      effects: [
        { type: "stat", target: "dexterity", value: 4 },
        { type: "dropRate", target: "wolf", value: 0.2 },
      ],
    },
    // Wolf traits - Level 3
    {
      id: "keen_senses_3",
      monsterType: "wolf",
      name: "Keen Senses III",
      description: "+6 DEX, +30% wolf drop rate, +5% dodge chance",
      level: 3,
      killsToUnlock: 50,
      effects: [
        { type: "stat", target: "dexterity", value: 6 },
        { type: "dropRate", target: "wolf", value: 0.3 },
      ],
    },

    // Goblin traits - Level 1
    {
      id: "greedy_grip_1",
      monsterType: "goblin",
      name: "Greedy Grip I",
      description: "+1 Essence gain from goblins",
      level: 1,
      killsToUnlock: 10,
      effects: [{ type: "essence", target: "goblin", value: 1 }],
    },
    // Goblin traits - Level 2
    {
      id: "greedy_grip_2",
      monsterType: "goblin",
      name: "Greedy Grip II",
      description: "+2 Essence gain from goblins, +1 LUK",
      level: 2,
      killsToUnlock: 25,
      effects: [
        { type: "essence", target: "goblin", value: 2 },
        { type: "stat", target: "luck", value: 1 },
      ],
    },
    // Goblin traits - Level 3
    {
      id: "greedy_grip_3",
      monsterType: "goblin",
      name: "Greedy Grip III",
      description: "+3 Essence gain from goblins, +2 LUK",
      level: 3,
      killsToUnlock: 50,
      effects: [
        { type: "essence", target: "goblin", value: 3 },
        { type: "stat", target: "luck", value: 2 },
      ],
    },

    // Slime traits - Level 1
    {
      id: "absorbent_hide_1",
      monsterType: "slime",
      name: "Absorbent Hide I",
      description: "+10 Max HP",
      level: 1,
      killsToUnlock: 10,
      effects: [{ type: "health", value: 10 }],
    },
    // Slime traits - Level 2
    {
      id: "absorbent_hide_2",
      monsterType: "slime",
      name: "Absorbent Hide II",
      description: "+25 Max HP",
      level: 2,
      killsToUnlock: 25,
      effects: [{ type: "health", value: 25 }],
    },
    // Slime traits - Level 3
    {
      id: "absorbent_hide_3",
      monsterType: "slime",
      name: "Absorbent Hide III",
      description: "+50 Max HP, 10% damage reduction",
      level: 3,
      killsToUnlock: 50,
      effects: [{ type: "health", value: 50 }],
    },

    // Boss traits - Level 1
    {
      id: "conquerors_might_1",
      monsterType: "boss",
      name: "Conqueror's Might I",
      description: "+3 STR, +5% damage to all monsters",
      level: 1,
      killsToUnlock: 10,
      effects: [
        { type: "stat", target: "strength", value: 3 },
        { type: "damage", value: 0.05 },
      ],
    },
    // Boss traits - Level 2
    {
      id: "conquerors_might_2",
      monsterType: "boss",
      name: "Conqueror's Might II",
      description: "+6 STR, +10% damage to all monsters",
      level: 2,
      killsToUnlock: 25,
      effects: [
        { type: "stat", target: "strength", value: 6 },
        { type: "damage", value: 0.1 },
      ],
    },
    // Boss traits - Level 3
    {
      id: "conquerors_might_3",
      monsterType: "boss",
      name: "Conqueror's Might III",
      description: "+10 STR, +15% damage to all monsters",
      level: 3,
      killsToUnlock: 50,
      effects: [
        { type: "stat", target: "strength", value: 10 },
        { type: "damage", value: 0.15 },
      ],
    },
  ]

  // List of unlocked traits
  private unlockedTraits: Trait[] = []

  // New trait notification
  private newTraitNotification: { trait: Trait; timestamp: number } | null = null

  // Record a kill for a specific monster type
  recordKill(monsterType: string): void {
    if (this.monsterKills[monsterType] !== undefined) {
      this.monsterKills[monsterType]++

      // Check for trait unlocks
      this.checkTraitUnlocks(monsterType)
    }
  }

  // Check if any traits should be unlocked
  private checkTraitUnlocks(monsterType: string): void {
    const kills = this.monsterKills[monsterType]

    // Check all available traits for this monster type
    const traitsForMonster = this.availableTraits.filter((trait) => trait.monsterType === monsterType)

    for (const trait of traitsForMonster) {
      // If we have enough kills and haven't unlocked this trait level yet
      if (kills >= trait.killsToUnlock && !this.unlockedTraits.some((t) => t.id === trait.id)) {
        // Check if we should replace a lower level trait
        const lowerLevelIndex = this.unlockedTraits.findIndex(
          (t) => t.monsterType === trait.monsterType && t.level < trait.level,
        )

        if (lowerLevelIndex !== -1) {
          // Replace the lower level trait
          this.unlockedTraits[lowerLevelIndex] = trait
        } else {
          // Add as a new trait
          this.unlockedTraits.push(trait)
        }

        // Set notification
        this.newTraitNotification = {
          trait: trait,
          timestamp: Date.now(),
        }
      }
    }
  }

  // Apply trait effects to player stats
  applyTraitEffects(stats: any): void {
    // Reset temporary bonuses
    stats.clearBonuses()

    // Apply effects from all unlocked traits
    this.unlockedTraits.forEach((trait) => {
      trait.effects.forEach((effect) => {
        if (effect.type === "stat" && effect.target) {
          stats.addBonus(effect.target as any, effect.value)
        }
      })
    })
  }

  // Get drop rate bonus for a specific monster type
  getDropRateBonus(monsterType: string): number {
    let bonus = 0

    this.unlockedTraits.forEach((trait) => {
      trait.effects.forEach((effect) => {
        if (effect.type === "dropRate" && (effect.target === monsterType || !effect.target)) {
          bonus += effect.value
        }
      })
    })

    return bonus
  }

  // Get essence bonus for a specific monster type
  getEssenceBonus(monsterType: string): number {
    let bonus = 0

    this.unlockedTraits.forEach((trait) => {
      trait.effects.forEach((effect) => {
        if (effect.type === "essence" && (effect.target === monsterType || !effect.target)) {
          bonus += effect.value
        }
      })
    })

    return bonus
  }

  // Get health bonus
  getHealthBonus(): number {
    let bonus = 0

    this.unlockedTraits.forEach((trait) => {
      trait.effects.forEach((effect) => {
        if (effect.type === "health") {
          bonus += effect.value
        }
      })
    })

    return bonus
  }

  // Get damage bonus against a specific monster type
  getDamageBonus(monsterType: string): number {
    let bonus = 0

    this.unlockedTraits.forEach((trait) => {
      trait.effects.forEach((effect) => {
        if (effect.type === "damage" && (effect.target === monsterType || !effect.target)) {
          bonus += effect.value
        }
      })
    })

    return bonus
  }

  // Get all unlocked traits
  getUnlockedTraits(): Trait[] {
    return [...this.unlockedTraits]
  }

  // Get monster kill counts
  getMonsterKills(): Record<string, number> {
    return { ...this.monsterKills }
  }

  // Get trait progress for UI display
  getTraitProgress(): Record<string, { kills: number; nextUnlock: number | null }> {
    const progress: Record<string, { kills: number; nextUnlock: number | null }> = {}

    // For each monster type
    Object.keys(this.monsterKills).forEach((monsterType) => {
      const kills = this.monsterKills[monsterType]

      // Find the next trait level to unlock
      const currentLevel = this.getHighestTraitLevel(monsterType)
      const nextTrait = this.availableTraits.find((t) => t.monsterType === monsterType && t.level > currentLevel)

      progress[monsterType] = {
        kills,
        nextUnlock: nextTrait ? nextTrait.killsToUnlock : null,
      }
    })

    return progress
  }

  // Get the highest unlocked trait level for a monster type
  private getHighestTraitLevel(monsterType: string): number {
    const traits = this.unlockedTraits.filter((t) => t.monsterType === monsterType)
    if (traits.length === 0) return 0

    return Math.max(...traits.map((t) => t.level))
  }

  // Get new trait notification
  getNotification(): { trait: Trait; timestamp: number } | null {
    // Clear notification if it's been shown for more than 5 seconds
    if (this.newTraitNotification && Date.now() - this.newTraitNotification.timestamp > 5000) {
      this.newTraitNotification = null
    }

    return this.newTraitNotification
  }

  // Clear all traits (for game restart)
  reset(): void {
    this.unlockedTraits = []

    // Reset kill counts
    Object.keys(this.monsterKills).forEach((key) => {
      this.monsterKills[key] = 0
    })

    this.newTraitNotification = null
  }

  // NEW METHODS TO SUPPORT ENHANCED PLAYER CLASS

  // Get attack speed bonus from traits
  getAttackSpeedBonus(): number {
    // For now, return a default value of 0 (no bonus)
    // This can be enhanced later to check for specific traits
    return 0
  }

  // Get dodge chance bonus from traits
  getDodgeChanceBonus(): number {
    // For now, return a default value of 0 (no bonus)
    return 0
  }

  // Get damage reduction from traits (e.g., Ooze Adaptation)
  getDamageReduction(): number {
    // For now, return a default value of 0 (no reduction)
    return 0
  }

  // Get critical hit chance bonus from traits
  getCritChanceBonus(): number {
    // For now, return a default value of 0 (no bonus)
    return 0
  }

  // Check if player has the double crit trait (Shadow Jab)
  hasDoubleCrit(): boolean {
    // For now, return false (no double crit)
    return false
  }

  // Use an active ability
  useActiveAbility(abilityId: string, player: any, target?: any): boolean {
    // For now, return false (ability not used)
    return false
  }

  // Activate a transformation
  activateTransformation(transformId: string): boolean {
    // For now, return false (transformation not activated)
    return false
  }

  // Check if player has the Lucky Find trait
  hasLuckyFind(): boolean {
    // For now, return false (no lucky find)
    return false
  }
}
