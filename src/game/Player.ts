import { Stats } from "./Stats"
import { TraitSystem } from "./TraitSystem"
import type { MonsterType } from "./Monster"

// Define possible percentage bonus types
export type PercentageBonusType =
  | "attackSpeed"
  | "critChance"
  | "dodgeChance"
  | "xpGain"
  | "essenceFind"
  | "damageBonus"

// Track random bonuses for display
export interface RandomBonus {
  type: "stat" | "percentage"
  stat?: keyof Stats["base"]
  percentageType?: PercentageBonusType
  value: number
  level: number // At which level this was gained
}

export class Player {
  position = 0
  health = 100
  maxHealth = 100
  attackPower = 10
  level = 1
  xp = 0
  essence = 0
  isAlive = true
  attackRange = 60 // Increased attack range for melee
  pendingTrait = false
  traits: string[] = []

  // New stats system
  stats = new Stats()
  mp = 20 // Current MP
  lastAttackTime = 0

  // Track unlocked special abilities
  unlockedAbilities: string[] = []

  // Trait system
  traitSystem = new TraitSystem()

  // Combat state
  inCombat = false
  currentTarget: string | null = null
  attackAnimationTime = 0
  attackAnimationDuration = 300 // ms
  inAttackAnimation = false
  attackCooldown = 0

  // NEW: Track random bonuses gained from level-ups
  randomBonuses: RandomBonus[] = []

  // NEW: Percentage-based bonuses
  percentageBonuses: Record<PercentageBonusType, number> = {
    attackSpeed: 1,
    critChance: 0,
    dodgeChance: 0,
    xpGain: 1,
    essenceFind: 1,
    damageBonus: 1,
  }

  update() {
    if (!this.isAlive) return

    // Only move forward if not in combat
    if (!this.inCombat) {
      this.position += 2 // auto-run
    }

    // Regenerate MP based on intelligence
    const derived = this.stats.calculateDerivedStats()
    this.mp = Math.min(derived.maxMP, this.mp + derived.mpRegen / 60) // Regen per frame (60fps)

    // Apply trait effects to stats
    this.traitSystem.applyTraitEffects(this.stats)

    // Update max health with trait bonuses
    const healthBonus = this.traitSystem.getHealthBonus()
    this.maxHealth = derived.maxHP + healthBonus
    // Ensure health does not exceed maxHealth
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    // Update attack animation state with better timing
    if (this.inAttackAnimation) {
      const now = Date.now()
      const elapsed = now - this.attackAnimationTime

      // Log animation state for debugging
      if (elapsed % 100 < 10) {
        // Log roughly every 100ms to avoid spam
        if (process.env.NODE_ENV === 'development') {
          console.log("Attack animation:", {
            elapsed,
            duration: this.attackAnimationDuration,
            remaining: this.attackAnimationDuration - elapsed,
          })
        }
      }

      if (elapsed >= this.attackAnimationDuration) {
        this.inAttackAnimation = false
        if (process.env.NODE_ENV === 'development') {
          console.log("Attack animation complete")
        }
      }
    }

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--

      // Log cooldown for debugging
      if (this.attackCooldown === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Attack cooldown reset to 0")
        }
      }
    }
  }

  receiveDamage(amount: number): boolean {
    // Check for dodge chance
    const derived = this.stats.calculateDerivedStats()
    const dodgeRoll = Math.random() * 100

    // Add trait dodge bonus and percentage bonus
    const traitDodgeBonus = this.traitSystem.getDodgeChanceBonus() * 100
    const percentageDodgeBonus = this.percentageBonuses.dodgeChance * 100
    const totalDodgeChance = derived.dodgeChance + traitDodgeBonus + percentageDodgeBonus

    // Successful dodge
    if (dodgeRoll < totalDodgeChance) {
      return true // Dodged
    }

    // Apply damage reduction from traits
    const damageReduction = this.traitSystem.getDamageReduction()
    const reducedAmount = amount * (1 - damageReduction)

    this.health -= reducedAmount
    if (this.health <= 0) {
      this.health = 0
      this.isAlive = false
    }

    return false // Hit taken
  }

  dealDamage(monsterType: MonsterType): { damage: number; isCritical: boolean } {
    const derived = this.stats.calculateDerivedStats()
    const now = Date.now()

    // Add trait attack speed bonus and percentage bonus
    const traitAttackSpeedBonus = this.traitSystem.getAttackSpeedBonus()
    const percentageAttackSpeedBonus = this.percentageBonuses.attackSpeed
    const totalAttackSpeed = derived.attackSpeed * (1 + traitAttackSpeedBonus) * percentageAttackSpeedBonus

    // Check if enough time has passed based on attack speed
    const attackCooldown = 1000 / totalAttackSpeed
    if (this.attackCooldown > 0) {
      return { damage: 0, isCritical: false } // Still on cooldown
    }

    // Set attack cooldown
    this.attackCooldown = Math.floor(attackCooldown / (1000 / 60)) // Convert to frames (assuming 60fps)

    // Start attack animation
    this.lastAttackTime = now
    this.attackAnimationTime = now
    this.inAttackAnimation = true // Set the property, don't call a method

    // Add trait crit chance bonus and percentage bonus
    const traitCritBonus = this.traitSystem.getCritChanceBonus() * 100
    const percentageCritBonus = this.percentageBonuses.critChance * 100
    const totalCritChance = derived.critChance + traitCritBonus + percentageCritBonus

    // Check for critical hit
    const critRoll = Math.random() * 100
    const isCritical = critRoll < totalCritChance

    // Calculate damage with critical multiplier if applicable
    const baseDamage = derived.attackPower
    const critMultiplier = isCritical ? 2 : 1

    // Apply trait damage bonus and percentage bonus
    const traitDamageBonus = this.traitSystem.getDamageBonus(monsterType)
    const percentageDamageBonus = this.percentageBonuses.damageBonus - 1 // Convert from multiplier to bonus
    const damageMultiplier = 1 + traitDamageBonus + percentageDamageBonus

    const finalDamage = baseDamage * critMultiplier * damageMultiplier

    return {
      damage: Math.floor(finalDamage),
      isCritical,
    }
  }

  gainXP(amount: number) {
    // Apply intelligence bonus to XP gain
    const derived = this.stats.calculateDerivedStats()

    // Apply both trait and percentage bonuses to XP gain
    const xpMultiplier = derived.xpGainRate * this.percentageBonuses.xpGain
    const bonusedAmount = Math.floor(amount * xpMultiplier)

    this.xp += bonusedAmount
    const requiredXP = this.level * 10

    if (this.xp >= requiredXP) {
      this.level++
      this.xp = 0
      this.pendingTrait = true // flag for UI
    }
  }

  applyTrait(trait: string) {
    switch (trait) {
      case "strength":
        this.stats.increaseStat("strength", 2)
        break
      case "dexterity":
        this.stats.increaseStat("dexterity", 2)
        break
      case "intelligence":
        this.stats.increaseStat("intelligence", 2)
        break
      case "luck":
        this.stats.increaseStat("luck", 2)
        break
    }

    // Update derived stats
    const derived = this.stats.calculateDerivedStats()
    this.maxHealth = derived.maxHP
    this.health = this.maxHealth // Heal to full on level up
    this.attackPower = derived.attackPower

    // Check for special ability unlocks
    this.checkAbilityUnlocks()

    this.traits.push(trait)
    this.pendingTrait = false

    // NEW: Roll for random stat bonus after applying trait
    return this.rollRandomStatBonus()
  }

  // NEW: Roll a random stat bonus on level up
  rollRandomStatBonus(): RandomBonus {
    const roll = Math.random()
    let bonus: RandomBonus

    if (roll < 0.6) {
      // 60% chance: Flat stat gain
      const stats: (keyof Stats["base"])[] = ["strength", "dexterity", "intelligence", "luck"]
      const stat = stats[Math.floor(Math.random() * stats.length)]
      const value = 1 // +1 to the stat

      // Apply the bonus
      this.stats.increaseStat(stat, value)

      bonus = {
        type: "stat",
        stat,
        value,
        level: this.level,
      }
    } else {
      // 40% chance: Percentage bonus to a derived stat
      const percentageTypes: PercentageBonusType[] = [
        "attackSpeed",
        "critChance",
        "dodgeChance",
        "xpGain",
        "essenceFind",
        "damageBonus",
      ]
      const percentageType = percentageTypes[Math.floor(Math.random() * percentageTypes.length)]

      // Different bonuses for different stats
      let value: number

      switch (percentageType) {
        case "attackSpeed":
        case "xpGain":
        case "essenceFind":
        case "damageBonus":
          // These are multipliers, so add 2-5%
          value = 1 + (Math.floor(Math.random() * 4) + 2) / 100
          this.percentageBonuses[percentageType] *= value
          break
        case "critChance":
        case "dodgeChance":
          // These are flat percentages, so add 1-2%
          value = (Math.floor(Math.random() * 2) + 1) / 100
          this.percentageBonuses[percentageType] += value
          break
      }

      bonus = {
        type: "percentage",
        percentageType,
        value,
        level: this.level,
      }
    }

    // Add to the list of random bonuses
    this.randomBonuses.push(bonus)

    return bonus
  }

  // NEW: Apply pet bonuses to player stats
  applyPetBonus(petBonus: Partial<Record<keyof Stats["base"], number>>) {
    // Clear any existing temporary bonuses (e.g., from a previous pet)
    this.stats.clearBonuses();

    // Apply each stat from the new pet as a temporary bonus
    for (const [stat, value] of Object.entries(petBonus)) {
      if (value && typeof value === "number") {
        // Ensure the stat is a valid key of BaseStats before adding
        if (stat === "strength" || stat === "dexterity" || stat === "intelligence" || stat === "luck") {
          this.stats.addBonus(stat as keyof Stats["base"], value);
        }
      }
    }

    // TODO: Ensure player's direct stats like maxHealth, health, attackPower are updated
    // after pet bonuses change. This might involve calling a new update method or
    // ensuring the Player.update() method correctly refreshes these from this.stats.calculateDerivedStats().
    // For now, let's assume Player.update() or other game loop logic handles this.
    // For example, maxHealth is updated in Player.update() via traitSystem.applyTraitEffects and getHealthBonus.
    // Attack power is read directly from derived.attackPower in dealDamage.
    // Health needs careful handling, especially ensuring it doesn't exceed new maxHealth.
  }

  // Check if any stats have reached thresholds to unlock special abilities
  checkAbilityUnlocks() {
    const current = this.stats.current

    // STR threshold abilities
    if (current.strength >= 15 && !this.unlockedAbilities.includes("mightyBlow")) {
      this.unlockedAbilities.push("mightyBlow")
    }

    // DEX threshold abilities
    if (current.dexterity >= 15 && !this.unlockedAbilities.includes("swiftStrike")) {
      this.unlockedAbilities.push("swiftStrike")
    }

    // INT threshold abilities
    if (current.intelligence >= 15 && !this.unlockedAbilities.includes("arcaneInsight")) {
      this.unlockedAbilities.push("arcaneInsight")
    }

    // LUK threshold abilities
    if (current.luck >= 15 && !this.unlockedAbilities.includes("fortunesFavor")) {
      this.unlockedAbilities.push("fortunesFavor")
    }
  }

  // Record a monster kill for trait tracking
  recordMonsterKill(monsterType: MonsterType) {
    this.traitSystem.recordKill(monsterType)
  }

  // Get the chance of essence dropping from a monster
  getEssenceDropChance(monsterType: MonsterType): number {
    const derived = this.stats.calculateDerivedStats()
    const baseChance = monsterType === "boss" ? 1.0 : 0.7

    // Apply trait drop rate bonus and percentage bonus
    const traitBonus = this.traitSystem.getDropRateBonus(monsterType)
    const percentageBonus = this.percentageBonuses.essenceFind - 1 // Convert from multiplier to bonus

    return Math.min(1.0, baseChance * derived.essenceDropRate * (1 + traitBonus + percentageBonus))
  }

  // Get the amount of essence dropped
  getEssenceDropAmount(monsterType: MonsterType): number {
    const derived = this.stats.calculateDerivedStats()
    const baseAmount = monsterType === "boss" ? 3 : 1

    // Apply trait essence bonus and percentage bonus
    const traitBonus = this.traitSystem.getEssenceBonus(monsterType)
    const percentageBonus = this.percentageBonuses.essenceFind - 1 // Convert from multiplier to bonus

    return Math.max(1, Math.floor(baseAmount * derived.essenceDropRate * (1 + percentageBonus)) + traitBonus)
  }

  // Get trait notification
  getTraitNotification() {
    return this.traitSystem.getNotification()
  }

  // Get unlocked traits
  getUnlockedTraits() {
    return this.traitSystem.getUnlockedTraits()
  }

  // Get monster kill counts
  getMonsterKills() {
    return this.traitSystem.getMonsterKills()
  }

  // NEW: Get random bonuses for display
  getRandomBonuses() {
    return this.randomBonuses
  }

  // NEW: Format a random bonus for display
  formatRandomBonus(bonus: RandomBonus): string {
    if (bonus.type === "stat") {
      return `+${bonus.value} ${bonus.stat?.toUpperCase()}`
    } else if (bonus.type === "percentage") {
      // Format percentage bonuses
      switch (bonus.percentageType) {
        case "attackSpeed":
          return `+${Math.round((bonus.value - 1) * 100)}% Attack Speed`
        case "critChance":
          return `+${Math.round(bonus.value * 100)}% Crit Chance`
        case "dodgeChance":
          return `+${Math.round(bonus.value * 100)}% Dodge Chance`
        case "xpGain":
          return `+${Math.round((bonus.value - 1) * 100)}% XP Gain`
        case "essenceFind":
          return `+${Math.round((bonus.value - 1) * 100)}% Essence Find`
        case "damageBonus":
          return `+${Math.round((bonus.value - 1) * 100)}% Damage`
        default:
          return `+${Math.round((bonus.value - 1) * 100)}% Bonus`
      }
    }
    return "Unknown Bonus"
  }

  // Set combat state
  enterCombat(targetId: string) {
    this.inCombat = true;
    this.currentTarget = targetId;
  }

  // Exit combat state
  exitCombat() {
    this.inCombat = false;
    this.currentTarget = null;
  }
}