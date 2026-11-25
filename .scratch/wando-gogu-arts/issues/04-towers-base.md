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
  respectively) — `World.gold`, shown in the HUD. Shared/simplified, not per-kill-credit: gold
  accrues whenever an enemy tower/creep dies, regardless of who landed the killing blow (not
  strict last-hit MOBA economy) — this is explicitly a placeholder for a later shop, which doesn't
  exist yet; nothing spends gold currently.
