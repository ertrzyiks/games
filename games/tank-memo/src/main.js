const app = document.getElementById('app')

if (!app) throw new Error('Missing #app element')

const DIFFICULTIES = {
  easy: 8,
  normal: 12,
  hard: 16,
}

const TANKS = [
  { id: 'tiger', label: 'Tiger', hull: 34, turret: 44, barrel: 86, wheel: 16 },
  { id: 'panther', label: 'Panther', hull: 32, turret: 46, barrel: 92, wheel: 14 },
  { id: 'sherman', label: 'Sherman', hull: 31, turret: 42, barrel: 83, wheel: 15 },
  { id: 'churchill', label: 'Churchill', hull: 36, turret: 40, barrel: 78, wheel: 12 },
  { id: 'panzer3', label: 'Panzer III', hull: 30, turret: 48, barrel: 89, wheel: 17 },
  { id: 'panzer4', label: 'Panzer IV', hull: 31, turret: 50, barrel: 91, wheel: 15 },
  { id: 'matilda', label: 'Matilda', hull: 37, turret: 41, barrel: 73, wheel: 10 },
  { id: 'king-tiger', label: 'King Tiger', hull: 35, turret: 45, barrel: 95, wheel: 14 },
  { id: 't34', label: 'T-34', hull: 29, turret: 43, barrel: 87, wheel: 18 },
  { id: 'kv1', label: 'KV-1', hull: 36, turret: 39, barrel: 80, wheel: 12 },
  { id: 't10', label: 'T-10', hull: 30, turret: 45, barrel: 97, wheel: 17 },
  { id: 'leopard', label: 'Leopard', hull: 28, turret: 49, barrel: 98, wheel: 19 },
]

const state = {
  screen: 'home',
  difficulty: null,
  cards: [],
  selected: [],
  matched: new Set(),
  lockBoard: false,
  elapsedMs: 0,
  startTimestamp: null,
  timerInterval: null,
  hideTimeout: null,
  finalTimeMs: 0,
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function formatTime(ms) {
  return (ms / 1000).toFixed(2).replace(/\.?0+$/, '')
}

function tankSvg(tank) {
  return `
    <svg class="tank" viewBox="0 0 100 60" role="img" aria-label="${tank.label}">
      <rect x="6" y="${tank.hull}" width="88" height="12" rx="4" fill="#c3d087" />
      <rect x="20" y="${tank.turret}" width="30" height="10" rx="3" fill="#d8e5a5" />
      <rect x="46" y="${tank.turret + 3}" width="${tank.barrel - 46}" height="3" rx="1.5" fill="#e9efc6" />
      <circle cx="20" cy="${tank.wheel + 28}" r="4" fill="#27311f" />
      <circle cx="35" cy="${tank.wheel + 28}" r="4" fill="#27311f" />
      <circle cx="50" cy="${tank.wheel + 28}" r="4" fill="#27311f" />
      <circle cx="65" cy="${tank.wheel + 28}" r="4" fill="#27311f" />
      <circle cx="80" cy="${tank.wheel + 28}" r="4" fill="#27311f" />
    </svg>
  `
}

function clearPending() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval)
    state.timerInterval = null
  }
  if (state.hideTimeout) {
    clearTimeout(state.hideTimeout)
    state.hideTimeout = null
  }
}

function startGame(difficulty) {
  clearPending()

  state.screen = 'board'
  state.difficulty = difficulty
  state.selected = []
  state.matched = new Set()
  state.lockBoard = false
  state.elapsedMs = 0
  state.finalTimeMs = 0

  const cardCount = DIFFICULTIES[difficulty]
  const pairCount = cardCount / 2
  const selectedTanks = shuffle(TANKS).slice(0, pairCount)
  state.cards = shuffle(
    selectedTanks.flatMap((tank) => [
      { key: `${tank.id}-a`, tankId: tank.id, tank },
      { key: `${tank.id}-b`, tankId: tank.id, tank },
    ])
  )

  state.startTimestamp = performance.now()
  state.timerInterval = setInterval(() => {
    state.elapsedMs = performance.now() - state.startTimestamp
    render()
  }, 100)

  render()
}

function endGame() {
  clearPending()
  state.finalTimeMs = state.elapsedMs
  state.screen = 'result'
  render()
}

function onCardClick(index) {
  if (state.lockBoard || state.matched.has(index)) return

  if (state.selected.includes(index)) {
    return
  }

  state.selected = [...state.selected, index]

  if (state.selected.length < 2) {
    render()
    return
  }

  const [first, second] = state.selected
  const firstCard = state.cards[first]
  const secondCard = state.cards[second]

  if (firstCard.tankId === secondCard.tankId) {
    state.matched.add(first)
    state.matched.add(second)
    state.selected = []

    if (state.matched.size === state.cards.length) {
      state.elapsedMs = performance.now() - state.startTimestamp
      endGame()
      return
    }

    render()
    return
  }

  state.lockBoard = true
  render()
  state.hideTimeout = setTimeout(() => {
    state.selected = []
    state.lockBoard = false
    state.hideTimeout = null
    render()
  }, 3000)
}

function resetToHome() {
  clearPending()
  state.screen = 'home'
  state.difficulty = null
  state.cards = []
  state.selected = []
  state.matched = new Set()
  state.lockBoard = false
  state.elapsedMs = 0
  state.startTimestamp = null
  render()
}

function renderHome() {
  return `
    <section class="screen">
      <h1>Tank Memo</h1>
      <p>Find all matching tank pairs as quickly as possible.</p>
      <h2>Choose difficulty</h2>
      <div class="difficulty-buttons">
        <button type="button" data-action="start" data-difficulty="easy">Easy (8 cards)</button>
        <button type="button" data-action="start" data-difficulty="normal">Normal (12 cards)</button>
        <button type="button" data-action="start" data-difficulty="hard">Hard (16 cards)</button>
      </div>
      <p style="margin-top:1rem"><a href="/games/">← Back to portal</a></p>
    </section>
  `
}

function cardContent(card, isVisible) {
  if (!isVisible) {
    return '<span>?</span>'
  }

  return `${tankSvg(card.tank)}<div class="tank-label">${card.tank.label}</div>`
}

function renderBoard() {
  return `
    <section class="screen">
      <div class="meta">
        <h1>Tank Memo</h1>
        <strong>Time: ${formatTime(state.elapsedMs)}s</strong>
      </div>
      <div class="board" role="grid" aria-label="Tank memory board">
        ${state.cards
          .map((card, index) => {
            const isRevealed = state.selected.includes(index)
            const isMatched = state.matched.has(index)
            const className = `card${isRevealed ? ' revealed' : ''}${isMatched ? ' matched' : ''}`

            return `<button type="button" class="${className}" data-action="card" data-index="${index}">${cardContent(card, isRevealed || isMatched)}</button>`
          })
          .join('')}
      </div>
    </section>
  `
}

function renderResult() {
  return `
    <section class="screen">
      <h1>Mission Complete</h1>
      <p>Final time: <strong>${formatTime(state.finalTimeMs)}s</strong></p>
      <div class="result-actions">
        <button type="button" data-action="retry">Retry</button>
      </div>
    </section>
  `
}

function render() {
  if (state.screen === 'home') {
    app.innerHTML = renderHome()
  } else if (state.screen === 'board') {
    app.innerHTML = renderBoard()
  } else {
    app.innerHTML = renderResult()
  }
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]')
  if (!target) return

  const action = target.dataset.action

  if (action === 'start' && target.dataset.difficulty in DIFFICULTIES) {
    startGame(target.dataset.difficulty)
    return
  }

  if (action === 'card' && target.dataset.index) {
    onCardClick(Number(target.dataset.index))
    return
  }

  if (action === 'retry') {
    resetToHome()
  }
})

render()
