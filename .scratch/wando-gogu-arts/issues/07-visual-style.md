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
