import { Player, type RandomBonus } from "./Player"
import { Spawner } from "./Spawner"
import { Combat } from "./Combat"
import { WorldState, type WorldSnapshot } from "./WorldState"
import { DamageLog } from "./DamageLog"
import { EssenceDrop } from "./EssenceDrop"
import { Pet, type PetType } from "./Pet"
import { getPetTypeBasedOnKills, getPetTypeById, type PetTypeDefinition } from "./PetTypes"
import { GameStateManager } from "./GameStateManager"
import { MONSTER_ENGAGE_DISTANCE } from "./Monster"

export class GameLoop {
  player = new Player()
  private spawner = new Spawner()
  private distanceTraveled = 0
  private lastLevelUp = 0
  private showLevelUp = false
  private essenceDrops: EssenceDrop[] = []
  private monsterTypes: Map<string, string> = new Map() // Track monster types for drops
  private pet: Pet
  private petDefinition: PetTypeDefinition
  private petTrails: { x: number; y: number; time: number }[] = []
  private showTraitNotification = false
  private lastTraitNotification = 0
  private initialized = false

  // NEW: Game state manager
  private gameState = new GameStateManager()

  // NEW: Combat transition variables
  private playerTargetX = 0
  private monsterTargetX = 0
  private combatStartTime = 0
  private combatEndTime = 0
  private isCombatEnding = false

  // NEW: Track random bonus notifications
  private showRandomBonusNotification = false
  private lastRandomBonus: RandomBonus | null = null
  private lastRandomBonusTime = 0

  constructor() {
    try {
      // Initialize with a random pet based on monster kills
      this.petDefinition = getPetTypeBasedOnKills(this.player.getMonsterKills())
      this.pet = new Pet(this.petDefinition.id, this.petDefinition)

      // Apply pet bonuses to player
      this.applyPetBonusesToPlayer()

      this.initialized = true
      console.log("GameLoop initialized successfully")
    } catch (error) {
      console.error("Error initializing GameLoop:", error)
      // Set default values to prevent crashes
      this.petDefinition = {
        id: "paw",
        name: "Cat",
        description: "A loyal cat companion",
        emoji: "🐱",
        statBonuses: { str: 0, dex: 0, int: 0, luk: 0 },
        abilities: [],
      }
      this.pet = new Pet("paw", this.petDefinition)
    }
  }

  private applyPetBonusesToPlayer() {
    try {
      // Get the pet's stat bonuses
      const bonuses = this.pet.getStatBonuses()

      // Apply these bonuses to the player's base stats
      this.player.applyPetBonus(bonuses)
    } catch (error) {
      console.error("Error applying pet bonuses:", error)
    }
  }

  update() {
    try {
      if (!this.initialized) {
        console.warn("GameLoop not initialized, attempting to initialize")
        this.petDefinition = getPetTypeBasedOnKills(this.player.getMonsterKills())
        this.pet = new Pet(this.petDefinition.id, this.petDefinition)
        this.applyPetBonusesToPlayer()
        this.initialized = true
      }

      // Update camera shake effect
      this.gameState.updateCameraShake()

      // Pause the game if there's a pending trait choice
      if (this.player.pendingTrait) {
        if (this.gameState.getState() !== "traitselect") {
          this.gameState.transitionTo("traitselect")
        }
        return
      } else if (this.gameState.getState() === "traitselect") {
        this.gameState.transitionTo(this.gameState.getPreviousState())
      }

      if (!this.player.isAlive) {
        if (this.gameState.getState() !== "dead") {
          this.gameState.transitionTo("dead")
        }
        return
      }

      // Track level for level-up detection
      const prevLevel = this.player.level

      // Update player based on current game state
      if (this.gameState.isState("running")) {
        this.player.update()
        this.updateRunningState()
      } else if (this.gameState.isState("combat")) {
        this.player.update()
        this.updateCombatState()
      } else if (this.gameState.isState("levelup")) {
        // Still update player and combat during level up, just show the animation
        this.player.update()

        // Continue combat if player was in combat before leveling up
        if (this.gameState.getPreviousState() === "combat") {
          this.updateCombatState()
        } else {
          this.updateRunningState()
        }

        // Check if level up animation should end
        if (Date.now() - this.lastLevelUp > 2000) {
          this.showLevelUp = false
          this.gameState.transitionTo(this.gameState.getPreviousState())
        }
      }

      // Update pet regardless of state
      this.updatePet()

      // Update essence drops
      this.updateEssenceDrops()

      this.distanceTraveled = Math.floor(this.player.position / 10)

      // Check for level up
      if (this.player.level > prevLevel) {
        this.showLevelUp = true
        this.lastLevelUp = Date.now()

        // Store the current state before transitioning to levelup
        const currentState = this.gameState.getState()
        this.gameState.transitionTo("levelup")

        // Reset attack animation and cooldown to prevent getting stuck
        this.player.inAttackAnimation = false
        this.player.attackCooldown = 0

        // Add debug logging
        console.log("Level up detected! Current state:", {
          previousState: currentState,
          playerAttackAnimation: this.player.inAttackAnimation,
          playerAttackCooldown: this.player.attackCooldown,
        })

        // Schedule transition back to previous state
        setTimeout(() => {
          if (this.gameState.getState() === "levelup") {
            const returnState = this.gameState.getPreviousState()
            this.gameState.transitionTo(returnState)
            console.log("Returning to state after level up:", returnState)
          }
        }, 2000)
      }

      // Hide level up notification after 2 seconds
      if (this.showLevelUp && Date.now() - this.lastLevelUp > 2000) {
        this.showLevelUp = false
      }

      // Check for trait notification
      const traitNotification = this.player.getTraitNotification()
      if (traitNotification && !this.showTraitNotification) {
        this.showTraitNotification = true
        this.lastTraitNotification = Date.now()
      }

      // Hide trait notification after 5 seconds
      if (this.showTraitNotification && Date.now() - this.lastTraitNotification > 5000) {
        this.showTraitNotification = false
      }

      // Hide random bonus notification after 3 seconds
      if (this.showRandomBonusNotification && Date.now() - this.lastRandomBonusTime > 3000) {
        this.showRandomBonusNotification = false
        this.lastRandomBonus = null
      }
    } catch (error) {
      console.error("Error in GameLoop update:", error)
    }
  }

  private updateRunningState() {
    try {
      // Update spawner in running state
      this.spawner.update(this.player.position)

      const monsters = this.spawner.getMonsters()
      monsters.forEach((monster) => monster.update(this.player.position))

      // Store monster types for later reference
      monsters.forEach((monster) => {
        this.monsterTypes.set(monster.id, monster.type)
      })

      // Check for combat engagement
      const inRangeMonster = monsters.find(
        (m) => Math.abs(m.position - this.player.position) <= MONSTER_ENGAGE_DISTANCE * 1.5,
      )

      if (inRangeMonster) {
        // Enter combat with the closest monster
        this.enterCombat(inRangeMonster.id)
      }
    } catch (error) {
      console.error("Error in updateRunningState:", error)
    }
  }

  private updateCombatState() {
    try {
      const monsters = this.spawner.getMonsters()
      const currentCombatMonsterId = this.gameState.getCurrentCombatMonster()

      // Find the current combat monster
      const combatMonster = monsters.find((m) => m.id === currentCombatMonsterId)

      // Enhanced combat cleanup logic
      if (!combatMonster || combatMonster.isDead()) {
        // Combat is over, transition back to running
        if (!this.isCombatEnding) {
          this.isCombatEnding = true
          this.combatEndTime = Date.now()

          // Force reset attack animations and cooldowns
          this.player.inAttackAnimation = false
          this.player.attackCooldown = 0

          console.log("Combat ending, resetting player state:", {
            inAttackAnimation: this.player.inAttackAnimation,
            attackCooldown: this.player.attackCooldown,
            lastAttackTime: this.player.lastAttackTime,
          })

          // Add a slight delay before transitioning back to running
          setTimeout(() => {
            this.exitCombat()
          }, 500)
        }
        return
      }

      // Update only the combat monster
      combatMonster.update(this.player.position)

      // Handle combat resolution
      Combat.resolveSingle(this.player, combatMonster)

      // Additional animation timer check for player
      if (this.player.inAttackAnimation) {
        const now = Date.now()
        const elapsed = now - this.player.attackAnimationTime
        if (elapsed >= this.player.attackAnimationDuration) {
          this.player.inAttackAnimation = false
          console.log("Resetting player attack animation via timer check")
        }
      }

      // Check if monster died during this update
      if (combatMonster.isDead()) {
        // Ensure proper cleanup
        combatMonster.inCombat = false
        combatMonster.attackCooldown = 0
        combatMonster.inAttackAnimation = false

        // Record kill for trait system
        this.player.recordMonsterKill(combatMonster.type)

        const xpReward = combatMonster.getXpValue()
        this.player.gainXP(xpReward)

        // Spawn essence drop
        const dropChance = this.player.getEssenceDropChance(combatMonster.type)
        if (Math.random() < dropChance) {
          const drop = new EssenceDrop(combatMonster.position)
          this.essenceDrops.push(drop)
        }

        // Shake camera on monster death
        this.gameState.shakeCamera(8)

        console.log("Monster died, cleaning up:", {
          monsterId: combatMonster.id,
          monsterType: combatMonster.type,
          inCombat: combatMonster.inCombat,
          attackCooldown: combatMonster.attackCooldown,
        })
      }
    } catch (error) {
      console.error("Error in updateCombatState:", error)
    }
  }

  private updatePet() {
    try {
      // Update pet and check if it collected anything
      const collected = this.pet.update(this.player.position, this.essenceDrops, this.player.isAlive, this.player.level)

      if (collected) {
        // Use player's luck to determine essence amount
        const monsterType = this.monsterTypes.get(collected.id.split("-")[1]) || "normal"
        const essenceAmount = this.player.getEssenceDropAmount(monsterType as any)
        this.player.essence += essenceAmount

        // Add trail particles when pet collects essence
        if (this.pet.isCollecting()) {
          for (let i = 0; i < 3; i++) {
            this.petTrails.push({
              x: this.pet.x + (Math.random() * 20 - 10),
              y: this.pet.y + (Math.random() * 20 - 10),
              time: Date.now(),
            })
          }
        }
      }

      // Clean up old trail particles
      this.petTrails = this.petTrails.filter((trail) => Date.now() - trail.time < 1000)
    } catch (error) {
      console.error("Error in updatePet:", error)
    }
  }

  private updateEssenceDrops() {
    try {
      // Update essence drops and collect them
      this.essenceDrops.forEach((drop) => {
        const wasCollected = drop.update(this.player.position)
        if (wasCollected) {
          // Use player's luck to determine essence amount
          const monsterType = this.monsterTypes.get(drop.id.split("-")[1]) || "normal"
          const essenceAmount = this.player.getEssenceDropAmount(monsterType as any)
          this.player.essence += essenceAmount
        }
      })

      // Clean up drops that have completed their animation
      this.essenceDrops = this.essenceDrops.filter((d) => !d.shouldRemove())
    } catch (error) {
      console.error("Error in updateEssenceDrops:", error)
    }
  }

  // Enter combat with a specific monster
  private enterCombat(monsterId: string) {
    try {
      this.gameState.transitionTo("combat")
      this.gameState.setCurrentCombatMonster(monsterId)
      this.player.enterCombat(monsterId)
      this.combatStartTime = Date.now()
      this.isCombatEnding = false

      // Find the monster
      const monster = this.spawner.getMonsters().find((m) => m.id === monsterId)
      if (monster) {
        monster.inCombat = true
      }
    } catch (error) {
      console.error("Error in enterCombat:", error)
    }
  }

  // Exit combat and return to running state
  private exitCombat() {
    try {
      // Add debug logging
      console.log("Exiting combat state", {
        previousState: this.gameState.getState(),
        playerAttackAnimation: this.player.inAttackAnimation,
        playerAttackCooldown: this.player.attackCooldown,
      })

      // Reset attack states to prevent getting stuck
      this.player.inAttackAnimation = false
      this.player.attackCooldown = 0

      this.gameState.transitionTo("running")
      this.gameState.setCurrentCombatMonster(null)
      this.player.exitCombat()
      this.isCombatEnding = false
    } catch (error) {
      console.error("Error in exitCombat:", error)
    }
  }

  getSnapshot(): WorldSnapshot {
    try {
      return WorldState.buildSnapshot(
        this.player,
        this.spawner.getMonsters(),
        this.distanceTraveled,
        !this.player.isAlive,
        this.showLevelUp,
        this.essenceDrops,
        this.pet,
        this.petTrails,
        this.showTraitNotification,
        this.petDefinition,
        this.showRandomBonusNotification,
        this.lastRandomBonus,
        this.gameState,
      )
    } catch (error) {
      console.error("Error in getSnapshot:", error)
      // Return a minimal valid snapshot to prevent crashes
      return {
        player: {
          health: 100,
          maxHealth: 100,
          xp: 0,
          xpToNextLevel: 10,
          essence: 0,
          level: 1,
          position: 0,
          inCombat: false,
          isAlive: true,
          pendingTrait: false,
          traits: [],
          mp: 10,
          maxMP: 10,
          stats: {
            base: { str: 1, dex: 1, int: 1, luk: 1 },
            current: { str: 1, dex: 1, int: 1, luk: 1 },
            derived: {
              maxHealth: 100,
              maxMP: 10,
              physicalDamage: 1,
              magicalDamage: 1,
              critChance: 0.05,
              critDamage: 1.5,
              dodgeChance: 0.05,
              movementSpeed: 1,
              attackSpeed: 1,
            },
            descriptions: {
              str: "Strength",
              dex: "Dexterity",
              int: "Intelligence",
              luk: "Luck",
            },
          },
          unlockedAbilities: [],
          unlockedTraits: [],
          monsterKills: {},
          traitProgress: {},
          randomBonuses: [],
          inAttackAnimation: false,
        },
        monsters: [],
        distance: 0,
        gameOver: false,
        showLevelUp: false,
        showTraitNotification: false,
        showRandomBonusNotification: false,
        traitNotification: null,
        randomBonusNotification: null,
        damageEvents: {
          playerHits: [],
          monsterHits: [],
          playerDodges: [],
        },
        essenceDrops: [],
        pet: {
          x: 0,
          y: 0,
          level: 1,
          emoji: "🐱",
          isCollecting: false,
          reactionEmoji: "",
          xp: 0,
          nextLevelXp: 5,
        },
        petDefinition: this.petDefinition,
        petTrails: [],
        gameState: {
          current: "running",
          isTransitioning: false,
          transitionProgress: 1,
          cameraOffset: { x: 0, y: 0 },
          combatMonsterId: null,
        },
        currentBiome: "forest",
      }
    }
  }

  // Apply a trait and roll for random bonus
  applyTrait(trait: string) {
    try {
      // Apply the trait
      const randomBonus = this.player.applyTrait(trait)

      // Show the random bonus notification
      this.lastRandomBonus = randomBonus
      this.showRandomBonusNotification = true
      this.lastRandomBonusTime = Date.now()

      // Exit trait selection state
      if (this.gameState.getState() === "traitselect") {
        this.gameState.transitionTo(this.gameState.getPreviousState())
      }
    } catch (error) {
      console.error("Error in applyTrait:", error)
    }
  }

  restart() {
    try {
      this.player = new Player()
      this.spawner = new Spawner()
      this.distanceTraveled = 0
      this.showLevelUp = false
      this.essenceDrops = []
      this.monsterTypes.clear()

      // Get a new pet based on monster kills (will be random on first run)
      this.petDefinition = getPetTypeBasedOnKills(this.player.getMonsterKills())
      this.pet = new Pet(this.petDefinition.id, this.petDefinition)

      // Apply pet bonuses to player
      this.applyPetBonusesToPlayer()

      this.petTrails = []
      this.showTraitNotification = false
      this.showRandomBonusNotification = false
      this.lastRandomBonus = null

      // Reset game state
      this.gameState = new GameStateManager()

      DamageLog.clearAllHits()
    } catch (error) {
      console.error("Error in restart:", error)
    }
  }

  changePetType(type: PetType) {
    try {
      const petDefinition = getPetTypeById(type)
      this.petDefinition = petDefinition

      // Keep pet level between changes
      const petLevel = this.pet.level
      const petXp = this.pet.xp

      this.pet = new Pet(type, petDefinition)
      this.pet.level = petLevel
      this.pet.xp = petXp

      // Reapply pet bonuses
      this.applyPetBonusesToPlayer()
    } catch (error) {
      console.error("Error in changePetType:", error)
    }
  }

  // Get the current game state
  getGameState(): GameStateManager {
    return this.gameState
  }
}
