import { registerTranslations } from '../../engine/i18n.js'

/**
 * Polish translations for every static dialogue line in
 * worlds/ashvaultStation.js — NPC dialogue arrays, dialogue(state) branches,
 * and ctx.showDialogue(...) trigger lines (lore reveals, the Tamsin rescue
 * and Extractor sabotage quest beats, the boss lead-in, and onVictory).
 * Dialogue is kept short (1-2 lines per interaction, 3 for the boss) to
 * match the trimmed English source.
 *
 * Dynamic battle combat-log lines are handled separately via the template
 * system in battle/battleScene.js and are intentionally not covered here.
 *
 * The world's display name ("Ashvault Station") is left untranslated as a
 * proper noun, so it has no entry below. Hero names "Wando" and "Gogu" are
 * also left as-is.
 */
registerTranslations('pl', {
  // Map segment names, shown in the HUD as "Ashvault Station - {name}".
  'Docking Approach': 'Podejście do Doku',
  'Habitation Ring': 'Pierścień Mieszkalny',
  'Engine Core': 'Rdzeń Silnika',
  'Extractor Vault': 'Skarbiec Ekstraktora',

  // --- Docking Approach: scrapRunner NPC ---
  [`Ships that ran the blockade didn't make it past this yard.`]:
    `Statki, które próbowały przełamać blokadę, skończyły tutaj.`,
  [`Mind the grating — some of it's rusted clean through.`]:
    `Uważaj na ruszty — część przerdzewiała na wylot.`,
  [`That support pillar near the middle sounds hollow when you knock it.`]:
    `Ten filar podporowy na środku brzmi głucho, gdy się go uderzy.`,
  [`The pillar panel pops loose — a smuggler stash!`]:
    `Panel w filarze odskakuje — skrytka przemytników!`,
  [`Found a medkit and a tonic!`]: `Znaleziono apteczkę i eliksir!`,

  // --- Docking Approach: scrap cache trigger ---
  [`A sealed supply case, wedged in the wreckage.`]:
    `Zapieczętowana skrzynka zaklinowana w wraku.`,
  [`Found a medkit!`]:
    `Znaleziono apteczkę!`,

  // --- Habitation Ring: dockHand NPC (Free Tamsin quest) ---
  [`They've chained Tamsin in the engine core.`]:
    `Zakuli Tamsin w jądrze silnika.`,
  [`Find the release switch and free her.`]:
    `Znajdź przełącznik i uwolnij ją.`,
  [`Thanks to you, Tamsin's safe now.`]:
    `Dzięki tobie Tamsin jest już bezpieczna.`,
  [`Watch yourself deeper in the core.`]:
    `Uważaj głębiej w jądrze.`,
  [`You freed her. I won't forget it.`]:
    `Uwolniłeś ją. Nie zapomnę tego.`,
  [`She's deep in the core — watch for patrols.`]:
    `Jest głęboko w jądrze — uważaj na patrole.`,

  // --- Habitation Ring: technician NPC (Current Extractor quest) ---
  [`They built a device to drain Gogu's Current.`]:
    `Zbudowali urządzenie, by wyssać Prąd z Gogu.`,
  [`Find the schematics console and confirm it.`]:
    `Znajdź konsolę ze schematami i to potwierdź.`,
  [`The Extractor's slag now — it's over.`]:
    `Ekstraktor to już złom — koniec z tym.`,
  [`Skyreach Canopy's next. They'll be there too.`]:
    `Teraz Skyreach Canopy. Oni też tam będą.`,
  [`So the schematics confirm it — built for Gogu.`]:
    `Więc schematy to potwierdzają — zbudowane dla Gogu.`,
  [`The vault door should open now. Hurry.`]:
    `Drzwi skarbca powinny się już otworzyć. Szybko.`,
  [`The vault door should open now. Hurry. (+10 credits)`]:
    `Drzwi skarbca powinny się już otworzyć. Szybko. (+10 kredytów)`,
  [`Find the console. Don't touch the Extractor yet.`]:
    `Znajdź konsolę. Nie dotykaj jeszcze Ekstraktora.`,

  // --- Habitation Ring: restingWorker NPC (merchant) ---
  [`They call our shifts 'labor debt' — debt to who?`]:
    `Nazywają nasze zmiany „długiem pracy” — komu ten dług?`,
  [`Still, I trade medkits and tonics if you've got the credits.`]:
    `Ale handluję apteczkami i eliksirami, jeśli masz kredyty.`,

  // --- Engine Core: ventTech NPC ---
  [`Core's been running hot since they powered that thing up.`]:
    `Jądro grzeje się, od kiedy uruchomili to urządzenie.`,
  [`Mind the grated floors — some won't hold your weight.`]:
    `Uważaj na ruszty — niektóre nie utrzymają twojej wagi.`,

  // --- Engine Core: tamsin NPC ---
  [`Tell the dock hand I'm out.`]:
    `Powiedz dokerowi, że jestem wolna.`,
  [`I won't forget who freed me.`]:
    `Nie zapomnę, kto mnie uwolnił.`,
  [`This restraint field's held me since the strike.`]:
    `To pole unieruchamia mnie od czasu strajku.`,
  [`There's a release switch south of here.`]:
    `Na południe stąd jest przełącznik zwalniający.`,

  // --- Engine Core: Tamsin-freed trigger ---
  [`You trip the release — the field drops, Tamsin's free.`]:
    `Uruchamiasz przełącznik — pole opada, Tamsin jest wolna.`,
  [`"Go, before they notice!"`]:
    `„Idź, zanim zauważą!”`,

  // --- Engine Core: schematics console / Extractor confirmed trigger ---
  [`The schematics are keyed to Gogu's signature.`]:
    `Schematy są dostrojone do sygnatury Gogu.`,
  [`The vault door should open now.`]:
    `Drzwi skarbca powinny się teraz otworzyć.`,

  // --- Engine Core: blast door chokepoint trigger ---
  [`A sealed blast door blinks: VERIFICATION REQUIRED.`]:
    `Zapieczętowane drzwi pancerne mrugają: WYMAGANA WERYFIKACJA.`,
  [`You need proof first.`]:
    `Najpierw potrzebujesz dowodu.`,

  // --- Extractor Vault: boss lead-in ---
  [`The Extractor hums behind the Foreman, half-built.`]:
    `Za brygadzistą buczy w połowie zbudowany Ekstraktor.`,
  [`"The device stays. You don't," he growls.`]:
    `„Urządzenie zostaje. Wy nie” — warczy.`,
  [`Wando steps forward. "Try it."`]:
    `Wando robi krok do przodu. „Spróbuj.”`,

  // --- Extractor Vault: boss onVictory ---
  [`The Foreman gives up — the Extractor sparks and shuts down.`]:
    `Brygadzista się poddaje — Ekstraktor iskrzy i gaśnie.`,
  [`Gogu breathes out: "It's gone quiet."`]:
    `Gogu wypuszcza powietrze: „Zrobiło się cicho.”`,
  [`Head back to the Starskiff for Skyreach Canopy. (+25 credits)`]:
    `Wróć na Starskiff, kurs na Skyreach Canopy. (+25 kredytów)`,
})
