// Define the base stats interface
export interface BaseStats {
  strength: number
  dexterity: number
  intelligence: number
  luck: number
}

// Define the derived stats interface
export interface DerivedStats {
  maxHP: number
  attackPower: number
  attackSpeed: number
  dodgeChance: number
  xpGainRate: number
  maxMP: number
  mpRegen: number
  critChance: number
  essenceDropRate: number
  rareTraitChance: number
}

// Stats calculator class
export class Stats {
  // Base stats
  private _baseStats: BaseStats = {
    strength: 5,
    dexterity: 5,
    intelligence: 5,
    luck: 5,
  }

  // Temporary stat bonuses (from buffs, etc.)
  private _tempBonuses: BaseStats = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    luck: 0,
  }

  constructor(initialStats?: Partial<BaseStats>) {
    if (initialStats) {
      this._baseStats = {
        ...this._baseStats,
        ...initialStats,
      }
    }
  }

  // Get the current total stats (base + temp bonuses)
  get current(): BaseStats {
    return {
      strength: this._baseStats.strength + this._tempBonuses.strength,
      dexterity: this._baseStats.dexterity + this._tempBonuses.dexterity,
      intelligence: this._baseStats.intelligence + this._tempBonuses.intelligence,
      luck: this._baseStats.luck + this._tempBonuses.luck,
    }
  }

  // Get base stats
  get base(): BaseStats {
    return { ...this._baseStats }
  }

  // Calculate all derived stats based on current stats
  calculateDerivedStats(): DerivedStats {
    const { strength, dexterity, intelligence, luck } = this.current

    return {
      maxHP: 100 + strength * 10,
      attackPower: 10 + strength * 2,

      attackSpeed: 1 + dexterity * 0.02, // attacks/sec
      dodgeChance: dexterity * 0.5, // %

      xpGainRate: 1 + intelligence * 0.02,
      maxMP: 20 + intelligence * 5,
      mpRegen: 1 + intelligence * 0.1,

      critChance: luck * 0.5, // %
      essenceDropRate: 1 + luck * 0.02, // multiplier
      rareTraitChance: luck * 0.3, // %
    }
  }

  // Increase a specific base stat
  increaseStat(stat: keyof BaseStats, amount: number): void {
    this._baseStats[stat] += amount
  }

  // Add a temporary bonus to a stat
  addBonus(stat: keyof BaseStats, amount: number): void {
    this._tempBonuses[stat] += amount
  }

  // Clear all temporary bonuses
  clearBonuses(): void {
    this._tempBonuses = {
      strength: 0,
      dexterity: 0,
      intelligence: 0,
      luck: 0,
    }
  }

  // Get a formatted description of what each stat affects
  getStatDescriptions(): Record<keyof BaseStats, string> {
    const { strength, dexterity, intelligence, luck } = this.current
    const derived = this.calculateDerivedStats()

    return {
      strength: `+${strength * 2} ATK, +${strength * 10} HP`,
      dexterity: `+${(dexterity * 0.02 * 100).toFixed(1)}% SPD, +${(dexterity * 0.5).toFixed(1)}% Dodge`,
      intelligence: `+${(intelligence * 0.02 * 100).toFixed(1)}% XP, +${intelligence * 5} MP`,
      luck: `+${(luck * 0.5).toFixed(1)}% Crit, +${(luck * 0.02 * 100).toFixed(1)}% Drop`,
    }
  }
}
