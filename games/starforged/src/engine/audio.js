/**
 * Minimal procedural SFX via the Web Audio API — no audio files.
 *
 * The shared AudioContext is created lazily on first use (never at module
 * load), because constructing one before a user gesture can throw or warn
 * in some browsers. Every call is wrapped in try/catch so audio is always
 * best-effort: if it's unavailable or blocked, the game keeps working
 * silently instead of breaking.
 */
let ctx = null

function getContext() {
  try {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return null
      ctx = new AudioCtx()
    }
    if (ctx.state === 'suspended') {
      // Best-effort resume; ignore rejection (e.g. still no user gesture yet).
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch (err) {
    return null
  }
}

/**
 * Play a short tone. Safe to call freely — never throws.
 * @param {number} freq - frequency in Hz
 * @param {number} durationMs - duration in milliseconds
 * @param {{ type?: OscillatorType, volume?: number }} [options]
 */
export function playTone(freq = 880, durationMs = 80, options = {}) {
  try {
    const audioCtx = getContext()
    if (!audioCtx) return
    const { type = 'square', volume = 0.05 } = options

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const now = audioCtx.currentTime
    const duration = Math.max(0.01, durationMs / 1000)
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.start(now)
    osc.stop(now + duration)
  } catch (err) {
    // Audio is best-effort; never let it break gameplay.
  }
}

/** Short high beep for menu move. */
export function playBlip() {
  playTone(880, 45, { type: 'square', volume: 0.04 })
}

/** Slightly brighter beep for menu confirm. */
export function playConfirm() {
  playTone(1320, 70, { type: 'square', volume: 0.05 })
}

/** Low tone for menu cancel/back. */
export function playCancel() {
  playTone(220, 90, { type: 'sine', volume: 0.04 })
}
