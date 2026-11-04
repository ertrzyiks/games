# Rendering/physics engine choice for the X-wing shooter

Research for [issue #25](https://github.com/ertrzyiks/games/issues/25) (child of the game-design
map, [issue #24](https://github.com/ertrzyiks/games/issues/24)): which existing 2D
rendering/physics/collision engine should the new 1942-style scrolling X-wing shooter be built on.

No prior research-output convention exists in this repo (checked for `docs/`, `research/`, and
similar folders, and searched `git log` for prior research docs — nothing found). This file
establishes `games/games/_wayfinder-research/<topic>.md` as that convention, as suggested by the
ticket.

**Research date:** 2026-11-04. Version numbers, download counts, and maintenance signals below are
primary-sourced (npm registry, GitHub API, official docs) as of that date and will drift over time.

## Recommendation

**Phaser** (`phaser` on npm, MIT license).

It is the only candidate that scores well on every axis that matters for this project:

- **Purpose-built for exactly this genre.** Phaser's Arcade Physics system is explicitly the
  "fast and easy" option for "platformers, top-down games, and puzzle games" and is explicitly
  *not* a rigid-body simulator — which is exactly the "simple physics (velocity, no rigid body)"
  the ticket asks for. It gives rectangle/circle bodies, velocity/acceleration/drag, `collider`
  (resolves overlap) and `overlap` (detect-only) callbacks, and collision category/masks — enough
  to wire up bullet-vs-enemy and enemy-vs-player hits with a handful of calls.
  ([docs.phaser.io/phaser/concepts/physics/arcade](https://docs.phaser.io/phaser/concepts/physics/arcade))
- **Official, maintained Vite templates.** `phaserjs/template-vite` is published by Phaser Studio
  itself (not a community guess), targets Phaser 4 + Vite, and is one of several official
  Vite/Vite-TS templates linked from the docs. Vite is a first-class, documented path, not an
  afterthought. ([github.com/phaserjs/template-vite](https://github.com/phaserjs/template-vite))
- **Touch input is a documented, first-class API**, not something to hand-roll:
  `setInteractive({ draggable: true })` plus `drag`/`dragstart`/`dragend` events, multi-pointer
  tracking (`input.activePointers`, `pointer1..10`), and per-pointer `x`/`y`/`worldX`/`worldY` —
  everything needed for a drag-to-move touch control.
  ([docs.phaser.io/phaser/concepts/input](https://docs.phaser.io/phaser/concepts/input))
- **Scale Manager directly serves the repo's small-screen mandate**: `FIT`/`ENVELOP`/`RESIZE`
  modes, orientation lock, and fullscreen-on-touch helpers are built in, so the "compatible with
  small screens" requirement in `games/CLAUDE.md` is a config option, not new code.
  ([docs.phaser.io/phaser/concepts/scale-manager](https://docs.phaser.io/phaser/concepts/scale-manager))
- **By far the largest, most active ecosystem** of any contender (see table) — most weekly
  downloads, most stars/contributors, continuous releases through mid-2026, which lowers the risk
  of hitting an undocumented edge case with no community answer.
- **Works with plain JavaScript**, matching this monorepo's convention (no TypeScript anywhere in
  `starforged`/`game-2`/`tank-memo`) — the vite template supports both JS and TS variants.

The cost is bundle size: Phaser is the heaviest option (~348 KB min+gzip). That is accepted
deliberately — it buys a complete, battle-tested package (rendering, scene graph, arcade physics,
input, audio, scale manager) with no integration glue, which is the most direct way to honor the
ticket's explicit ask to *stop* hand-rolling this layer.

## Comparison table

| | **Phaser** | Excalibur.js | Kaplay | Kaboom.js (original) | PixiJS + Matter.js |
|---|---|---|---|---|---|
| npm package | `phaser` | `excalibur` | `kaplay` | `kaboom` | `pixi.js` + `matter-js` |
| Latest version | 4.2.1 | 0.32.0 | 3001.0.19 | 3000.1.17 (frozen) | 8.22.0 + 0.20.0 |
| Last publish | 2026-07-09 | 2026-11-02 | 2026-05-12 | 2025-05-01 | 2026-10-30 / 2024-06-23 |
| GitHub last push | 2026-08-21 | 2026-11-03 | 2026-10-22 | 2024-08-04 (**archived**) | 2026-11-04 / 2026-09-30 |
| Weekly npm downloads | **796,864** | 27,501 | 6,132 | 2,277 (declining) | 1,789,212 / 535,480 |
| Stars / contributors | 40,648 / ~676 | 2,361 / ~121 | 1,824 / ~104 | 2,733 / — (frozen) | 48,622 / — |
| License | MIT | BSD-2-Clause | MIT | MIT | MIT / MIT |
| Min+gzip bundle | ~348 KB | ~142 KB | ~65 KB | ~65 KB (same lineage) | ~258 KB (Pixi only, no physics) |
| Official Vite story | Official `template-vite`, Phaser-Studio-maintained | Official `template-ts-vite` linked from docs | Named in a generic bundler list only (esbuild is the documented path) | N/A (archived) | No game-specific template; DIY |
| Documented touch drag/pointer-follow | Yes — `setInteractive({draggable:true})`, `drag` events, multi-pointer API | Partial — unified pointer API, but the dedicated actor-drag helper was just removed/reworked (`remove!: broken actor drag helper`, 2026-11-03) | Not documented — guides cover only a keyboard/mouse/gamepad "Buttons" API; touch not described | N/A | Neither library has touch/drag helpers; fully DIY |
| Built-in collision for bullets/enemies | Arcade Physics: AABB/circle bodies, `overlap`/`collider`, explicitly "not for complex simulations" | Collision types (Prevent/Passive/Active/Fixed) + colliders; velocity-based body details live in deeper API docs | `area()` + `body()` components, `onCollide`/`onCollideUpdate`/`onCollideEnd`, velocity via `vel`/impulses/forces | Same model as Kaplay (shared lineage) | Pixi has none; Matter.js is a full rigid-body solver — more than the ticket asks for |

Sources for the table: npm registry (`npm view <pkg> version license time.modified`, run
2026-11-04), `api.npmjs.org/downloads/point/last-week/<pkg>` (run 2026-11-04), GitHub REST API
(`gh api repos/<org>/<repo>` and `.../commits`, run 2026-11-04), bundlephobia API
(`bundlephobia.com/api/size?package=<pkg>@<version>`, run 2026-11-04), and the official docs pages
linked throughout this document.

## Why not the others

### Excalibur.js — strong runner-up, lost on ecosystem size and input-API stability

Excalibur is TypeScript-first, has a genuinely lean bundle (~142 KB gzip, the lightest full engine
here), and is being actively developed — commits landed the same day this research was written
([github.com/excaliburjs/Excalibur/commits](https://github.com/excaliburjs/Excalibur/commits/main)).
It has an official Vite+TS template
([excaliburjs.com/docs/installation](https://excaliburjs.com/docs/installation/)) and a real
collision-type system (Prevent/Passive/Active/Fixed,
[excaliburjs.com/docs/collisiontypes](https://excaliburjs.com/docs/collisiontypes/)).

It loses to Phaser on two counts specific to this project: (1) its ecosystem is an order of
magnitude smaller (27.5K weekly downloads and ~121 contributors vs. Phaser's 797K and ~676), so
less community prior art exists for this exact genre; and (2) the dedicated actor pointer-drag
helper was *just* removed/reworked in a breaking commit the day this research was done
(`remove!: broken actor drag helper`, 2026-11-03) — a bad sign for leaning on that exact feature
(touch drag-to-move) for a v1 title right now. Worth a second look later if its input API
stabilizes.

### Kaplay (formerly Kaboom.js) — lightest bundle, but touch input and Vite support are unproven

Kaplay is the direct, actively-maintained fork/rename of Kaboom.js. The **original** `kaboom`
package on npm is unchanged since 2025-05-01, and its source repo `replit/kaboom` is **archived**
on GitHub (confirmed via GitHub API: `"archived": true`, last push 2024-08-04) — so the ticket's
note about Kaboom being superseded is correct, and the original should not be used.

Kaplay itself (`kaplayjs/kaplay`) is healthy: commits into October 2026, ~104 contributors, and the
smallest bundle of any contender (~65 KB gzip). Its `area()`/`body()` component model
(`onCollide`/`onCollideUpdate`/`onCollideEnd`, velocity via `vel`/impulses) is a good, lightweight
fit for bullet/enemy collision — not overkill.

It loses on two points: its install/bundler guide documents **esbuild**, not Vite — Vite is only
named in passing in a list of options
([kaplayjs.com/guides/install](https://kaplayjs.com/guides/install/)), so Vite integration would be
unverified territory in this monorepo. And its input guide covers only a keyboard/mouse/gamepad
"Buttons" API; touch/drag-to-move is undocumented
([kaplayjs.com/guides/input](https://kaplayjs.com/guides/input/)) — this repo's hard touch-first
requirement would need to be built against the API reference/source rather than a guide. Smallest
footprint by far, but more risk on the two things this ticket cares most about.

### PixiJS (+ Matter.js) — not a real contender as a combo

PixiJS is a renderer only — no collision or physics of any kind. To get the equivalent of
Phaser's Arcade Physics, it would need to be paired with a separate physics library, and the
obvious npm choice (`matter-js`) is a **full rigid-body simulator** — explicitly more machinery
than the ticket asks for ("no need for full rigid-body simulator"), plus it shows a maintenance gap
(GitHub pushes continued into 2026-09-30, but the last npm publish was 2024-06-23 — fixes are
sitting unreleased). Stitching two separately-maintained libraries together (coordinate systems,
render loop, no shared input/scene layer) reintroduces exactly the kind of hand-rolled integration
work this ticket is trying to avoid by picking an engine. Not pursued further.

## Repo context used for this research

Confirmed by reading `games/games/{starforged,game-2,tank-memo}/package.json` and `vite.config.js`:
every existing game package is `"type": "module"`, plain vanilla JS (no TypeScript anywhere in the
repo), with `vite` as the only devDependency, `dev`/`build`/`preview` npm scripts, and a
per-package `base: '/games/<name>/'` in `vite.config.js`. The new game package should follow this
same shape, with `phaser` added as a dependency and the official `template-vite` used as a
reference (not copied wholesale, since it includes its own scaffolding/analytics ping that doesn't
match this monorepo's conventions).
