# Wando & Gogu: X-wing Shooter — Game Design Spec

(Originally charted as GitHub issue [#24](https://github.com/ertrzyiks/games/issues/24) and tickets #25-#35; mirrored here as the local-markdown tracker because the sandbox's GitHub token can create issues/labels but cannot post comments, which blocked recording resolutions. This directory is the live tracker going forward.)

## Destination

A written game design spec for a brand-new game — a 2D scrolling shooter (1942-style), pseudo-Star-Wars setting, flying an X-wing piloted by **Wando** and **Gogu** — ready to hand off for implementation as a new package in this monorepo (`games/games/<name>/`).

## Notes

**Domain:** new sibling package to `starforged`, `game-2`, `tank-memo` in `games/games/`. Genre is a 1942-style vertical scrolling shooter, not a turn-based RPG like `starforged`.

**Skills to use while working tickets:** `/grilling` and `/domain-modeling` by default; `/prototype` when a mechanic needs something concrete to react to (control feel, a boss pattern); `/research` for research tickets.

**Standing decisions / preferences for this effort:**
- Kid-friendly: no blood, no gore, in enemy/boss/world design. Otherwise full creative freedom on enemies and world/stage themes.
- Every boss needs a distinct, unique win-mechanic — e.g. a weak spot, attrition via massive HP, or a mechanic tied to one of Gogu's special skills. No two bosses should be beaten the same way.
- This is v1. Favor simple, shippable decisions over exhaustive design — deeper refinement is expected as a later effort, not now.
- Prefer adopting an existing engine/library for rendering, physics, and collision over hand-rolling it — unlike `starforged`/`game-2`/`tank-memo`, which are vanilla Canvas with no engine. This is a deliberate reversal for this new game.
- Touch-friendly and usable on small screens is a hard repo-wide constraint (see `/Users/mateuszderks/personal/games/CLAUDE.md`). Primary input is movement-only (auto-fire is always on); Gogu's skill(s) fire via one separate explicit input.
- No persistence beyond saving the last completed stage (for resuming). No high scores, no inventory, no leveling, no cross-run power-up accumulation.
- No dialogue/story layer, and no i18n — consistent with `game-2`/`tank-memo` (only `starforged` has i18n, because it has dialogue).
- Single player, one ship. Gogu is a copilot providing special skill(s), not a separately controlled character.
- ~3 stages, each ending in a boss fight.

## Decisions so far

- [Pick the rendering/physics engine for the X-wing shooter](issues/01-engine.md) — **Phaser** (MIT). Active ecosystem, official Vite template, documented touch/drag input, Arcade Physics fits velocity + AABB/circle collision without a rigid-body sim. Runners-up (Excalibur.js, Kaplay, PixiJS+Matter.js) and full sourcing in the ticket; working notes also on git branch `research/engine-choice` at `games/_wayfinder-research/engine-choice.md`.

## Not yet specified

- Audio/music & SFX scope for v1 — not discussed yet; revisit once core mechanics (enemies, bosses, power-ups) are speced.
- Title screen / menu / pause flow.
- Exact balancing & tuning numbers (speeds, HP values, spawn rates) — depends on the enemy, boss, and power-up tickets' outcomes.
- Asset production specifics (sprite dimensions, frame counts) — depends on the art/asset-pipeline ticket's outcome.
- Registering the new game as an entry in `portal` — mechanical integration work, not a design decision; happens after the spec is handed off, not part of this map.

## Out of scope

- Two-player co-op / separately controlled Wando and Gogu — ruled out during destination-fixing; single ship, single player, Gogu as a skill-granting copilot instead.
- Narrative/dialogue/story scenes and NPCs — ruled out; purely arcade (fly, shoot, dodge, boss).
- Persistent meta-progression: high scores, inventory, ship leveling, cross-run power-up accumulation — ruled out; only the last completed stage is saved.
