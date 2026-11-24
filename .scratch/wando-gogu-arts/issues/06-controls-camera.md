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
