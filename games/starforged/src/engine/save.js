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
    return { ...parsed, flags: new Set(parsed.flags || []) }
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
