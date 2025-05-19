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
  const gameHookState = useGameState();
  
  const {
    player, monsters, damageEvents, essenceDrops, pet, petTrails, 
    petDefinition, distance, currentPetType, currentBiome, 
    randomBonusNotification, showLevelUp, showTraitNotification, 
    traitNotification, gameOver, resetGame,
    gameState: gameSystemStateObject, // This is snapshot.gameState (the object)
    rawGameState: currentGameStateString // This is snapshot.gameState.current (the string)
  } = gameHookState;

  const showTraitPopup = player.pendingTrait;

  const handleTraitChoice = (trait: string) => {
    // Access applyTrait directly from the hook's return if it's not part of the destructured snapshot
    gameHookState.applyTrait(trait);
  };

  // onSelect for PetSelector needs to come from gameHookState.changePetType
  const handleChangePetType = (type: any) => { // TODO: use PetType
    gameHookState.changePetType(type);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Preload sprites */}
      <SpritePreloader />

      <GameCanvas
        player={player}
        monsters={monsters}
        damageEvents={damageEvents}
        essenceDrops={essenceDrops}
        pet={pet}
        petTrails={petTrails}
        petDefinition={petDefinition}
        distance={distance}
        gameSystemState={gameSystemStateObject} // Pass the object directly
      />

      <HUD
        player={player}
        pet={pet}
        petDefinition={petDefinition}
        distance={distance}
        latestRandomBonus={randomBonusNotification}
        currentGameState={currentGameStateString} // Pass the string directly
        currentBiome={currentBiome}
      />

      <PetSelector
        onSelect={handleChangePetType} // Use the new handler
        currentType={currentPetType}
        petDefinition={petDefinition}
        petLevel={pet.level}
        petXp={pet.xp}
        nextLevelXp={pet.nextLevelXp}
      />

      {showLevelUp && <LevelUp level={player.level} />}

      {showTraitNotification && traitNotification && (
        <TraitNotification trait={traitNotification.trait} />
      )}

      {showTraitPopup && <TraitChoiceUI onChoose={handleTraitChoice} />}

      {gameOver && (
        <GameOver
          distance={distance}
          essence={player.essence}
          level={player.level}
          onRestart={resetGame} // resetGame is directly from gameHookState
        />
      )}

      {/* Conditionally render debug components in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <SpriteDebug />
          <SpriteDebugPanel />
          <SpriteLoadingStatus />
          <GameStateDebug gameSystemState={gameSystemStateObject} player={player} />
        </>
      )}
    </div>
  )
}
