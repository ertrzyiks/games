# Design Gogu's special skill(s)

Type: grilling
Status: resolved

## Question

What are Gogu's special skill(s) in the X-wing shooter (see [map.md](../map.md)), and how do they work?

The user's framing: "Gogu should have some special skills that help the X-wing somehow" (plural skills explicitly allowed, not necessarily just one). This ticket is not blocked by engine selection — it's a game-design decision first, implementation follows. It does, however, feed the three boss-design tickets, since the user said a boss's win-mechanic could be tied to a Gogu skill — so resolve this one before (or alongside) the boss tickets ([07](07-boss1.md), [08](08-boss2.md), [09](09-boss3.md)).

Resolve:
- How many distinct skills does Gogu have for v1 (one is fine; more is allowed if it doesn't bloat scope for a v1)?
- What does each skill do mechanically (e.g. screen-clearing blast, temporary shield, slow-time, homing shots)? Keep it kid-friendly — no gore, consistent with the map's Notes.
- How is each skill charged/triggered (cooldown timer vs. a meter filled by play, e.g. destroying enemies or collecting pickups) and how does the player trigger it (ties into the control-scheme ticket's dedicated skill input, [03-controls.md](03-controls.md))?
- Any visual/feedback requirement for when a skill is active.

Work it live with the user, one question at a time.

## Answer

Two skills, both kid-friendly ("Force" nudges, not weapons):

1. **Force Nudge** (small skill) — Gogu deflects incoming enemy shots within a small radius around the X-wing for ~2 seconds; projectiles harmlessly veer away instead of hitting. Charges on a flat cooldown (ready every ~8 seconds, no play required) — a safety net the player can lean on reactively. Triggered by a tap on the dedicated Gogu button.
2. **Force Wave** (big skill) — a radial push that instantly clears small/weak enemies and deflects all projectiles (including boss shots) in a wide radius around the ship. Charges via a separate meter filled only by destroying enemies (not passive) — rewards active play. Triggered by a long-press (~400ms hold) of the same Gogu button, only usable once that meter is full. This is the skill bosses can gate behind (see boss tickets).

Visual feedback: a soft blue glow/ring expands from the ship when either skill fires (bigger/brighter for Force Wave); the Gogu button shows two stacked fill-rings (cooldown ring for Force Nudge, charge-meter ring for Force Wave) so the player always sees both states at a glance.
