# Starforged — Implementation Plan v2 (chapter rebuild)

v1 shipped a working but thin vertical slice: tiny single-screen worlds, no
quests, no progression gating, and two real bugs (dialogue could
re-trigger itself forever off a single keypress; the battle menu could go
fully unresponsive once Moss ran out of Focus or medkits ran out). This
version fixes the bugs, adds the missing systems, and rebuilds every world
to be several times bigger with actual quests and a gated story order.

## What's fixed / added (done, by the coordinator — foundation layer)

- **Dialogue re-trigger bug**: `overworldScene.js` and `battleScene.js`
  both now snapshot `dialogueWasActive` before calling `dialogue.update()`
  and return early if it was true, so the keypress that closes a textbox
  can never also be read as this frame's interact/menu input.
- **Battle menu stuck bug**: `BattleScene._currentOptions()` now filters to
  only options that are actually affordable (Focus cost, medkit count), so
  there is never a selectable-but-dead option. Every party member has a
  guaranteed 0-Focus-cost move (Kade: `strike`, Moss: new `glimmer`).
- **Quest data model**: `data/gameState.js` now has `state.quests = {}`
  plus `startQuest(state, id, name)` / `setQuestStage(state, id, stage)`
  / `completeQuest(state, id)`. A quest is `{ id, name, stage, complete }`.
  NPC dialogue (as a function of `state`) and triggers read/write this to
  gate what's said/offered.
- **World gating**: `state.unlockedWorlds` starts as `['rustmoor']` only.
  `worlds/registry.js` exports `unlockNextWorld(state, currentWorldId)`,
  which unlocks whatever world was registered immediately after
  `currentWorldId` (registration order = import order in `main.js` =
  the intended chapter order: rustmoor → mossfenReach → ashvaultStation →
  skyreachCanopy → theHollow). Call it from a boss fight's victory
  callback.
- **Boss victory callback**: `OverworldScene.startBattle(enemyIds,
  callbacks)` now takes an optional second arg `{ onVictory(state),
  onDefeat(state) }`, forwarded from `ctx.startBattle(enemyIds, callbacks)`
  inside a trigger's `onEnter`. Use this for every chapter's boss fight:
  ```js
  ctx.startBattle(['bossId'], {
    onVictory: (state) => {
      unlockNextWorld(state, 'thisWorldId')
      completeQuest(state, 'thisWorldMainQuest')
      ctx.showDialogue(['...victory/plot lines...'])
    },
  })
  ```
- **Ship screen is now a hub**: press B from the overworld → `Travel` /
  `Quest Log` / `Close`. Quest Log reads `state.quests` directly — nothing
  else to wire up, just use the quest helpers.

These foundation files are done and should NOT be touched by chapter
agents: `src/engine/*`, `src/scenes/overworldScene.js`,
`src/scenes/shipScene.js`, `src/scenes/titleScene.js`, `src/battle/*`,
`src/data/*`, `src/worlds/registry.js`, `src/assets/sprites/registry.js`,
`src/assets/tiles.js`, `src/ui/*`, `src/main.js`, `package.json`.

## Overall plot (so each chapter's dialogue stays consistent)

Kade Ironhelm, an armorer-warrior exiled from his forge-clan, found Moss —
a foundling with power over "the Current" — fleeing a Hollow Syndicate
raid and swore to protect him. The Syndicate wants Moss to build a device
to harness the Current at scale. Across the five worlds of the Drift, the
Syndicate's presence escalates from rumor to open operation to full
confrontation:

1. **Rustmoor** (ch.1) — Kade's exile, introducing Moss, first sign of
   Syndicate scouts; a local raider captain is shaking down the canyon
   settlements. Beating him is what gets Kade's skiff fueled to leave.
2. **Mossfen Reach** (ch.2) — Moss's homeland. The fenling kin here were
   already raided once; a corrupted "Bog Warden" (Syndicate-controlled)
   guards something the Syndicate wants from the reach.
3. **Ashvault Station** (ch.3) — the Syndicate's industrial foothold:
   they're building a Current Extractor. Sabotage it; beat the Foreman
   running the station.
4. **Skyreach Canopy** (ch.4) — a hidden refuge of Current-sensitive
   "Skykin." The Syndicate has found it. An elite enforcer leads the
   assault; beating them buys the refuge time and reveals the Hollow's
   location.
5. **The Hollow** (ch.5) — the Syndicate stronghold. Final confrontation
   with its leader, the Warden, who wants Moss directly. Ending wraps up
   Kade's redemption arc and the Drift's worlds being safer.

## Per-chapter build spec (applies to each of the 5 world files)

Each world file should be rebuilt to roughly this shape — several times
bigger than v1, with real quests, not just flavor NPCs:

- **4 connected maps**: an outdoor *Approach* (encounter zone, ~18x14), a
  *Settlement* hub (~14x12, 3-4 NPCs), a *Depths* dungeon/interior
  (~16x16, maze-like, at least one area gated behind a quest flag/item),
  and a boss arena (can be the Depths' final room).
- **5-6 NPCs total**, at least 2 of them quest-givers whose `dialogue`
  is a function of `state` that branches on `state.quests[id]?.stage` /
  `.complete` (different lines before/during/after the quest).
- **2 quests** per world using the `startQuest`/`setQuestStage`/
  `completeQuest` helpers from `data/gameState.js`:
  - one "go do a thing in the Depths and come back" quest (fetch/defeat/
    rescue), paying out e.g. +1 medkit or a small stat item on return;
  - one plot quest advancing the Syndicate thread for that chapter.
- **Enemy variety**: 2-3 regular enemy types + 1 named boss. The boss
  trigger blocks further progress until beaten (one-tile chokepoint, like
  `theHollow.js` already does well) and its `onVictory` callback calls
  `unlockNextWorld` + `completeQuest` + a short plot payoff line.
- Reuse the existing world file's established names/lore/sprites/tiles as
  a seed — don't throw away working content — but the map footprint and
  NPC/quest count must grow substantially; a single 12x10 screen is not
  acceptable anymore.
- Rustmoor and Skyreach Canopy currently have **no boss at all** — add
  one; this is the main gate for those two chapters.

### Balance targets (bigger worlds mean more fights before the boss, so
targets are slightly higher than v1)

| Chapter | Regular enemy HP | Boss HP |
|---|---|---|
| 1 Rustmoor | 18-26 | 45-60 |
| 2 Mossfen Reach | 26-34 | 75-95 |
| 3 Ashvault Station | 34-44 | 100-125 (buff the existing Foreman if reusing it) |
| 4 Skyreach Canopy | 46-58 | 140-165 |
| 5 The Hollow (final) | — | 190-230 (buff the existing Warden — party will be well leveled by here) |

## Status: v2 complete

- Foundation (bug fixes, quest model, world-gating, ship hub): **done**.
- Chapter rebuilds 1-5: **done**. Every world now has 3-4 connected maps,
  5-6 NPCs with real stage-based quest dialogue, 2 quests each, a
  quest-item/flag-gated area, enemy variety, and a named boss gating
  progress to the next chapter (Rustmoor and Skyreach Canopy didn't have
  bosses in v1 — they do now).
- A bug surfaced during integration: `data/gameState.js`'s
  `createInitialState()` still pointed at Rustmoor's old v1 map id/coords
  (`'canyon'`, x:5,y:7), which no longer exist after the rebuild — New
  Game would have crashed. Fixed to match the new `canyonApproach`/`(9,1)`
  entry point.
- Verified end-to-end in a real headless-Chromium browser: New Game no
  longer crashes; Rustmoor's quest/flag-gated rubble dungeon, random
  encounters, and boss fight all work; beating the Rustmoor boss correctly
  unlocks Mossfen Reach (confirmed via the Quest-Log/Travel ship screen,
  not just by reading code); all 5 worlds load cleanly from their entry
  points with zero console errors; the final boss in The Hollow resolves
  into a proper multi-line ending and sets `gameCompleted` without
  incorrectly unlocking a nonexistent 6th world.
- Committed to `main` locally. Not yet pushed — this sandbox currently has
  no way to push (SSH remote, no key here); push from the host/another
  machine with SSH access.
