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

## 2026-11-25 — further revisions: no auto-level, no auto-aim, gyro, rate of fire

More feedback from playing this pass, each overriding a piece of the above:

- **Pitch no longer auto-levels** — pure trim, holds wherever you leave it. A cockpit
  **gyroscope instrument** was added to the HUD (bottom-left) instead: a sky/ground horizon ball
  for pitch plus a rotating heading marker for yaw, so attitude stays readable without an
  auto-correct crutch.
- **No auto-aim at all** — manual fire is a literal fixed forward-firing gun (like a WWII
  fighter's), not a lock-on. It always fires dead straight along Wando's exact forward vector on
  every trigger pull (subject to its own fire-rate cooldown), hit or miss; whether something
  happens to be in that exact line (within a small tolerance, `FIRE_RAY_TOLERANCE`) only decides
  whether damage lands, never the shot's direction. A **crosshair** was added at screen center
  marking exactly where that line points. Holding the fire button fires continuously rather than
  needing rapid taps. Fire rate increased substantially (`WANDO_ATTACK_INTERVAL_MS`, 150ms) for a
  machine-gun feel.
- **Floating HP bars** added over every creep, tower, and bot hero (both teams) — not just
  Wando's own HUD bar. Projectiles were also shrunk and switched to shared geometry/materials
  (no per-shot allocation) to stay cheap at a machine-gun fire rate with many units on screen.
- **A fixed bug**: shots were firing level regardless of pitch — the projectile renderer forced
  both ends of every shot to the attacker's own height, discarding the endpoint's actual computed
  Y entirely. Diving/climbing now visibly angles the shot.

## 2026-11-25 — added: a death/respawn sequence for the player

Previously the player's hero just used the same instant-blink respawn as every bot hero, with the
screen frozen for the ~5s respawn timer (and the cockpit-hides-the-ship rule meant there was no
crash visual at all). Now, on Wando's death: her mesh becomes visible again and falls/tilts toward
the ground over `CRASH_FALL_MS` (900ms) while the camera stays in the first-person cockpit view
(watching the ground rush up); at the moment of impact the camera cuts to a fixed external view
positioned above and back from the crash site, looking at it, and a 5-second countdown
(`RESPAWN_MS`) displays before she respawns at full HP back at her spawn point. The player's hero
is deliberately excluded from `World`'s generic hero-auto-respawn timer — this sequence is driven
entirely from `main.js`, since it needs the camera and HUD that only main.js has access to. Bot
heroes are unaffected, still an instant blink.
