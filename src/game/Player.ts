import type { GameState } from "./GameState"

export interface PlayerState {
  position: number
  health: number
  maxHealth: number
  speed: number
  state: "idle" | "running" | "attacking" | "hit"
  isLevelingUp: boolean
  level: number
  experience: number
  experienceToNextLevel: number
  strength: number
  dexterity: number
  intelligence: number
  luck: number
  lastAttackTime: number
  attackCooldown: number
  // Add other player properties as needed
}

export function updatePlayerState(gameState: GameState, deltaTime: number): void {
  const player = gameState.player

  // Basic player movement logic
  if (!player.isLevelingUp && player.state !== "hit") {
    // Auto-run logic
    player.state = "running"
  }

  // Handle attack cooldown
  if (player.lastAttackTime > 0) {
    const timeSinceLastAttack = gameState.gameTime - player.lastAttackTime
    if (timeSinceLastAttack >= player.attackCooldown) {
      player.lastAttackTime = 0 // Reset attack timer when cooldown is complete
    }
  }

  // Check for level up
  if (player.experience >= player.experienceToNextLevel) {
    levelUp(player)
  }
}

function levelUp(player: PlayerState): void {
  player.level += 1
  player.experience -= player.experienceToNextLevel
  player.experienceToNextLevel = Math.floor(player.experienceToNextLevel * 1.2) // Increase XP needed for next level
  player.maxHealth += 5 // Increase max health on level up
  player.health = player.maxHealth // Restore health on level up
  player.isLevelingUp = true

  // Reset level up state after a delay
  setTimeout(() => {
    player.isLevelingUp = false
  }, 2000)

  // Random stat increases
  const statIncrease = Math.floor(Math.random() * 4)
  switch (statIncrease) {
    case 0:
      player.strength += 1
      break
    case 1:
      player.dexterity += 1
      break
    case 2:
      player.intelligence += 1
      break
    case 3:
      player.luck += 1
      break
  }
}
