import type { Player, RandomBonus } from "./Player"
import type { Monster } from "./Monster"
import { DamageLog, type DamageEvent, type DodgeEvent } from "./DamageLog"
import type { EssenceDrop } from "./EssenceDrop"
import type { Pet } from "./Pet"
import type { BaseStats, DerivedStats } from "./Stats"
import type { Trait } from "./TraitSystem"
import type { PetTypeDefinition } from "./PetTypes"
import type { GameStateManager, GameState } from "./GameStateManager"
import { getCurrentBiome, type BiomeType } from "./BiomeTypes" // Import from BiomeTypes.ts instead

export interface WorldSnapshot {
  player: {
    health: number
    maxHealth: number
    xp: number
    xpToNextLevel: number
    essence: number
    level: number
    position: number
    inCombat: boolean
    isAlive: boolean
    pendingTrait: boolean
    traits: string[]
    mp: number
    maxMP: number
    stats: {
      base: BaseStats
      current: BaseStats
      derived: DerivedStats
      descriptions: Record<keyof BaseStats, string>
    }
    unlockedAbilities: string[]
    unlockedTraits: Trait[]
    monsterKills: Record<string, number>
    traitProgress: Record<string, { kills: number; nextUnlock: number | null }>
    randomBonuses: RandomBonus[] // NEW: Add random bonuses
    inAttackAnimation: boolean
  }
  monsters: {
    id: string
    health: number
    maxHealth: number
    position: number
    type: string
    lastHitTime?: number
    emoji: string
    inCombat: boolean
    facingRight: boolean
    inAttackAnimation: boolean
    tier: number
  }[]
  distance: number
  gameOver: boolean
  showLevelUp: boolean
  showTraitNotification: boolean
  showRandomBonusNotification: boolean
  traitNotification: {
    trait: Trait
    timestamp: number
  } | null
  randomBonusNotification: RandomBonus | null
  damageEvents: {
    playerHits: DamageEvent[]
    monsterHits: DamageEvent[]
    playerDodges: DodgeEvent[]
  }
  essenceDrops: {
    id: string
    position: number
    y: number
    collected: boolean
  }[]
  pet: {
    x: number
    y: number
    level: number
    emoji: string
    isCollecting: boolean
    reactionEmoji: string
    xp: number
    nextLevelXp: number
  }
  petDefinition: PetTypeDefinition
  petTrails: {
    x: number
    y: number
    time: number
  }[]
  // NEW: Game state information
  gameState: {
    current: GameState
    isTransitioning: boolean
    transitionProgress: number
    cameraOffset: { x: number; y: number }
    combatMonsterId: string | null
  }
  // NEW: Current biome information
  currentBiome: BiomeType
}

export class WorldState {
  static buildSnapshot(
    player: Player,
    monsters: Monster[],
    distance: number,
    gameOver: boolean,
    showLevelUp: boolean,
    essenceDrops: EssenceDrop[],
    pet: Pet,
    petTrails: { x: number; y: number; time: number }[] = [],
    showTraitNotification = false,
    petDefinition: PetTypeDefinition,
    showRandomBonusNotification = false,
    randomBonusNotification: RandomBonus | null = null,
    gameStateManager: GameStateManager,
  ): WorldSnapshot {
    // Clean up old hits
    DamageLog.clearOldHits(800)

    // Get player stats
    const playerStats = player.stats
    const baseStats = playerStats.base
    const currentStats = playerStats.current
    const derivedStats = playerStats.calculateDerivedStats()
    const statDescriptions = playerStats.getStatDescriptions()

    // Get trait information
    const unlockedTraits = player.getUnlockedTraits()
    const monsterKills = player.getMonsterKills()
    const traitNotification = player.getTraitNotification()
    const traitProgress = player.traitSystem.getTraitProgress()

    // Get random bonuses
    const randomBonuses = player.getRandomBonuses()

    // Get current biome based on distance
    const biome = getCurrentBiome(distance)

    return {
      player: {
        health: player.health,
        maxHealth: player.maxHealth,
        xp: player.xp,
        xpToNextLevel: player.level * 10,
        essence: player.essence,
        level: player.level,
        position: player.position,
        inCombat: player.inCombat,
        isAlive: player.isAlive,
        pendingTrait: player.pendingTrait,
        traits: player.traits,
        mp: player.mp,
        maxMP: derivedStats.maxMP,
        stats: {
          base: baseStats,
          current: currentStats,
          derived: derivedStats,
          descriptions: statDescriptions,
        },
        unlockedAbilities: player.unlockedAbilities,
        unlockedTraits,
        monsterKills,
        traitProgress,
        randomBonuses,
        inAttackAnimation: player.inAttackAnimation, // Changed from function call to property access
      },
      monsters: monsters.map((monster) => ({
        id: monster.id,
        health: monster.health,
        maxHealth: monster.maxHealth,
        position: monster.position,
        type: monster.type,
        lastHitTime: monster.lastHitTime,
        emoji: monster.getEmoji(),
        inCombat: monster.inCombat,
        facingRight: monster.facingRight,
        inAttackAnimation: monster.inAttackAnimation, // Changed from function call to property access
        tier: monster.tier,
      })),
      distance,
      gameOver,
      showLevelUp,
      showTraitNotification,
      showRandomBonusNotification,
      traitNotification,
      randomBonusNotification,
      damageEvents: {
        playerHits: DamageLog.getPlayerHits(),
        monsterHits: DamageLog.getMonsterHits(),
        playerDodges: DamageLog.getPlayerDodges(),
      },
      essenceDrops: essenceDrops.map((drop) => ({
        id: drop.id,
        position: drop.position,
        y: drop.y,
        collected: drop.collected,
      })),
      pet: {
        x: pet.x,
        y: pet.y,
        level: pet.level,
        emoji: pet.getEmoji(),
        isCollecting: pet.isCollecting(),
        reactionEmoji: pet.getReactionEmoji(),
        xp: pet.xp,
        nextLevelXp: pet.level * 5,
      },
      petDefinition,
      petTrails,
      // Game state information
      gameState: {
        current: gameStateManager.getState(),
        isTransitioning: gameStateManager.isInTransition(),
        transitionProgress: gameStateManager.getTransitionProgress(),
        cameraOffset: gameStateManager.getCameraOffset(),
        combatMonsterId: gameStateManager.getCurrentCombatMonster(),
      },
      // Current biome
      currentBiome: biome.type,
    }
  }
}
