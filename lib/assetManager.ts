"use client"

import type { Pet, AssetType } from "@/types/game"

// Mock data for pets
const MOCK_PETS: Pet[] = [
  {
    id: "ember-fox",
    name: "Ember Fox",
    description: "A fiery companion with magical abilities",
    spriteUrl: "/sprites/ember-fox.png",
    traits: ["Fire", "Magic", "Swift"],
    stats: {
      speed: 8,
      strength: 5,
      intelligence: 7,
    },
  },
  {
    id: "shadow-wolf",
    name: "Shadow Wolf",
    description: "A mysterious wolf that can blend with shadows",
    spriteUrl: "/sprites/shadow-wolf.png",
    traits: ["Shadow", "Stealth", "Loyal"],
    stats: {
      speed: 7,
      strength: 8,
      intelligence: 6,
    },
  },
  {
    id: "crystal-drake",
    name: "Crystal Drake",
    description: "A small drake with crystalline scales",
    spriteUrl: "/sprites/crystal-drake.png",
    traits: ["Crystal", "Flying", "Resilient"],
    stats: {
      speed: 6,
      strength: 7,
      intelligence: 8,
    },
  },
]

// Asset cache for in-memory caching
const assetCache: Record<string, string> = {}
const assetLoadTimes: Record<string, number> = {}
const failedAssets: Set<string> = new Set()

/**
 * Load an asset with fallback mechanisms
 * 1. Check in-memory cache
 * 2. Try Redis
 * 3. Try Supabase
 * 4. Try Vercel Blob
 * 5. Use fallback
 */
export async function loadAsset(assetPath: string): Promise<string> {
  // For demo purposes, simulate network conditions
  const simulateSlowNetwork = Math.random() > 0.7
  const simulateError = assetPath.includes("_broken")

  // Start timing
  const startTime = performance.now()

  try {
    // Check in-memory cache first
    if (assetCache[assetPath]) {
      const endTime = performance.now()
      assetLoadTimes[assetPath] = Math.round(endTime - startTime)
      return assetCache[assetPath]
    }

    // Simulate network delay
    if (simulateSlowNetwork) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))
    }

    // Simulate error
    if (simulateError) {
      throw new Error("Asset not found")
    }

    // In a real implementation, we would:
    // 1. Check Redis cache
    // 2. Query Supabase
    // 3. Fetch from Vercel Blob

    // For demo, we'll just return a mock URL based on the asset path
    let resolvedUrl: string

    if (assetPath.startsWith("/sprites/")) {
      // For sprite assets, use placeholder
      resolvedUrl = `/placeholder.svg?height=160&width=160&text=${encodeURIComponent(assetPath.split("/").pop() || "sprite")}`
    } else {
      // For other assets, use the path directly
      resolvedUrl = assetPath
    }

    // Cache the result
    assetCache[assetPath] = resolvedUrl

    // End timing
    const endTime = performance.now()
    assetLoadTimes[assetPath] = Math.round(endTime - startTime)

    return resolvedUrl
  } catch (error) {
    // Log the error
    console.error(`Failed to load asset: ${assetPath}`, error)

    // Mark as failed
    failedAssets.add(assetPath)

    // End timing
    const endTime = performance.now()
    assetLoadTimes[assetPath] = Math.round(endTime - startTime)

    // Return a fallback
    return `/placeholder.svg?height=160&width=160&text=Error`
  }
}

/**
 * Get an asset URL directly (without loading)
 */
export function getAsset(assetPath: string, type: AssetType = "sprite"): string {
  // Check cache first
  if (assetCache[assetPath]) {
    return assetCache[assetPath]
  }

  // For demo purposes, return a placeholder
  return `/placeholder.svg?height=160&width=160&text=${encodeURIComponent(assetPath.split("/").pop() || type)}`
}

/**
 * Get all pets
 */
export async function getPets(): Promise<Pet[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real implementation, we would fetch from Supabase
  return MOCK_PETS
}

/**
 * Get a pet by ID
 */
export async function getPetById(id: string): Promise<Pet | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real implementation, we would fetch from Supabase
  return MOCK_PETS.find((pet) => pet.id === id) || null
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For demo purposes, return success most of the time
  return Math.random() > 0.2
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // For demo purposes, return success most of the time
  return Math.random() > 0.2
}

/**
 * Test Blob connection
 */
export async function testBlobConnection(): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // For demo purposes, return success most of the time
  return Math.random() > 0.2
}

/**
 * Get asset loading statistics
 */
export async function getAssetLoadStats() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    total: Object.keys(assetLoadTimes).length,
    cached: Object.keys(assetCache).length,
    failed: failedAssets.size,
    loadTimes: assetLoadTimes,
  }
}
