# Define the 3D visual style

Type: grilling
Status: resolved

## Question

No art pipeline, no textures/models (repo precedent) — what do heroes, creeps, towers, and the
lane actually look like in 3D?

## Answer

Procedural primitive meshes only (boxes, spheres, cones, cylinders, combined per unit — the 3D
equivalent of the shooter's `Graphics`-drawn sprites), flat bright team colors (blue = ally, red =
enemy), simple/rounded silhouettes, no textures, no loaded models. The 5 hero roles are
distinguished by a distinct simple shape/size combination each (e.g. Vanguard a stocky box,
Marksman a slim tall shape, Sentinel the largest/bulkiest), not by detailed modeling — same
"readable silhouette over detail" bar the shooter used. The lane is a flat ground plane (plus
simple tower/base geometry at the ends); no terrain decoration needed for v1.

## 2026-11-28 — Wando's own ship, and blaster-bolt projectiles

- **Wando no longer shares the generic Vanguard box** — `visuals.js`'s `createPlayerShipMesh`
  builds a dedicated sci-fi starfighter silhouette (X-wing-like) out of the same procedural
  primitives: a cylinder+cone fuselage, a small cockpit sphere, four box "S-foil" wings mounted in
  an X configuration (rotated 45/135/225/315° around the roll axis), and two wingtip cannons. It
  reads clearly from the third-person chase camera, which looks nearly straight down the ship's
  own forward axis — exactly the angle that shows an X-wing's silhouette best. Bot Vanguards
  (ally and enemy) are unaffected, still the plain box.
- **Projectiles now look like blaster bolts**, not bullets: the shared geometry changed from a
  small sphere to a short glowing rod (a thin `CylinderGeometry`), oriented along its actual travel
  direction each shot (same `setFromUnitVectors` trick the rocket already used). `MeshBasicMaterial`
  is unlit, which already gives it a flat, glowing-against-the-scene look typical of a blaster
  shot; colors brightened slightly from the original pale tones to read more vividly.
