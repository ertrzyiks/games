# Design the enemy bestiary & wave patterns

Type: grilling
Status: resolved

## Question

What enemies and wave/formation patterns populate the 3 stages of the X-wing shooter (see [map.md](../map.md))?

Blocked on the stage-themes ticket ([02-stages.md](02-stages.md)), since enemy design should fit each stage's setting. Full creative freedom per the map's Notes, with the one hard constraint: kid-friendly, no blood or gore (think droids, critters, mechanical constructs — not anything that reads as violent death).

Resolve, per stage:
- 2-4 enemy types per stage (reused/remixed across stages is fine, doesn't need to be unique each time) with a one-line behavior description each (e.g. "drone: flies straight down, fires single shot" / "swarmer: weaves side to side in groups of 3").
- How they're introduced/paced across the stage (wave patterns, formations, escalating density toward the boss).
- Difficulty escalation across stage 1 → 3 (more enemies, faster, more complex patterns — exact tuning numbers are fog, not this ticket's job; just establish the shape of the escalation).

Work it live with the user, one question at a time.

## Answer

**Stage 1 — Dustrim Canyons:**
- *Scout Pod* — floats straight down, fires a single slow shot every ~2s.
- *Cliff Turret* — stationary at the screen's left/right edges, fires a 3-shot burst aimed at the player when in range.
- Pacing: lone Scout Pods to open, Cliff Turrets introduced midway, a tight cluster of both right before the boss.

**Stage 2 — Frostholt Reaches:**
- *Frost Walker* — moves in a zigzag weave, faster than Scout Pods, fires twin shots.
- *Snow Skimmer* — flies in V-formation groups of 3, dives toward the player's lane then retreats.
- Pacing: zigzag Frost Walkers first, then V-formation Skimmer squads, escalating to overlapping waves of both.

**Stage 3 — Scrapfleet Graveyard:**
- *Scavenger Drone* — small, fast, erratic movement, low HP but numerous (swarms of 4-6).
- *Salvage Bot* — tanky, slow-moving, fires a 5-shot fan spread.
- Pacing: dense Scavenger Drone swarms interleaved with occasional tanky Salvage Bots — the densest, fastest stage, feeding directly into the final boss.

**Overall escalation:** roughly +50% enemy density per stage, movement speed increases, attack patterns layer (single shot → multi-shot/formations → swarms + spread patterns). Exact numeric tuning stays fog, per the map.
