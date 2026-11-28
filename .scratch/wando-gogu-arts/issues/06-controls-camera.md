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

## 2026-11-25 — added: longer/more forgiving range, a bomb, keyboard fire

- **Fire range increased (20 → 36) and the hit tolerance now widens with distance** instead of
  staying a flat lateral distance — a flat tolerance meant hits at long range needed near-perfect
  alignment, which read as "shots do nothing far away" even though up-close hits worked fine.
- **A second special action: a bomb.** Distinct from Guard Up and manual fire, its own button and
  cooldown (8s) and the 'B' key. Drops straight down from wherever Wando is when triggered, then
  explodes for heavy AoE damage to any enemy unit in range on impact — including towers/bases, so
  it's also a legitimate siege tool.
- **Space/Enter now also fire**, mirroring the on-screen button, for desktop dev/testing.

## 2026-11-25 — revised: bomb became a rocket, third-person camera, a turbo action

More feedback after playing: the straight-down bomb drop was invisible in practice — it fell
straight down from Wando's position while she kept flying forward, so by the time it landed it was
already behind the camera's view and she never actually saw it land. Several related changes:

- **The bomb is now a rocket**: same special action and cooldown (key '1'), but it fires straight
  ahead along the exact same forward line as the gun (`ai.js`'s `fireRocket`, reusing the gun's
  forward-ray hit detection with a wider, more forgiving tolerance for a bigger projectile), as one
  slower, larger projectile (a cone oriented along its flight path, not a small bullet) that
  explodes in a radius wherever it lands — on a direct hit, or at max range if nothing was hit. It
  stays in view the whole time since it travels the same direction the player is looking.
- **Camera is now third-person**, not cockpit: positioned behind and above Wando so the whole ship
  is visible, replacing the first-person view from two revisions ago. Her mesh — previously always
  hidden — is now always visible during normal flight, and oriented to face her actual travel
  direction each frame so she reads as flying rather than sliding. The crosshair stays (still a
  reasonable approximation of the firing line from a trailing chase camera) but is necessarily less
  exact than it was in true first-person.
- **A second special action: turbo.** Its own button (key '2', next to the gyro) and a 10-second
  cooldown — a flat 1.8x speed multiplier for 3 seconds on activation
  (`TURBO_DURATION_MS`/`TURBO_SPEED_MULTIPLIER`/`TURBO_COOLDOWN_MS`).
- **Fixed a bug introduced alongside the rocket's cooldown-wipe visual**: the action buttons'
  negative-offset key-shortcut badges were being clipped by `overflow:hidden` on the button, which
  had been added (unnecessarily) to keep the cooldown mask circular — the mask's own border-radius
  already clips its own background with no overflow needed on the parent at all.

## 2026-11-25 — crosshair accuracy, two attempts then the real fix

The third-person camera made the crosshair (and therefore the gun/rocket) read as inaccurate —
three corrections, in order:

1. First attempt: aim the camera exactly parallel to Wando's own forward vector instead of at her.
   Wrong fix — the camera sits `CHASE_HEIGHT` above her, so a line parallel to but offset from the
   gun's actual path only converges toward the crosshair at infinite range; at any real distance
   the shot read as landing below center.
2. Second attempt: aim the camera at a point lying ON the gun's actual firing line, a fixed
   "convergence distance" out (18 units) — the standard trick for an over-the-shoulder camera.
   Exactly correct at that one distance, with a small, expected, opposite-signed error closer or
   farther than it. Still not good enough on reflection.
3. **The actual fix, per explicit instruction to just cheat**: `manualAttack`/`fireRocket` (ai.js)
   now raycast from the camera's own position/view direction (`main.js`'s `getAimRay()`, using
   `camera.getWorldDirection`) instead of Wando's own position/forward vector. This makes the hit
   detection and the crosshair identical *by construction*, at every distance — not an
   approximation. The visual projectile still launches from Wando's own mesh (for a sane-looking
   origin point) but travels toward the impact point computed from the camera's ray, so very
   occasionally a shot's visual path and the ship's nose won't quite line up — an accepted
   trade-off for the crosshair always being exactly right, which is what was asked for. The
   convergence-distance tuning from attempt 2 was removed as dead weight; the camera can now look
   anywhere without affecting accuracy at all.

## 2026-11-25 — Wando buffed: faster, harder-hitting, twin wingtip cannons

- **Speed increased** (`WANDO_SPEED`, 7 → 10) — a dedicated override, distinct from the generic
  Vanguard bot speed other Vanguards still use.
- **Damage increased** (`WANDO_DAMAGE`, 16 → 24 per stream) — also a dedicated override.
- **Manual fire is now a twin parallel stream**, not a single shot: `ai.js`'s `manualAttack` runs
  two independent hit-checks offset left/right of the aim ray by `WANDO_STREAM_OFFSET` (1.1 units),
  each able to land its own hit — a target within tolerance of both streams takes double damage in
  one trigger pull. Visually the two bullets originate from Wando's own left/right wingtips (an
  X-wing silhouette), not dead-center, while hit-detection still rides the camera-ray cheat
  (offset the same way, just from the camera's ray instead of the ship's position) so each stream
  independently stays exactly where its half of the crosshair-area points.

## 2026-11-28 — added: physical collision destroys the ship

Previously flying into an enemy unit or tower had no special consequence beyond whatever damage it
happened to deal at its own normal attack range/cadence — colliding wasn't actually "a collision,"
Wando just sat inside its attack range like any other target. Now, each frame
(`ai.js`'s `aiStep`), if any enemy unit/creep/tower/base is within `WANDO_COLLISION_RADIUS` (2.2
units) of her, she takes damage equal to her own current HP (an instant kill, same shield-absorption
rule as any other damage — an active Guard Up/Fortify-style shield still mitigates it, just not
necessarily fully) and the normal death/crash sequence takes over from there, same as being shot
down. Ally units never trigger this — only enemies.
