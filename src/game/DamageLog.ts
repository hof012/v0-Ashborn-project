// Simple interface for damage events
interface DamageEvent {
  id: string // monster ID or "player"
  amount: number
  timestamp: number
  position: number // World position for accurate placement
  isCritical?: boolean // For critical hits
}

// Interface for dodge events
interface DodgeEvent {
  timestamp: number
  position: number
}

// Global state for damage events
let monsterHits: DamageEvent[] = []
let playerHits: DamageEvent[] = []
let playerDodges: DodgeEvent[] = []

export const DamageLog = {
  logMonsterHit(id: string, amount: number, position: number, isCritical = false) {
    monsterHits.push({ id, amount, timestamp: Date.now(), position, isCritical })

    // Keep array size reasonable
    if (monsterHits.length > 20) {
      monsterHits = monsterHits.slice(-20)
    }
  },

  logPlayerHit(amount: number, position = 0) {
    playerHits.push({ id: "player", amount, timestamp: Date.now(), position })

    // Keep array size reasonable
    if (playerHits.length > 20) {
      playerHits = playerHits.slice(-20)
    }
  },

  logPlayerDodge(position = 0) {
    playerDodges.push({ timestamp: Date.now(), position })

    // Keep array size reasonable
    if (playerDodges.length > 10) {
      playerDodges = playerDodges.slice(-10)
    }
  },

  getMonsterHits(maxAgeMs = 2000) {
    const cutoff = Date.now() - maxAgeMs
    return monsterHits.filter((hit) => hit.timestamp > cutoff)
  },

  getPlayerHits(maxAgeMs = 2000) {
    const cutoff = Date.now() - maxAgeMs
    return playerHits.filter((hit) => hit.timestamp > cutoff)
  },

  getPlayerDodges(maxAgeMs = 2000) {
    const cutoff = Date.now() - maxAgeMs
    return playerDodges.filter((dodge) => dodge.timestamp > cutoff)
  },

  getLatestPlayerDamage(): number {
    const recent = playerHits[playerHits.length - 1]
    return recent?.amount || 0
  },

  clearOldHits(ageMs = 800) {
    const cutoff = Date.now() - ageMs
    monsterHits = monsterHits.filter((d) => d.timestamp > cutoff)
    playerHits = playerHits.filter((d) => d.timestamp > cutoff)
    playerDodges = playerDodges.filter((d) => d.timestamp > cutoff)
  },

  clearAllHits() {
    monsterHits = []
    playerHits = []
    playerDodges = []
  },
}

// Export the types for use in other files
export type { DamageEvent, DodgeEvent }
