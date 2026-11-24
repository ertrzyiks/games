# Design the hero roster

Type: grilling
Status: resolved

## Question

5 heroes per side, one player-controlled (per the user's explicit requirement). What are they,
and what does each do? Keep it to the "simplified v1" bar: 1-2 abilities per hero, kid-friendly,
no blood/gore. Heroes can fly (unlike creeps, which are land-only) — decide what that means
mechanically.

## Answer

**Mirror-match roster:** both teams field the same 5 hero roles, reskinned per team color (ally =
blue, enemy = red), so AI, stats, and ability logic are fully shared code between teams — the only
difference is which team's nearest-enemy logic a hero/creep uses. This is a deliberate
simplification: it halves the design/implementation surface while still giving 5 distinct heroes
per side.

1. **Vanguard** (**Wando** — the player's hero on the ally side). Melee, highest HP of the five.
   Ability *Guard Up*: briefly reduces incoming damage (self-buff), short cooldown.
2. **Mystic** (**Gogu** on the ally side). Ranged magic basic attack. Ability *Pulse Wave*: a
   small AoE burst of damage + knockback centered on self.
3. **Marksman**. Ranged basic attack, highest damage, lowest HP. Ability *Piercing Shot*: a single
   high-damage shot at the nearest target, on cooldown.
4. **Skirmisher**. Fast melee flanker. Ability *Dash Strike*: dashes to the nearest target and
   deals bonus damage on arrival, on cooldown.
5. **Sentinel**. Tanky melee. Ability *Fortify*: grants self a temporary damage-absorbing shield
   (flat amount), short cooldown.

**Flight:** all heroes move freely in full 3D space (not locked to the lane's ground path the way
creeps are) — in practice, a hover height and direct point-to-point movement, unconstrained by the
lane geometry. This is what distinguishes them from creeps mechanically, not a separate
fly/land toggle — keeps v1 simple.

**Player's hero:** Wando (Vanguard). The other 4 ally heroes (Mystic/Gogu, Marksman, Skirmisher,
Sentinel) are AI-controlled, as are all 5 enemy heroes — see
[05-ai-behavior.md](05-ai-behavior.md).
