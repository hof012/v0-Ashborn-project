"use client"

import { useState, useEffect } from "react"
import type { BaseStats } from "../game/Stats"
import type { PetTypeDefinition } from "../game/PetTypes"
import type { Trait } from "../game/TraitSystem"
import type { RandomBonus } from "../game/Player"
import type { GameState } from "../game/GameStateManager"
import type { BiomeType } from "../game/Biome" // Import from Biome.ts instead
import StatsPanel from "./StatsPanel"
import TraitsList from "./TraitsList"
import RandomBonusList from "./RandomBonusList"
import HealthBar from "./HealthBar"
import ManaBar from "./ManaBar"
import XPBar from "./XPBar"
import BiomeNotification from "./BiomeNotification"

interface HUDProps {
  player: any; // TODO: Replace with a well-defined PlayerType
  pet: any;    // TODO: Replace with a well-defined PetType
  petDefinition?: PetTypeDefinition;
  distance: number;
  latestRandomBonus: RandomBonus | null;
  currentGameState: string; // Renamed from gameState, receives gameSystemState.current
  currentBiome: BiomeType;
}

export default function HUD({
  player,
  pet,
  petDefinition,
  distance,
  latestRandomBonus,
  currentGameState, // Renamed
  currentBiome,
}: HUDProps) {
  const [showStats, setShowStats] = useState(false)
  const [showTraits, setShowTraits] = useState(false)
  const [showBonuses, setShowBonuses] = useState(false)
  const [showLatestBonus, setShowLatestBonus] = useState(false)
  const [lastBiome, setLastBiome] = useState<BiomeType>(currentBiome)
  const [showBiomeNotification, setShowBiomeNotification] = useState(false)

  // Destructure from player and pet for convenience if needed, or access directly
  const {
    health,
    maxHealth,
    level,
    xp,
    xpToNextLevel,
    essence,
    mp,
    maxMP,
    stats,
    unlockedAbilities,
    unlockedTraits,
    randomBonuses
  } = player; 
  const petLevel = pet.level; // Example, access pet.xp, pet.nextLevelXp similarly if needed

  // Auto-hide latest bonus after 3 seconds
  useEffect(() => {
    if (latestRandomBonus) {
      setShowLatestBonus(true)
      const timer = setTimeout(() => {
        setShowLatestBonus(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [latestRandomBonus])

  // Show biome notification when biome changes
  useEffect(() => {
    if (currentBiome !== lastBiome) {
      setShowBiomeNotification(true)
      setLastBiome(currentBiome)

      const timer = setTimeout(() => {
        setShowBiomeNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentBiome, lastBiome])

  return (
    <>
      {/* Top HUD Bar - Always Visible */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 border-b border-gray-700 shadow-lg p-2">
        <div className="max-w-4xl mx-auto flex flex-col gap-1">
          {/* Health Bar */}
          <HealthBar current={health} max={maxHealth} height={10} className="mb-1" />

          {/* MP and XP Bars */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <ManaBar current={mp} max={maxMP} height={6} />
            </div>
            <div className="w-1/2">
              <XPBar current={xp} max={xpToNextLevel} level={level} height={6} />
            </div>
          </div>

          {/* Essence & Distance & Biome */}
          <div className="flex justify-between text-xs text-white font-pixel mt-1">
            <div className="flex items-center">
              <span className="mr-1">🧬</span>
              <span className="text-yellow-300 tabular-nums">{essence}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">📏</span>
              <span className="text-yellow-300 tabular-nums">{Math.floor(distance)}m</span>
            </div>

            {/* Biome Indicator */}
            <div className="flex items-center">
              <span className="mr-1">
                {currentBiome === "forest"
                  ? "🌲"
                  : currentBiome === "beach"
                    ? "🏝️"
                    : currentBiome === "desert"
                      ? "🏜️"
                      : currentBiome === "mountains"
                        ? "🏔️"
                        : currentBiome === "ruins"
                          ? "🏛️"
                          : "🌍"}
              </span>
              <span className="text-cyan-300 capitalize">{currentBiome}</span>
            </div>

            {/* Game State Indicator */}
            <div className="flex items-center">
              <span className="mr-1">
                {currentGameState === "running"
                  ? "🏃"
                  : currentGameState === "combat"
                    ? "⚔️"
                    : currentGameState === "levelup"
                      ? "🎉"
                      : currentGameState === "traitselect"
                        ? "✨"
                        : "💀"}
              </span>
              <span className="text-yellow-300 capitalize">{currentGameState}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel: Stats Toggle */}
      <div className="fixed top-24 left-2 z-30">
        <button
          onClick={() => setShowStats(!showStats)}
          className="bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 shadow-lg font-pixel flex items-center"
        >
          <span className="mr-2">📊</span>
          Stats {showStats ? "▼" : "▶"}
        </button>

        {/* Stats Panel */}
        {showStats && (
          <div className="mt-2">
            <StatsPanel
              stats={stats}
              unlockedAbilities={unlockedAbilities}
              petDefinition={petDefinition}
              petLevel={petLevel}
            />
          </div>
        )}
      </div>

      {/* Right Panel: Traits Toggle */}
      <div className="fixed top-24 right-2 z-30">
        <button
          onClick={() => setShowTraits(!showTraits)}
          className="bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 shadow-lg font-pixel flex items-center"
        >
          <span className="mr-2">✨</span>
          Traits {showTraits ? "▼" : "▶"}
        </button>

        {/* Traits Panel */}
        {showTraits && (
          <div className="mt-2">
            <TraitsList traits={unlockedTraits} />
          </div>
        )}
      </div>

      {/* Bottom-Right: Bonuses Toggle */}
      <div className="fixed bottom-2 right-2 z-30">
        <button
          onClick={() => setShowBonuses(!showBonuses)}
          className="bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 shadow-lg font-pixel flex items-center"
        >
          <span className="mr-2">🎲</span>
          Bonuses {showBonuses ? "▼" : "▶"}
        </button>

        {/* Bonuses Panel */}
        {showBonuses && (
          <div className="mb-10 mt-2">
            <RandomBonusList bonuses={randomBonuses} />
          </div>
        )}
      </div>

      {/* Latest Random Bonus Notification (auto-fades) */}
      {showLatestBonus && latestRandomBonus && (
        <div className="fixed bottom-12 right-2 z-30 bg-purple-900 bg-opacity-90 border border-purple-500 rounded-lg p-3 shadow-lg text-white font-pixel animate-pulse">
          <div>
            <span className="text-yellow-300 font-bold text-sm">🎲 Random Bonus!</span>
            <div className="text-white text-sm mt-1">
              {latestRandomBonus.type === "stat"
                ? `+${latestRandomBonus.value} ${latestRandomBonus.stat?.toUpperCase()}`
                : `+${Math.round((latestRandomBonus.value - 1) * 100)}% ${latestRandomBonus.percentageType}`}
            </div>
          </div>
        </div>
      )}

      {/* Biome Notification */}
      {showBiomeNotification && <BiomeNotification biomeType={currentBiome} />}
    </>
  )
}
