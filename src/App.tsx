"use client"

import { useGameState } from "./useGameState"
import GameCanvas from "./render/GameCanvas"
import HUD from "./ui/HUD"
import GameOver from "./ui/GameOver"
import LevelUp from "./ui/LevelUp"
import TraitChoiceUI from "./ui/TraitChoiceUI"
import PetSelector from "./ui/PetSelector"
import TraitNotification from "./ui/TraitNotification"
import SpriteDebug from "./ui/SpriteDebug"
import SpriteDebugPanel from "./ui/SpriteDebugPanel"
import SpriteLoadingStatus from "./ui/SpriteLoadingStatus"
import SpritePreloader from "./ui/SpritePreloader"
import GameStateDebug from "./ui/GameStateDebug"

export default function App() {
  const gameState = useGameState()
  const showTraitPopup = gameState.player.pendingTrait

  // Function to apply the chosen trait
  const handleTraitChoice = (trait: string) => {
    // This will be passed to the game loop to update the player
    gameState.applyTrait(trait)
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Preload sprites */}
      <SpritePreloader />

      <GameCanvas
        player={gameState.player}
        monsters={gameState.monsters}
        damageEvents={gameState.damageEvents}
        essenceDrops={gameState.essenceDrops}
        pet={gameState.pet}
        petTrails={gameState.petTrails}
        petDefinition={gameState.petDefinition}
        distance={gameState.distance}
        gameState={{
          current: gameState.gameState.current,
          isTransitioning: gameState.gameState.isTransitioning,
          transitionProgress: gameState.gameState.transitionProgress,
          cameraOffset: gameState.gameState.cameraOffset,
          combatMonsterId: gameState.gameState.combatMonsterId,
        }}
      />

      <HUD
        health={gameState.player.health}
        maxHealth={gameState.player.maxHealth}
        level={gameState.player.level}
        xp={gameState.player.xp}
        xpToNextLevel={gameState.player.xpToNextLevel}
        essence={gameState.player.essence}
        distance={gameState.distance}
        mp={gameState.player.mp}
        maxMP={gameState.player.maxMP}
        stats={gameState.player.stats}
        unlockedAbilities={gameState.player.unlockedAbilities}
        petDefinition={gameState.petDefinition}
        petLevel={gameState.pet.level}
        petXp={gameState.pet.xp}
        nextLevelXp={gameState.pet.nextLevelXp}
        unlockedTraits={gameState.player.unlockedTraits}
        randomBonuses={gameState.player.randomBonuses}
        latestRandomBonus={gameState.randomBonusNotification}
        gameState={gameState.gameState.current}
        currentBiome={gameState.currentBiome}
      />

      <PetSelector
        onSelect={gameState.changePetType}
        currentType={gameState.currentPetType}
        petDefinition={gameState.petDefinition}
        petLevel={gameState.pet.level}
        petXp={gameState.pet.xp}
        nextLevelXp={gameState.pet.nextLevelXp}
      />

      {gameState.showLevelUp && <LevelUp level={gameState.player.level} />}

      {gameState.showTraitNotification && gameState.traitNotification && (
        <TraitNotification trait={gameState.traitNotification.trait} />
      )}

      {showTraitPopup && <TraitChoiceUI onChoose={handleTraitChoice} />}

      {gameState.gameOver && (
        <GameOver
          distance={gameState.distance}
          essence={gameState.player.essence}
          level={gameState.player.level}
          onRestart={gameState.resetGame}
        />
      )}

      {/* Add the sprite debug components */}
      <SpriteDebug />
      <SpriteDebugPanel />
      <SpriteLoadingStatus />

      {/* Add the debug component */}
      <GameStateDebug gameState={gameState.gameState} player={gameState.player} />
    </div>
  )
}
