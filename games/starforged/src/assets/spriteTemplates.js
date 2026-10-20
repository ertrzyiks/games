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

// Lone armored gunslinger (Wando only): angular pointed helmet (H) with a
// narrow V-shaped visor (V), a cape swept off the shoulder (C), armored
// torso (A) with a chest/belt trim stripe (T), a holstered sidearm bump at
// the hip that pokes past the body outline (G), and booted legs (L). An
// original design for this game — distinct from the plain rounded-helmet
// HUMANOID_TEMPLATE silhouette at a glance.
export const HERO_TEMPLATE = [
  '................',
  '.......HH.......',
  '......HHHH......',
  '.....HHHHHH.....',
  '.....HVVVVH.....',
  '.....HVVVVH.....',
  '.....HHHHHH.....',
  '...CTTTTTTTT....',
  '.CCCAAAAAAAA....',
  'CCCCAAAAAAAA....',
  '.CCCAAAAAAAA....',
  '..CCTTTTTTTT....',
  '....AAAAAAAGG...',
  '....LLLL.LLLL...',
  '....LLLL.LLLL...',
  '....LLLL.LLLL...',
]

// Boxy mechanical chassis for droid/industrial enemies: a flat-top head
// block (H) with a single optic sensor band (O) instead of a face, a stub
// antenna (N), a squared chassis torso (A) with a panel-seam trim stripe
// (T), and blocky piston legs (L). No organic curves anywhere.
export const ROBOT_TEMPLATE = [
  '........N.......',
  '........N.......',
  '.....HHHHHH.....',
  '.....HHHHHH.....',
  '.....HHOOHH.....',
  '.....HHHHHH.....',
  '....TTTTTTTT....',
  '...AAAAAAAAAA...',
  '...AAAAAAAAAA...',
  '...AAAAAAAAAA...',
  '....AAAAAAAA....',
  '....TTTTTTTT....',
  '....AAAAAAAA....',
  '....LLLLLLLL....',
  '....LLLLLLLL....',
  '...LLLLLLLLLL...',
]

// Low, hunched quadruped beast for wildlife enemies: a forward-jutting head
// (H) with beady eyes (E), a long humped back/body (B) and a trailing tail
// (T), and four short stubby legs (L). Deliberately non-humanoid — reads
// as "animal," not "person," at a glance.
export const CREATURE_TEMPLATE = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....BBBBBBB....',
  'HHHHBBBBBBBBB...',
  'HEHEHBBBBBBBBBT.',
  'HHHHHBBBBBBBBBTT',
  '.....BBBBBBBBB..',
  '.....LL....LL...',
  '.....LL....LL...',
  '.....LL....LL...',
  '................',
  '................',
  '................',
]

// Armed human troop, bulkier and more closed-off than the plain
// HUMANOID_TEMPLATE NPC: a full-face closed visor (F) instead of the NPC's
// open visor band, wide squared shoulder pads (S) that jut past the torso,
// armored body (A) with a belt trim stripe (T), and heavy blocky boots
// (L). Reads as "armed enemy trooper," not "townsfolk."
export const ARMORED_TEMPLATE = [
  '................',
  '................',
  '....HHHHHHHH....',
  '....HHHHHHHH....',
  '....FFFFFFFF....',
  '....FFFFFFFF....',
  '....HHHHHHHH....',
  '.SSSSSSSSSSSSSS.',
  '.SSAAAAAAAAAASS.',
  '...AAAAAAAAAA...',
  '...AAAAAAAAAA...',
  '...TTTTTTTTTT...',
  '...AAAAAAAAAA...',
  '...LLLLLLLLLL...',
  '...LLLLLLLLLL...',
  '...LLLLLLLLLL...',
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
