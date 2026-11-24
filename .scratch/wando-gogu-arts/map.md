# Wando & Gogu: ARTS — Game Design Spec

Supersedes the X-wing shooter previously built in the same package — see
[`.scratch/wando-gogu-xwing-shooter/map.md`](../wando-gogu-xwing-shooter/map.md) for that
history. This map tracks the pivot: a simplified 3D Action Real-Time Strategy (MOBA-lite).

## Destination

A simplified 3D ARTS/MOBA-lite, replacing the shooter in the same `games/games/wando-gogu/`
package: a single lane, 5 heroes per side (the player controls exactly one; the other 9 — 4
allies, 5 enemies — are AI-controlled), computer-controlled creep waves (land units only, unlike
heroes which can fly) marching down the lane to fight whatever's in their way, towers, and a base
per side. Destroying the enemy base wins the match. Per the established precedent for this
project, execution is carried directly into this map rather than staying purely planning.

## Notes

**Domain:** replaces the prior shooter entirely, in the same package. Genre is now a 3D
MOBA-lite/ARTS, not a 2D scroller.

**2026-11-24 — scope confirmed by user:** (1) replace the existing `wando-gogu` package rather
than build a separate game; (2) **simplified v1** — single lane, basic "chase nearest enemy and
attack" AI for creeps and bot heroes, 1-2 abilities per hero, simple tower/base HP. Explicitly not
full MOBA depth (no multiple lanes, no sophisticated pathfinding/retreat logic, no deep ability
kits) — that's deliberately out of scope for this pass.

**Lesson carried forward from the shooter effort:** the engine-research ticket there recommended
Phaser 4 correctly, but a Phaser-3-only API (`Group.children.each()`) slipped into the
implementation anyway and broke the game at runtime, caught only by an actual headless-browser
click-through, not by static checks. For this effort, verify the chosen 3D engine's API against
the actually-installed package version (a tiny working example), and smoke-test every
implementation milestone with a real headless browser (Playwright is available in this sandbox,
Chromium pre-cached at `~/.cache/ms-playwright/chromium-1248`), not just a build/transform check.

**Standing decisions / preferences for this effort:**
- Kid-friendly: no blood, no gore — carried forward from the shooter effort, still the right
  default for this project; otherwise full creative freedom on hero/creep/map visual design.
- Touch-friendly and usable on small screens is a hard repo-wide constraint (see
  `/Users/mateuszderks/personal/games/CLAUDE.md`).
- Procedural/code-built visuals (no image/model assets, no art pipeline) — carried forward from
  the shooter's art decision, adapted to 3D: simple primitive meshes (boxes/spheres/cones/etc.),
  flat bright colors, no textures.
- No multiplayer networking — all 9 non-player heroes are AI-controlled, consistent with "computer
  controlled" framing and this repo having no backend/auth infrastructure.
- No persistence needed beyond the current match's state; a match is a single self-contained
  session (start → win/lose → restart), no save/continue system like the shooter's stage-select.

## Decisions so far

- [Design the hero roster](issues/02-heroes.md) — mirror-match 5-role roster (Vanguard/Wando,
  Mystic/Gogu, Marksman, Skirmisher, Sentinel) shared by both teams, reskinned per side; heroes
  move freely in 3D, unconstrained by the lane.
- [Design the creep (mob) type and wave behavior](issues/03-creeps.md) — one shared "Grunt" type,
  waves of 3 every ~15s, lane-locked, chase-nearest-and-attack.
- [Design the lane, towers, base, and win/lose/match flow](issues/04-towers-base.md) — single
  lane, 2 towers/side, base per side, nearest-in-range targeting, hero respawn on death, base
  destruction wins.
- [Design the AI behavior shared by creeps and bot-controlled heroes](issues/05-ai-behavior.md) —
  one shared chase-nearest/attack/advance loop, no retreat or prioritization logic.
- [Define the player's controls and camera](issues/06-controls-camera.md) — fixed follow camera,
  drag-to-move via ground-plane raycast, fully automatic nearest-enemy attack, one ability button.
- [Define the 3D visual style](issues/07-visual-style.md) — procedural primitive meshes, flat
  team colors, no textures/models.

Only the engine pick ([01-engine.md](issues/01-engine.md)) remains open.

## Not yet specified

- Audio/music & SFX — not discussed, building without audio for v1.
- Match flow details beyond "start, play, win/lose, restart" (e.g. a title/menu screen) — minimal
  by design for v1.
- Exact numeric tuning (HP, damage, speeds, cooldowns, spawn cadence) — left to implementation
  judgment within the shapes decided in tickets, same approach as the shooter effort.

## Out of scope

- Multiple lanes, jungle/neutral objectives, items/shops, leveling/XP — full MOBA depth, ruled out
  by the user's explicit "simplified v1" scope choice.
- Multiplayer/networked play — all non-player heroes are AI, not other humans.
- Persistent progression across matches (ranks, unlocks, stats) — not part of this scope.
