# Pick the 3D rendering engine

Type: research
Status: resolved

## Question

Which 3D rendering library should the ARTS (see [map.md](../map.md)) be built on? This replaces
Phaser (a 2D-only engine, wrong fit here).

Context: this is a **simplified v1** MOBA-lite — single lane, basic distance-based AI (no real
pathfinding/navmesh needed, since units just advance along one lane and engage whatever's nearest),
procedural primitive-mesh visuals (no textures/models/art pipeline), touch-friendly controls (a
camera-relative ground-plane raycast for movement, one ability button), and no physics beyond
simple distance/range checks (no rigid-body simulation needed). Evaluate candidates (e.g. Three.js,
Babylon.js, PlayCanvas engine) against:

- Ease of a minimal setup: scene, camera, ground plane, simple primitive meshes (boxes/spheres/
  cones), basic lighting — with no asset pipeline.
- Vite integration story (this monorepo is 100% Vite; every other package here is Vite + vanilla
  JS, no bundler surprises wanted).
- Touch input: need to raycast from a pointer/touch position onto a ground plane, and a simple
  camera-follow. Does the library have first-class raycasting/picking helpers, or is this trivial
  to hand-roll regardless of library choice?
- API stability/maturity — **this project was burned once already**: the previous research ticket
  correctly picked an engine (Phaser) but recommended its newest major version, which had quietly
  dropped an API (`Group.children.each()`) that slipped into the implementation and broke the game
  at runtime, only caught by an actual headless-browser click-through. For this pick, don't just
  read docs — write a tiny working example against the **actually-installed** package version
  (scene + camera + a moving box + a mouse/touch raycast onto a ground plane) and confirm it runs
  before recommending an API shape. Prefer whichever option lets you most confidently avoid a
  repeat of that failure mode (e.g. a more stable/conservative version, or better first-party
  examples you can verify against directly).
- License and bundle size (same bar as the shooter's engine pick — MIT-compatible, reasonable for
  a small browser game).

Resolve as a `research` ticket: produce a recommendation with reasoning, verified by a working
example, not an open-ended survey. Record the answer (chosen library + why + the minimal example
that proves the API surface works) on the map.

## Answer

**Three.js** (`three`, MIT), verified against the actually-installed r187 (`0.187.0`).

Ran clean on the first try in a real, headlessly-executed example (Playwright + Chromium against
a live Vite dev server, not just docs): `Raycaster.setFromCamera` + `intersectObject(ground)`
correctly reported world-space hit points for simulated pointer positions. Bundle for a minimal
scene via real `vite build`: 532 KB / 132 KB gzip.

Runners-up: **Babylon.js** v9.37.2 also ran clean and has a more ergonomic touch-raycast API
(`scene.pick(screenX, screenY, predicate)`, raw screen pixels), but its bundle was ~10x heavier
(6.3 MB / 1.39 MB gzip) — too heavy for a touch-first small-screen game. **PlayCanvas engine**
v2.24.3 silently produced wrong raycast results on the first attempt
(`new pc.Plane(normal, point)` actually takes `(normal, distance)` — a scalar, not a point — so it
compiled and ran with zero errors while always returning no hit); fixed, it ran clean, mid-pack
bundle (2.09 MB / 535 KB gzip). This PlayCanvas bug is exactly the "verify, don't just read docs"
failure mode this ticket called out — caught only because the example was actually run and its
output checked, not because it looked correct.

Full comparison table, sourcing, and the verified example code: `games/_wayfinder-research/
3d-engine-choice.md` (also on git branch `research/3d-engine-choice`, now merged into
`feat/wando-gogu-arts`).
