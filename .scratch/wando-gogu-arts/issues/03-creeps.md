# Design the creep (mob) type and wave behavior

Type: grilling
Status: resolved

## Question

"Computer-controlled mobs trying to defeat towers and the base" — what are they, how do they
spawn, and how do they behave? Land units only (per the user's explicit requirement — only heroes
fly). Simplified v1 bar: basic "chase nearest enemy and attack" AI.

## Answer

One creep type for v1, symmetric for both teams: **Grunt** — basic melee land unit, moderate
HP/damage, always locked to the ground and restricted to moving along the single lane's path
(this is the mechanical meaning of "land unit," in contrast to heroes' free 3D movement).

- **Spawning:** both bases spawn a wave of 3 Grunts every ~15s, for their own team, for as long as
  their base stands.
- **Behavior:** advance along the lane toward the enemy base by default. If an enemy unit (creep,
  hero, tower, or base) comes within aggro range, move to the nearest one and attack once in attack
  range, instead of continuing to advance. No retreat logic, no target prioritization beyond
  "nearest" — this is the explicit "simplified v1" bar, shared with hero AI (see
  [05-ai-behavior.md](05-ai-behavior.md)).
- Creeps are valid targets for everything (other creeps, heroes, towers) and can damage anything
  in range the same way.
