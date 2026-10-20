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
 * Deliberate naming choices, kept consistent across every line below:
 *  - "the Hollow" (the world/place) -> "Czeluść" (chasm/abyss — fits a
 *    buried stronghold better than a literal "Wydrążenie" or "Pustka"
 *    would, and reads naturally with Polish declension: Czeluść /
 *    Czeluści / w Czeluści).
 *  - "the Warden" -> "Strażnik".
 *  - "the Syndicate" -> "Syndykat".
 *  - "the Current" (the psychic force Moss is tied to) -> "Prąd".
 *  - Other worlds' proper names (Rustmoor, Ashvault, Mossfen, the Canopy,
 *    the Reach, the Drift, Starskiff) are left as proper nouns, untranslated
 *    — consistent with how a fantasy place name usually survives translation
 *    intact, and out of scope for this file to redecide.
 *  - Moss is written as male throughout (the English text itself settles
 *    this — "Kneel, armorer, and he lives") and Rell as female (the English
 *    stage direction "catches herself").
 */

const pl = {
  // --- World name --------------------------------------------------------
  [`The Hollow`]: `Czeluść`,

  // --- vexDialogue ---------------------------------------------------------
  [`You're Kade. The armorer. Word travels even down here.`]: `Jesteś Kade. Zbrojmistrz. Wieści docierają nawet tu, na samo dno.`,
  [`I'm Vex — ran courier for the Syndicate until I saw what they actually want Moss for.`]: `Jestem Vex — biegałam z przesyłkami dla Syndykatu, dopóki nie zobaczyłam, do czego naprawdę chcą wykorzystać Moss.`,
  [`The Warden's shield relay is still live, up past the courtyard. Knock it out before you push deeper, or every alarm in the Hollow finds you at once.`]: `Przekaźnik osłon Strażnika wciąż działa, tam za dziedzińcem. Wyłącz go, zanim pójdziesz dalej, bo inaczej wszystkie alarmy w Czeluści spadną na ciebie naraz.`,
  [`Relay's dark — good. That buys you a straight run through the sanctum.`]: `Przekaźnik ucichł — dobrze. Masz teraz czyste przejście przez sanktuarium.`,
  [`They're still holding some of the people they dragged in off Ashvault and the Canopy. If you can free them, do it.`]: `Wciąż trzymają tu część ludzi, których zwlekli z Ashvault i Canopy. Jeśli możesz ich uwolnić — zrób to.`,
  [`You freed them. That's more mercy than the Hollow's shown anyone in years.`]: `Uwolniłeś ich. To więcej miłosierdzia, niż Czeluść pokazała komukolwiek od lat.`,
  [`The Warden's past the sanctum, in the old rune chamber. Whatever happens in there — Moss doesn't face it alone.`]: `Strażnik jest za sanktuarium, w starej komnacie run. Cokolwiek się tam wydarzy — Moss nie stanie do tego sam.`,

  // --- lookoutDialogue -------------------------------------------------
  [`Alarms are dead now. Patrols are still walking their old routes out of habit — use that.`]: `Alarmy już nie działają. Patrole wciąż chodzą starymi trasami z przyzwyczajenia — wykorzystaj to.`,
  [`Patrol sweeps every few minutes. Stick to the open floor and you can read their pattern before they see you.`]: `Patrol przechodzi tu co kilka minut. Trzymaj się otwartej przestrzeni, to rozczytasz ich wzorzec, zanim cię zobaczą.`,

  // --- outerHollow triggers ------------------------------------------------
  [`This is it — the Hollow itself. Every road since Rustmoor led here.`]: `To jest to — sama Czeluść. Każda droga od Rustmoor prowadziła właśnie tutaj.`,
  [`Moss presses close to Kade's side. "I can feel it. Whatever they built to use me... it's close."`]: `Moss przyciska się do boku Kade'a. "Czuję to. Cokolwiek zbudowali, żeby mnie wykorzystać... jest blisko."`,
  [`Cut their defenses, get anyone they're still holding, and we go straight for the one in charge.`]: `Przetnij ich obronę, uwolnij każdego, kogo jeszcze trzymają, a potem idziemy prosto po tego, kto tu rządzi.`,
  [`A humming console, half-buried in rune conduit — the shield relay.`]: `Brzęczący pulpit, na wpół wtopiony w przewody run — przekaźnik osłon.`,
  [`Kade jams a blade into the housing. The hum dies. Somewhere deep in the Hollow, an alarm that never got to ring goes quiet.`]: `Kade wbija klingę w obudowę. Brzęczenie gaśnie. Gdzieś głęboko w Czeluści cichnie alarm, który nigdy nie zdążył zadzwonić.`,

  // --- rellDialogue ------------------------------------------------------
  [`Air. Real air. I'd almost forgotten what that felt like.`]: `Powietrze. Prawdziwe powietrze. Już prawie zapomniałam, jak to jest.`,
  [`Go, Kade — finish this. I've got people to find and a long walk out of here.`]: `Idź, Kade — dokończ to. Mam ludzi do odnalezienia i długą drogę stąd przed sobą.`,
  [`...Kade? They said you'd be dead by Ashvault.`]: `...Kade? Mówili, że zginiesz jeszcze pod Ashvault.`,
  [`Get this chain off and I'll tell you everything I heard them say about Moss.`]: `Zdejmij ze mnie ten łańcuch, a powiem ci wszystko, co słyszałam, jak mówili o Moss.`,

  // --- junDialogue ---------------------------------------------------------
  [`Rustmoor. Mossfen. Ashvault. The Canopy. And now here.`]: `Rustmoor. Mossfen. Ashvault. Canopy. A teraz tutaj.`,
  [`You crossed the whole Drift to reach this room. The Warden knows it too — that's why it hasn't fled.`]: `Przemierzyłeś cały Drift, żeby dotrzeć do tej komnaty. Strażnik też to wie — właśnie dlatego nie uciekł.`,
  [`Whatever path brought you here, it ends past that door.`]: `Jakąkolwiek drogą tu dotarłeś, kończy się ona za tymi drzwiami.`,
  [`The Warden doesn't run. It's waited this long on purpose.`]: `Strażnik nie ucieka. Czekał tak długo z rozmysłem.`,

  // --- innerSanctum triggers -----------------------------------------------
  [`The sanctum beyond is quiet — too quiet. Whatever's left of the Warden's guard is falling back to regroup.`]: `Sanktuarium przed wami jest ciche — zbyt ciche. To, co zostało ze straży Strażnika, wycofuje się, by się przegrupować.`,
  [`Alarms are still live somewhere behind you. Move fast.`]: `Alarmy wciąż gdzieś za wami wyją. Ruszaj się szybko.`,
  [`Chains shatter at a touch — these were never meant to hold against a real fight.`]: `Łańcuchy pękają od jednego dotyku — nigdy nie miały powstrzymać kogoś, kto naprawdę się bije.`,
  [`Rell slumps forward, then catches herself. "...Kade. You actually came."`]: `Rell osuwa się, po czym łapie równowagę. "...Kade. Naprawdę przyszedłeś."`,

  // --- wardenChamber boss lead-in (4 lines) -------------------------------
  [`The corridor opens onto a floor etched in cold red runes — the same sigils from Ashvault's vault, from the Bog Warden's hollow, all of it tracing back here.`]: `Korytarz otwiera się na podłogę wyżłobioną w zimnych, czerwonych runach — te same symbole, co w skarbcu Ashvault, w jamie Bagiennego Strażnika — wszystko prowadziło właśnie tutaj.`,
  [`At the center, wreathed in Syndicate light, the Warden rises to meet you.`]: `W centrum, otoczony światłem Syndykatu, Strażnik powstaje, by stanąć przed wami.`,
  [`"The little psychic comes to us after all," it rasps. "Every world you crossed to get here, and it ends the same. Kneel, armorer, and he lives."`]: `"Mały psychik sam trafia w nasze ręce," chrypi. "Każdy świat, który przemierzyliście, by dotrzeć tutaj — a kończy się zawsze tak samo. Ukorz się, zbrojmistrzu, i on przeżyje."`,
  [`Kade plants his feet, shield raised. "Moss — stay behind me. This ends now. Not with him."`]: `Kade staje w rozkroku, unosi tarczę. "Moss — zostań za mną. To się kończy teraz. Nie z nim."`,

  // --- onVictory ending (7 lines, including THE END) ----------------------
  [`The Warden falls still. The rune-light flickers, dims, and finally goes dark — the Hollow has nothing left to throw at you.`]: `Strażnik zastyga w bezruchu. Światło run miga, przygasa i wreszcie gaśnie całkiem — Czeluść nie ma już niczego, czym mogłaby w was rzucić.`,
  [`Moss steps out from behind Kade, small fingers finding his armored hand. "...It's quiet. I've never felt it this quiet before."`]: `Moss wychodzi spod osłony Kade'a, małe palce odnajdują jego opancerzoną rękę. "...Jest cicho. Nigdy wcześniej nie czułem takiej ciszy."`,
  [`Kade kneels to his level. "That's the Current settling. Nobody's hunting it anymore — not here, not in the Reach, not anywhere we've been."`]: `Kade przyklęka, żeby spojrzeć mu w oczy. "To Prąd się wycisza. Nikt już go nie poluje — ani tu, ani w Reach, ani gdziekolwiek byliśmy."`,
  [`Rell, and everyone else the Syndicate dragged down here, will walk out into daylight they didn't expect to see again.`]: `Rell i wszyscy inni, których Syndykat zaciągnął tutaj, wyjdą na światło dnia, którego nie liczyli już ujrzeć.`,
  [`Kade thinks of the forge-clan that exiled him, a raider's canyon, a drowned bog shrine, a station full of smoke, a refuge in the clouds — every place this road ran through to get here.`]: `Kade myśli o klanie kowali, który go wygnał, o kanionie rozbójników, o zatopionej bagiennej świątyni, o stacji pełnej dymu, o schronieniu w obłokach — o każdym miejscu, przez które przeszła ta droga, by zaprowadzić go tutaj.`,
  [`"Come on, Moss," he says, straightening up. "Let's go see what the Drift looks like without the Hollow watching it."`]: `"Chodź, Moss," mówi, wyprostowując się. "Zobaczymy, jak wygląda Drift, kiedy nie patrzy na niego Czeluść."`,
  [`THE END — head back to the Starskiff to revisit any world of the Drift.`]: `KONIEC — wróć na Starskiff, by ponownie odwiedzić każdy świat Driftu.`,
}

registerTranslations('pl', pl)
