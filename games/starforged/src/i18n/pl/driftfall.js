/**
 * Polish translations for Driftfall world dialogue (games/starforged/src/worlds/driftfall.js).
 *
 * Keys are exact-match source strings from driftfall.js; dialogue.js runs every
 * line shown to the player through t(), so registering them here is enough -
 * no changes to the world file itself are needed.
 *
 * Deliberately NOT translated:
 *  - The world name 'Driftfall' and map segment names - proper nouns.
 *  - Enemy/boss display names - not dialogue text, out of scope.
 */
import { registerTranslations } from '../../engine/i18n.js'

registerTranslations('pl', {
  // Map segment names, shown in the HUD as "Driftfall - {name}".
  'Void Approach': 'Podejście Pustki',
  'Citadel Halls': 'Korytarze Cytadeli',
  'Command Sanctum': 'Sanktuarium Dowodzenia',

  // --- voidApproach: Kessa ---
  'Kessa: You made it through the Hollow? Then you felt it too - that signal.':
    'Kessa: Przeszedłeś przez Czeluść? Więc też to poczułeś — ten sygnał.',
  "Kessa: Find the array still broadcasting it, deeper in the wreckage. I'll meet you past the airlock.":
    'Kessa: Znajdź instalację, która go wciąż nadaje, głębiej w wraku. Spotkamy się za śluzą.',
  "Kessa: You found it. Whatever's calling, it's close now.": 'Kessa: Znalazłeś ją. Cokolwiek woła, jest już blisko.',
  'Kessa: The airlock north of here leads in. Stay sharp.': 'Kessa: Śluza na północy prowadzi do środka. Miej się na baczności.',
  "Kessa: Somewhere out past the debris - an array, still lit. Find it.":
    'Kessa: Gdzieś za gruzowiskiem — instalacja, wciąż podświetlona. Znajdź ją.',

  // --- voidApproach: Soren's side quest ---
  "Soren: My own crate's wedged under a strut since we crashed through. Can't budge it alone.":
    'Soren: Moja skrzynka utknęła pod dźwigarem, odkąd się tu rozbiliśmy. Sam jej nie ruszę.',
  'Soren: Pry it loose and we split what survived?': 'Soren: Wyciągniesz ją? Podzielimy się tym, co przetrwało.',
  "Soren: Still can't believe any of that made it through the crash.": 'Soren: Wciąż nie wierzę, że cokolwiek z tego przetrwało rozbicie.',
  'Soren: Under the strut, east of here.': 'Soren: Pod dźwigarem, na wschód stąd.',

  // --- voidApproach: secret + triggers ---
  'The broken strut shifts loose - a sealed cache!': 'Złamany dźwigar się przesuwa — zapieczętowana skrytka!',
  'Found a medkit and a Resistance Elixir!': 'Znaleziono apteczkę i Eliksir Odporności!',
  'The array is still warm, still broadcasting - not Syndicate make at all.':
    'Instalacja wciąż jest ciepła, wciąż nadaje — to w ogóle nie technologia Syndykatu.',
  "Wando: \"Whatever this is, it's older than the Hollow.\" (+10 credits)":
    'Wando: "Cokolwiek to jest, jest starsze niż Czeluść." (+10 kredytów)',
  "The strut gives way - Soren's crate, battered but sealed!": 'Dźwigar ustępuje — skrzynka Sorena, poobijana, ale zapieczętowana!',
  'Soren splits the surviving stock with you. (+12 credits)': 'Soren dzieli się z tobą ocalałym zapasem. (+12 kredytów)',

  // --- citadelHalls: Tomas ---
  "Tomas: Careful. Whatever's running this place isn't Syndicate command.":
    'Tomas: Uważaj. Cokolwiek rządzi tym miejscem, to nie dowództwo Syndykatu.',
  "Tomas: Null Herald's gone quiet. First real quiet I've felt in years.":
    'Tomas: Herold Pustki ucichł. Pierwsza prawdziwa cisza od lat.',
  'Tomas: That array - I felt it the moment you activated it. Something old just woke up.':
    'Tomas: Ta instalacja — poczułem ją, gdy tylko ją uruchomiłeś. Coś starego się obudziło.',
  "Tomas: The Sanctum's north of here. Go carefully. (+10 credits)":
    'Tomas: Sanktuarium jest na północ stąd. Idź ostrożnie. (+10 kredytów)',
  "Tomas: The Sanctum's north of here. Go carefully.": 'Tomas: Sanktuarium jest na północ stąd. Idź ostrożnie.',
  'Tomas: Kessa sent you? Good. Find that signal source.': 'Tomas: Kessa cię przysłała? Dobrze. Znajdź źródło sygnału.',

  // --- citadelHalls: Ren (merchant) ---
  'Ren: Even out here, a merchant finds a way.': 'Ren: Nawet tutaj, kupiec znajdzie sposób.',
  'Ren: Medkits and elixirs, same as anywhere in the Drift.': 'Ren: Apteczki i eliksiry, tak jak wszędzie w Drifcie.',

  // --- commandSanctum: boss lead-in ---
  'The corridor opens on a chamber with no walls that stay still - light bends wrong here.':
    'Korytarz otwiera się na komnatę, której ściany się nie trzymają w miejscu — światło wygina się tu niewłaściwie.',
  'At its center, a shape that is not quite a shape at all turns to face you.':
    'Pośrodku, kształt, który nie do końca jest kształtem, odwraca się ku wam.',
  '"EVERY CURRENT RETURNS TO ITS SOURCE," it says, in a voice like static. "YOU WILL TOO."':
    '"KAŻDY NURT WRACA DO ŹRÓDŁA," mówi głosem jak trzask zakłóceń. "WY TEŻ WRÓCICIE."',
  'Gogu grips Wando\'s arm. "That\'s what the Syndicate was listening to, all along."':
    'Gogu zaciska dłoń na ramieniu Wando. "To właśnie tego cały czas słuchał Syndykat."',

  // --- commandSanctum: boss onVictory ---
  'The Herald unravels into drifting motes of light, and the static finally goes quiet.':
    'Herold rozpływa się w unoszące się drobiny światła, a trzask zakłóceń wreszcie cichnie.',
  "Salvaging what's left of the flagship is worth a fortune back at the Starskiff. (+60 credits)":
    'Odzyskane resztki flagowca są warte fortunę po powrocie na Starskiffa. (+60 kredytów)',
  'Gogu breathes out, slow. "It\'s not angry anymore. It\'s just... tired. Like it\'s been running a long time."':
    'Gogu powoli wypuszcza powietrze. "Już się nie złości. Jest po prostu... zmęczony. Jakby uciekał bardzo długo."',
  'Wando lowers his shield. "Then let it rest. We\'re done hunting, and so is it."':
    'Wando opuszcza tarczę. "Więc niech odpocznie. Skończyliśmy z polowaniem, on też."',
  "Rell, Vex, Kessa, Tomas, Soren - everyone this road ever crossed - get to wake up tomorrow without the Syndicate watching.":
    'Rell, Vex, Kessa, Tomas, Soren — każdy, kogo ta droga kiedykolwiek spotkała — obudzi się jutro bez Syndykatu patrzącego im na plecy.',
  '"Come on, Gogu," Wando says. "Let\'s go see what the Drift looks like, now that nothing\'s hunting it."':
    '"Chodź, Gogu," mówi Wando. "Zobaczmy, jak wygląda Drift, teraz gdy nic już na niego nie poluje."',
  'THE END — head back to the Starskiff to revisit any world of the Drift.':
    'KONIEC — wróć na Starskiff, by ponownie odwiedzić każdy świat Driftu.',
})
