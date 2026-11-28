# Design the lane, towers, base, and win/lose/match flow

Type: grilling
Status: resolved

## Question

Lane layout, tower/base stats and targeting, win condition, and what happens on hero death /
match end. Simplified v1 bar: simple tower/base HP, single lane.

## Answer

**Lane:** one straight lane connecting two bases at opposite ends. 2 towers per side spaced along
the lane (4 towers total), roughly a third and two-thirds of the way down each side's half of the
lane.

**Towers:** moderate-to-high HP, attack the nearest enemy unit (creep or hero — flight doesn't
exempt a hero from being targeted, range is what matters) within their attack range, meaningful
damage so an unsupported push stalls against them.

**Base:** large HP pool per side; also attacks the nearest enemy unit within its (short) range as
a last line of defense. Reaching 0 HP on a base ends the match for that side.

**Win/lose:** destroying the enemy base wins; your base reaching 0 HP loses.

**Hero death:** any hero (player's or AI) that reaches 0 HP respawns at their own base after a
short timer (~5s) — standard MOBA feel, keeps the player's hero from being stuck sitting out a
long match on a bad death. Creeps that die are simply gone (no respawn — more spawn on the next
wave).

**Match flow:** the match starts immediately on load — no menu/lobby needed for v1 (optionally a
minimal "tap to start" beat, implementation's call). On win/lose, show a simple overlay
("VICTORY"/"DEFEAT") with a restart action that reloads the match from scratch. No persistence
across matches, per the map's Notes.

## 2026-11-25 — added: tower destruction visual + a gold economy

Two additions from playing this pass:

- **A destroyed tower visually becomes a rubble pile** instead of sitting there dead but
  unchanged (it already stopped shooting for free, since attack logic already skips `!alive`
  units — this was purely a missing visual). The original tower mesh (and its health bar) is
  hidden; a scattered 5-chunk debris group spawns at its position.
- **A gold economy**: destroying an enemy tower or enemy creep grants the player gold (100 / 10
  respectively) — `World.gold`, shown in the HUD. A placeholder for a later shop; nothing spends
  gold currently.

## 2026-11-25 — revised: last-hit only, tower telegraph + rebalance, progress HUD

- **Gold now requires the player's own kill** — reversing the earlier "shared" design. A bot ally
  finishing off an enemy creep/tower grants nothing; only a kill where `unit.lastDamagedBy` (set
  on every hit, see `Unit.takeDamage`) is Wando counts. Classic MOBA last-hitting, not a shared
  team economy.
- **Towers now telegraph before firing**: on acquiring a target, a visible aim line locks onto it
  for `TOWER_AIM_MS` (2s) before the shot actually lands — dodgeable, not instant. Rebalanced to
  match: much higher damage per hit (24 → 70) but a far slower cycle (`attackIntervalMs` 700ms →
  3800ms, counted from the start of one aim phase to the next). A cancelled aim (target died or
  left range) can retry immediately, no penalty.
- **Tower progress is now shown in the HUD** — a small "🗼 Ally x/y  Enemy x/y" readout of towers
  still standing per side.

## 2026-11-28 — bigger waves, top-strip HUD replaces the text readout

- **More mobs**: `CREEP_WAVE_SIZE` 3 → 6 and `CREEP_WAVE_INTERVAL_MS` 15s → 10s, since the lane is
  now longer (see `LANE_LENGTH`) and had room to spare.
- **The tower-count text readout was replaced** with a visual top-of-screen strip laid out like an
  unrolled lane: `[ally base bar][ally tower near-base][ally tower near-mid] | [enemy tower
  near-mid][enemy tower near-base][enemy base bar]`, each tower a small vertical-fill icon (full
  color when healthy, dims to gray when destroyed) instead of a plain fraction. `hud.js`'s
  `setTowerStates` takes each side's fractions already in left-to-right display order; main.js
  reverses the enemy array since towers are stored `[nearBase, nearMid]` but displayed mid-first on
  that side, to meet the ally side's mid-first-from-center order in the middle.
- The strip was later re-centered as one compact unit (was stretched edge-to-edge with the two
  team groups pinned to the screen corners) and sized up for legibility.

## 2026-11-28 — faster towers, an "under fire" screen warning

- **Towers re-engage sooner after firing**: `TOWER_STATS.attackIntervalMs` 3800 → 2300. The real
  shot-to-shot cadence is `TOWER_AIM_MS + attackIntervalMs` (not `attackIntervalMs` alone — see the
  comment in `config.js`, corrected alongside this change since it previously described the wrong
  relationship), so this drops the cadence from 5800ms to 4300ms, a verified ~26% speed-up.
  Deliberately raises the cost of lingering in a tower's range unsupported, since the goal is to
  push the player toward using their own creep waves as cover — a tower always targets the nearest
  enemy, so standing amid a wave usually means the creeps draw its attention instead of Wando.
- **A new "under fire" HUD warning**: a soft red glow around the screen's edge only (an inset
  `box-shadow`, not a full-screen tint) fades in whenever any tower's telegraph (`tower.aimTarget`)
  is locked onto Wando specifically, and fades back out once that's no longer true — giving a clear,
  peripheral signal that she's the one about to be hit, distinct from the aim-line telegraph itself
  (which points at a target, not necessarily visible in frame).
