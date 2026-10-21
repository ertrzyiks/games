/**
 * Builds src/data/wiki-data.json straight from Starforged's real data
 * modules, so the wiki can never drift from the actual game balance/content.
 *
 * Nothing here is DOM-dependent: moves.js/enemies.js/items.js are plain
 * registries, and the world files only build plain data (tile/sprite
 * definitions are role-letter grids + color legends, never touching
 * `document` or `canvas` at import time — see engine/sprite.js, whose only
 * DOM call is inside drawSprite(), which this script never calls). That
 * makes it safe to import the real source files directly from Node instead
 * of hand-transcribing their content.
 *
 * Run via `pnpm run generate-data` (wired into both `dev` and `build`).
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const GAME_SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../starforged/src')
const OUT_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/wiki-data.json')

function gameSrc(relPath) {
  return path.join(GAME_SRC, relPath)
}

const { getAllMoves } = await import(gameSrc('battle/moves.js'))
const { getAllEnemies } = await import(gameSrc('battle/enemies.js'))
const { MEDKIT_HEAL_AMOUNT, TONIC_FOCUS_RESTORE_AMOUNT } = await import(gameSrc('battle/items.js'))
const { createInitialState } = await import(gameSrc('data/gameState.js'))
const { setLanguage, t } = await import(gameSrc('engine/i18n.js'))
const { listWorldIds, getWorld } = await import(gameSrc('worlds/registry.js'))

// Side-effect imports, in the same order main.js uses, so move/enemy ids and
// their `moveWorld`/`enemyWorld` tagging below line up with the real game.
await import(gameSrc('i18n/pl/common.js'))
await import(gameSrc('i18n/pl/combatNames.js'))

const CORE = 'core'
const moveWorld = new Map()
const enemyWorld = new Map()
for (const m of getAllMoves()) moveWorld.set(m.id, CORE)
for (const e of getAllEnemies()) enemyWorld.set(e.id, CORE)

const WORLD_FILES = [
  { id: 'rustmoor', file: 'worlds/rustmoor.js', i18n: 'i18n/pl/rustmoor.js' },
  { id: 'mossfenReach', file: 'worlds/mossfenReach.js', i18n: 'i18n/pl/mossfenReach.js' },
  { id: 'ashvaultStation', file: 'worlds/ashvaultStation.js', i18n: 'i18n/pl/ashvaultStation.js' },
  { id: 'skyreachCanopy', file: 'worlds/skyreachCanopy.js', i18n: 'i18n/pl/skyreachCanopy.js' },
  { id: 'theHollow', file: 'worlds/theHollow.js', i18n: 'i18n/pl/theHollow.js' },
]

for (const w of WORLD_FILES) {
  await import(gameSrc(w.file))
  await import(gameSrc(w.i18n))
  for (const m of getAllMoves()) if (!moveWorld.has(m.id)) moveWorld.set(m.id, w.id)
  for (const e of getAllEnemies()) if (!enemyWorld.has(e.id)) enemyWorld.set(e.id, w.id)
}

// Bosses are only referenced inside each world's finale-trigger closure
// (ctx.startBattle([...])), not via any statically-scannable list, so the
// registration-order tagging above (which only sees enemySpawns-independent
// registerEnemies calls) already assigns them correctly: each boss is
// registered in its own chapter's world file, same as its regular enemies.

function bilingual(nameEn) {
  setLanguage('en')
  const en = t(nameEn)
  setLanguage('pl')
  const pl = t(nameEn)
  setLanguage('en')
  return { en, pl }
}

const moves = getAllMoves().map((m) => ({
  id: m.id,
  name: bilingual(m.name),
  kind: m.kind,
  power: m.power,
  focusCost: m.focusCost,
  accuracy: m.accuracy,
  status: m.applyStatus ? { type: m.applyStatus.type, duration: m.applyStatus.duration, power: m.applyStatus.power } : null,
  lifesteal: !!m.lifesteal,
  focusRestore: m.focusRestore || 0,
  world: moveWorld.get(m.id) || CORE,
}))

const enemies = getAllEnemies().map((e) => ({
  id: e.id,
  name: bilingual(e.name),
  maxHp: e.maxHp,
  atk: e.atk,
  def: e.def,
  spd: e.spd,
  xpReward: e.xpReward,
  isBoss: !!e.isBoss,
  moves: e.moves,
  world: enemyWorld.get(e.id) || CORE,
}))

const items = [
  {
    id: 'medkit',
    name: bilingual('Medkit'),
    description: {
      en: `Restores ${MEDKIT_HEAL_AMOUNT} HP to one party member. Usable both in and out of battle.`,
      pl: `Przywraca ${MEDKIT_HEAL_AMOUNT} PŻ jednemu członkowi drużyny. Można użyć w walce i poza nią.`,
    },
  },
  {
    id: 'tonic',
    name: bilingual('Tonic'),
    description: {
      en: `Outside battle, restores ${TONIC_FOCUS_RESTORE_AMOUNT} Focus to one party member. In battle, raises that member's Attack for the fight instead.`,
      pl: `Poza walką przywraca ${TONIC_FOCUS_RESTORE_AMOUNT} Skupienia jednemu członkowi drużyny. W walce zamiast tego zwiększa jego Atak do końca starcia.`,
    },
  },
]

const initialState = createInitialState()
const party = Object.values(initialState.party).map((member) => ({
  id: member.id,
  name: member.name,
  startingMoves: member.moves,
}))

const worldMeta = [
  { id: 'rustmoor', order: 1 },
  { id: 'mossfenReach', order: 2 },
  { id: 'ashvaultStation', order: 3 },
  { id: 'skyreachCanopy', order: 4 },
  { id: 'theHollow', order: 5 },
]

const worlds = worldMeta.map(({ id }) => {
  const world = getWorld(id)
  const maps = Object.entries(world.maps).map(([mapId, map]) => ({
    id: mapId,
    name: bilingual(map.name),
    npcs: (map.npcs || []).map((npc) => npc.id),
    enemySpawns: [...new Set((map.enemySpawns || []).map((s) => s.enemyId))],
    secrets: (map.secrets || []).map((s) => ({
      id: s.id,
      reward: s.reward || {},
    })),
  }))
  return {
    id,
    name: bilingual(world.name),
    startMap: world.startMap,
    maps,
  }
})

// Quest IDs/keys/giver/reward are read straight off the real quest-tracking
// calls in each world file (startQuest/setQuestStage/completeQuest) and the
// quest-title strings match verbatim, so bilingual() picks up the exact
// translation already registered in i18n/pl/combatNames.js.
//
// The walkthrough steps below (`solution`) are NOT derived mechanically —
// they're hand-written prose summarizing what happens when you actually
// read each world file's dialogue/trigger logic (per issue #23's
// instruction that quest solutions "can't be purely mechanical/derived").
const QUESTS = [
  {
    id: 'rustmoor_syndicateSigns',
    key: 'T1',
    nameEn: 'Signs of the Syndicate',
    world: 'rustmoor',
    giver: 'Dessa',
    reward: { en: 'Unlocks Mossfen Reach', pl: 'Odblokowuje Mossfen Reach' },
    solution: {
      en: [
        'Talk to Dessa at her camp in the Canyon Approach — she asks you to find proof of the Hollow Syndicate in the old mine tunnels.',
        "Head down into the Depths (through the Settlement's south door) and reach the mid chamber — the Syndicate sigil scratched into the wall advances the investigation.",
        "Push on to the end of the Depths corridor and defeat the Scavenger Captain in the boss chamber. This finishes the quest and fuels Wando's skiff for the trip to Mossfen Reach.",
      ],
      pl: [
        'Porozmawiaj z Dessą w jej obozie na Podejściu do Kanionu — prosi cię o znalezienie dowodów na działalność Syndykatu Pustki w starych tunelach kopalni.',
        'Zejdź do Głębin (przez południowe drzwi Osady) i dotrz do środkowej komory — wyryty w murze symbol Syndykatu posuwa śledztwo do przodu.',
        'Przejdź do końca korytarza Głębin i pokonaj Kapitana Szabrowników w komnacie szefa. To kończy zadanie i tankuje szkuner Wando na podróż do Mossfen Reach.',
      ],
    },
  },
  {
    id: 'rustmoor_yaraCache',
    key: 'T2',
    nameEn: "Yara's Buried Cache",
    world: 'rustmoor',
    giver: 'Yara',
    reward: { en: '+2 medkits, Wando DEF +1', pl: '+2 apteczki, Obrona Wando +1' },
    solution: {
      en: [
        'Talk to Yara in the Settlement — she hands you her mining pick (it clears the rubble gate deeper in the Depths) and asks you to find her buried medkit cache.',
        "In the Depths' mid chamber, step onto the cache marker to find it.",
        "Return to Yara and talk to her again to hand it over — you receive 2 medkits and Wando's DEF permanently +1.",
      ],
      pl: [
        'Porozmawiaj z Yarą w Osadzie — daje ci swój kilof górniczy (rozbija zawał głębiej w Głębinach) i prosi o znalezienie jej zakopanej skrzyni z apteczkami.',
        'W środkowej komorze Głębin stań na oznaczonym polu, by ją znaleźć.',
        'Wróć do Yary i porozmawiaj z nią jeszcze raz, by jej to przekazać — otrzymujesz 2 apteczki, a Obrona Wando trwale wzrasta o 1.',
      ],
    },
  },
  {
    id: 'mossfen_lostScout',
    key: 'T3',
    nameEn: 'The Lost Scout',
    world: 'mossfenReach',
    giver: 'Finn the Tracker',
    reward: { en: '+1 medkit, Kinlight lantern', pl: '+1 apteczka, lampa Kinlight' },
    solution: {
      en: [
        'Talk to Finn in the Fenling Settlement — his kin Wick went missing scouting the Deep Mire.',
        'Enter the Deep Mire and take the side branch north-west of the entrance room to the small room where Wick is tangled in root-snares; talking to her rescues her and hands you the Kinlight lantern (needed later to cross the dark-water gate).',
        'Return to Finn in the Settlement and talk to him again to complete the quest and receive a medkit.',
      ],
      pl: [
        'Porozmawiaj z Finnem w Osadzie Fenlingów — jego krewna Wick zaginęła, zwiadując w Głębokim Bagnisku.',
        'Wejdź do Głębokiego Bagniska i skręć w boczny korytarz na północny zachód od komnaty wejściowej, do małego pokoju, gdzie Wick jest uwięziona w korzeniach-sidłach; rozmowa z nią uwalnia ją i daje ci lampę Kinlight (potrzebną później do przejścia przez bramę czarnej wody).',
        'Wróć do Finna w Osadzie i porozmawiaj z nim ponownie, by zakończyć zadanie i otrzymać apteczkę.',
      ],
    },
  },
  {
    id: 'mossfen_syndicateTrail',
    key: 'T4',
    nameEn: 'What the Syndicate Took',
    world: 'mossfenReach',
    giver: 'Birch Keeper',
    reward: { en: 'Unlocks Ashvault Station', pl: 'Odblokowuje Ashvault Station' },
    solution: {
      en: [
        'Talk to the Birch Keeper in the Settlement — something was dug up at the old shrine and she wants to know what.',
        'Get the Kinlight lantern from Wick first (see "The Lost Scout") — without it, the dark-water gate deeper in the Deep Mire just bounces you back.',
        'Cross the gate and reach the evidence room to find the cracked Syndicate siphon rig.',
        "Continue on to the Bog Warden's Lair and defeat the Bog Warden to complete the quest.",
      ],
      pl: [
        'Porozmawiaj ze Strażniczką Brzozy w Osadzie — coś wykopano przy starej świątyni i chce wiedzieć co.',
        'Najpierw zdobądź lampę Kinlight od Wick (zobacz "Zaginiony Zwiadowca") — bez niej brama czarnej wody głębiej w Głębokim Bagnisku odeśle cię z powrotem.',
        'Przejdź przez bramę i dotrz do komnaty z dowodami, by znaleźć uszkodzony aparat wysysający Syndykatu.',
        'Idź dalej do Nory Strażnika Bagna i pokonaj Strażnika Bagna, by zakończyć zadanie.',
      ],
    },
  },
  {
    id: 'ashvault_tamsinRescue',
    key: 'T5',
    nameEn: 'Free Tamsin',
    world: 'ashvaultStation',
    giver: 'Dock Hand',
    reward: { en: '+1 medkit', pl: '+1 apteczka' },
    solution: {
      en: [
        'Talk to the dock hand in the Habitation Ring — Tamsin is being held in the Engine Core.',
        'Head into the Engine Core and push past the first narrow neck to the junction room; step on the release switch there to free her.',
        'Return to the dock hand and talk to him again to complete the quest and receive a medkit.',
      ],
      pl: [
        'Porozmawiaj z dokerem w Pierścieniu Mieszkalnym — Tamsin jest przetrzymywana w Jądrze Silnika.',
        'Wejdź do Jądra Silnika i przejdź przez pierwsze wąskie gardło do komnaty węzłowej; stań na przełączniku zwalniającym, by ją uwolnić.',
        'Wróć do dokera i porozmawiaj z nim jeszcze raz, by zakończyć zadanie i otrzymać apteczkę.',
      ],
    },
  },
  {
    id: 'ashvault_extractorSabotage',
    key: 'T6',
    nameEn: 'The Current Extractor',
    world: 'ashvaultStation',
    giver: 'Technician',
    reward: { en: 'Unlocks Skyreach Canopy', pl: 'Odblokowuje Skyreach Canopy' },
    solution: {
      en: [
        'Talk to the technician in the Habitation Ring — he wants confirmation of what the Extractor device is for.',
        "Push on through the Engine Core to the schematics console and read it — it confirms the device is keyed to Gogu's signature, and unlocks the sealed blast door further in.",
        'Continue to the Extractor Vault and defeat the Syndicate Foreman to complete the quest.',
      ],
      pl: [
        'Porozmawiaj z technikiem w Pierścieniu Mieszkalnym — chce potwierdzenia, do czego służy Ekstraktor.',
        'Przejdź przez Jądro Silnika do konsoli ze schematami i odczytaj ją — potwierdza, że urządzenie jest dostrojone do sygnatury Gogu, i odblokowuje zablokowane drzwi pancerne głębiej.',
        'Idź dalej do Komory Ekstraktora i pokonaj Brygadzistę Syndykatu, by zakończyć zadanie.',
      ],
    },
  },
  {
    id: 'skyreach_hollowWatch',
    key: 'T7',
    nameEn: 'Shroud the Current-Well',
    world: 'skyreachCanopy',
    giver: 'Senna',
    reward: { en: 'Triggers the Enforcer Vane boss fight', pl: 'Wywołuje walkę z bossem Egzekutorką Vane' },
    solution: {
      en: [
        'Talk to Senna in the Skykin Refuge — the Current-well in the High Reaches is broadcasting straight to the Syndicate.',
        'Make your way up into the High Reaches (the Windward Charm from Tamsin opens the vine-lock gate blocking the way — see "Find Wren in the High Reaches") and reach the Current-well beacon to still it.',
        "Return to Senna to complete the quest — this is also what brings Enforcer Vane down on the refuge for the chapter's boss fight.",
      ],
      pl: [
        'Porozmawiaj z Senną w Schronieniu Skykin — Studnia Nurtu w Wysokich Ostępach nadaje sygnał prosto do Syndykatu.',
        'Wejdź do Wysokich Ostępów (Amulet Wiatru od Tamsin otwiera bramę z lian blokującą drogę — zobacz "Znajdź Wren w Wysokich Ostępach") i dotrz do latarni Studni Nurtu, by ją uciszyć.',
        'Wróć do Senny, by zakończyć zadanie — to właśnie ściąga Egzekutorkę Vane na schronienie, co prowadzi do walki z bossem tego rozdziału.',
      ],
    },
  },
  {
    id: 'skyreach_roostRescue',
    key: 'T8',
    nameEn: 'Find Wren in the High Reaches',
    world: 'skyreachCanopy',
    giver: 'Orin',
    reward: { en: "Gogu's max Focus +1", pl: 'Maksymalne Skupienie Gogu +1' },
    solution: {
      en: [
        'Talk to Orin in the Skykin Refuge — Wren never came back from scouting the roost towers.',
        'Talk to Tamsin in the Refuge to receive the Windward Charm, which opens the vine-lock gate in the High Reaches.',
        "Cross the gate and find Wren near the roost — talking to them rescues Wren and permanently raises Gogu's max Focus by 1.",
        'Return to Orin to complete the quest.',
      ],
      pl: [
        'Porozmawiaj z Orinem w Schronieniu Skykin — Wren nie wróciła ze zwiadu przy wieżach gniazd.',
        'Porozmawiaj z Tamsin w Schronieniu, by otrzymać Amulet Wiatru, który otwiera bramę z lian w Wysokich Ostępach.',
        'Przejdź przez bramę i znajdź Wren niedaleko gniazda — rozmowa z nią ratuje Wren i trwale zwiększa maksymalne Skupienie Gogu o 1.',
        'Wróć do Orina, by zakończyć zadanie.',
      ],
    },
  },
  {
    id: 'hollow_finaleQuestId',
    key: 'T9',
    nameEn: 'Break the Hollow',
    world: 'theHollow',
    giver: '—',
    reward: { en: 'Completes the game', pl: 'Kończy grę' },
    solution: {
      en: [
        'Walking away from your landing point in the Outer Hollow starts the quest automatically.',
        'Shut down the shield relay in the Outer Hollow (Vex and the lookout both point you toward it) to silence the alarms.',
        'Push into the Inner Sanctum and free Rell through the single doorway into her cell.',
        "Advance through the Warden's Chamber corridor and defeat the Syndicate Warden at the chokepoint to finish the game.",
      ],
      pl: [
        'Zadanie zaczyna się automatycznie, gdy odejdziesz od miejsca lądowania w Zewnętrznej Czeluści.',
        'Wyłącz przekaźnik osłony w Zewnętrznej Czeluści (Vex i wartownik obaj wskazują na niego), by uciszyć alarmy.',
        'Wejdź do Wewnętrznego Sanktuarium i uwolnij Rell przez jedyne wejście do jej celi.',
        'Idź dalej przez korytarz Komnaty Strażnika i pokonaj Strażnika Syndykatu w wąskim przejściu, by zakończyć grę.',
      ],
    },
  },
]

const quests = QUESTS.map((q) => ({
  id: q.id,
  key: q.key,
  name: bilingual(q.nameEn),
  world: q.world,
  giver: q.giver,
  reward: q.reward,
  solution: q.solution,
}))

const data = { moves, enemies, items, party, worlds, quests }

writeFileSync(OUT_FILE, JSON.stringify(data, null, 2))
console.log(`Wrote ${OUT_FILE}`)
console.log(`moves=${moves.length} enemies=${enemies.length} worlds=${worlds.length}`)
