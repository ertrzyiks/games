import { registerTranslations } from '../../engine/i18n.js'

// Shared UI chrome (title/ship/battle menus, HUD, footer hint) plus the
// base move/enemy display names defined in the foundation files
// (battle/moves.js, battle/enemies.js). Per-world dialogue/content
// translations live in their own sibling files (rustmoor.js etc.) —
// kept separate so this file and those never touch the same lines.
registerTranslations('pl', {
  // Title screen
  Continue: 'Kontynuuj',
  'New Game': 'Nowa Gra',
  Language: 'Język',
  'a tale of the Drift': 'opowieść Dryfu',

  // Ship / pause screen
  Travel: 'Podróż',
  'Quest Log': 'Dziennik Zadań',
  Close: 'Zamknij',
  'A: Select   B: Close': 'A: Wybierz   B: Zamknij',
  'Select a world': 'Wybierz świat',
  'No worlds unlocked yet.': 'Żaden świat nie został jeszcze odblokowany.',
  'A: Travel   B: Back': 'A: Podróż   B: Wstecz',
  'No quests yet. Talk to people!': 'Brak zadań. Porozmawiaj z kimś!',
  '[done]': '[gotowe]',
  'A/B: Back': 'A/B: Wstecz',

  // Battle chrome
  and: 'i',
  '{names} appeared!': 'Pojawia się: {names}!',
  'Choose target': 'Wybierz cel',
  'A: ok  B: back': 'A: ok  B: wstecz',
  'Medkit x{count}': 'Apteczka x{count}',
  '{name} Lv{level}': '{name} Poz.{level}',
  '{name} uses a medkit and recovers {amount} HP!': '{name} używa apteczki i odzyskuje {amount} PŻ!',
  '{name} guards.': '{name} przyjmuje postawę obronną.',
  '{name} uses {move}, guarding and restoring {amount} focus!':
    '{name} używa: {move}, broniąc się i odzyskując {amount} skupienia!',
  '{name} uses {move} on {target}, healing {amount} HP!': '{name} używa: {move} na {target}, lecząc {amount} PŻ!',
  '{name} uses {move} but misses!': '{name} używa: {move}, ale chybia!',
  '{name} uses {move}! {target} takes {dmg} damage.': '{name} używa: {move}! {target} otrzymuje {dmg} obrażeń.',
  '{name} drains {amount} HP!': '{name} wysysa {amount} PŻ!',
  '{target} is defeated!': '{target} zostaje pokonany!',
  'Victory! Gained {xp} XP.': 'Zwycięstwo! Zdobyto {xp} PD.',
  '{name} leveled up to Lv.{level}!': '{name} awansuje na poziom {level}!',
  'Your party has fallen...': 'Twoja drużyna poległa...',

  // Footer control hint (index.html)
  'Arrows/WASD to move · Z/Enter = A · X/Esc = B': 'Strzałki/WASD - ruch · Z/Enter = A · X/Esc = B',

  // Base moves (battle/moves.js)
  Strike: 'Uderzenie',
  'Forge Slam': 'Kuźniany Cios',
  Guard: 'Osłona',
  Push: 'Pchnięcie',
  Mend: 'Ulecz',
  'Rusty Slash': 'Zardzewiałe Cięcie',
  Glimmer: 'Błysk',
  'Heavy Slam': 'Ciężki Cios',
  Drain: 'Wyssanie',
  Rally: 'Mobilizacja',

  // Base enemy (battle/enemies.js)
  'Rustmoor Scavenger': 'Padlinożerca z Rustmoor',
})
