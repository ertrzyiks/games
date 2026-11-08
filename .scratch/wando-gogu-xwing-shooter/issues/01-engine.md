# Pick the rendering/physics engine for the X-wing shooter

Type: research
Status: resolved

## Question

Which existing 2D rendering/physics/collision engine should the new X-wing shooter (see [map.md](../map.md)) be built on?

The user explicitly wants an existing engine preferred over hand-rolling physics/collision (unlike `starforged`/`game-2`/`tank-memo`, which are plain Vite + vanilla Canvas with no library at all). Research and recommend a concrete choice evaluated against:

- Fit for a 1942-style vertical/scrolling shooter: sprite rendering, scrolling backgrounds, collision detection between bullets/enemies/player, simple physics (velocity, no need for a full rigid-body simulator).
- Touch input support (drag-to-move) suitable for small screens — this repo's `games/CLAUDE.md` mandates touch-friendly, small-screen-compatible games.
- Works cleanly with Vite (the monorepo's build tool for every game package) with no exotic bundler config.
- License (must be usable in this project) and maintenance status (actively maintained, not abandoned).
- Bundle size / footprint — these are small arcade games, not one that should balloon in download size.

## Answer

**Phaser** (MIT license, `phaser` on npm).

It wins on ecosystem activity (796,864 weekly npm downloads, 40,648 GitHub stars, continuous 2026 releases), has an official Phaser-Studio-maintained Vite template, a documented drag/multi-pointer touch-input API (`setInteractive({draggable:true})`), a Scale Manager that directly covers this repo's small-screen/touch mandate, and an Arcade Physics system built specifically for simple velocity + AABB/circle collision — not a full rigid-body sim, which is exactly what a 1942-style shooter needs.

**Runners-up considered and rejected:**
- **Excalibur.js** — lean/TS-first, but only ~27.5K weekly downloads, and its drag-input helper had a breaking rework around the time this research ran.
- **Kaplay** — smallest bundle, actively maintained successor to the now-archived original Kaboom.js, but documents esbuild rather than Vite and has no documented touch/drag API.
- **PixiJS + Matter.js** — Pixi has zero built-in collision; pairing with Matter.js reintroduces integration glue work, and Matter.js's npm publish is stale since 2024.

Full comparison table and sourcing: git branch `research/engine-choice`, file `games/_wayfinder-research/engine-choice.md` (committed locally, not pushed/PR'd).

Mirrors the resolution originally intended for GitHub issue [#25](https://github.com/ertrzyiks/games/issues/25) (comment-posting blocked by sandbox token scope — see map.md note).
