import type { PetType } from "./Pet"

export interface PetTypeDefinition {
  id: PetType
  name: string
  emoji: string
  evolvedEmoji: string
  bonus: {
    strength?: number
    dexterity?: number
    intelligence?: number
    luck?: number
  }
  description: string
}

export const PET_TYPES: PetTypeDefinition[] = [
  {
    id: "paw",
    name: "Wolf Cub",
    emoji: "🐾",
    evolvedEmoji: "🐺",
    bonus: { dexterity: 2 },
    description: "Increases attack speed and dodge chance",
  },
  {
    id: "star",
    name: "Star Spirit",
    emoji: "🌟",
    evolvedEmoji: "⭐",
    bonus: { intelligence: 2 },
    description: "Increases XP gain and mana regeneration",
  },
  {
    id: "teddy",
    name: "Teddy Friend",
    emoji: "🧶",
    evolvedEmoji: "🧸",
    bonus: { strength: 2 },
    description: "Increases attack power and max health",
  },
  {
    id: "ghost",
    name: "Ghost Buddy",
    emoji: "🌫️",
    evolvedEmoji: "👻",
    bonus: { luck: 2 },
    description: "Increases critical hit chance and essence drops",
  },
]

// Function to get a random pet type
export function getRandomPetType(): PetTypeDefinition {
  return PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)]
}

// Function to get a pet type by ID
export function getPetTypeById(id: PetType): PetTypeDefinition {
  return PET_TYPES.find((pet) => pet.id === id) || PET_TYPES[0]
}

// Function to get a pet type based on monster kills
// More likely to get a pet related to the monster type you've killed the most
export function getPetTypeBasedOnKills(monsterKills: Record<string, number>): PetTypeDefinition {
  // If no kills yet, return random pet
  const totalKills = Object.values(monsterKills).reduce((sum, kills) => sum + kills, 0)
  if (totalKills === 0) {
    return getRandomPetType()
  }

  // Map monster types to pet types
  const monsterToPet: Record<string, PetType> = {
    wolf: "paw",
    goblin: "teddy",
    slime: "ghost",
    boss: "star",
  }

  // Calculate weights based on kills
  const weights: Record<PetType, number> = {
    paw: 1,
    star: 1,
    teddy: 1,
    ghost: 1,
  }

  // Increase weights based on kills
  for (const [monsterType, kills] of Object.entries(monsterKills)) {
    const petType = monsterToPet[monsterType]
    if (petType && kills > 0) {
      weights[petType] += kills
    }
  }

  // Create weighted array for selection
  const weightedArray: PetType[] = []
  for (const [petType, weight] of Object.entries(weights)) {
    for (let i = 0; i < weight; i++) {
      weightedArray.push(petType as PetType)
    }
  }

  // Select random pet from weighted array
  const selectedPetType = weightedArray[Math.floor(Math.random() * weightedArray.length)]
  return getPetTypeById(selectedPetType)
}
