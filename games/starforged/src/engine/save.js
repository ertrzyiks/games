import { normalizePartyMember } from '../data/gameState.js'

const SAVE_KEY = 'starforged-save-v1'

export function saveGame(state) {
  try {
    const serializable = {
      ...state,
      flags: Array.from(state.flags),
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializable))
    return true
  } catch (err) {
    console.warn('Failed to save game', err)
    return false
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const state = { ...parsed, flags: new Set(parsed.flags || []) }
    // Older saves predate the known-vs-equipped moves split - backfill
    // knownMoves from the equipped list so they keep working unchanged.
    for (const member of Object.values(state.party || {})) normalizePartyMember(member)
    return state
  } catch (err) {
    console.warn('Failed to load game', err)
    return null
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY)
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}
