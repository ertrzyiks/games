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

// Slim, hooded scout variant of ARMORED_TEMPLATE: a narrow hood (H) over
// dark eye-gaps (E) instead of a full-face visor, a scarf/cape wrap (C)
// instead of wide shoulder pads, a slimmer torso (A, 10 wide vs ARMORED's
// 12), an asymmetric scarf-tail flutter breaking the silhouette's left
// edge, and HUMANOID's two-booted-feet leg pattern instead of ARMORED's
// single block — reads as lighter/faster at a glance. For agile/stealth
// regular enemies (scouts, infiltrators) that would look wrong in
// ARMORED_TEMPLATE's bulky trooper armor.
export const ARMORED_SCOUT_TEMPLATE = [
  '................',
  '................',
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '....HHEHHEHH....',
  '.....HHHHHH.....',
  '....CCCCCCCC....',
  '...AAAAAAAAAA...',
  '...AAAAAAAAAA...',
  '.CC.AAAAAAAAAA..',
  '...ATTTTTTTTA...',
  '...AAAAAAAAAA...',
  '...LLLL..LLLL...',
  '...LLLL..LLLL...',
  '...LLLL..LLLL...',
  '................',
]

// Sinuous legless serpent: a diagonal zigzag body (B) running corner to
// corner instead of CREATURE_TEMPLATE's low horizontal quadruped, a coiled
// head (H) with eyes (E) and a forked fang/tongue flick (F) at the top-left,
// tapering to a point at the bottom-right. No legs anywhere — unmistakably
// a snake, not a beast.
export const CREATURE_SERPENT_TEMPLATE = [
  '................',
  '..BBBBBB........',
  '.BHHHHHBB.......',
  '.BHEBBEHB.......',
  '.BHHFFHHB.......',
  '..BBBBBBB.......',
  '....BBBBBB......',
  '......BBBBBB....',
  '........BBBBBB..',
  '..........BBBBB.',
  '........BBBBBB..',
  '......BBBBBB....',
  '....BBBBB.......',
  '...BBB..........',
  '..BB............',
  '................',
]

// Winged flying beast: a wide wing-sweep (W) spanning almost the full
// width at the top, a small tucked head/body (B/H) with eyes (E) in the
// middle, and two trailing tail-feather streamers (T) instead of
// CREATURE_TEMPLATE's four ground legs. For aerial enemies (Skyreach's
// sky-beasts) that should visibly fly, not stalk on legs.
export const CREATURE_FLYER_TEMPLATE = [
  '................',
  '.WW..........WW.',
  'WWWW........WWWW',
  '.WWW........WWW.',
  '..WW.BBBBBB.WW..',
  '.....BHHHHB.....',
  '.....HEHHEH.....',
  '.....BHHHHB.....',
  '....BBBBBBBB....',
  '...BBBBBBBBBB...',
  '....TT....TT....',
  '....TT....TT....',
  '................',
  '................',
  '................',
  '................',
]

// Hovering drone chassis: a round optic-band head (H/O) on a stub antenna
// (N), no legs at all — a pair of side pontoons (A) and two short landing
// struts (G) floating clear of the ground instead of ROBOT_TEMPLATE's
// bipedal piston legs. Reads as "flies," not "walks."
export const ROBOT_DRONE_TEMPLATE = [
  '................',
  '......NN........',
  '......NN........',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '...HHOOOOOOHH...',
  '...HHOOOOOOHH...',
  '...HHHHHHHHHH...',
  '....HHHHHHHH....',
  '..AA........AA..',
  '.AAA........AAA.',
  '..AA........AA..',
  '................',
  '....GG....GG....',
  '....GG....GG....',
  '................',
]

// --- Boss templates ---------------------------------------------------------
// Every boss gets its own bespoke silhouette, never shared with a regular
// enemy or another boss — distinct ornamentation (crests, wings, capes,
// glowing cores) that no palette swap of a regular-enemy template could
// produce, so a boss reads as a boss on sight instead of "a reskinned
// regular enemy." Each is also drawn at 2x scale in battle (see
// battleScene.js's enemy draw loop), which a shared/reused template
// wouldn't by itself fix.

// Scavenger Captain (Rustmoor): spiked scavenged-armor crest (K), a wide
// trophy-chain collar (C/T), and a big weapon-arm bulge (W) breaking past
// the right edge — nothing a raider/raiderScout's ARMORED silhouette has.
export const BOSS_RAIDER_TEMPLATE = [
  '......K.........',
  '......K.K.......',
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '....HVVVVVVH....',
  '....HVVVVVVH....',
  '....HHHHHHHH....',
  '...CCTTTTTTCC...',
  '..AAAAAAAAAAAA.W',
  '..AAAAAAAAAAAAWW',
  '..AAAAAAAAAAAA.W',
  '..ATTTTTTTTTTA..',
  '..AAAAAAAAAAAA..',
  '..LLLLL..LLLLL..',
  '..LLLLL..LLLLL..',
  '..LLLLL..LLLLL..',
]

// Bog Warden (Mossfen): reared up on its hind legs instead of hunched low
// like the ground-level CREATURE/SERPENT beasts, with mossy growth-horns
// (M), glowing eyes (E), and a glowing corrupted core (G) in its chest —
// taller and far bulkier-reading than any regular swamp creature.
export const BOSS_BOG_TEMPLATE = [
  '....MM....MM....',
  '...MHHM..MHHM...',
  '...HHHH..HHHH...',
  '....HH....HH....',
  '..BBBBBBBBBBBB..',
  '.BBBBBBBBBBBBBB.',
  'BBBHHHHHHHHHHBBB',
  'BBHEHHHHHHHHEHBB',
  'BBBHHGGGGGGHHBBB',
  '.BBBBGGGGGGBBBB.',
  '.BBBBBBBBBBBBBB.',
  '..BBBB....BBBB..',
  '..BBBB....BBBB..',
  '..LLLL....LLLL..',
  '..LLLL....LLLL..',
  '................',
]

// Enforcer Vane (Skyreach): a glider-wing rig (W) flaring from the
// shoulders and a narrow visor (V) — built from the humanoid vocabulary
// but with wings where ARMORED_TEMPLATE/ARMORED_SCOUT_TEMPLATE only ever
// have plain shoulder pads or a scarf.
export const BOSS_ENFORCER_TEMPLATE = [
  '................',
  '.......HH.......',
  '......HHHH......',
  '.....HHHHHH.....',
  '.....HVVVVH.....',
  '.....HVVVVH.....',
  '.....HHHHHH.....',
  'WW...TTTTTTTT...',
  'WWWW.AAAAAAAA.WW',
  '.WWW.AAAAAAAA.WW',
  '..W..AACCCCAA...',
  '.....AAAAAAAA...',
  '.....AAAAAAAA...',
  '.....LLLL.LLLL..',
  '.....LLLL.LLLL..',
  '................',
]

// Foreman (Ashvault): an industrial exo-rig — a backpack/vent stack (K) on
// both shoulders, a welding-goggle visor band (O), and wide boxy SS
// shoulders over a heavier, blockier stance than any regular trooper.
export const BOSS_FOREMAN_TEMPLATE = [
  '........KK......',
  '........KK......',
  '.....HHHHHHH.KK.',
  '....HHHHHHHHHKK.',
  '....HOOOOOOHH...',
  '....HHHHHHHH....',
  '...SSSSSSSSSSS..',
  '..SSAAAAAAAAASS.',
  '..KKAAAAAAAAAKK.',
  '..KKAAAAAAAAAKK.',
  '....TTTTTTTTTT..',
  '....AAAAAAAAAA..',
  '....AAAAAAAAAA..',
  '....LLLLL.LLLL..',
  '....LLLLL.LLLL..',
  '....LLLLL.LLLL..',
]

// Syndicate Warden (The Hollow, final boss): the single most imposing
// silhouette in the game — a crowned, horned helm (K), a long flowing
// cape (C) running the full height down both sides, and a glowing chest
// emblem (G). The only template with a crown and a full-height cape.
export const BOSS_WARDEN_TEMPLATE = [
  '.....K....K.....',
  '....KKK..KKK....',
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '....HVVVVVVH....',
  '....HVVVVVVH....',
  '....HHHHHHHH....',
  'CC..TTTTTTTT..CC',
  'CCC.AAAAAAAA.CCC',
  'CCC.AAGGGGAA.CCC',
  'CCC.AAGGGGAA.CCC',
  'CCC.AAAAAAAA.CCC',
  'CC..AAAAAAAA..CC',
  'CC..LLLL.LLLL.CC',
  'C...LLLL.LLLL...',
  '....LLLL.LLLL...',
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
