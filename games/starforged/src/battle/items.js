/**
 * Medkit/tonic math shared between in-battle use (battleScene.js) and
 * out-of-battle use (heroScreen.js), so both apply the exact same amount
 * and HP/Focus-cap clamping rather than keeping two copies of the formula.
 *
 * Tonic's in-battle effect (a temporary ATK buff, see battleScene.js's
 * TONIC_ATK_BOOST/_applyStatus) is implemented as a statusEffect, and
 * battleScene.enter() wipes every party member's statusEffects at the
 * start of each fight — so a buff "drunk" in the overworld would already
 * be gone before the next battle even started. Restoring Focus instead
 * keeps a tonic useful outside battle without needing a persistent
 * buff-tracking mechanism just for this.
 *
 * MEDKIT_HEAL_AMOUNT is deliberately kept well above a typical non-boss
 * enemy hit (roughly 10-25 damage across the game's five chapters) so one
 * medkit reliably outheals the damage from the attack that just landed,
 * rather than merely softening it.
 */
export const MEDKIT_HEAL_AMOUNT = 35
export const TONIC_FOCUS_RESTORE_AMOUNT = 6

// Shop prices (see scenes/shopScene.js) - shared here so the wiki's
// generated item descriptions can quote the same numbers instead of a
// hand-copied duplicate.
export const MEDKIT_PRICE = 15
export const TONIC_PRICE = 20

export function healWithMedkit(unit) {
  const before = unit.hp
  unit.hp = Math.min(unit.maxHp, unit.hp + MEDKIT_HEAL_AMOUNT)
  return unit.hp - before
}

export function restoreFocusWithTonic(unit) {
  const before = unit.focus
  unit.focus = Math.min(unit.maxFocus, unit.focus + TONIC_FOCUS_RESTORE_AMOUNT)
  return unit.focus - before
}
