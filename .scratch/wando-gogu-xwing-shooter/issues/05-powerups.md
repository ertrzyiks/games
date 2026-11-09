# Design power-up types and rules

Type: grilling
Status: resolved

## Question

What power-up types exist in the X-wing shooter (see [map.md](../map.md)), and what are the rules around them?

Already decided on the map: power-ups are in-run pickups only — nothing persists or stacks across runs, no leveling, no inventory. This ticket fixes what happens *within* a run/stage.

Resolve:
- What power-up types exist for v1 (e.g. weapon upgrade/spread shot, temporary shield, speed boost, extra life — pick a small v1 set, not an exhaustive catalogue)?
- How do they spawn (dropped by enemies? floating pickups in the level? both?) and how common are they?
- Do they stack within a single run (e.g. picking up the same weapon upgrade twice), and do they expire (timed buff vs. permanent-for-the-stage vs. permanent-for-the-run but lost on death)?
- Any power-up that interacts with Gogu's skill(s) (coordinate with [04-gogu-skills.md](04-gogu-skills.md) if useful, but don't block on it).

Work it live with the user, one question at a time.

## Answer

Three power-up types for v1:

1. **Twin Blaster** — upgrades auto-fire: base (1 shot) → twin (2 parallel shots) → triple spread (3 shots) on a second pickup. Caps at triple; further pickups while maxed are just wasted (no harm, but no further effect).
2. **Shield Orb** — grants a one-hit shield bubble that absorbs the next hit then pops. Doesn't stack; picking up another while shielded just refreshes the timer, it never doubles up.
3. **Meter Charge** — instantly adds a chunk of charge to Gogu's Force Wave meter (see [04-gogu-skills.md](04-gogu-skills.md)).

Spawn rule: enemies have roughly a 1-in-6 chance to drop one on destruction; a few also float freely in open stretches between waves. Pickups drift down with the scroll and despawn if they scroll off the bottom edge uncollected.

Lifetime: all three are run-scoped only, per the map's "no cross-run accumulation" rule — see [11-lives.md](11-lives.md) for what resets on death (weapon level and shield both reset on respawn).
