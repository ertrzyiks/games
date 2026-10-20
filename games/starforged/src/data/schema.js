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
 *
 * @typedef {Object} Secret
 * @property {string} id           - unique within the map
 * @property {number} x
 * @property {number} y            - usually an otherwise-unwalkable "fake wall" tile; found by pressing A while facing it (same gesture as talking to an NPC)
 * @property {Object<string, number>} [reward] - inventory items to grant, e.g. { medkit: 2 }
 * @property {string[]} [dialogue] - shown on discovery
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
 * @property {number} width
 * @property {number} height
 * @property {string[][]} tiles    - rows of tile-type ids (see assets/tiles.js)
 * @property {NPC[]} npcs
 * @property {EnemySpawn[]} enemySpawns - visible enemies on the map; walking into one starts the fight
 * @property {Secret[]} [secrets] - hidden chests/fake walls found by pressing A while facing them
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
 */

export {}
