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

// Gogu only: a slimmer variant of CHILD_TEMPLATE's round-headed child/robe
// silhouette (reused for every other fenling/child NPC) — the robe tops out
// at 10 wide instead of 12 and never bulges past that, instead of widening
// into a round "belly" partway down — plus a pair of characteristic tall,
// pointed ears (P) swept up and out from the sides of the head, and large
// 2x2 eyes (E) instead of CHILD_TEMPLATE's single-pixel dots. Distinct at a
// glance from everyone else of his kind.
export const GOGU_TEMPLATE = [
  '.PP..........PP.',
  '.PPP.HHHHHH.PPP.',
  '..PPHHHHHHHHPP..',
  '...PHEEHHEEHP...',
  '....HEEHHEEH....',
  '.....HHHHHH.....',
  '....RRRRRRRR....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '...RRRRRRRRRR...',
  '...RRRRRRRRRR...',
  '...RBBBBBBBBR...',
  '...RRRRRRRRRR...',
  '....RRRRRRRR....',
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

// --- Compact object templates ---------------------------------------------
// Unlike the 16x16 character silhouettes above, important story/quest
// OBJECTS (a lamp, a console, a buried cache, ...) are drawn much smaller —
// 8x8, a quarter of a tile's area — so they read as "a thing sitting on the
// floor" rather than a character, and so OverworldScene can center them
// within TILE_SIZE (16) with a few pixels of floor showing around the edge.

// Lamp/lantern/beacon: a framed glow (F = frame/casing, G = the light
// itself) on a short post (P). Reused with different legends for both a
// cozy rescue lantern and an ominous Syndicate-tech beacon — only the
// colors change, never the shape.
export const LAMP_TEMPLATE = [
  '..FFFF..',
  '.FGGGGF.',
  '.FGGGGF.',
  '.FGGGGF.',
  '..FFFF..',
  '...PP...',
  '...PP...',
  '..PPPP..',
]

// Console/terminal/device: a squared casing (B = body) around a glowing
// display (S = screen), with a small indicator strip (L = light/lever)
// underneath. Reused for every "quest-critical device" sprite in the game
// (a schematics console, a release switch, a corroded siphon rig, a shield
// relay, ...) — each world just re-skins the legend.
export const CONSOLE_TEMPLATE = [
  'BBBBBBBB',
  'BSSSSSSB',
  'BSSSSSSB',
  'BSSSSSSB',
  'BBBBBBBB',
  '.BBLLBB.',
  '.BBBBBB.',
  '..BBBB..',
]

// Buried/supply cache: a banded crate (C = crate body, B = metal band/
// latch). Reused for quest-critical "find the cache" payoffs that aren't
// lamps or devices.
export const CACHE_TEMPLATE = [
  '.CCCCCC.',
  'CCCCCCCC',
  'CCBBBBCC',
  'CCCCCCCC',
  'CCCCCCCC',
  'CCBBBBCC',
  'CCCCCCCC',
  '.CCCCCC.',
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
