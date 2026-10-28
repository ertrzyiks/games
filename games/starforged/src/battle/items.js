/**
 * Medkit/elixir math shared between in-battle use (battleScene.js) and
 * out-of-battle use (heroScreen.js), so both apply the exact same amount
 * and HP cap / buff clamping rather than keeping two copies of the formula.
 *
 * MEDKIT_HEAL_AMOUNT is deliberately kept well above a typical non-boss
 * enemy hit (roughly 10-25 damage across the game's five chapters) so one
 * medkit reliably outheals the damage from the attack that just landed,
 * rather than merely softening it.
 *
 * Both elixirs' effect is a 3-turn statusEffect (see battleScene.js's
 * _applyStatus/_effectiveAtk/_effectiveDef): the Attack Elixir raises ATK
 * (`boostAtk`), the Resistance Elixir raises DEF (`boostDef`). Drinking one
 * outside battle queues the exact same buff via queueElixirBuff() instead
 * of applying anything immediately - battleScene.enter() wipes every party
 * member's statusEffects at the start of each fight, so it applies any
 * queued buffs right after that wipe, then clears the queue, giving the
 * buff to the party's very next fight instead of losing it entirely.
 */
export const MEDKIT_HEAL_AMOUNT = 35
export const ELIXIR_ATK_BOOST = 9
export const ELIXIR_DEF_BOOST = 4
export const ELIXIR_DURATION = 3

// Shop prices (see scenes/shopScene.js) - shared here so the wiki's
// generated item descriptions can quote the same numbers instead of a
// hand-copied duplicate.
export const MEDKIT_PRICE = 15
export const ATK_ELIXIR_PRICE = 20
export const RESIST_ELIXIR_PRICE = 20

export function healWithMedkit(unit) {
  const before = unit.hp
  unit.hp = Math.min(unit.maxHp, unit.hp + MEDKIT_HEAL_AMOUNT)
  return unit.hp - before
}

// `type` is 'boostAtk' (Attack Elixir, inventory key 'tonic') or
// 'boostDef' (Resistance Elixir, inventory key 'resistTonic'). Replaces any
// already-queued buff of the same type for this member instead of
// stacking duplicates, mirroring _applyStatus's own refresh-not-stack
// behavior for in-battle status effects.
export function queueElixirBuff(state, memberKey, type) {
  const power = type === 'boostAtk' ? ELIXIR_ATK_BOOST : ELIXIR_DEF_BOOST
  const pending = (state.pendingBuffs || []).filter((b) => !(b.memberKey === memberKey && b.type === type))
  pending.push({ memberKey, type, duration: ELIXIR_DURATION, power })
  state.pendingBuffs = pending
}
