import { registerTranslations } from '../../engine/i18n.js'

/**
 * Polish translations for World 5 — The Hollow (the finale).
 *
 * Keys are the exact English strings as they appear in
 * ../../worlds/theHollow.js — copy-pasted, not retyped, so the exact-match
 * lookup in engine/i18n.js's t() actually hits. Computed (`[`...`]`)
 * template-literal keys are used throughout purely so strings containing
 * both ' and " don't need any escaping that could introduce a mismatch.
 *
 * Dialogue outside the boss lead-in / ending was trimmed engine-side to
 * 1 short sentence per line, max 2 lines per interaction — translations
 * below follow that same brevity. The boss lead-in and the onVictory
 * ending were left untouched in the English source, so their Polish
 * lines are carried over unchanged from the previous version of this
 * file.
 *
 * Deliberate naming choices, kept consistent across every line below:
 *  - "the Hollow" (the world/place) -> "Czeluść" (chasm/abyss — fits a
 *    buried stronghold better than a literal "Wydrążenie" or "Pustka"
 *    would, and reads naturally with Polish declension: Czeluść /
 *    Czeluści / w Czeluści).
 *  - "the Warden" -> "Strażnik".
 *  - "the Syndicate" -> "Syndykat".
 *  - "the Current" (the psychic force Gogu is tied to) -> "Prąd".
 *  - Other worlds' proper names (Rustmoor, Ashvault, Mossfen, the Canopy,
 *    the Reach, the Drift, Starskiff) are left as proper nouns, untranslated
 *    — consistent with how a fantasy place name usually survives translation
 *    intact, and out of scope for this file to redecide.
 *  - Hero names are Wando and Gogu throughout. Gogu is written as male
 *    (the English text itself settles this — "Kneel, armorer, and he
 *    lives") and Rell as female (the English stage direction "catches
 *    herself").
 */

const pl = {
  // --- World name --------------------------------------------------------
  [`The Hollow`]: `Czeluść`,

  // --- Map segment names, shown in the HUD as "Czeluść - {name}" ---------
  [`Outer Hollow`]: `Zewnętrzna Czeluść`,
  [`Inner Sanctum`]: `Wewnętrzne Sanktuarium`,
  [`Warden's Chamber`]: `Komnata Strażnika`,

  // --- vexDialogue ---------------------------------------------------------
  [`I'm Vex. I escaped the Syndicate.`]: `Jestem Vex. Uciekłam z Syndykatu.`,
  [`Shut down the shield relay past the courtyard before you go deeper.`]: `Wyłącz przekaźnik osłon za dziedzińcem, zanim pójdziesz dalej.`,
  [`Relay's down — good.`]: `Przekaźnik wyłączony — dobrze.`,
  [`They're still holding prisoners. Free them if you can.`]: `Wciąż trzymają więźniów. Uwolnij ich, jeśli możesz.`,
  [`You freed them. That's rare mercy down here.`]: `Uwolniłeś ich. To rzadkie miłosierdzie na tym dnie.`,
  [`The Warden waits past the sanctum. Gogu won't face it alone.`]: `Strażnik czeka za sanktuarium. Gogu nie stanie do tego sam.`,

  // --- lookoutDialogue -------------------------------------------------
  [`Alarms are down. Patrols still walk old routes.`]: `Alarmy nie działają. Patrole wciąż chodzą starymi trasami.`,
  [`Patrols sweep every few minutes. Watch the pattern.`]: `Patrol przechodzi tu co kilka minut. Obserwuj wzorzec.`,
  [`One of the broken pillars near the west wall is hollow.`]: `Jedna ze zniszczonych kolumn przy zachodniej ścianie jest pusta w środku.`,
  [`The pillar crumbles — a guard’s stashed kit!`]: `Kolumna się rozpada — schowany sprzęt strażnika!`,
  [`Found a medkit and a tonic!`]: `Znaleziono apteczkę i eliksir!`,

  // --- outerHollow triggers ------------------------------------------------
  [`This is the Hollow — it ends here.`]: `To jest Czeluść — tu się to kończy.`,
  [`Cut their defenses, then go for the one in charge.`]: `Przetnij ich obronę, a potem idź po tego, kto tu rządzi.`,
  [`The shield relay hums before you.`]: `Przekaźnik osłon brzęczy przed tobą.`,
  [`Wando shuts it down — the alarms go silent.`]: `Wando wyłącza go — alarmy cichną.`,

  // --- rellDialogue ------------------------------------------------------
  [`Real air. I'd forgotten the feel.`]: `Prawdziwe powietrze. Zapomniałam, jak to jest.`,
  [`Go finish this, Wando.`]: `Idź, dokończ to, Wando.`,
  [`...Wando? They said you were gone for good.`]: `...Wando? Mówili, że przepadłeś na dobre.`,
  [`Free me and I'll tell you about Gogu.`]: `Uwolnij mnie, a powiem ci o Gogu.`,

  // --- junDialogue ---------------------------------------------------------
  [`You crossed the whole Drift to get here.`]: `Przemierzyłeś cały Drift, żeby dotrzeć tutaj.`,
  [`This ends past that door.`]: `To się kończy za tymi drzwiami.`,
  [`Even down here, I still trade medkits and tonics for credits.`]: `Nawet tu, na samym dnie, wciąż handluję apteczkami i eliksirami za kredyty.`,

  // --- innerSanctum triggers -----------------------------------------------
  [`The sanctum's quiet — too quiet.`]: `W sanktuarium jest cicho — zbyt cicho.`,
  [`Alarms are still live. Move fast.`]: `Alarmy wciąż wyją. Ruszaj się szybko.`,
  [`The chains break at a touch.`]: `Łańcuchy pękają od jednego dotyku.`,
  [`Rell: "...Wando. You came."`]: `Rell: "...Wando. Przyszedłeś."`,

  // --- wardenChamber boss lead-in (4 lines, unchanged) --------------------
  [`The corridor opens onto a floor etched in cold red runes — the same sigils from Ashvault's vault, from the Bog Warden's hollow, all of it tracing back here.`]: `Korytarz otwiera się na podłogę wyżłobioną w zimnych, czerwonych runach — te same symbole, co w skarbcu Ashvault, w jamie Bagiennego Strażnika — wszystko prowadziło właśnie tutaj.`,
  [`At the center, wreathed in Syndicate light, the Warden rises to meet you.`]: `W centrum, otoczony światłem Syndykatu, Strażnik powstaje, by stanąć przed wami.`,
  [`"The little psychic comes to us after all," it rasps. "Every world you crossed to get here, and it ends the same. Kneel, armorer, and hand him over."`]: `"Mały psychik sam trafia w nasze ręce," chrypi. "Każdy świat, który przemierzyliście, by dotrzeć tutaj — a kończy się zawsze tak samo. Ukorz się, zbrojmistrzu, i oddaj go nam."`,
  [`Wando plants his feet, shield raised. "Gogu — stay behind me. This ends now. Not with him."`]: `Wando staje w rozkroku, unosi tarczę. "Gogu — zostań za mną. To się kończy teraz. Nie z nim."`,

  // --- onVictory ending (8 lines, including THE END; a new salvage/credits
  // line was inserted second, the rest carried over unchanged) -----------
  [`The Warden sinks down, beaten. The rune-light flickers, dims, and finally goes dark — the Hollow has nothing left to throw at you.`]: `Strażnik osuwa się, pokonany. Światło run miga, przygasa i wreszcie gaśnie całkiem — Czeluść nie ma już niczego, czym mogłaby w was rzucić.`,
  [`Among the wreckage, salvaged Syndicate tech is worth a small fortune back at the Starskiff. (+45 credits)`]: `Wśród gruzów, odzyskana technologia Syndykatu jest warta małej fortuny po powrocie na Starskiffa. (+45 kredytów)`,
  [`Gogu steps out from behind Wando, small fingers finding his armored hand. "...It's quiet. I've never felt it this quiet before."`]: `Gogu wychodzi spod osłony Wando'a, małe palce odnajdują jego opancerzoną rękę. "...Jest cicho. Nigdy wcześniej nie czułem takiej ciszy."`,
  [`Wando kneels to his level. "That's the Current settling. Nobody's hunting it anymore — not here, not in the Reach, not anywhere we've been."`]: `Wando przyklęka, żeby spojrzeć mu w oczy. "To Prąd się wycisza. Nikt już go nie poluje — ani tu, ani w Reach, ani gdziekolwiek byliśmy."`,
  [`Rell, and everyone else the Syndicate dragged down here, will walk out into daylight they didn't expect to see again.`]: `Rell i wszyscy inni, których Syndykat zaciągnął tutaj, wyjdą na światło dnia, którego nie liczyli już ujrzeć.`,
  [`Wando thinks of the forge-clan that exiled him, a raider's canyon, a drowned bog shrine, a station full of smoke, a refuge in the clouds — every place this road ran through to get here.`]: `Wando myśli o klanie kowali, który go wygnał, o kanionie rozbójników, o zatopionej bagiennej świątyni, o stacji pełnej dymu, o schronieniu w obłokach — o każdym miejscu, przez które przeszła ta droga, by zaprowadzić go tutaj.`,
  [`"Come on, Gogu," he says, straightening up. "Let's go see what the Drift looks like without the Hollow watching it."`]: `"Chodź, Gogu," mówi, wyprostowując się. "Zobaczymy, jak wygląda Drift, kiedy nie patrzy na niego Czeluść."`,
  [`THE END — head back to the Starskiff to revisit any world of the Drift.`]: `KONIEC — wróć na Starskiff, by ponownie odwiedzić każdy świat Driftu.`,
}

registerTranslations('pl', pl)
