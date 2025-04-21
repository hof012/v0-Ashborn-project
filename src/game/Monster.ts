import { MonsterTier } from "./TraitSystem"

export type MonsterType = "wolf" | "goblin" | "slime" | "boss"

// Define the engagement distance constant
export const MONSTER_ENGAGE_DISTANCE = 60 // Pixels - adjust as needed for visual feel

export class Monster {
  id: string
  position: number
  health: number
  maxHealth: number
  attackPower: number
  type: MonsterType
  tier: MonsterTier
  lastHitTime = 0
  scale = 1.0 // For mini-bosses and bosses
  specialAttackCooldown = 0 // For mini-boss special attacks
  specialAttackType: string | null = null // Type of special attack
  isUsingSpecialAttack = false

  // Combat state variables
  inCombat = false
  attackCooldown = 0
  facingRight = false // By default monsters face left (toward player)
  attackAnimationTime = 0
  attackAnimationDuration = 300 // ms
  inAttackAnimation = false

  constructor(position: number, type?: MonsterType, tier?: MonsterTier) {
    // Generate a unique ID without using uuid library
    this.id = `monster-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    this.position = position

    // Determine monster type
    if (type) {
      this.type = type
    } else {
      // Random monster type selection
      const rand = Math.random()
      if (rand < 0.1) {
        this.type = "boss"
      } else if (rand < 0.4) {
        this.type = "wolf"
      } else if (rand < 0.7) {
        this.type = "goblin"
      } else {
        this.type = "slime"
      }
    }

    // Determine monster tier
    if (tier) {
      this.tier = tier
    } else if (this.type === "boss") {
      this.tier = MonsterTier.Boss
    } else {
      // 5% chance for mini-boss
      this.tier = Math.random() < 0.05 ? MonsterTier.MiniBoss : MonsterTier.Normal
    }

    // Set stats based on monster type and tier
    switch (this.type) {
      case "boss":
        this.maxHealth = 100
        this.attackPower = 8
        this.scale = 1.5
        break
      case "wolf":
        this.maxHealth = this.tier === MonsterTier.MiniBoss ? 70 : 35
        this.attackPower = this.tier === MonsterTier.MiniBoss ? 8 : 6
        this.scale = this.tier === MonsterTier.MiniBoss ? 1.3 : 1.0
        break
      case "goblin":
        this.maxHealth = this.tier === MonsterTier.MiniBoss ? 60 : 30
        this.attackPower = this.tier === MonsterTier.MiniBoss ? 6 : 4
        this.scale = this.tier === MonsterTier.MiniBoss ? 1.3 : 1.0
        break
      case "slime":
        this.maxHealth = this.tier === MonsterTier.MiniBoss ? 100 : 50
        this.attackPower = this.tier === MonsterTier.MiniBoss ? 5 : 3
        this.scale = this.tier === MonsterTier.MiniBoss ? 1.4 : 1.0
        break
      default:
        this.maxHealth = 40
        this.attackPower = 5
        this.scale = 1.0
    }

    this.health = this.maxHealth

    // Set special attack type for mini-bosses
    if (this.tier === MonsterTier.MiniBoss) {
      switch (this.type) {
        case "wolf":
          this.specialAttackType = "charge"
          break
        case "goblin":
          this.specialAttackType = "throw"
          break
        case "slime":
          this.specialAttackType = "split"
          break
      }
    }
  }

  update(playerPosition: number) {
    if (this.health <= 0) return

    // Update special attack cooldown
    if (this.specialAttackCooldown > 0) {
      this.specialAttackCooldown--
    }

    // Update attack animation state
    if (this.inAttackAnimation) {
      const now = Date.now()
      if (now - this.attackAnimationTime >= this.attackAnimationDuration) {
        this.inAttackAnimation = false
      }
    }

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--
    }

    this.isUsingSpecialAttack = false

    // Mini-boss special attacks
    if (this.tier === MonsterTier.MiniBoss) {
      const distToPlayer = Math.abs(this.position - playerPosition)

      // Only use special attacks when close to player
      if (distToPlayer < 100) {
        this.isUsingSpecialAttack = true
      }
    }

    // Calculate distance to player
    const distToPlayer = this.position - playerPosition
    const absDistToPlayer = Math.abs(distToPlayer)

    // Update facing direction based on player position
    this.facingRight = distToPlayer < 0

    // Check if monster should engage in combat
    if (absDistToPlayer <= MONSTER_ENGAGE_DISTANCE) {
      // Monster is in combat range - stop and fight
      this.inCombat = true
    } else {
      // Monster is not in combat range - move toward player
      this.inCombat = false

      // Base speed by monster type
      let speed = 0
      switch (this.type) {
        case "boss":
          speed = 1
          break
        case "wolf":
          speed = 2
          break
        case "slime":
          speed = 0.8
          break
        case "goblin":
          speed = 1.5
          break
        default:
          speed = 1.5
      }

      // Mini-bosses are slightly slower
      if (this.tier === MonsterTier.MiniBoss) {
        speed *= 0.8
      }

      // Move toward player (always left since player is auto-running right)
      this.position -= speed
    }

    // If monster somehow gets behind the player by a significant amount, mark for cleanup
    if (this.position < playerPosition - 100) {
      this.health = 0 // This will mark it for removal in the next cleanup
    }

    const shouldPerformSpecialAttack = this.isUsingSpecialAttack && this.specialAttackCooldown <= 0

    // Always call useSpecialAttack, but only execute if conditions are met
    if (shouldPerformSpecialAttack) {
      this.useSpecialAttack(playerPosition)
      this.specialAttackCooldown = 120 // 2 seconds at 60fps
      this.attackCooldown = 30 // Short cooldown after special attack
    } else {
      // Ensure cooldowns are still updated even if the special attack isn't used
      if (this.specialAttackCooldown > 0) {
        this.specialAttackCooldown = Math.max(0, this.specialAttackCooldown - 1)
      }
      if (this.attackCooldown > 0) {
        this.attackCooldown = Math.max(0, this.attackCooldown - 1)
      }
    }

    // Failsafe to prevent monsters from getting too far from player
    if (this.position < playerPosition - 200) {
      this.health = 0 // Mark for removal
    }
  }

  useSpecialAttack(playerPosition: number) {
    if (!this.specialAttackType) return

    switch (this.specialAttackType) {
      case "charge":
        // Wolf charge: move quickly toward player
        this.position = playerPosition + (this.position > playerPosition ? 1 : -1) * MONSTER_ENGAGE_DISTANCE
        this.attackAnimationTime = Date.now()
        this.inAttackAnimation = true
        break
      case "throw":
        // Goblin throw: nothing to do here, will be handled in combat
        this.attackAnimationTime = Date.now()
        this.inAttackAnimation = true
        break
      case "split":
        // Slime split: nothing to do here, will be handled in spawner
        this.attackAnimationTime = Date.now()
        this.inAttackAnimation = true
        break
    }
  }

  isDead(): boolean {
    return this.health <= 0
  }

  receiveDamage(amount: number) {
    this.health -= amount
    this.lastHitTime = Date.now()
    if (this.health < 0) this.health = 0
  }

  recentlyHit(): boolean {
    return Date.now() - this.lastHitTime < 200
  }

  isAttacking(): boolean {
    return this.inCombat && this.attackCooldown <= 0
  }

  // Start an attack and reset cooldown
  startAttack() {
    this.attackCooldown = this.type === "boss" ? 90 : this.type === "wolf" ? 45 : 60
    this.attackAnimationTime = Date.now()
    this.inAttackAnimation = true // Set the property, don't call a method
  }

  // Check if monster is currently in attack animation
  // inAttackAnimation(): boolean {
  //   const now = Date.now()
  //   const elapsed = now - this.attackAnimationTime
  //   return elapsed < this.attackAnimationDuration
  // }

  // Get the emoji representation of this monster
  getEmoji(): string {
    // Mini-boss versions
    if (this.tier === MonsterTier.MiniBoss) {
      switch (this.type) {
        case "wolf":
          return "🐻" // Dire Wolf (bear emoji)
        case "goblin":
          return "👹" // Goblin Brute (oni emoji)
        case "slime":
          return "🦠" // Giant Slime (microbe emoji)
      }
    }

    // Normal versions
    switch (this.type) {
      case "boss":
        return "👹"
      case "wolf":
        return "🐺"
      case "goblin":
        return "👺"
      case "slime":
        return "🫧"
      default:
        return "🧟"
    }
  }

  // Get the name of this monster
  getName(): string {
    if (this.tier === MonsterTier.MiniBoss) {
      switch (this.type) {
        case "wolf":
          return "Dire Wolf"
        case "goblin":
          return "Goblin Brute"
        case "slime":
          return "Giant Slime"
        default:
          return "Mini-Boss"
      }
    }

    if (this.tier === MonsterTier.Boss) {
      return "Boss"
    }

    switch (this.type) {
      case "wolf":
        return "Wolf"
      case "goblin":
        return "Goblin"
      case "slime":
        return "Slime"
      default:
        return "Monster"
    }
  }

  // Get XP value of this monster
  getXpValue(): number {
    if (this.tier === MonsterTier.Boss) {
      return 15
    }
    if (this.tier === MonsterTier.MiniBoss) {
      return 10
    }
    return 5
  }

  // Get essence value of this monster
  getEssenceValue(): number {
    if (this.tier === MonsterTier.Boss) {
      return 3
    }
    if (this.tier === MonsterTier.MiniBoss) {
      return 2
    }
    return 1
  }
}
