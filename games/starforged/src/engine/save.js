import { normalizePartyMember } from '../data/gameState.js'

const SAVE_KEY = 'starforged-save-v1'
// A second slot holding a snapshot taken right after each world arrival (see
// saveCheckpoint's call site in shipScene.js's travel flow), so a full party
// wipe can offer "retry from the start of this world" instead of only "clear
// everything and start a brand new game".
const CHECKPOINT_KEY = 'starforged-checkpoint-v1'

function serialize(state) {
  return JSON.stringify({ ...state, flags: Array.from(state.flags) })
}

function deserialize(raw) {
  const parsed = JSON.parse(raw)
  const state = { ...parsed, flags: new Set(parsed.flags || []) }
  // Older saves predate the known-vs-equipped moves split - backfill
  // knownMoves from the equipped list so they keep working unchanged.
  for (const member of Object.values(state.party || {})) normalizePartyMember(member)
  // Older saves predate the shared credits wallet - give them a starting
  // balance too rather than locking existing players out of every merchant.
  if (state.credits == null) state.credits = 30
  return state
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state))
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
    return deserialize(raw)
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

export function saveCheckpoint(state) {
  try {
    localStorage.setItem(CHECKPOINT_KEY, serialize(state))
    return true
  } catch (err) {
    console.warn('Failed to save checkpoint', err)
    return false
  }
}

export function loadCheckpoint() {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY)
    if (!raw) return null
    return deserialize(raw)
  } catch (err) {
    console.warn('Failed to load checkpoint', err)
    return null
  }
}

export function hasCheckpoint() {
  return !!localStorage.getItem(CHECKPOINT_KEY)
}

export function clearCheckpoint() {
  localStorage.removeItem(CHECKPOINT_KEY)
}
