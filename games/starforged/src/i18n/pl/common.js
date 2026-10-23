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

  // Game Over screen
  'GAME OVER': 'KONIEC GRY',
  'Wando and Gogu were overwhelmed.': 'Wando i Gogu zostali pokonani.',
  'Press A to continue': 'Naciśnij A, aby kontynuować',
  'Press A to retry': 'Naciśnij A, aby spróbować ponownie',
  'A: Retry   B: Give up': 'A: Ponów   B: Poddaj się',

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
  Sound: 'Dźwięk',
  On: 'Wł.',
  Off: 'Wył.',

  // HUD (top-right overworld readout)
  '{amount}cr': '{amount}kr',

  // Shop (merchant NPCs)
  Shop: 'Sklep',
  'Credits: {amount}': 'Kredyty: {amount}',
  'Medkit — {price}cr': 'Apteczka — {price}kr',
  'Attack Elixir — {price}cr': 'Eliksir Ataku — {price}kr',
  'Resistance Elixir — {price}cr': 'Eliksir Odporności — {price}kr',
  Leave: 'Wyjdź',
  'Not enough credits.': 'Niewystarczająca liczba kredytów.',
  'Bought a {item}!': 'Kupiono: {item}!',
  Medkit: 'Apteczka',
  'Attack Elixir': 'Eliksir Ataku',
  'Resistance Elixir': 'Eliksir Odporności',
  'A: Buy   B: Leave': 'A: Kup   B: Wyjdź',

  // Hero screen
  Heroes: 'Bohaterowie',
  Moves: 'Ataki',
  Back: 'Wstecz',
  'A: Select   B: Back': 'A: Wybierz   B: Wstecz',
  'HP {hp}/{maxHp}  Focus {focus}/{maxFocus}': 'PŻ {hp}/{maxHp}  Skupienie {focus}/{maxFocus}',
  'Already at full HP.': 'Już przy pełnym PŻ.',
  '{name} recovers {amount} HP!': '{name} odzyskuje {amount} PŻ!',
  '{name} will start the next fight with Attack raised!': '{name} rozpocznie następną walkę ze zwiększonym Atakiem!',
  '{name} will start the next fight with Defense raised!': '{name} rozpocznie następną walkę ze zwiększoną Obroną!',
  '{name}: Equipped Moves': '{name}: Wybrane Ataki',
  '-- empty --': '-- brak --',
  'A: Assign   B: Back': 'A: Przypisz   B: Wstecz',
  'Known Moves': 'Poznane Ataki',
  'A: Swap   B: Back': 'A: Zamień   B: Wstecz',
  equipped: 'wybrany',

  // Travel minigame
  'Asteroid run!': 'Lot przez asteroidy!',
  'Remaining: {n}': 'Pozostało: {n}',

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
  '{target} is weak to this attack!': '{target} jest wrażliwy na ten atak!',
  '{target} resists this attack!': '{target} jest odporny na ten atak!',
  '{target} is defeated!': '{target} zostaje pokonany!',
  'Victory! Gained {xp} XP.': 'Zwycięstwo! Zdobyto {xp} PD.',
  '{name} leveled up to Lv.{level}!': '{name} awansuje na poziom {level}!',
  '{name} is revived with {amount} HP!': '{name} zostaje ocucony z {amount} PŻ!',
  '{name} learned {move}!': '{name} poznaje: {move}!',
  '{target} is {status}!': '{target}: {status}!',
  burned: 'poparzony',
  poisoned: 'zatruty',
  '{name} takes {dmg} {status} damage!': '{name} otrzymuje {dmg} obrażeń ({status})!',
  burn: 'poparzenie',
  poison: 'trucizna',
  '{name} drinks an Attack Elixir! Attack rises.': '{name} wypija Eliksir Ataku! Atak wzrasta.',
  '{name} drinks a Resistance Elixir! Defense rises.': '{name} wypija Eliksir Odporności! Obrona wzrasta.',
  'Attack Elixir x{count}': 'Eliksir Ataku x{count}',
  'Resistance Elixir x{count}': 'Eliksir Odporności x{count}',
  'Your party has been defeated...': 'Twoja drużyna została pokonana...',

  // Footer control hint (index.html)
  'Arrows/WASD to move · Z/Enter = A · X/Esc = B': 'Strzałki/WASD - ruch · Z/Enter = A · X/Esc = B',

  // Base moves (battle/moves.js) - still used by various enemies
  Strike: 'Uderzenie',
  'Forge Slam': 'Kuźniany Cios',
  Guard: 'Osłona',
  'Rusty Slash': 'Zardzewiałe Cięcie',
  'Heavy Slam': 'Ciężki Cios',
  Drain: 'Wyssanie',
  Rally: 'Mobilizacja',

  // Wando's kit (blaster-themed)
  'Pistol Shot': 'Strzał z Pistoletu',
  'Rifle Shot': 'Strzał z Karabinu',
  Flamethrower: 'Miotacz Ognia',
  'Trick Shot': 'Rykoszet',
  'Grenade Toss': 'Rzut Granatem',

  // Gogu's kit (Force-themed)
  'Force Push': 'Pchnięcie Mocą',
  'Force Heal': 'Uzdrowienie Mocą',
  'Force Heal+': 'Uzdrowienie Mocą+',
  'Force Spark': 'Iskra Mocy',

  // Base enemy (battle/enemies.js)
  'Rustmoor Scavenger': 'Szabrownik z Rustmoor',
})
