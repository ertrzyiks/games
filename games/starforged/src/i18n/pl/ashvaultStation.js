import { registerTranslations } from '../../engine/i18n.js'

/**
 * Polish translations for every static dialogue line in
 * worlds/ashvaultStation.js — NPC dialogue arrays, dialogue(state) branches,
 * and ctx.showDialogue(...) trigger lines (lore reveals, the Tamsin rescue
 * and Extractor sabotage quest beats, the boss lead-in, and onVictory).
 *
 * Dynamic battle combat-log lines are handled separately via the template
 * system in battle/battleScene.js and are intentionally not covered here.
 *
 * The world's display name ("Ashvault Station") is left untranslated as a
 * proper noun, so it has no entry below.
 */
registerTranslations('pl', {
  // --- Docking Approach: scrapRunner NPC ---
  [`Half these hulls were ships that tried running the Syndicate blockade. Didn't make it past the yard.`]:
    `Połowa tych kadłubów to statki, które próbowały przebić się przez blokadę Syndykatu. Nie przeszły dalej niż to złomowisko.`,
  [`Ashvault used to be a relay station before the Hollow Syndicate muscled in and started 'refining.'`]:
    `Ashvault było kiedyś stacją przekaźnikową, zanim Syndykat Hollow wepchnął się tu siłą i zaczął swoje „uszlachetnianie”.`,
  [`Keep off the grating near the gaps — some of it's rusted clean through to open space.`]:
    `Trzymaj się z daleka od rusztów blisko szczelin — część z nich przerdzewiała na wylot, prosto w otwartą przestrzeń.`,

  // --- Docking Approach: scrap cache trigger ---
  [`Wedged in a derelict hull, a sealed supply case.`]:
    `W wraku kadłuba, zaklinowana, zapieczętowana skrzynka zaopatrzeniowa.`,
  [`Found a medkit!`]:
    `Znaleziono apteczkę!`,

  // --- Habitation Ring: dockHand NPC (Free Tamsin quest) ---
  [`They've got one of ours chained up in the engine core restraint pit — Tamsin, from the scrap crews.`]:
    `Mają jedną z naszych zakutą w dole unieruchomień w jądrze silnika — Tamsin, z ekip złomowych.`,
  [`There's a release switch near her cell. Trip it before a trooper notices you.`]:
    `Przy jej celi jest przełącznik zwalniający. Uruchom go, zanim zauważy cię żołdak.`,
  [`Tamsin's resting easier thanks to you. Shouldn't have taken a stranger to get her out, but here we are.`]:
    `Dzięki tobie Tamsin odpoczywa spokojniej. Nie powinien być do tego potrzebny obcy, ale cóż, tak to wyszło.`,
  [`Mind the engine core deeper in — the foreman's keeping it locked tight for a reason.`]:
    `Uważaj głębiej w jądrze silnika — brygadzista trzyma je pod ścisłą kłódką i nie bez powodu.`,
  [`You actually got her out. I won't forget this — take what's left of our medical stock.`]:
    `Naprawdę ją wyciągnąłeś. Nie zapomnę tego — weź, co zostało z naszych zapasów medycznych.`,
  [`She's deep in the core, past the grated corridors. Watch for patrols on your way.`]:
    `Jest głęboko w jądrze, za korytarzami z rusztów. Uważaj na patrole w drodze.`,

  // --- Habitation Ring: technician NPC (Current Extractor quest) ---
  [`There's a device down in the core they call the Extractor. Built to pull the Current out of someone and hold it.`]:
    `W jądrze mają urządzenie, które nazywają Ekstraktorem. Zbudowane, by wyciągnąć z kogoś Prąd i go uwięzić.`,
  [`Gogu goes pale just hearing the word. Find their schematics console, confirm what it does before you touch anything.`]:
    `Gogu blednie na samo wspomnienie tej nazwy. Znajdź ich konsolę ze schematami, potwierdź, co to robi, zanim czegokolwiek dotkniesz.`,
  [`The Extractor's slag now, and the foreman with it. Whatever they meant to do to Gogu, it dies here.`]:
    `Ekstraktor to teraz złom, a brygadzista razem z nim. Cokolwiek planowali zrobić Gogu, umiera to tutaj.`,
  [`Skyreach Canopy is further out past the ridge — if the Syndicate was hunting this hard, they will be there too.`]:
    `Skyreach Canopy leży dalej, za grzbietem — jeśli Syndykat polował tak zapamiętale, będą tam też.`,
  [`You read the schematics? Then you know — that thing was built to drain Gogu dry, not just study the Current.`]:
    `Przeczytałeś schematy? Więc wiesz — to coś zbudowano, by wyssać Gogu do suchej nitki, a nie tylko badać Prąd.`,
  [`The vault blast door should answer to the console now. Finish it before the foreman calls in more troopers.`]:
    `Pancerne drzwi skarbca powinny teraz reagować na konsolę. Dokończ to, zanim brygadzista ściągnie więcej żołdaków.`,
  [`Find the console in the core's control chamber. Don't touch the Extractor itself until you know what it does.`]:
    `Znajdź konsolę w komorze kontrolnej jądra. Nie dotykaj samego Ekstraktora, dopóki nie wiesz, co on robi.`,

  // --- Habitation Ring: restingWorker NPC ---
  [`They work us the core in shifts and call it 'labor debt.' Debt to who, I keep asking.`]:
    `Zapędzają nas do jądra na zmiany i nazywają to „długiem pracy”. Komu ten dług, wciąż pytam.`,
  [`The foreman doesn't come up to the ring much anymore — too busy babysitting whatever they're building down there.`]:
    `Brygadzista rzadko już zagląda do pierścienia — zbyt zajęty pilnowaniem tego, co budują tam w dole.`,
  [`You've got a look about you. The Syndicate doesn't like strangers asking questions. Neither do I, until I know whose side you're on.`]:
    `Masz w sobie coś takiego. Syndykat nie lubi obcych zadających pytania. Ja też nie, dopóki nie wiem, po czyjej jesteś stronie.`,

  // --- Engine Core: ventTech NPC ---
  [`Core's running hotter every cycle since they brought that device online.`]:
    `Jądro rozgrzewa się coraz bardziej z każdym cyklem, od kiedy uruchomili to urządzenie.`,
  [`The foreman doesn't let anyone near the vault without the console's say-so. Smart, if you ask me — I've seen what's chained to it.`]:
    `Brygadzista nie wpuszcza nikogo w stronę skarbca bez zgody konsoli. Rozsądnie, jak mnie pytasz — widziałem, co jest do niego przykute.`,
  [`Watch the grated floors. Half of them haven't held a trooper's weight in months.`]:
    `Uważaj na ruszty w podłodze. Połowa z nich nie utrzymała ciężaru żołdaka od miesięcy.`,

  // --- Engine Core: tamsin NPC ---
  [`Go on — find the dock hand by the ring door, he'll want to know I'm out.`]:
    `Idź już — znajdź dokera przy drzwiach pierścienia, będzie chciał wiedzieć, że jestem wolna.`,
  [`I won't forget who pulled that clamp.`]:
    `Nie zapomnę, kto zwolnił tę klamrę.`,
  [`They've had this restraint field locked since the strike. Can't so much as sit up straight.`]:
    `Mają to pole unieruchamiające zablokowane od czasu strajku. Nie mogę się nawet wyprostować.`,
  [`There's a release switch on the wall south of here — if you can reach it without a trooper seeing...`]:
    `Na ścianie na południe stąd jest przełącznik zwalniający — jeśli zdołasz go dosięgnąć, żeby nie zauważył żołdak...`,

  // --- Engine Core: Tamsin-freed trigger ---
  [`You yank the restraint clamp release. The field drops — Tamsin stumbles free, rubbing her wrists.`]:
    `Pociągnąłeś za zwolnienie klamry unieruchamiającej. Pole opada — Tamsin wypada na wolność, trąc nadgarstki.`,
  [`"Go, before they notice! I'll find my own way out."`]:
    `„Idź, zanim zauważą! Sama znajdę wyjście.”`,

  // --- Engine Core: schematics console / Extractor confirmed trigger ---
  [`The console lights up with schematics — a Current Extractor, keyed to a single signature. Gogu's.`]:
    `Konsola rozświetla się schematami — Ekstraktor Prądu, dostrojony do jednej, konkretnej sygnatury. Gogu.`,
  [`Gogu grips Wando's sleeve. "That's... that's for me. They built that for me."`]:
    `Gogu zaciska palce na rękawie Wando'a. „To... to jest dla mnie. Zbudowali to dla mnie.”`,
  [`The blast door down the corridor should answer to this console now.`]:
    `Pancerne drzwi w głębi korytarza powinny teraz reagować na tę konsolę.`,

  // --- Engine Core: blast door chokepoint trigger ---
  [`A sealed blast door. A console readout blinks: SCHEMATICS VERIFICATION REQUIRED.`]:
    `Zapieczętowane drzwi pancerne. Wyświetlacz konsoli mruga: WYMAGANA WERYFIKACJA SCHEMATÓW.`,
  [`Whatever's through there, the station won't open it without proof you know what it is.`]:
    `Co by tam nie było, stacja nie otworzy tego bez dowodu, że wiesz, co to jest.`,

  // --- Extractor Vault: boss lead-in ---
  [`The corridor opens into a vaulted chamber humming with contained Current — the Extractor, half-built, chained in conduits.`]:
    `Korytarz otwiera się na sklepioną komorę, pulsującą uwięzionym Prądem — Ekstraktor, w połowie zbudowany, oplątany przewodami.`,
  [`Beside it, the Syndicate Foreman turns from the controls, ember-lit visor fixed on you.`]:
    `Obok niego brygadzista Syndykatu odwraca się od sterów, wizjer rozświetlony żarem wpatrzony w ciebie.`,
  [`"Scrap and a boy," he growls. "The device stays. You don't."`]:
    `„Złom i chłopak” — warczy. „Urządzenie zostaje. Wy nie.”`,
  [`Wando steps between him and Gogu, plate grinding against the deck. "Try it."`]:
    `Wando staje między nim i Gogu, płyty zbroi skrzypią o pokład. „Spróbuj.”`,

  // --- Extractor Vault: boss onVictory ---
  [`The Foreman crashes against the conduits — the Extractor sparks, cracks, and dies in a shower of slag.`]:
    `Brygadzista wali się na przewody — Ekstraktor iskrzy, trzeszczy i gaśnie w deszczu żużlu.`,
  [`Gogu exhales, shoulders dropping like a held breath finally let go. "It's gone quiet. Whatever it wanted from me... it's gone."`]:
    `Gogu wypuszcza powietrze, ramiona opadają jak wstrzymywany od dawna oddech. „Zrobiło się cicho. Czegokolwiek ono chciało ze mnie... już go nie ma.”`,
  [`Wando lowers his hammer. "Then Ashvault's done with us. Skyreach Canopy waits past the ridge — let's see what else the Syndicate's reaching for."`]:
    `Wando opuszcza młot. „Więc Ashvault ma już z nami koniec. Skyreach Canopy czeka za grzbietem — zobaczmy, po co jeszcze sięga Syndykat.”`,
  [`Head back to the Starskiff to set course for Skyreach Canopy.`]:
    `Wróć na Starskiff, by wytyczyć kurs na Skyreach Canopy.`,
})
