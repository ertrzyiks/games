# Design the AI behavior shared by creeps and bot-controlled heroes

Type: grilling
Status: resolved

## Question

9 of the 10 heroes (4 allies + 5 enemies) and every creep are computer-controlled. What's the
actual behavior rule? Simplified v1 bar: basic "chase nearest enemy and attack," explicitly not
sophisticated pathfinding or retreat logic.

## Answer

One shared behavior loop, used by creeps and every AI hero alike (heroes additionally use their
ability on cooldown; creeps have no ability):

1. Look for the nearest enemy unit (creep, hero, tower, or base — whichever is closest) within an
   aggro radius.
2. If one exists: move toward it; once within attack range, stop and attack it (basic auto-attack
   on a fixed interval) instead of advancing.
3. If none exists: advance along the lane toward the enemy base (for creeps, this means following
   the lane path; for AI heroes, moving directly toward a point further down the lane, since heroes
   aren't path-constrained — see [02-heroes.md](02-heroes.md)).
4. (Heroes only) if an enemy is in range and the hero's ability is off cooldown, use it on that
   same nearest-enemy target.

No retreat-at-low-HP logic, no target prioritization beyond distance, no group coordination — this
is intentionally the simplest rule that produces a lane push, matching the user's explicit scope
call. Hero death/respawn is covered in [04-towers-base.md](04-towers-base.md).
