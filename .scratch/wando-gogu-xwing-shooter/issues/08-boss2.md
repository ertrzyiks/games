# Design the Stage 2 boss fight

Type: grilling
Status: resolved

## Question

What is the Stage 2 boss fight for the X-wing shooter (see [map.md](../map.md))?

Blocked on the stage-themes ticket ([02-stages.md](02-stages.md), boss should fit stage 2's setting) and the Gogu-skills ticket ([04-gogu-skills.md](04-gogu-skills.md), the boss's win-mechanic may lean on a Gogu skill). The user's explicit requirement: every boss needs a distinct, unique win-mechanic — a weak spot, attrition via massive HP, or a mechanic tied to a Gogu skill — and no two bosses should be won the same way, so check what [07-boss1.md](07-boss1.md) and [09-boss3.md](09-boss3.md) land on (if already resolved) to avoid repeating a mechanic. Kid-friendly: no blood or gore.

Resolve:
- What is the boss, visually/thematically, for stage 2?
- What is its unique win-mechanic (pick a different lane from whichever the other two bosses already used: weak spot, massive-HP attrition, or Gogu-skill-dependent — be specific about how it plays out)?
- What attack patterns does it have, and how do they escalate/phase as the fight progresses?
- As the middle boss, it should be clearly harder than stage 1's but leave room for stage 3 to top it.

Work it live with the user, one question at a time. Pair with `/prototype` if a quick rough mockup of the attack pattern would sharpen the discussion.

## Answer

**Frostclaw Walker** — a big quadruped mech striding across the ice field.

**Win-mechanic: massive-HP attrition.** No gimmick — a large health bar, constant movement/dodging required while chipping away damage. Two phases: phase 2 kicks in at 50% HP, where it moves faster and adds a stomp-shockwave attack (a telegraphed radial burst to dodge). Clearly harder than the Canyon Turret (active movement + two phases vs. a stationary single-phase fight), but leaves room for the final boss to top it via the Gogu-skill mechanic.
