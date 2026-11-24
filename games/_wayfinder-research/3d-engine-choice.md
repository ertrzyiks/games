# 3D rendering engine choice for the Wando & Gogu ARTS pivot

Research for [`.scratch/wando-gogu-arts/issues/01-engine.md`](../../.scratch/wando-gogu-arts/issues/01-engine.md)
(child of the design map, [`.scratch/wando-gogu-arts/map.md`](../../.scratch/wando-gogu-arts/map.md)):
which 3D rendering library the simplified single-lane MOBA-lite should be built on, replacing
Phaser (2D-only, wrong fit for this pivot) in the `games/games/wando-gogu/` package.

Follows the research-output convention established by the shooter effort's
[`engine-choice.md`](./engine-choice.md): `games/games/_wayfinder-research/<topic>.md`.

**Research date:** 2026-11-24. Version numbers, download counts, and bundle sizes below are
primary-sourced (npm registry, GitHub API, and actual `vite build` output from this research's own
scratch projects) as of that date and will drift over time.

## Recommendation

**Three.js** (`three` on npm, MIT license, verified against the actually-installed **r187**
(`0.187.0`)).

It is the only candidate that comes out ahead on every axis that matters here, and — per the
lesson this project was explicitly trying not to repeat — every claim below was checked by running
real code against the installed package, not by reading docs or changelogs:

- **Smallest bundle by a wide margin**, verified with real `vite build` output on equivalent
  minimal scenes (scene + camera + ground plane + one lit box + a raycast), not vendor marketing
  numbers: **532 KB / 132 KB gzip** for Three.js vs. **2.09 MB / 535 KB gzip** for PlayCanvas vs.
  **6.3 MB / 1.39 MB gzip** for Babylon.js (see [Comparison](#comparison) for how each was built).
  For a touch-friendly small-screen game, this is a decisive, not marginal, difference.
- **Zero-friction Vite integration.** `three` is a plain ESM package with no bundler-specific
  config, no WASM/asset-copy step, and no special Vite plugin — `import * as THREE from "three"`
  worked immediately against this monorepo's existing `vite@^5` convention (verified here against
  a fresh Vite 8 dev server and `vite build`, same zero-config behavior either way).
- **The ground-plane raycast API worked exactly as documented, first try.** `THREE.Raycaster` +
  `setFromCamera(ndc, camera)` + `intersectObject(groundMesh)` returned a correct world-space
  `Vector3` hit point with no surprises — see [Verified example](#verified-example) below. This is
  the one area where Babylon's `scene.pick(screenX, screenY)` is arguably *more* ergonomic (screen
  pixels in, no manual NDC math) — noted honestly in the comparison — but Three's version is still
  a first-class, one-line, well-documented API, not something hand-rolled.
- **By far the largest ecosystem and most primary-source material**: 119K GitHub stars, pushed to
  same-day as this research, and (per the npm download API) the most weekly downloads of the three
  candidates — see the [table](#comparison). More prior art lowers the risk of hitting an
  undocumented edge case with no community answer, which is exactly the failure mode this project
  was burned by once already with Phaser 4.
- **MIT license** — same bar as the shooter's Phaser pick, no copyleft/attribution complications.
- **Plain JavaScript, matching every other package in this monorepo.** No TypeScript required, no
  framework wrapper (e.g. react-three-fiber) needed — the raw API is approachable enough for a
  "scene, camera, boxes/spheres/cones" procedural-mesh game.

The cost, relative to Babylon specifically, is that Three.js's raycasting needs a couple of extra
lines (NDC conversion) that Babylon's `scene.pick` skips — a minor, well-documented ergonomics gap,
not a capability gap, and it's dwarfed by the 10x bundle-size difference.

## Comparison

All three candidates were installed for real (not just read about) in throwaway scratch projects,
each with `three`/`@babylonjs/core`/`playcanvas` + `vite` + `playwright-core@1.65.1`, and each was
driven through an identical smoke test with headless Chromium (pre-cached binary at
`~/.cache/ms-playwright/chromium-1248`, launched with `--no-sandbox`) against a real `vite` dev
server — see [Verified example](#verified-example).

| | **Three.js** | Babylon.js | PlayCanvas engine |
|---|---|---|---|
| npm package | `three` | `@babylonjs/core` | `playcanvas` |
| Installed version (verified) | **0.187.0** (r187) | 9.37.2 | 2.24.3 |
| License | MIT | Apache-2.0 (permissive, MIT-compatible) | MIT |
| Last npm publish | 2026-10-30 | 2026-11-23 | 2026-11-24 |
| GitHub stars / last push | 119,297 / 2026-11-24 | 26,440 / 2026-11-24 | 17,363 / 2026-11-24 |
| Weekly npm downloads | 38,006,894 | 373,100 | 217,396 |
| Minimal-scene bundle (real `vite build`, this research) | **532 KB / 132 KB gzip** | 6.3 MB / 1.39 MB gzip | 2.09 MB / 535 KB gzip |
| Ground-plane raycast API | `Raycaster.setFromCamera(ndc, cam)` + `intersectObject(mesh)` — manual NDC conversion, otherwise first-class | `scene.pick(screenX, screenY, predicate)` — screen pixels directly, most ergonomic of the three | No built-in plane-pick helper; hand-rolled from `camera.screenToWorld()` + `pc.Ray` + `pc.Plane.intersectsRay()` |
| Smoke test result | **Clean on first run** — 0 errors, correct hit points | **Clean on first run** — 0 errors, correct hit points | **Failed silently on first run** (see below), fixed, then clean |
| Vite integration | Zero-config ESM import | Zero-config ESM import | Zero-config ESM import |

Sources: `npm view <pkg> version license time.modified` (run 2026-11-24),
`api.npmjs.org/downloads/point/last-week/<pkg>` (run 2026-11-24), GitHub REST API
(`gh api repos/<org>/<repo>`, run 2026-11-24), and this research's own `vite build` output (see
scratch projects, not committed — see [Verification method](#verification-method)).

## Why not the others

### Babylon.js — genuinely excellent API, loses purely on bundle size

Babylon.js's smoke test was clean on the first run, with no bugs found in its API surface. Its
`scene.pick(screenX, screenY, predicate)` is a genuinely nicer touch-input primitive than Three's
`Raycaster` + manual NDC math — it takes raw screen pixels and a mesh filter predicate directly.
Its Apache-2.0 license is permissive and fine for this repo (no copyleft, no conflict with an
MIT-compatible bar).

It loses entirely on bundle size: importing from the `@babylonjs/core` barrel
(`import { Engine, Scene, ... } from "@babylonjs/core"`) — the straightforward style that matches
how this monorepo imports everything else, with no bundler surprises — pulled in **6.3 MB
unminified / 1.39 MB gzip** for a scene with one ground plane, one box, and one light. That is
roughly **10x** Three's equivalent. Babylon is modular enough to hand-tune with deep subpath
imports (`@babylonjs/core/Meshes/meshBuilder`, etc.) to shrink this, but that is exactly the kind
of "bundler surprise"/careful-import-discipline this monorepo has avoided so far, and a 10x
out-of-the-box gap is too large to accept for a touch-first, small-screen game on the promise that
it can be tuned away later.

### PlayCanvas engine — real API footgun caught only by running it

This is the clearest illustration of why this ticket insisted on a working example instead of
docs-reading. The first version of the ground-plane raycast test, written directly from the
engine's exposed types, used:

```js
const groundPlane = new pc.Plane(new pc.Vec3(0, 1, 0), new pc.Vec3(0, 0, 0));
```

This looks reasonable — "normal, point on the plane" is how Three's `Plane` reads conceptually —
and it compiled and ran with **zero console errors or warnings**. But `pc.Plane`'s actual
constructor signature is `(normal, distance)`, where `distance` is a signed **scalar** offset
along the normal, not a point. Passing a `Vec3` there doesn't throw; it just makes
`this.normal.dot(ray.origin) + this.distance` silently coerce to `NaN` inside
`intersectsRay()`, so every raycast call returned `false` with no error, console warning, or
visible symptom other than "the feature doesn't work." The fix was one line
(`new pc.Plane(new pc.Vec3(0, 1, 0), 0)`), but finding it required actually calling the function
and getting `null` back where a hit point was expected — exactly the class of bug this project was
burned by once already with Phaser 4's `Group.children`, except this time caught in the research
phase instead of at runtime after implementation.

Once fixed, PlayCanvas's example ran clean and its bundle (2.09 MB / 535 KB gzip via the same
barrel-import style) lands between the other two. PlayCanvas's Entity/Component architecture is
also a heavier conceptual model (`app.root.addChild(entity)`, `entity.addComponent('render', ...)`,
material-per-mesh-instance) for what is, in this project, a simple procedural-primitive-mesh scene
graph — more ceremony than Three's direct `new THREE.Mesh(geometry, material)`. Combined with a
real (if fixable) API surprise on the exact feature this ticket cares most about (ground-plane
picking) and a mid-pack bundle size, it's a reasonable engine but not the best fit here.

## Verified example

### Three.js (recommended) — `main.js`

```js
import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 12, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// Ground plane
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0x3a9d3a })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Moving "hero" box
const hero = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff4444 })
);
hero.position.set(0, 0.5, 0);
scene.add(hero);

let t = 0;
function animate() {
  t += 0.016;
  hero.position.x = Math.sin(t) * 3;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Ground-plane raycast from a simulated pointer position (NDC -1..1)
const raycaster = new THREE.Raycaster();
function raycastGround(ndcX, ndcY) {
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const hits = raycaster.intersectObject(ground, false);
  return hits.length ? hits[0].point : null;
}

const centerHit = raycastGround(0, 0);   // pointer at screen center
const farHit = raycastGround(0, 0.5);    // pointer toward top of screen
```

(Full file with console-logging scaffolding used by the test harness lives in this research's
scratch directory, not committed to the repo.)

### How it was run

1. `npm install three vite playwright-core@1.65.1` in a throwaway scratch directory (not under
   `games/`).
2. Served with a real `vite` dev server (`npx vite --port 5183`) — ES module imports need an HTTP
   origin, not `file://`.
3. Driven with `playwright-core`'s `chromium.launch({ executablePath:
   "/home/agent/.cache/ms-playwright/chromium-1248/chrome-linux-arm64/chrome", args: ["--no-sandbox"] })`
   against the pre-cached Chromium binary.
4. The page's `console` and `pageerror` events were captured and asserted empty (aside from the
   browser's own automatic, harmless `favicon.ico` 404 — confirmed via `curl` that this is not an
   app/module-loading error).
5. The raycast results were read back out of the page via `page.evaluate()` and printed.

### What the raycast test actually printed

```
--- console messages ---
[console.debug] [vite] connecting...
[console.debug] [vite] connected.
[console.log] RAYCAST_RESULT {"centerHit":{"x":0,"y":7.888609052210118e-31,"z":-3.552713678800501e-15},"farHit":{"x":0,"y":2.1626829370438977e-15,"z":-9.739858069391428},"threeVersion":"187"}
[console.warning] GL Driver Message ... GPU stall due to ReadPixels   (x4, benign — software/headless GPU perf notice, not an app error)
[console.error] Failed to load resource: the server responded with a status of 404 (Not Found)   (confirmed via curl: this is the browser's automatic /favicon.ico request, not an app error)

--- errors (pageerror / requestfailed) ---
(none)

--- raycast result ---
{
  "centerHit": { "x": 0, "y": 7.888609052210118e-31, "z": -3.552713678800501e-15 },
  "farHit":    { "x": 0, "y": 2.1626829370438977e-15, "z": -9.739858069391428 },
  "threeVersion": "187"
}

PASS
```

`centerHit` (pointer at the screen center) lands at the world origin `(0, ~0, ~0)` — correct, since
the camera at `(0, 12, 12)` looks straight at `(0, 0, 0)`, and the ground plane passes through the
origin (the `~1e-15`/`~1e-31` values are ordinary floating-point noise, not a bug). `farHit`
(pointer toward the top of the screen, further from the camera) lands at `z ≈ -9.74`, i.e. further
down the lane away from the camera — exactly the direction a ground-plane raycast should move the
hit point as the touch/pointer position moves up the screen. This confirms the raycast produces
correct, direction-sensitive world-space coordinates, not just "no crash."

For comparison, Babylon's equivalent test (same camera/ground/box shape, using
`scene.pick(screenX, screenY, predicate)`) printed:

```
[console.log] BJS - [19:46:51]: Babylon.js v9.37.2 - WebGL2
[console.log] RAYCAST_RESULT {"centerHit":{"x":0,"y":0,"z":0},"farHit":{"x":0,"y":0,"z":-4.188155004968897},"babylonVersion":"9.37.2"}
PASS
```

— also clean, also correct (the different `farHit` z-value reflects a different camera
position/pointer-sampling point in that test, not a discrepancy).

PlayCanvas's test, after fixing the `pc.Plane` constructor argument bug described above, printed:

```
[console.log] Powered by PlayCanvas 2.24.3 2e89103
[console.log] RAYCAST_RESULT {"centerHit":{"x":0,"y":-1.7763568394002505e-15,"z":-1.7763568394002505e-15},"farHit":{"x":0,"y":0,"z":4.117749006091281},"playcanvasVersion":"2.24.3"}
PASS
```

— also correct once fixed.

## Verification method

Three throwaway scratch projects (`three-test/`, `babylon-test/`, `playcanvas-test/`), each with
its own `package.json`, `index.html`, `main.js`, and a shared `playwright-check.mjs` harness
(differing only by port number), were built and run outside the repo, under this session's
scratchpad directory. None of these scratch files are committed — only this research document and
the new `research/3d-engine-choice` branch are. Each project was also built for production
(`npx vite build`) to get real, not estimated, bundle sizes.

## Repo context used for this research

Confirmed by reading `games/games/wando-gogu/package.json` and `vite.config.js`: the package is
`"type": "module"`, plain vanilla JS (no TypeScript), with `vite@^5.0.0` as the only
devDependency, `dev`/`build`/`preview` npm scripts, and `base: '/games/wando-gogu/'` in
`vite.config.js` — the same shape as every other package in this monorepo. The rebuilt package
should keep this shape, with `three` added as a dependency; no Vite plugin, config change, or
asset-pipeline step is needed to use it, since the ground-plane raycast and primitive meshes this
project needs are all plain JS/WebGL APIs with no loaders involved.
