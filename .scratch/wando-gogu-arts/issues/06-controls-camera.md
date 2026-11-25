# Define the player's controls and camera

Type: grilling
Status: resolved
Blocked by: 01

## Question

How does the player control Wando, and what's the camera? Touch-friendly/small-screen is a hard
repo-wide constraint. Blocked on the engine pick since the exact raycasting/camera APIs depend on
the chosen 3D library.

## Answer

- **Camera:** fixed-angle, isometric-style, follows Wando's position (offset above and behind,
  angled down) — no free camera control needed, avoids a second touch control competing with
  movement on a small screen.
- **Movement:** whole-screen drag surface, same philosophy as the shooter's drag-to-move — a
  touch/pointer position is raycast onto the lane's ground plane, and Wando eases toward that
  world-space point. Keyboard/WASD equivalent for desktop dev/testing.
- **Attack:** fully automatic, same philosophy as the shooter's autofire — Wando attacks the
  nearest enemy in range exactly like every AI unit does (see
  [05-ai-behavior.md](05-ai-behavior.md)), no manual targeting UI needed. The player's only verb
  via touch is "where to be."
- **Ability:** one dedicated on-screen button (reusing the shooter's Gogu-button pattern: bottom
  corner, out of the movement drag surface's way) triggers *Guard Up* when off cooldown.

## 2026-11-25 — revised: piloted flight + manual fire

The user asked for two changes after playing the first pass, overriding parts of the answer above:

- **Attack is now manual**, not automatic — a second dedicated button (next to the ability
  button) fires Wando's basic attack at the nearest enemy in range, same cooldown as before. Bot
  heroes and creeps are unaffected — they still auto-attack per
  [05-ai-behavior.md](05-ai-behavior.md). Every attack (manual or automatic) now also gets a
  visible effect — a travelling projectile for ranged units, a brief flash on the target for melee
  — since the original fully-automatic design had no visual feedback at all for *any* unit's
  attacks, which is what prompted the "am I even shooting?" question in the first place.
- **Movement is now piloted, not click-to-move**: Wando flies constantly forward; the whole-screen
  drag is a steering input instead of a destination — horizontal drag = yaw (turn), vertical drag
  = pitch (climb/dive), releasing the stick auto-levels the pitch back toward level flight (so the
  ship can't get stuck pinned at the altitude ceiling). Keyboard/WASD mirrors this (arrows/WASD set
  a steer direction instead of a move direction). This is also what makes "heroes can fly" literal
  for the player, not just a lore note.
- **Camera is now first-person/cockpit**, not a third-person follow cam: it sits just ahead of and
  above Wando's position, looking in Wando's current flight direction. Wando's own mesh is hidden
  (never rendered) since the camera is effectively inside it.
