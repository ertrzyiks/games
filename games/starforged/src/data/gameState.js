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
    mapId: 'canyon',
    x: 5,
    y: 7,
    facing: 'up',
    party: {
      kade: {
        id: 'kade',
        name: 'Kade',
        level: 1,
        hp: 28,
        maxHp: 28,
        focus: 6,
        maxFocus: 6,
        atk: 7,
        def: 5,
        spd: 4,
        xp: 0,
        moves: ['strike', 'guard', 'forgeSlam'],
      },
      moss: {
        id: 'moss',
        name: 'Moss',
        level: 1,
        hp: 16,
        maxHp: 16,
        focus: 10,
        maxFocus: 10,
        atk: 3,
        def: 3,
        spd: 6,
        xp: 0,
        moves: ['glimmer', 'push', 'mend'],
      },
    },
    inventory: { medkit: 2 },
    flags: new Set(),
    // Only Rustmoor is reachable at the start. Each world's finale boss
    // trigger unlocks the next one on victory (see worlds/registry.js's
    // WORLD_ORDER and OverworldScene.startBattle's onVictory callback).
    unlockedWorlds: ['rustmoor'],
    // Lightweight quest log: { [questId]: { id, name, stage, complete } }.
    // World/NPC files call the helpers below to start/advance/complete a
    // quest; the ship screen's Quest Log page reads this to render status.
    quests: {},
  }
}

export function startQuest(state, id, name) {
  if (!state.quests[id]) state.quests[id] = { id, name, stage: 0, complete: false }
}

export function setQuestStage(state, id, stage) {
  if (state.quests[id]) state.quests[id].stage = stage
}

export function completeQuest(state, id) {
  if (state.quests[id]) state.quests[id].complete = true
}

export function xpToNextLevel(level) {
  return 20 + level * 15
}

export function grantXp(member, amount) {
  member.xp += amount
  let leveledUp = false
  while (member.xp >= xpToNextLevel(member.level)) {
    member.xp -= xpToNextLevel(member.level)
    member.level += 1
    member.maxHp += 6
    member.hp = member.maxHp
    member.maxFocus += 2
    member.focus = member.maxFocus
    member.atk += 2
    member.def += 1
    member.spd += 1
    leveledUp = true
  }
  return leveledUp
}

export function isPartyWiped(party) {
  return Object.values(party).every((m) => m.hp <= 0)
}
