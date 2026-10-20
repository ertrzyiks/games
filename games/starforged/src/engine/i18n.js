/**
 * Minimal i18n layer. Two lookup styles:
 *  - t(text): exact-string translation lookup, used for static UI labels
 *    and (via dialogue.js) for every NPC/battle dialogue line — world
 *    content files never call this directly, so they needed zero changes.
 *  - tf(template, vars): template lookup + {placeholder} substitution, for
 *    the handful of dynamically-built battle log lines (damage numbers,
 *    names) that can't be exact-string-matched.
 *
 * Translations are appended per-language via registerTranslations(lang,
 * dict), same append-only-registry pattern as tiles/sprites/enemies, so
 * each world's translation file can be added independently.
 */

const STORAGE_KEY = 'starforged-lang'
const dictionaries = { en: new Map() } // en has no dictionary entries - t() falls through to the source text

let currentLang = 'en'
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) currentLang = saved
} catch {
  // localStorage unavailable (private mode etc.) - default to 'en'
}

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
]

export function getLanguage() {
  return currentLang
}

const listeners = new Set()

export function onLanguageChange(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function setLanguage(lang) {
  currentLang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore - language just won't persist across reloads
  }
  for (const cb of listeners) cb(lang)
}

export function cycleLanguage() {
  const idx = LANGUAGES.findIndex((l) => l.code === currentLang)
  const next = LANGUAGES[(idx + 1) % LANGUAGES.length]
  setLanguage(next.code)
  return next.code
}

export function registerTranslations(lang, dict) {
  if (!dictionaries[lang]) dictionaries[lang] = new Map()
  const map = dictionaries[lang]
  for (const [source, translated] of Object.entries(dict)) {
    map.set(source, translated)
  }
}

/** Exact-string lookup. Falls back to the original text if untranslated. */
export function t(text) {
  if (currentLang === 'en') return text
  const map = dictionaries[currentLang]
  if (!map) return text
  return map.get(text) ?? text
}

/**
 * Template lookup: looks up `template` (containing {placeholders}) the
 * same way as t(), then substitutes `vars` into whichever version (source
 * or translated) was found.
 */
export function tf(template, vars) {
  const resolved = t(template)
  return resolved.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}
