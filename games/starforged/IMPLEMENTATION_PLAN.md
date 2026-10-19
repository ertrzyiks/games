# Starforged — Implementation Plan

A Game Boy–era (Pokémon-style) RPG: top-down tile exploration + random/scripted
turn-based battles. Original space-western setting inspired by the vibe of a
certain lone armored bounty-hunter and the small green foundling he protects
— told with entirely original names, characters and lore.

## Premise (original IP, no copyrighted names)

- **Hero:** Kade Ironhelm, an armorer-warrior exiled from his forge-clan. He
  wears a suit of sigil-etched plate he forges and repairs himself.
- **Companion:** Moss, a tiny green foundling with latent psychic power over
  "the Current" (this game's stand-in force). Kade is sworn to protect him.
- **Antagonists:** The Hollow Syndicate, a crime guild hunting Moss to weaponize
  the Current.
- **Setting:** "The Drift", a cluster of five remote worlds Kade and Moss travel
  between aboard a junker starskiff.
- **Arc:** Rustmoor (intro/tutorial) → Mossfen Reach → Ashvault Station →
  Skyreach Canopy → The Hollow (finale, confront the Syndicate).

## Tech stack

Matches the existing monorepo convention (see `games/tank-memo`): a plain
Vite + vanilla JS package, **no framework**. No external art/audio files —
all visuals are procedurally generated pixel-grid sprites drawn to
`<canvas>` (same spirit as tank-memo's inline-SVG sprites, just pixel-art
instead of vector), scaled with `image-rendering: pixelated` for a crisp
GB-style look. Sound is a handful of tiny WebAudio-generated bleeps/boops
(no audio files to fetch). State persists to `localStorage`. Touch controls
(on-screen d-pad + A/B buttons) are DOM overlays per `Agents.md`'s
touchscreen requirement.

## Package layout (`games/starforged/`)

```
index.html, vite.config.js, package.json
src/
  main.js                 — boot: canvas, input, save, scene manager → Title
  engine/
    constants.js          — TILE_SIZE, viewport size, palette tokens
    canvas.js             — canvas setup + pixel-perfect scaling/resize
    input.js              — keyboard + touch d-pad/buttons → action states
    sceneManager.js        — push/pop/replace stack, drives update/draw
    sprite.js             — draws pixel-grid sprite defs to canvas, anim frames
    tilemap.js            — tile rendering, collision, camera, encounter zones
    dialogue.js           — GB-style textbox, typing effect, choices
    save.js               — localStorage load/save of GameState
  data/
    schema.js             — JSDoc shape contracts for World/Map/NPC/Enemy/Move
    gameState.js          — initial state, flags, party stat helpers
  assets/
    palette.js            — shared color palettes per world
    sprites/*.js          — hero, moss, npc, enemy, tile pixel-grid defs
  battle/
    battleScene.js        — turn-based battle loop (player/enemy turns, UI)
    moves.js              — move definitions (attack/heal/buff/status)
    enemies.js            — enemy roster + per-world boss defs
  scenes/
    titleScene.js, overworldScene.js, menuScene.js, shipScene.js (world select)
  worlds/
    rustmoor.js, mossfenReach.js, ashvaultStation.js, skyreachCanopy.js,
    theHollow.js           — map tiles, NPCs, dialogue, encounter tables,
                              story triggers for each world
  ui/
    hud.js, titleArt.js, transitions.js
```

### Core contracts (frozen after Phase 1, everyone codes against these)

- `Scene`: `{ enter(), exit(), update(dt, input), draw(ctx) }`
- `World`: `{ id, name, startMap, maps: { [mapId]: MapDef } }`
- `MapDef`: `{ width, height, tiles: number[][], walkable(tileId), npcs: NPC[], encounterZones: Zone[], warps: Warp[], triggers: Trigger[] }`
- `NPC`: `{ id, x, y, spriteId, facing, dialogue: string[] | DialogueNode }`
- `EnemyDef`: `{ id, name, spriteId, maxHp, atk, def, spd, moves: string[], xpReward }`
- `Move`: `{ id, name, kind, power, focusCost, accuracy }`
- `GameState` (saved): `{ worldId, mapId, x, y, facing, party, inventory, flags, unlockedWorlds }`

## Build phases

**Phase 1 — Foundation + vertical slice (done synchronously, by the
coordinator, before any parallel work starts).** Engine (canvas, input,
scenes, tilemap, dialogue, save), data contracts, base sprite/palette set,
and one fully playable world end-to-end: Rustmoor exploration, an NPC with
dialogue, a random encounter, a working turn-based battle against one enemy,
title screen, and localStorage save. This proves the whole loop works and
gives later agents real, tested APIs instead of guesses. Wired into the
pnpm workspace + portal.

**Phase 2 — Parallel content & systems agents** (run concurrently, each
touching only its own files to avoid merge conflicts):

1. **World agent — Mossfen Reach**: swamp world map(s), 2+ NPCs, one unique
   enemy, one story trigger, dialogue tying into the Moss backstory.
2. **World agent — Ashvault Station**: derelict mining-station world, same
   shape as above, introduces a Syndicate mini-boss.
3. **World agent — Skyreach Canopy + The Hollow finale**: floating-forest
   world plus the short final world (Syndicate stronghold, final boss,
   ending screen/credits).
4. **Battle depth agent**: expands `battle/moves.js` and `battle/enemies.js`
   with the full move list (attack/guard/Current abilities/items), enemy AI,
   boss fight wiring for each world's trigger, and balancing (XP/leveling
   curve).
5. **Polish agent**: expands sprite/tile variety and animation frames, adds
   the WebAudio SFX/jingles, builds the ship/world-select screen and HUD,
   and verifies mobile touch controls + small-screen layout.

**Phase 3 — Integration & browser testing (coordinator):** merge all
branches, run `pnpm dev` (or build+preview), click through the full game in
a real browser — title → exploration → dialogue → random encounter → battle
→ world transitions → finale — fixing any seams between agents' work.

**Phase 4 — Commit & push to `main`.**

## Done criteria

- All 5 worlds reachable and distinct visually/narratively.
- Exploration (collision, NPCs, dialogue) and turn-based battles both work.
- Game is completable from title screen to ending.
- Playable on a small/touch screen (on-screen controls, responsive canvas).
- Save/load via localStorage works across reloads.
- Verified by actually driving it in a browser, not just reading code.
