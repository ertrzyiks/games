/**
 * @typedef {Object} PartyMember
 * @property {string} id
 * @property {string} name
 * @property {number} level
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} focus
 * @property {number} maxFocus
 * @property {number} atk
 * @property {number} def
 * @property {number} spd
 * @property {number} xp
 * @property {string[]} moves
 */

export function createInitialState() {
  return {
    worldId: 'rustmoor',
    // Must match rustmoorWorld.startMap / .entry in worlds/rustmoor.js —
    // kept in sync by hand since this file can't import the world file
    // (would create a circular import with the quest helpers below).
    mapId: 'canyonApproach',
    x: 9,
    y: 1,
    facing: 'up',
    party: {
      kade: {
        id: 'kade',
        name: 'Wando',
        level: 1,
        hp: 28,
        maxHp: 28,
        focus: 6,
        maxFocus: 6,
        atk: 7,
        def: 5,
        spd: 4,
        xp: 0,
        // Weapons unlock with level — see MOVE_UNLOCKS below. Wando starts
        // with just his pistol; Rifle Shot and the Flamethrower come later.
        moves: ['pistolShot'],
      },
      moss: {
        id: 'moss',
        name: 'Gogu',
        level: 1,
        hp: 16,
        maxHp: 16,
        focus: 10,
        maxFocus: 10,
        atk: 3,
        def: 3,
        spd: 6,
        xp: 0,
        // Gogu starts with just the free Force Spark; Force Push and Force
        // Heal unlock later — see MOVE_UNLOCKS below.
        moves: ['glimmer'],
      },
    },
    inventory: { medkit: 2, tonic: 1 },
    flags: new Set(),
    // Only Rustmoor is reachable at the start. Each world's finale boss
    // trigger unlocks the next one on victory (see worlds/registry.js's
    // WORLD_ORDER and OverworldScene.startBattle's onVictory callback).
    unlockedWorlds: ['rustmoor'],
    // Lightweight quest log: { [questId]: { id, name, key, stage, complete } }.
    // World/NPC files call the helpers below to start/advance/complete a
    // quest; the ship screen's Quest Log page reads this to render status.
    // `key` is a short stable reference code (T1, T2, ...) shown in-game and
    // used to refer to quests unambiguously in code/discussion.
    quests: {},
    // Tracks which "content signature" (see overworldScene.js's
    // npcHasNewContent) the player last saw for each NPC they've talked
    // to, so the "!" marker reappears when an NPC's dialogue has actually
    // changed (e.g. a watched quest advanced) and not otherwise.
    npcSeenSignatures: {},
  }
}

export function startQuest(state, id, name, key) {
  if (!state.quests[id]) state.quests[id] = { id, name, key, stage: 0, complete: false }
}

export function setQuestStage(state, id, stage) {
  if (state.quests[id]) state.quests[id].stage = stage
}

export function completeQuest(state, id) {
  if (state.quests[id]) state.quests[id].complete = true
}

// Steeper than a flat linear curve so higher levels — and the bigger
// stat/damage numbers that come with them — take meaningfully longer to
// reach, instead of snowballing after just a few fights.
export function xpToNextLevel(level) {
  return Math.round(24 + level * 16 * Math.pow(1.08, level))
}

// Weapons/techniques unlock as a character levels up, rather than all
// being available from level 1. Additive only (old moves are never
// removed) — every character keeps a guaranteed free 0-focus-cost move,
// so the battle menu can never end up with nothing selectable.
const MOVE_UNLOCKS = {
  kade: { 2: 'rifleShot', 5: 'flamethrower' },
  moss: { 2: 'push', 5: 'mend' },
}

export function grantXp(member, amount) {
  member.xp += amount
  let leveledUp = false
  const unlockedMoves = []
  while (member.xp >= xpToNextLevel(member.level)) {
    member.xp -= xpToNextLevel(member.level)
    member.level += 1
    member.maxHp += 4
    member.hp = member.maxHp
    member.maxFocus += 1
    member.focus = member.maxFocus
    member.atk += 1
    if (member.level % 2 === 0) member.def += 1
    if (member.level % 3 === 0) member.spd += 1
    leveledUp = true

    const unlockedMoveId = MOVE_UNLOCKS[member.id]?.[member.level]
    if (unlockedMoveId && !member.moves.includes(unlockedMoveId)) {
      member.moves.push(unlockedMoveId)
      unlockedMoves.push(unlockedMoveId)
    }
  }
  return { leveledUp, unlockedMoves }
}

export function isPartyWiped(party) {
  return Object.values(party).every((m) => m.hp <= 0)
}
