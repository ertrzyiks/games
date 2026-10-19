import { defineSprite } from '../engine/sprite.js'

/**
 * Procedural pixel-art sprite templates. Each template is a 16x16 grid of
 * role-letters (what body part a pixel belongs to); a "legend" maps those
 * letters to actual colors, so the same silhouette can be re-skinned for
 * many characters/enemies without hand-authoring new pixel grids. `.` is
 * always transparent. Add new templates here for new silhouettes
 * (quadruped, droid, flying creature, ...) — this file is meant to grow.
 */

// Humanoid: helmeted/hooded head (H), visor/face-shadow (V), trim (T),
// body/armor (A), legs/boots (L).
export const HUMANOID_TEMPLATE = [
  '................',
  '................',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '...HVVVVVVVVH...',
  '...HVVVVVVVVH...',
  '...HHHHHHHHHH...',
  '....TTTTTTTT....',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..ATTTTTTTTTTA..',
  '..AAAAAAAAAAAA..',
  '...LLLL..LLLL...',
  '...LLLL..LLLL...',
  '...LLLL..LLLL...',
]

// Small round-headed child/creature in a robe: head (H), eyes (E), robe (R), belt (B).
export const CHILD_TEMPLATE = [
  '................',
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '....HHEHHEHH....',
  '....HHHHHHHH....',
  '.....HHHHHH.....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '...RRRRRRRRRR...',
  '..RRRRRRRRRRRR..',
  '..RRRRRRRRRRRR..',
  '..RBBBBBBBBBBR..',
  '..RRRRRRRRRRRR..',
  '...RRRRRRRRRR...',
  '....RRRRRRRR....',
  '.....RRRRRR.....',
]

export function buildSprite(template, legend) {
  const charToIdx = {}
  const palette = {}
  let idx = 1
  for (const ch of Object.keys(legend)) {
    charToIdx[ch] = idx
    palette[idx] = legend[ch]
    idx += 1
  }
  const grid = template.map((row) => row.split('').map((ch) => (ch === '.' ? 0 : charToIdx[ch])))
  return defineSprite({ palette, frames: [grid] })
}
