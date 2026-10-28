/**
 * Shared data contracts. Nothing here executes — it documents the shapes
 * every world/battle/content file should conform to so parallel work stays
 * compatible without needing a shared runtime dependency.
 *
 * @typedef {Object} Warp
 * @property {number} x
 * @property {number} y
 * @property {string} toMap     - map id within the same world, or 'SHIP' to open world-select
 * @property {number} [toX]
 * @property {number} [toY]
 * @property {string} [toWorld] - set when warping to a different world
 *
 * @typedef {Object} NPC
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {'up'|'down'|'left'|'right'} facing
 * @property {string} spriteId   - key into assets/sprites registry
 * @property {string[]|function(state):string[]} dialogue - lines, or a function of GameState returning lines (for flag-aware dialogue)
 * @property {string} [requiresFlag] - only appears/interactable if this flag is set
 * @property {string[]} [watchesQuests] - quest ids this NPC's dialogue branches on. Drives the "!" new-content
 *   marker: shown the first time the player meets them, and again whenever any watched quest's stage/complete
 *   or watched flag changes since the last conversation. Omit for NPCs with purely static dialogue (marker
 *   just shows once).
 * @property {string[]} [watchesFlags] - flag names this NPC's dialogue branches on (for flag-gated rather
 *   than quest-stage-gated dialogue) — same "!" marker behavior as watchesQuests.
 * @property {boolean} [isMerchant] - one per world: talking to them shows their `dialogue` (if any) as a
 *   greeting, then opens the ShopScene (see scenes/shopScene.js) to buy medkits/tonics with state.credits,
 *   instead of just closing the dialogue box.
 *
 * @typedef {Object} Secret
 * @property {string} id           - unique within the map
 * @property {number} x
 * @property {number} y            - usually an otherwise-unwalkable "fake wall" tile; found by walking into it (bump-to-reveal) or, as a fallback, by pressing A while facing it
 * @property {Object<string, number>} [reward] - inventory items to grant, e.g. { medkit: 2 }
 * @property {string[]} [dialogue] - shown on discovery
 * @property {Array<{x: number, y: number, tileId: string}>} [opensTiles] - tiles on the
 *   same map to mutate once this secret is found (e.g. turning the fake-wall tile and a
 *   short corridor into walkable floor to open a hidden passage/chamber)
 * @property {string} [setsFlag] - an extra flag (beyond the secret's own internal found-key) to set once
 *   found — e.g. to gate a MapItem's `showWhenFlag` sitting in the chamber this secret opens, so that
 *   item doesn't render while the passage to it is still sealed (see MapItem below).
 *
 * @typedef {Object} MapItem
 * @property {string} id           - unique within the map
 * @property {number} x
 * @property {number} y            - same tile as the Trigger (if any) it visually marks; purely cosmetic and
 *   does not participate in collision/interaction — it does not need to match a Trigger at all, though in
 *   practice it always sits on one for this game's quest/story items.
 * @property {string} spriteId     - id from assets/sprites/registry.js. Rendered every frame like an NPC or
 *   EnemySpawn, plus a pulsing golden aura glow behind it (see OverworldScene._drawGoldenAura) so important
 *   story/quest objects (a lamp, a console, ...) are never just invisible floor.
 * @property {string} [hideWhenFlag] - once this flag is set, the marker (sprite + aura) stops being drawn
 *   entirely, instead of lingering on a tile whose one-time payoff has already been collected/used. Set this
 *   to whatever flag the item's own Trigger already sets on pickup (its `setsFlag`, or one it adds to
 *   `ctx.state.flags` manually) — the item doesn't read quest/inventory state itself, only this one flag.
 * @property {string} [showWhenFlag] - opposite of hideWhenFlag: the marker stays undrawn until this flag is
 *   set. Used for an item sitting behind a Secret (e.g. a cache in a chamber a fake wall still blocks) so
 *   it isn't visible in the camera viewport before the secret is actually found — pair with that Secret's
 *   own `setsFlag`. Independent of hideWhenFlag; an item can use either, both, or neither.
 *
 * @typedef {Object} EncounterZone
 * @deprecated random encounters are disabled — OverworldScene no longer
 *   rolls against encounterZones. Use EnemySpawn (visible, map-placed
 *   enemies) instead. Left here only so old data doesn't throw; new map
 *   content should not add encounterZones.
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {number} chance
 * @property {string[]} enemyIds
 *
 * @typedef {Object} EnemySpawn
 * @property {string} id           - unique within the map, used to remember it's been defeated
 * @property {number} x
 * @property {number} y
 * @property {string} enemyId      - id from battle/enemies.js
 * @property {string} spriteId     - id from assets/sprites/registry.js
 * @property {string[]} [leadInDialogue] - shown (typewriter, blocking) before the fight starts, every
 *   time this spawn is engaged; used for boss build-up lines. Omit for a plain fight-on-contact enemy.
 * @property {function(state, {showDialogue, openShip}):void} [onVictory] - extra story beats beyond the
 *   defeated-flag bookkeeping (handled automatically by OverworldScene) — completing quests, granting
 *   credits, unlocking the next world, chaining a victory dialogue into openShip(), etc. Used by bosses;
 *   a plain enemy omits this. Unlike a boss Trigger's onVictory, this only fires on an actual win, and
 *   the spawn itself stays on the map (re-engageable on retry) until it does.
 *
 * @typedef {Object} Trigger
 * @property {number} x
 * @property {number} y
 * @property {boolean} once
 * @property {string} [requiresFlag]
 * @property {string} [setsFlag]
 * @property {function(ctx):void} onEnter - ctx: { state, startBattle, showDialogue, warpTo, openShip }
 *
 * @typedef {Object} MapDef
 * @property {string} [name] - human-readable segment label shown in the HUD as "{world} - {name}"
 * @property {number} width
 * @property {number} height
 * @property {string[][]} tiles    - rows of tile-type ids (see assets/tiles.js)
 * @property {NPC[]} npcs
 * @property {EnemySpawn[]} enemySpawns - visible enemies on the map; walking into one starts the fight
 * @property {Secret[]} [secrets] - hidden chests/fake walls found by pressing A while facing them
 * @property {MapItem[]} [items] - visible markers for important story/quest objects (lamps, consoles, ...);
 *   rendering-only, see MapItem. Collision/interaction still comes entirely from Trigger/Warp/NPC at the
 *   same coordinates — adding an entry here never changes gameplay, only what's drawn.
 * @property {Warp[]} warps
 * @property {Trigger[]} triggers
 *
 * @typedef {Object} World
 * @property {string} id
 * @property {string} name
 * @property {string} startMap
 * @property {Object<string, MapDef>} maps
 *
 * @typedef {Object} Move
 * @property {string} id
 * @property {string} name
 * @property {'attack'|'heal'|'buff'|'debuff'} kind
 * @property {number} power
 * @property {number} focusCost
 * @property {number} accuracy     - 0..1
 * @property {'kade'|'moss'|'any'} user
 * @property {'kinetic'|'fire'|'force'} [damageType] - attack moves only; compared against a target's
 *   weakTo/resistantTo (see EnemyDef) by battleScene._resolveAction for a damage multiplier
 *
 * @typedef {Object} EnemyDef
 * @property {string} id
 * @property {string} name
 * @property {string} spriteId
 * @property {number} maxHp
 * @property {number} atk
 * @property {number} def
 * @property {number} spd
 * @property {string[]} moves
 * @property {number} xpReward
 * @property {boolean} [isBoss]
 * @property {'kinetic'|'fire'|'force'} [weakTo] - regular (non-boss) enemies only: takes 1.5x damage
 *   from an attack move with this damageType
 * @property {Array<'kinetic'|'fire'|'force'>} [resistantTo] - bosses only: takes 0.6x damage from an
 *   attack move whose damageType is in this list
 *
 * @typedef {Object} Quest
 * @property {string} id       - unique quest id, e.g. 'rustmoor_syndicateSigns'
 * @property {string} name     - display name, routed through t() when rendered
 * @property {string} key      - short stable reference code (T1, T2, ...) for referring to this
 *   quest unambiguously in code/discussion; shown in-game as-is, never translated
 * @property {number} stage
 * @property {boolean} complete
 */

export {}
