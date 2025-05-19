"use client"

import { useState, useRef, useEffect } from "react"
import PixelSprite from "./PixelSprite"
import ParallaxBackground from "./ParallaxBackground"
import { useHitFlash } from "@/src/hooks/useHitFlash"
import { DamageLog } from "@/src/game/DamageLog"
import { getCurrentBiome } from "../game/BiomeTypes"
import AttackEffect from "./AttackEffect"

interface GameCanvasProps {
  player: any
  monsters: any[]
  damageEvents: any
  essenceDrops: any
  pet: any
  petTrails: any[]
  petDefinition: any
  distance: number
  gameState: {
    current: string
    isTransitioning: boolean
    transitionProgress: number
    cameraOffset?: { x: number; y: number }
    combatMonsterId: string | null
  }
}

// Camera and positioning constants
const PLAYER_SCREEN_POSITION = 200 // Player at 200px from the left
const CHARACTER_BASE_POSITION = 100 // Character base position from the top
const GROUND_POSITION = 300 // Ground position from the top
const COMBAT_CAMERA = {
  PLAYER_POSITION: 0.35, // Player at 35% of screen width during combat
  MONSTER_POSITION: 0.65, // Monster at 65% of screen width during combat
  TRANSITION_DURATION: 500, // ms for smooth transitions
  CINEMATIC_BORDER_HEIGHT: 0.1, // 10% of screen height for cinematic borders
}

export default function GameCanvas({
  player,
  monsters,
  damageEvents,
  essenceDrops = [],
  pet,
  petTrails = [],
  petDefinition,
  distance,
  gameState,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const latestDamage = DamageLog.getLatestPlayerDamage()
  const { isFlashing, shakeClass } = useHitFlash(latestDamage)
  const [windowWidth, setWindowWidth] = useState(1000)
  const [windowHeight, setWindowHeight] = useState(600)
  // Add state for tracking attack effects
  const [attackEffects, setAttackEffects] = useState<
    Array<{
      id: string
      x: number
      y: number
      direction: "left" | "right"
      type: "slash" | "impact" | "critical"
      timestamp: number
    }>
  >([])

  // Add a ref to track previous attack animation state
  const prevAttackAnimationRef = useRef(false)

  // Calculate ground position - 15% from bottom of screen
  const groundPosition = windowHeight * 0.85
  const characterBasePosition = groundPosition - 40 // Just above ground

  // Get current biome based on distance
  const currentBiome = getCurrentBiome(distance)

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Add an effect to watch for player attack animations
  useEffect(() => {
    // Check if player just started attacking
    if (player.inAttackAnimation && !prevAttackAnimationRef.current) {
      // Add a new attack effect
      const newEffect = {
        id: `attack-${Date.now()}`,
        x:
          gameState.current === "combat"
            ? windowWidth * COMBAT_CAMERA.PLAYER_POSITION + 30
            : PLAYER_SCREEN_POSITION + 30,
        y: characterBasePosition - 20,
        direction: "right",
        type: Math.random() < 0.2 ? "critical" : "slash",
        timestamp: Date.now(),
      }

      setAttackEffects((prev) => [...prev, newEffect])
    }

    // Update ref for next check
    prevAttackAnimationRef.current = player.inAttackAnimation
  }, [player.inAttackAnimation, gameState.current, windowWidth, characterBasePosition])

  // Add a cleanup effect for old attack effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Remove effects older than 1 second
      setAttackEffects((prev) => prev.filter((effect) => Date.now() - effect.timestamp < 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Helper function to convert world coordinates to screen coordinates
  const worldToScreen = (worldX: number): number => {
    // Safely access cameraOffset, defaulting to {x: 0, y: 0} if undefined
    const cameraOffset = gameState.cameraOffset || { x: 0, y: 0 }
    const transitionProgress = gameState.isTransitioning ? gameState.transitionProgress : 1

    // In combat, smoothly transition camera to combat positions
    if (gameState.current === "combat") {
      const playerTargetX = windowWidth * COMBAT_CAMERA.PLAYER_POSITION
      const monsterTargetX = windowWidth * COMBAT_CAMERA.MONSTER_POSITION

      const playerDiff = playerTargetX - PLAYER_SCREEN_POSITION

      // Safely handle the case where monsters array might be empty
      const monsterPos = monsters.length > 0 ? monsters[0].position : player.position
      const monsterDiff = monsterTargetX - (worldX - player.position + PLAYER_SCREEN_POSITION)

      return worldX - player.position + PLAYER_SCREEN_POSITION + playerDiff * transitionProgress + cameraOffset.x
    }

    // In running, keep camera centered on player
    return worldX - player.position + PLAYER_SCREEN_POSITION + cameraOffset.x
  }

  // Helper function to get monster tier string
  const getMonsterTierString = (tier: number): string => {
    if (tier === 1) return "miniboss"
    if (tier === 2) return "boss"
    return "normal"
  }

  // Update the getPlayerAnimationState function to be more sophisticated

  // Helper function to get player animation state
  const getPlayerAnimationState = (): string => {
    if (!player.isAlive) return "death"

    // If player is in attack animation, use attack1, attack2, or attack3 randomly
    if (player.inAttackAnimation) {
      // Use attack1, attack2, or attack3 based on a consistent pattern
      const attackType = Math.floor(player.lastAttackTime / 1000) % 3
      return attackType === 0 ? "attack1" : attackType === 1 ? "attack2" : attackType === 2 ? "attack3" : "attack1"
    }

    // If player recently took damage
    if (isFlashing) return "hit"

    // If in combat, use idle animation
    if (player.inCombat) return "idle"

    // Otherwise, use run animation for movement
    return "run"
  }

  // Update the getMonsterAnimationState function to handle all slime animation states:

  // Helper function to get monster animation state
  const getMonsterAnimationState = (monster: any): string => {
    if (monster.health <= 0) return "death"
    if (monster.inAttackAnimation) return "attack"
    if (monster.lastHitTime && Date.now() - monster.lastHitTime < 200) return "hit"
    return monster.inCombat ? "idle" : "move"
  }

  // Apply camera shake
  const cameraStyle = gameState.cameraOffset
    ? {
        transform: `translate(${gameState.cameraOffset.x}px, ${gameState.cameraOffset.y}px)`,
      }
    : {}

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${shakeClass}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        ...cameraStyle,
      }}
    >
      {/* Solid color fallback background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: currentBiome.type === "beach" ? "#87CEEB" : "#3a5c38",
        }}
      />

      {/* Parallax Background */}
      <ParallaxBackground
        biome={currentBiome.type}
        playerPosition={player.position}
        inCombat={gameState.current === "combat"}
      />

      {/* Cinematic borders for combat mode */}
      {gameState.current === "combat" && (
        <>
          <div
            className="absolute left-0 right-0 bg-black z-50"
            style={{
              top: 0,
              height: `${windowHeight * COMBAT_CAMERA.CINEMATIC_BORDER_HEIGHT * gameState.transitionProgress}px`,
              transition: "height 0.5s ease-out",
            }}
          />
          <div
            className="absolute left-0 right-0 bg-black z-50"
            style={{
              bottom: 0,
              height: `${windowHeight * COMBAT_CAMERA.CINEMATIC_BORDER_HEIGHT * gameState.transitionProgress}px`,
              transition: "height 0.5s ease-out",
            }}
          />
        </>
      )}

      {/* Player */}
      <div
        style={{
          position: "absolute",
          left: gameState.current === "combat" ? windowWidth * COMBAT_CAMERA.PLAYER_POSITION : PLAYER_SCREEN_POSITION,
          top: characterBasePosition,
          transform: `translateX(-50%) ${isFlashing ? "scale(1.1)" : "scale(1)"}`,
          userSelect: "none",
          filter: isFlashing ? "drop-shadow(0 0 5px red)" : "none",
          transition: "transform 0.1s ease-in-out, filter 0.1s ease-in-out, left 0.5s ease-in-out",
          zIndex: 25,
        }}
      >
        <PixelSprite
          type="player"
          state={getPlayerAnimationState()}
          alt="Player"
          width={48}
          height={48}
          scale={1.2}
          animate={gameState.current === "combat" ? "bob" : "none"}
          flipX={player.facingRight === false}
        />

        {/* Player health bar */}
        <div
          style={{
            position: "absolute",
            top: -15,
            left: "50%",
            transform: "translateX(-50%)",
            width: 48,
            height: 6,
            backgroundColor: "#222",
            border: "1px solid #000",
            borderRadius: "2px",
            overflow: "hidden",
            zIndex: 30,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(player.health / player.maxHealth) * 100}%`,
              backgroundColor: "#22c55e", // Green-500
              transition: "width 0.3s ease-out",
            }}
          />
        </div>
      </div>

      {/* Monsters - Force all monsters to be slimes */}
      {monsters.map((monster) => {
        // In combat mode, only render the active combat monster
        if (gameState.current === "combat" && monster.id !== gameState.combatMonsterId) {
          return null
        }

        const screenX = worldToScreen(monster.position)
        const healthPct = monster.health / monster.maxHealth
        const monsterTier = getMonsterTierString(monster.tier)

        // Only render monsters that are on screen (with some margin)
        if (screenX < -50 || screenX > windowWidth + 50) {
          return null
        }

        // In combat mode, position the monster at the combat position
        const monsterX =
          gameState.current === "combat" && monster.id === gameState.combatMonsterId
            ? windowWidth * COMBAT_CAMERA.MONSTER_POSITION
            : screenX

        return (
          <div key={monster.id}>
            <div
              style={{
                position: "absolute",
                left: monsterX,
                top: characterBasePosition,
                transform: `translateX(-50%)`,
                userSelect: "none",
                transition: "all 0.3s ease-out",
                zIndex: 25,
              }}
            >
              <PixelSprite
                type="slime" // Force all monsters to be slimes
                variant={monsterTier}
                alt="Slime"
                width={32}
                height={32}
                scale={monster.tier === 2 ? 1.5 : monster.tier === 1 ? 1.3 : 1}
                animate={monster.inAttackAnimation ? "shake" : gameState.current === "combat" ? "bob" : "none"}
                flipX={!monster.facingRight}
                tier={monster.tier}
                state={getMonsterAnimationState(monster)}
              />
            </div>

            {/* Monster health bar */}
            <div
              style={{
                position: "absolute",
                top: characterBasePosition - 20,
                left: monsterX,
                transform: "translateX(-50%)",
                width: 48 * (monster.tier === 2 ? 1.5 : monster.tier === 1 ? 1.3 : 1),
                height: 6,
                backgroundColor: "#222",
                border: "1px solid #000",
                borderRadius: "2px",
                overflow: "hidden",
                zIndex: 30,
                transition: "all 0.3s ease-out",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(0, healthPct * 100)}%`,
                  backgroundColor: "#ef4444", // Red-500
                  transition: "width 0.3s ease-out",
                }}
              />
            </div>

            {/* Monster name/type label in combat */}
            {gameState.current === "combat" && monster.id === gameState.combatMonsterId && (
              <div
                style={{
                  position: "absolute",
                  top: characterBasePosition - 40,
                  left: monsterX,
                  transform: "translateX(-50%)",
                  padding: "2px 6px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  fontSize: "12px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  zIndex: 30,
                }}
              >
                {monster.tier === 2 ? "Boss " : monster.tier === 1 ? "Elite " : ""}
                Slime
              </div>
            )}
          </div>
        )
      })}

      {/* Pet */}
      {pet && petDefinition && (
        <div
          style={{
            position: "absolute",
            left: worldToScreen(pet.x),
            top: groundPosition - 80 - pet.y,
            transform: "translateX(-50%)",
            transition: "all 0.1s ease-out",
            userSelect: "none",
            pointerEvents: "none",
            filter: pet.isCollecting ? "drop-shadow(0 0 8px cyan)" : "drop-shadow(0 0 3px white)",
            zIndex: 26,
          }}
        >
          <PixelSprite
            type="pet"
            variant={petDefinition.id}
            state={pet.isCollecting ? "collect" : "idle"}
            alt={petDefinition.name}
            width={32}
            height={32}
            animate={pet.isCollecting ? "pulse" : "bob"}
          />

          {/* Pet reaction emoji */}
          {pet.reactionType !== "none" && (
            <div
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "16px",
                filter: "drop-shadow(0 0 2px black)",
                animation: "float 1s ease-in-out infinite alternate",
              }}
            >
              {pet.reactionType === "levelUp" ? "🎉" : pet.reactionType === "death" ? "😢" : ""}
            </div>
          )}
        </div>
      )}

      {/* Essence Drops */}
      {essenceDrops.map((drop) => {
        const screenX = worldToScreen(drop.position)
        const isCollected = drop.collected || drop.y <= 2
        const dropY = groundPosition - 50 - drop.y

        return (
          <div
            key={drop.id}
            style={{
              position: "absolute",
              left: screenX,
              top: dropY,
              transform: "translateX(-50%)",
              opacity: isCollected ? 0 : 1,
              transition: "all 0.4s ease-out",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 25,
            }}
          >
            <PixelSprite
              type="essence"
              alt="Essence"
              width={28}
              height={28}
              animate="pulse"
              className="drop-shadow-[0_0_6px_cyan]"
            />
          </div>
        )
      })}

      {/* Damage Numbers */}
      {damageEvents.monsterHits.map((hit, index) => {
        const screenX = worldToScreen(hit.position)
        const timeSinceHit = Date.now() - hit.timestamp
        const opacity = Math.max(0, 1 - timeSinceHit / 1000)
        const yOffset = Math.min(30, timeSinceHit / 20)

        return (
          <div
            key={`monster-hit-${index}-${hit.timestamp}`}
            style={{
              position: "absolute",
              left: screenX,
              top: characterBasePosition - 50 - yOffset,
              transform: "translateX(-50%)",
              color: hit.isCritical ? "#fcd34d" : "white", // Yellow-300 for crits
              fontSize: hit.isCritical ? "18px" : "14px",
              fontWeight: "bold",
              textShadow: "0 0 3px black",
              opacity,
              zIndex: 40,
            }}
          >
            {hit.amount}
            {hit.isCritical && "!"}
          </div>
        )
      })}

      {/* Player Damage Numbers */}
      {damageEvents.playerHits.map((hit, index) => {
        const timeSinceHit = Date.now() - hit.timestamp
        const opacity = Math.max(0, 1 - timeSinceHit / 1000)
        const yOffset = Math.min(30, timeSinceHit / 20)

        return (
          <div
            key={`player-hit-${index}-${hit.timestamp}`}
            style={{
              position: "absolute",
              left: PLAYER_SCREEN_POSITION,
              top: characterBasePosition - 50 - yOffset,
              transform: "translateX(-50%)",
              color: "#ef4444", // Red-500
              fontSize: "14px",
              fontWeight: "bold",
              textShadow: "0 0 3px black",
              opacity,
              zIndex: 40,
            }}
          >
            {hit.amount}
          </div>
        )
      })}

      {/* Dodge Indicators */}
      {damageEvents.playerDodges.map((dodge, index) => {
        const timeSinceHit = Date.now() - dodge.timestamp
        const opacity = Math.max(0, 1 - timeSinceHit / 800)
        const yOffset = Math.min(40, timeSinceHit / 15)

        return (
          <div
            key={`player-dodge-${index}-${dodge.timestamp}`}
            style={{
              position: "absolute",
              left: PLAYER_SCREEN_POSITION,
              top: characterBasePosition - 40 - yOffset,
              transform: "translateX(-50%)",
              color: "#22d3ee", // Cyan-400
              fontSize: "14px",
              fontWeight: "bold",
              textShadow: "0 0 3px black",
              opacity,
              zIndex: 40,
            }}
          >
            DODGE!
          </div>
        )
      })}

      {/* Attack Effects */}
      {attackEffects.map((effect) => (
        <AttackEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          direction={effect.direction}
          type={effect.type}
          onComplete={() => {
            setAttackEffects((prev) => prev.filter((e) => e.id !== effect.id))
          }}
        />
      ))}

      {/* Add CSS animations to the global stylesheet */}
      <style jsx global>{`
        @keyframes bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(-50%);
          }
          100% {
            transform: translateY(-5px) translateX(-50%);
          }
        }

        @keyframes flash {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-bob {
          animation: bob 1.5s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .animate-float {
          animation: float 1s ease-in-out infinite alternate;
        }

        .animate-flash {
          animation: flash 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
