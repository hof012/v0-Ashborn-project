import type { GameState } from "./GameState"
import type { Monster } from "./Monster"
import type { Player } from "./Player"

// This is the named export that was missing
export const Combat = {
  update(gameState: GameState, deltaTime: number): void {
    // Basic stub implementation
    const player = gameState.player

    // Skip combat if player is leveling up
    if (player.isLevelingUp) return

    // Process player attacks
    this.processPlayerAttacks(gameState)

    // Process monster attacks
    this.processMonsterAttacks(gameState)
  },

  processPlayerAttacks(gameState: GameState): void {
    const player = gameState.player

    // Check if player can attack
    if (player.lastAttackTime === 0) {
      // Find monsters in attack range
      const monstersInRange = gameState.monsters.filter((monster) => {
        return (
          Math.abs(monster.position - player.position) < 60 && monster.state !== "dying" && monster.state !== "dead"
        )
      })

      if (monstersInRange.length > 0) {
        // Attack the closest monster
        const closestMonster = monstersInRange.reduce((closest, current) => {
          const closestDist = Math.abs(closest.position - player.position)
          const currentDist = Math.abs(current.position - player.position)
          return currentDist < closestDist ? current : closest
        })

        // Calculate damage based on player stats
        const damage = this.calculatePlayerDamage(player)

        // Apply damage to monster
        this.applyDamageToMonster(gameState, closestMonster, damage)

        // Set attack cooldown
        player.lastAttackTime = gameState.gameTime
        player.state = "attacking"

        // Reset player state after attack animation
        setTimeout(() => {
          if (player.state === "attacking") {
            player.state = "running"
          }
        }, 500)
      }
    }
  },

  processMonsterAttacks(gameState: GameState): void {
    const player = gameState.player

    // Process each monster's attack
    gameState.monsters.forEach((monster) => {
      if (monster.state === "attacking") {
        const distanceToPlayer = Math.abs(monster.position - player.position)

        // Check if monster is in range to hit player
        if (distanceToPlayer < 50) {
          // Apply damage to player
          this.applyDamageToPlayer(gameState, monster.damage)
        }
      }
    })
  },

  calculatePlayerDamage(player: Player): number {
    // Base damage + strength bonus
    const baseDamage = 5 + Math.floor(player.strength / 2)

    // Critical hit chance based on luck
    const critChance = 0.05 + player.luck * 0.01
    const isCrit = Math.random() < critChance

    // Apply critical multiplier if applicable
    return isCrit ? Math.floor(baseDamage * 1.5) : baseDamage
  },

  applyDamageToMonster(gameState: GameState, monster: Monster, damage: number): void {
    // Apply damage to monster
    monster.health -= damage

    // Create damage number
    if (gameState.damageNumbers) {
      gameState.damageNumbers.push({
        value: damage,
        x: monster.position,
        y: 100,
        isCritical: damage > 7, // Assuming damage > 7 is a critical hit
        createdAt: gameState.gameTime,
        lifetime: 1000,
      })
    }

    // Check if monster is defeated
    if (monster.health <= 0) {
      monster.health = 0
      monster.state = "dying"
      monster.lastStateChange = gameState.gameTime

      // Award experience to player
      gameState.player.experience += monster.experienceValue
    } else {
      // Set monster to hit state
      monster.state = "hit"
      monster.lastStateChange = gameState.gameTime
    }
  },

  applyDamageToPlayer(gameState: GameState, damage: number): void {
    const player = gameState.player

    // Apply damage to player
    player.health -= damage

    // Create damage number for player
    if (gameState.damageNumbers) {
      gameState.damageNumbers.push({
        value: damage,
        x: player.position,
        y: 100,
        isCritical: false,
        createdAt: gameState.gameTime,
        lifetime: 1000,
      })
    }

    // Set player to hit state
    player.state = "hit"

    // Reset player state after hit animation
    setTimeout(() => {
      if (player.state === "hit") {
        player.state = "running"
      }
    }, 500)

    // Check if player is defeated
    if (player.health <= 0) {
      player.health = 0
      gameState.isPaused = true
      gameState.isGameOver = true
    }
  },
}
