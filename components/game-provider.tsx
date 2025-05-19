'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { GameLoop } from '@/src/game/GameLoop' // Adjust path as needed
import type { WorldSnapshot } from '@/src/game/WorldState'
import type { PetType } from '@/src/game/Pet'
import type { GameState as GameStateType } from '@/src/game/GameStateManager'

const GAME_FPS = 60;
const RENDER_FPS = 30;

interface GameContextType {
  game: GameLoop | null;
  snapshot: WorldSnapshot | null;
  // Callbacks that App.tsx needs, which operate on the game instance
  resetGame: () => void;
  applyTrait: (trait: string) => void;
  changePetType: (type: PetType) => void;
  currentPetType: PetType; // This will be sourced from snapshot or game internal state
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [game] = useState(() => new GameLoop());
  const [snapshot, setSnapshot] = useState<WorldSnapshot>(() => game.getSnapshot());
  const [currentPetType, setCurrentPetType] = useState<PetType>(() => game.getSnapshot().player.petType || 'paw');

  const gameLoopRef = useRef<number>();
  const lastRenderTimeRef = useRef<number>(0);

  const gameUpdateLoop = useCallback((timestamp: number) => {
    game.update(); // Update game logic at native Raf rate or fixed step if implemented in GameLoop

    // Update snapshot for React rendering at RENDER_FPS
    if (timestamp - lastRenderTimeRef.current >= 1000 / RENDER_FPS) {
      setSnapshot(game.getSnapshot());
      lastRenderTimeRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameUpdateLoop);
  }, [game]);

  useEffect(() => {
    // Snapshot is already initialized, this effect now just starts the loop
    // setSnapshot(game.getSnapshot()); // No longer needed here if initialized in useState
    // setCurrentPetType(game.getSnapshot().player.petType || 'paw'); // Also initialized

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameUpdateLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [game, gameUpdateLoop]);

  useEffect(() => {
    // Update currentPetType when the snapshot indicates a change from the game state
    // This assumes snapshot.player.petType is the source of truth from GameLoop
    if (snapshot && snapshot.player.petType && snapshot.player.petType !== currentPetType) {
      setCurrentPetType(snapshot.player.petType);
    }
  }, [snapshot]); // Add snapshot as a dependency

  const contextValue: GameContextType = {
    game,
    snapshot,
    resetGame: () => game.restart(),
    applyTrait: (trait: string) => game.applyTrait(trait),
    changePetType: (type: PetType) => {
      game.changePetType(type);
      setCurrentPetType(type); // Keep local sync for now
    },
    currentPetType,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 