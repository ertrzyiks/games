import data from './data/wiki-data.json'

const STORAGE_KEY = 'starforged-wiki-lang'

const STRINGS = {
  en: {
    title: 'Starforged Wiki',
    subtitle: 'Attacks, opponents, items, and the five worlds of the Drift — straight from the game data.',
    langToggle: 'Polski',
    backToGame: '← Back to the game',
    tabs: { attacks: 'Attacks', opponents: 'Opponents', items: 'Items', worlds: 'Worlds & Quests' },
    attacksIntro:
      'Every move used by the party or an enemy, with its real battle stats. Pistol Shot is the one exception ' +
      'to the Damage Type system below: it always deals neutral damage, never super-effective but never ' +
      "resisted either — Rifle Shot is the one that can actually exploit an enemy's kinetic weakness.",
    col: {
      name: 'Name',
      kind: 'Kind',
      power: 'Power',
      focusCost: 'Focus Cost',
      accuracy: 'Accuracy',
      effect: 'Effect',
      source: 'Source',
      hp: 'HP',
      atk: 'ATK',
      def: 'DEF',
      spd: 'SPD',
      xp: 'XP Reward',
      moves: 'Moves',
      world: 'World',
      description: 'Description',
      damageType: 'Damage Type',
      weakness: 'Weakness',
      resistance: 'Resistance',
    },
    kind: { attack: 'Attack', heal: 'Heal', buff: 'Buff', debuff: 'Debuff' },
    core: 'Core / Party',
    boss: 'Boss',
    opponentsIntro:
      'Every enemy in the game, grouped by the world they appear in. Regular enemies have one Weakness ' +
      '(1.5x damage from a matching attack); bosses instead Resist one or more damage types (0.6x damage) ' +
      'and are never weak to anything — Force Push is the one attack type no boss resists.',
    itemsIntro:
      'Consumables found and used throughout the Drift. Wando and Gogu share one wallet of Credits — they ' +
      'start a new game with {credits} and earn more from most quests — spent at the one merchant NPC on ' +
      'each world (marked ★ on the Worlds & Quests tab).',
    worldsIntro: 'The five worlds of the Drift, in the order you visit them, with their maps and quests.',
    maps: 'Maps',
    npcs: 'NPCs',
    merchant: 'merchant',
    enemiesHere: 'Enemies here',
    quests: 'Quests',
    giver: 'Quest giver',
    reward: 'Reward',
    walkthrough: 'Walkthrough',
    none: 'none',
    price: 'Price',
    creditsShort: 'cr',
    howToDefeat: 'How to Defeat',
    backToOpponents: '← Back to Opponents',
    weakHintTitle: 'Weak Point',
    weakHintBody: (type) => `This enemy takes 1.5x damage from ${type} attacks.`,
    resistHintTitle: 'Resistances',
    resistHintBody: (types) => `This enemy only takes 0.6x damage from ${types} attacks — try something else.`,
    suggestedMoves: 'Suggested moves',
    noHints: 'No known weakness or resistance.',
  },
  pl: {
    title: 'Wiki Starforged',
    subtitle: 'Ataki, przeciwnicy, przedmioty i pięć światów Dryfu — prosto z danych gry.',
    langToggle: 'English',
    backToGame: '← Wróć do gry',
    tabs: { attacks: 'Ataki', opponents: 'Przeciwnicy', items: 'Przedmioty', worlds: 'Światy i Zadania' },
    attacksIntro:
      'Każdy atak używany przez drużynę lub wrogów, z prawdziwymi statystykami z gry. Strzał z Pistoletu to ' +
      'jedyny wyjątek od systemu Typów Obrażeń poniżej: zawsze zadaje neutralne obrażenia, nigdy nie jest ' +
      'szczególnie skuteczny, ale też nigdy nie jest odparty — to Strzał z Karabinu potrafi realnie wykorzystać ' +
      'kinetyczną słabość przeciwnika.',
    col: {
      name: 'Nazwa',
      kind: 'Typ',
      power: 'Siła',
      focusCost: 'Koszt Skupienia',
      accuracy: 'Celność',
      effect: 'Efekt',
      source: 'Źródło',
      hp: 'PŻ',
      atk: 'ATK',
      def: 'OBR',
      spd: 'SZB',
      xp: 'Nagroda PD',
      moves: 'Ataki',
      world: 'Świat',
      description: 'Opis',
      damageType: 'Typ Obrażeń',
      weakness: 'Słabość',
      resistance: 'Odporność',
    },
    kind: { attack: 'Atak', heal: 'Leczenie', buff: 'Wzmocnienie', debuff: 'Osłabienie' },
    core: 'Podstawowe / Drużyna',
    boss: 'Boss',
    opponentsIntro:
      'Każdy wróg w grze, pogrupowany według świata, w którym się pojawia. Zwykli wrogowie mają jedną Słabość ' +
      '(1.5x obrażeń od pasującego ataku); bossowie mają za to Odporność na jeden lub więcej typów obrażeń ' +
      '(0.6x obrażeń) i nigdy nie są słabi na żaden atak — Pchnięcie Mocą jest jedynym typem ataku, na który ' +
      'żaden boss nie jest odporny.',
    itemsIntro:
      'Przedmioty jednorazowe spotykane i używane w całym Dryfie. Wando i Gogu dzielą jeden portfel kredytów — ' +
      'na początku nowej gry mają {credits} i zdobywają więcej za większość zadań — wydawanych u jedynego ' +
      'kupca na każdym świecie (oznaczonego ★ w zakładce Światy i Zadania).',
    worldsIntro: 'Pięć światów Dryfu, w kolejności odwiedzania, z ich mapami i zadaniami.',
    maps: 'Mapy',
    npcs: 'NPC',
    merchant: 'kupiec',
    enemiesHere: 'Wrogowie tutaj',
    quests: 'Zadania',
    giver: 'Zleceniodawca',
    reward: 'Nagroda',
    walkthrough: 'Przewodnik',
    none: 'brak',
    price: 'Cena',
    creditsShort: 'kr',
    howToDefeat: 'Jak Pokonać',
    backToOpponents: '← Wróć do Przeciwników',
    weakHintTitle: 'Słaby Punkt',
    weakHintBody: (type) => `Ten wróg otrzymuje 1.5x obrażeń od ataków typu: ${type}.`,
    resistHintTitle: 'Odporności',
    resistHintBody: (types) => `Ten wróg otrzymuje tylko 0.6x obrażeń od ataków typu: ${types} — spróbuj czegoś innego.`,
    suggestedMoves: 'Sugerowane ataki',
    noHints: 'Brak znanej słabości lub odporności.',
  },
}

const WORLD_LABELS = {
  core: { en: 'Core / Party', pl: 'Podstawowe / Drużyna' },
}

const DAMAGE_TYPE_LABELS = {
  kinetic: { en: 'Kinetic', pl: 'Kinetyczny' },
  fire: { en: 'Fire', pl: 'Ognisty' },
  force: { en: 'Force', pl: 'Mocy' },
}

const DAMAGE_TYPES_ORDER = ['kinetic', 'fire', 'force']

function damageTypeLabel(type, lang) {
  if (!type) return '—'
  return DAMAGE_TYPE_LABELS[type]?.[lang] || type
}

function readLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'en'
  } catch {
    return 'en'
  }
}

function writeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore - private mode etc, language just won't persist
  }
}

// A URL like #enemy/scavenger is its own page (an opponent's detail view)
// rather than one of the four main tabs - readRoute() resolves either
// shape to { tab, enemyId }, with the Opponents tab staying the "current"
// tab underneath an open enemy detail page (so its nav button still shows
// as active, and navigating straight back to #opponents just closes it).
function readRoute() {
  const hash = location.hash.replace('#', '')
  if (hash.startsWith('enemy/')) {
    const id = decodeURIComponent(hash.slice('enemy/'.length))
    if (data.enemies.some((e) => e.id === id)) return { tab: 'opponents', enemyId: id }
  }
  return { tab: ['attacks', 'opponents', 'items', 'worlds'].includes(hash) ? hash : 'attacks', enemyId: null }
}

const state = {
  lang: readLang(),
  ...readRoute(),
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function worldLabel(worldId, lang) {
  if (WORLD_LABELS[worldId]) return WORLD_LABELS[worldId][lang]
  const world = data.worlds.find((w) => w.id === worldId)
  return world ? world.name[lang] : worldId
}

function moveEffectText(move, s) {
  const parts = []
  if (move.status) parts.push(`${move.status.type} (${move.status.duration}x, ${move.status.power})`)
  if (move.lifesteal) parts.push(s.lang === 'pl' ? 'wysysanie życia' : 'lifesteal')
  if (move.focusRestore) parts.push((s.lang === 'pl' ? '+Skupienie ' : '+Focus ') + move.focusRestore)
  if (move.healAll) parts.push(s.lang === 'pl' ? 'leczy całą drużynę' : 'heals whole party')
  if (move.upgradesFrom) {
    const base = data.moves.find((m) => m.id === move.upgradesFrom)
    const baseName = base ? base.name[s.lang] : move.upgradesFrom
    parts.push(s.lang === 'pl' ? `ulepszenie: ${baseName}` : `upgrades ${baseName}`)
  }
  return parts.length ? parts.join(', ') : '—'
}

function renderAttacks(s) {
  const rows = data.moves
    .map((m) => {
      const name = m.name[s.lang]
      return `
      <tr>
        <td data-label="${s.col.name}"><strong>${esc(name)}</strong></td>
        <td data-label="${s.col.kind}">${esc(s.kind[m.kind] || m.kind)}</td>
        <td data-label="${s.col.damageType}">${esc(damageTypeLabel(m.damageType, s.lang))}</td>
        <td data-label="${s.col.power}">${m.power}</td>
        <td data-label="${s.col.focusCost}">${m.focusCost}</td>
        <td data-label="${s.col.accuracy}">${Math.round(m.accuracy * 100)}%</td>
        <td data-label="${s.col.effect}">${esc(moveEffectText(m, s))}</td>
        <td data-label="${s.col.source}"><span class="tag">${esc(worldLabel(m.world, s.lang))}</span></td>
      </tr>`
    })
    .join('')

  return `
    <section class="panel">
      <h2>${s.tabs.attacks}</h2>
      <p>${s.attacksIntro}</p>
      <table>
        <thead>
          <tr>
            <th>${s.col.name}</th><th>${s.col.kind}</th><th>${s.col.damageType}</th><th>${s.col.power}</th>
            <th>${s.col.focusCost}</th><th>${s.col.accuracy}</th><th>${s.col.effect}</th><th>${s.col.source}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`
}

function renderOpponents(s) {
  const rows = data.enemies
    .map((e) => {
      const moveNames = e.moves
        .map((id) => {
          const move = data.moves.find((m) => m.id === id)
          return move ? move.name[s.lang] : id
        })
        .join(', ')
      const weaknessText = e.weakTo ? damageTypeLabel(e.weakTo, s.lang) : '—'
      const resistanceText = e.resistantTo && e.resistantTo.length
        ? e.resistantTo.map((t) => damageTypeLabel(t, s.lang)).join(', ')
        : '—'
      return `
      <tr class="${e.isBoss ? 'boss' : ''}">
        <td data-label="${s.col.name}"><a href="#enemy/${encodeURIComponent(e.id)}"><strong>${esc(e.name[s.lang])}</strong></a>${e.isBoss ? ` <span class="tag">${s.boss}</span>` : ''}</td>
        <td data-label="${s.col.world}"><span class="tag">${esc(worldLabel(e.world, s.lang))}</span></td>
        <td data-label="${s.col.hp}">${e.maxHp}</td>
        <td data-label="${s.col.atk}">${e.atk}</td>
        <td data-label="${s.col.def}">${e.def}</td>
        <td data-label="${s.col.spd}">${e.spd}</td>
        <td data-label="${s.col.xp}">${e.xpReward}</td>
        <td data-label="${s.col.weakness}">${esc(weaknessText)}</td>
        <td data-label="${s.col.resistance}">${esc(resistanceText)}</td>
        <td data-label="${s.col.moves}">${esc(moveNames)}</td>
      </tr>`
    })
    .join('')

  return `
    <section class="panel">
      <h2>${s.tabs.opponents}</h2>
      <p>${s.opponentsIntro}</p>
      <table>
        <thead>
          <tr>
            <th>${s.col.name}</th><th>${s.col.world}</th><th>${s.col.hp}</th><th>${s.col.atk}</th>
            <th>${s.col.def}</th><th>${s.col.spd}</th><th>${s.col.xp}</th>
            <th>${s.col.weakness}</th><th>${s.col.resistance}</th><th>${s.col.moves}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`
}

// One page per opponent (#enemy/<id>, linked from the Opponents table's
// name column) with concrete "how to defeat" hints: not just the raw
// weakTo/resistantTo damage type, but which of the party's own moves
// (data.partyMovesByDamageType) actually exploit or avoid it.
function renderEnemyDetail(s, enemyId) {
  const e = data.enemies.find((en) => en.id === enemyId)
  if (!e) return renderOpponents(s)

  const moveItems = e.moves
    .map((id) => {
      const m = data.moves.find((mm) => mm.id === id)
      if (!m) return `<li>${esc(id)}</li>`
      const typeTag = m.damageType ? ` <span class="tag">${esc(damageTypeLabel(m.damageType, s.lang))}</span>` : ''
      return `<li>${esc(m.name[s.lang])}${typeTag}</li>`
    })
    .join('')

  let hints = ''
  if (e.weakTo) {
    const weakMoves = data.partyMovesByDamageType[e.weakTo] || []
    hints += `
      <div class="hint hint-weak">
        <p><strong>${esc(s.weakHintTitle)}</strong></p>
        <p>${esc(s.weakHintBody(damageTypeLabel(e.weakTo, s.lang)))}</p>
        ${weakMoves.length ? `<p>${esc(s.suggestedMoves)}: ${weakMoves.map((m) => esc(m.name[s.lang])).join(', ')}</p>` : ''}
      </div>`
  }
  if (e.resistantTo && e.resistantTo.length) {
    const resistLabels = e.resistantTo.map((t) => damageTypeLabel(t, s.lang)).join(', ')
    const betterMoves = DAMAGE_TYPES_ORDER.filter((t) => !e.resistantTo.includes(t)).flatMap(
      (t) => data.partyMovesByDamageType[t] || []
    )
    hints += `
      <div class="hint hint-resist">
        <p><strong>${esc(s.resistHintTitle)}</strong></p>
        <p>${esc(s.resistHintBody(resistLabels))}</p>
        ${betterMoves.length ? `<p>${esc(s.suggestedMoves)}: ${betterMoves.map((m) => esc(m.name[s.lang])).join(', ')}</p>` : ''}
      </div>`
  }
  if (!hints) hints = `<p>${esc(s.noHints)}</p>`

  return `
    <section class="panel">
      <p><a href="#opponents">${esc(s.backToOpponents)}</a></p>
      <h2>${esc(e.name[s.lang])}${e.isBoss ? ` <span class="tag">${s.boss}</span>` : ''}</h2>
      <p><span class="tag">${esc(worldLabel(e.world, s.lang))}</span></p>
      <table>
        <tbody>
          <tr><th>${s.col.hp}</th><td>${e.maxHp}</td></tr>
          <tr><th>${s.col.atk}</th><td>${e.atk}</td></tr>
          <tr><th>${s.col.def}</th><td>${e.def}</td></tr>
          <tr><th>${s.col.spd}</th><td>${e.spd}</td></tr>
          <tr><th>${s.col.xp}</th><td>${e.xpReward}</td></tr>
        </tbody>
      </table>
      <h3>${s.col.moves}</h3>
      <ul>${moveItems}</ul>
      <h3>${esc(s.howToDefeat)}</h3>
      ${hints}
    </section>`
}

function renderItems(s) {
  const rows = data.items
    .map(
      (item) => `
      <tr>
        <td data-label="${s.col.name}"><strong>${esc(item.name[s.lang])}</strong></td>
        <td data-label="${s.price}">${item.price}${esc(s.creditsShort)}</td>
        <td data-label="${s.col.description}">${esc(item.description[s.lang])}</td>
      </tr>`
    )
    .join('')

  const intro = s.itemsIntro.replace('{credits}', `${data.startingCredits}${s.creditsShort}`)

  return `
    <section class="panel">
      <h2>${s.tabs.items}</h2>
      <p>${intro}</p>
      <table>
        <thead><tr><th>${s.col.name}</th><th>${s.price}</th><th>${s.col.description}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`
}

function renderWorlds(s) {
  const blocks = data.worlds
    .map((world) => {
      const maps = world.maps
        .map((map) => {
          const npcList = map.npcs.length
            ? map.npcs.map((npc) => esc(npc.id) + (npc.isMerchant ? ` ★ (${esc(s.merchant)})` : '')).join(', ')
            : esc(s.none)
          const enemyList = map.enemySpawns.length
            ? map.enemySpawns
                .map((id) => {
                  const e = data.enemies.find((en) => en.id === id)
                  return e ? e.name[s.lang] : id
                })
                .join(', ')
            : s.none
          return `
          <div class="map-card">
            <h4>${esc(map.name[s.lang])}</h4>
            <p><strong>${s.npcs}:</strong> ${npcList}</p>
            <p><strong>${s.enemiesHere}:</strong> ${esc(enemyList)}</p>
          </div>`
        })
        .join('')

      const quests = data.quests
        .filter((q) => q.world === world.id)
        .map((q) => {
          const steps = q.solution[s.lang].map((step) => `<li>${esc(step)}</li>`).join('')
          return `
          <div class="quest-card">
            <h4>${esc(q.key)} · ${esc(q.name[s.lang])}</h4>
            <p class="quest-meta">${s.giver}: ${esc(q.giver)} · ${s.reward}: ${esc(q.reward[s.lang])}</p>
            <p><strong>${s.walkthrough}:</strong></p>
            <ol>${steps}</ol>
          </div>`
        })
        .join('')

      return `
      <div class="world-block">
        <h3>${esc(world.name[s.lang])}</h3>
        <h4>${s.maps}</h4>
        <div class="map-list">${maps}</div>
        <h4>${s.quests}</h4>
        ${quests || `<p>${s.none}</p>`}
      </div>`
    })
    .join('')

  return `
    <section class="panel">
      <h2>${s.tabs.worlds}</h2>
      <p>${s.worldsIntro}</p>
      ${blocks}
    </section>`
}

function render() {
  const strings = STRINGS[state.lang]
  const s = { ...strings, lang: state.lang }

  const tabButtons = Object.entries(s.tabs)
    .map(([id, label]) => `<button data-tab="${id}" aria-current="${state.tab === id}">${esc(label)}</button>`)
    .join('')

  let body = ''
  if (state.tab === 'opponents' && state.enemyId) body = renderEnemyDetail(s, state.enemyId)
  else if (state.tab === 'attacks') body = renderAttacks(s)
  else if (state.tab === 'opponents') body = renderOpponents(s)
  else if (state.tab === 'items') body = renderItems(s)
  else body = renderWorlds(s)

  document.getElementById('app').innerHTML = `
    <header class="page-header">
      <div>
        <h1 class="site-title">${esc(s.title)}</h1>
        <p class="site-subtitle">${esc(s.subtitle)}</p>
      </div>
      <div class="header-actions">
        <a class="btn" href="/games/starforged/">${esc(s.backToGame)}</a>
        <button id="lang-toggle">${esc(s.langToggle)}</button>
      </div>
    </header>
    <nav class="tabs">${tabButtons}</nav>
    ${body}
    <footer class="site-footer">Starforged Wiki — generated from the game's own data files.</footer>
  `

  document.getElementById('lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'pl' : 'en'
    writeLang(state.lang)
    render()
  })

  for (const btn of document.querySelectorAll('nav.tabs button')) {
    btn.addEventListener('click', () => {
      state.tab = btn.dataset.tab
      state.enemyId = null
      location.hash = state.tab
      render()
    })
  }
}

window.addEventListener('hashchange', () => {
  Object.assign(state, readRoute())
  render()
})

render()
