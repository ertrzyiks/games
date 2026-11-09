# Wando & Gogu: X-wing Shooter — Game Design Spec

(Originally charted as GitHub issue [#24](https://github.com/ertrzyiks/games/issues/24) and tickets #25-#35; mirrored here as the local-markdown tracker because the sandbox's GitHub token can create issues/labels but cannot post comments, which blocked recording resolutions. This directory is the live tracker going forward.)

## Destination

A written game design spec for a brand-new game — a 2D scrolling shooter (1942-style), pseudo-Star-Wars setting, flying an X-wing piloted by **Wando** and **Gogu** — ready to hand off for implementation as a new package in this monorepo (`games/games/<name>/`).

## Notes

**Domain:** new sibling package to `starforged`, `game-2`, `tank-memo` in `games/games/`. Genre is a 1942-style vertical scrolling shooter, not a turn-based RPG like `starforged`.

**Skills to use while working tickets:** `/grilling` and `/domain-modeling` by default; `/prototype` when a mechanic needs something concrete to react to (control feel, a boss pattern); `/research` for research tickets.

**2026-11-09 — scope override:** once all design tickets below were resolved, the user explicitly asked to skip further HITL grilling and go straight to implementation — agent judgment decides remaining design tickets, parallel subagents build the game, and the result merges to `main`. This carries execution into the map itself (see the end of Decisions so far).

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
- [Pick the 3 stage themes & settings](issues/02-stages.md) — Dustrim Canyons (desert canyon) → Frostholt Reaches (icy mountains) → Scrapfleet Graveyard (asteroid junkyard, leads into the final boss).
- [Define the touch & keyboard control scheme](issues/03-controls.md) — whole-screen finger-follow drag for movement, arrow/WASD on desktop, dedicated bottom-right Gogu button (tap/long-press), continuous autofire via a timer.
- [Design Gogu's special skill(s)](issues/04-gogu-skills.md) — two skills: **Force Nudge** (cooldown-based shot deflection) and **Force Wave** (meter-charged radial clear/deflect, also the Stage 3 boss's unlock mechanic).
- [Design power-up types and rules](issues/05-powerups.md) — Twin Blaster (weapon tiers), Shield Orb (one-hit shield), Meter Charge (fills Force Wave); drop-based, run-scoped only.
- [Design the enemy bestiary & wave patterns](issues/06-enemies.md) — 2 enemy types per stage, escalating density/speed/pattern complexity stage to stage.
- [Design the Stage 1 boss fight](issues/07-boss1.md) — Old Canyon Turret, weak-spot mechanic, gentlest fight.
- [Design the Stage 2 boss fight](issues/08-boss2.md) — Frostclaw Walker, massive-HP attrition, two phases.
- [Design the Stage 3 (final) boss fight](issues/09-boss3.md) — The Reassembler, Gogu-skill-dependent (Force Wave breaks its shield), multi-phase climax.
- [Define the art/asset pipeline & visual style](issues/10-art.md) — procedural Phaser `Graphics`-drawn shapes (like `starforged`'s `spriteTemplates.js`), flat bold-outlined cartoon style.
- [Define lives, game-over, and continue-from-last-stage flow](issues/11-lives.md) — 3 lives, restart current stage on game-over, power-ups reset on death, stage-select/continue screen driven by saved "last completed stage."

All design tickets are now resolved. The map's destination (a written spec) is reached — remaining work is implementation, which per the user's direction was carried out directly rather than staying purely planning.

**2026-11-09 — implementation complete, merged to `main`.** The full game is built at `games/games/wando-gogu/` (Phaser 4 + Vite): shared systems (movement/autofire/Gogu skills/power-ups/lives/stage-select, scaffolded directly) plus all three stages and bosses (Stage 1 built directly; Stages 2 and 3 built by parallel background agents in isolated worktrees, against the Stage 1 contract, then merged with no conflicts). Registered in `portal`. Verified via `pnpm run build` (clean) and a Vite-dev-server module-transform smoke test for every file (no runtime/browser testing was available in this environment — gameplay feel and the specific numeric tuning chosen by the implementing agents are unverified by actual play).

## Not yet specified

- Audio/music & SFX scope for v1 — not discussed yet; building v1 without audio, can be added later.
- Title screen / menu / pause flow beyond the stage-select screen described in [11-lives.md](issues/11-lives.md).
- Exact numeric tuning (speeds, HP values, spawn rates, meter fill rates) — left to implementation judgment within the shapes described in the tickets.
- Registering the new game as an entry in `portal` — mechanical integration work, not a design decision.

## Out of scope

- Two-player co-op / separately controlled Wando and Gogu — ruled out during destination-fixing; single ship, single player, Gogu as a skill-granting copilot instead.
- Narrative/dialogue/story scenes and NPCs — ruled out; purely arcade (fly, shoot, dodge, boss).
- Persistent meta-progression: high scores, inventory, ship leveling, cross-run power-up accumulation — ruled out; only the last completed stage is saved.
