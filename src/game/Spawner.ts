import { Monster, type MonsterType } from "./Monster"

export class Spawner {
  private cooldown = 0
  private spawnRate = 120
  private monsters: Monster[] = []
  private distance = 0
  private MAX_MONSTERS = 5 // Limit the number of monsters

  update(playerPosition: number) {
    this.cooldown--
    this.distance = Math.floor(playerPosition / 100)

    // Only spawn new monsters if we're under the limit
    if (this.cooldown <= 0 && this.monsters.length < this.MAX_MONSTERS) {
      // Spawn monsters ahead of the player (to the right)
      this.spawnMonster(playerPosition + 600 + Math.random() * 200)
      this.cooldown = this.spawnRate + Math.floor(Math.random() * 60)
    }

    // Clean up dead monsters and those far behind the player
    this.monsters = this.monsters.filter((m) => {
      // Remove dead monsters
      if (m.isDead()) return false

      // Remove monsters that are too far behind the player (offscreen)
      if (m.position < playerPosition - 300) return false

      return true
    })
  }

  spawnMonster(position: number) {
    // Determine monster type based on distance
    let type: MonsterType | undefined = undefined

    // Boss spawn chance increases with distance
    const bossChance = Math.min(0.1, 0.02 + this.distance / 1000)

    if (Math.random() < bossChance) {
      type = "boss"
    } else {
      // Regular monster types
      const rand = Math.random()
      if (rand < 0.33) {
        type = "wolf"
      } else if (rand < 0.66) {
        type = "goblin"
      } else {
        type = "slime"
      }
    }

    const monster = new Monster(position, type)
    this.monsters.push(monster)

    console.log(`Spawned ${type} at position ${position}, total monsters: ${this.monsters.length}`)
  }

  getMonsters(): Monster[] {
    return this.monsters
  }
}
