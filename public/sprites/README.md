# Sprite Assets Directory

This directory contains all the sprite assets for Ashborn.

## Directory Structure

- `/player/` - Player character sprites
  - idle_1.png, idle_2.png, etc. - Idle animation frames
  - run_1.png, run_2.png, etc. - Running animation frames
  - attack_1.png, attack_2.png, etc. - Attack animation frames
  - hurt_1.png, hurt_2.png - Hurt animation frames

- `/monsters/` - Monster sprites
  - wolf_1.png, wolf_2.png, etc. - Wolf animation frames
  - dire_wolf_1.png, dire_wolf_2.png, etc. - Dire Wolf (mini-boss) animation frames
  - alpha_wolf_1.png, alpha_wolf_2.png, etc. - Alpha Wolf (boss) animation frames
  - goblin_1.png, goblin_2.png, etc. - Goblin animation frames
  - goblin_brute_1.png, goblin_brute_2.png, etc. - Goblin Brute (mini-boss) animation frames
  - goblin_king_1.png, goblin_king_2.png, etc. - Goblin King (boss) animation frames
  - slime_1.png, slime_2.png, etc. - Slime animation frames
  - giant_slime_1.png, giant_slime_2.png, etc. - Giant Slime (mini-boss) animation frames
  - king_slime_1.png, king_slime_2.png, etc. - King Slime (boss) animation frames

- `/pets/` - Pet sprites
  - wolf_cub_1.png, wolf_cub_2.png, etc. - Wolf Cub animation frames
  - wolf_evolved_1.png, wolf_evolved_2.png, etc. - Evolved Wolf animation frames
  - star_spirit_1.png, star_spirit_2.png, etc. - Star Spirit animation frames
  - star_evolved_1.png, star_evolved_2.png, etc. - Evolved Star Spirit animation frames
  - teddy_1.png, teddy_2.png, etc. - Teddy animation frames
  - teddy_evolved_1.png, teddy_evolved_2.png, etc. - Evolved Teddy animation frames
  - ghost_1.png, ghost_2.png, etc. - Ghost animation frames
  - ghost_evolved_1.png, ghost_evolved_2.png, etc. - Evolved Ghost animation frames

- `/items/` - Item sprites
  - essence_1.png, essence_2.png, etc. - Essence animation frames
  - health_potion.png - Health potion sprite

- `/effects/` - Effect sprites
  - dodge_1.png, dodge_2.png, dodge_3.png - Dodge effect animation frames
  - critical_1.png, critical_2.png, critical_3.png - Critical hit effect animation frames
  - level_up_1.png, level_up_2.png, level_up_3.png - Level up effect animation frames

- `/backgrounds/` - Background layers
  - forest_sky.png - Forest biome sky layer
  - forest_mountains.png - Forest biome mountains layer
  - forest_trees.png - Forest biome trees layer
  - forest_ground.png - Forest biome ground layer
  - desert_sky.png - Desert biome sky layer
  - desert_mountains.png - Desert biome mountains layer
  - desert_dunes.png - Desert biome dunes layer
  - desert_ground.png - Desert biome ground layer
  - mountain_sky.png - Mountain biome sky layer
  - mountain_peaks.png - Mountain biome peaks layer
  - mountain_hills.png - Mountain biome hills layer
  - mountain_ground.png - Mountain biome ground layer
  - ruins_sky.png - Ruins biome sky layer
  - ruins_structures.png - Ruins biome structures layer
  - ruins_pillars.png - Ruins biome pillars layer
  - ruins_ground.png - Ruins biome ground layer

## Sprite Dimensions

- Player sprites: 48x48 pixels
- Monster sprites: 48x48 pixels (bosses may be larger)
- Pet sprites: 32x32 pixels
- Item sprites: 16x16 or 32x32 pixels
- Effect sprites: 32x32 pixels
- Background layers: Various sizes, typically 1024x256 pixels or larger

## Animation Frames

Most animations consist of 4 frames for a smooth loop. Attack animations may have more frames.

## Pixel Art Style

- Use a consistent color palette
- Keep outlines consistent (1px black or dark color)
- Use pixel-perfect scaling (no anti-aliasing)
- Maintain consistent lighting direction
