import type { Player } from "./Player"
import type { Monster } from "./Monster"
import { DamageLog } from "./DamageLog"
import { MONSTER_ENGAGE_DISTANCE } from "./Monster"

// Maximum number of monsters that can engage the player at once
export const MAX_MONSTERS_IN_COMBAT = 2

export class Combat {
  static resolve(player: Player, monsters: Monster[]) {
    if (!player.isAlive) return

    // Count how many monsters are currently in combat
    let monstersInCombat = 0

    // Sort monsters by distance to player (closest first)
    const sortedMonsters = [...monsters].sort((a, b) => {
      const distA = Math.abs(a.position - player.position)
      const distB = Math.abs(b.position - player.position)
      return distA - distB
    })

    for (const monster of sortedMonsters) {
      if (monster.isDead()) continue

      const distToPlayer = Math.abs(monster.position - player.position)
      const inRange = distToPlayer <= MONSTER_ENGAGE_DISTANCE

      // If monster is in range, engage in combat
      if (inRange) {
        // Limit the number of monsters that can engage at once
        if (monstersInCombat < MAX_MONSTERS_IN_COMBAT) {
          monstersInCombat++

          // If monster is ready to attack
          if (monster.isAttacking()) {
            // Monster attacks player
            const monsterDmg = monster.attackPower
            monster.startAttack()

            // Check if player dodged
            const dodged = player.receiveDamage(monsterDmg)

            if (!dodged) {
              DamageLog.logPlayerHit(monsterDmg, monster.position)
            } else {
              // Log dodge event
              DamageLog.logPlayerDodge(monster.position)
            }
          }

          // Player attacks monster if not on cooldown
          const { damage: playerDmg, isCritical } = player.dealDamage(monster.type)

          // Skip if player is on attack cooldown
          if (playerDmg > 0) {
            // Player attacks monster
            monster.receiveDamage(playerDmg)

            // Log damage (for floating text)
            DamageLog.logMonsterHit(monster.id, playerDmg, monster.position, isCritical)

            // Monster dies? Grant rewards
            if (monster.isDead()) {
              // Record kill for trait system
              player.recordMonsterKill(monster.type)

              const xpReward = monster.type === "boss" ? 15 : 5
              // Essence is now handled by the drop system
              player.gainXP(xpReward)
            }
          }
        } else {
          // Too many monsters in combat, this one waits
          // Slightly push back monsters that are waiting
          if (monster.position < player.position) {
            monster.position -= 0.5 // Move slightly away to prevent piling up
          }
        }
      }
    }
  }

  // NEW: Handle combat with a single monster (for combat stage)
  static resolveSingle(player: Player, monster: Monster) {
    if (!player.isAlive || monster.isDead()) return

    // Debug logging
    console.debug("Combat state:", {
      monsterId: monster.id,
      monsterType: monster.type,
      monsterHealth: monster.health,
      inCombat: monster.inCombat,
      distToPlayer: Math.abs(monster.position - player.position),
      playerAttackCooldown: player.attackCooldown,
      monsterAttackCooldown: monster.attackCooldown,
      playerInAttackAnimation: player.inAttackAnimation, // Changed from function call to property access
      monsterInAttackAnimation: monster.inAttackAnimation, // Changed from function call to property access
    })

    // If monster is ready to attack
    if (monster.isAttacking()) {
      // Monster attacks player
      const monsterDmg = monster.attackPower
      monster.startAttack()

      // Check if player dodged
      const dodged = player.receiveDamage(monsterDmg)

      if (!dodged) {
        DamageLog.logPlayerHit(monsterDmg, monster.position)
      } else {
        // Log dodge event
        DamageLog.logPlayerDodge(monster.position)
      }
    }

    // Player attacks monster if not on cooldown
    const { damage: playerDmg, isCritical } = player.dealDamage(monster.type)

    // Skip if player is on attack cooldown
    if (playerDmg > 0) {
      // Player attacks monster
      monster.receiveDamage(playerDmg)

      // Log damage (for floating text)
      DamageLog.logMonsterHit(monster.id, playerDmg, monster.position, isCritical)
    }

    // Ensure proper state cleanup if monster died
    if (monster.isDead()) {
      monster.inCombat = false
      monster.attackCooldown = 0
    }
  }
}
