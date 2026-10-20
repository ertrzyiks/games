import { registerTranslations } from '../../engine/i18n.js'

// Polish translations for every static dialogue line in
// src/worlds/skyreachCanopy.js — NPC dialogue arrays/functions and
// ctx.showDialogue() trigger lines. Dynamic battle combat-log lines are
// handled separately via the tf() template system in battle/battleScene.js
// and are intentionally not covered here. The world's `name` field
// ("Skyreach Canopy") is left untranslated as a proper noun, matching the
// other world/location names (Starskiff, the Drift, the Hollow) that read
// better kept as-is. Hero names ("Wando", "Gogu") are also kept as-is.
//
// Dialogue was trimmed to 1-2 short lines per interaction (3 max for the
// boss lead-in/victory) — keys below match the shortened English lines
// exactly.

registerTranslations('pl', {
  // Map segment names, shown in the HUD as "Skyreach Canopy - {name}".
  Canopy: 'Korona Drzew',
  'Skykin Refuge': 'Schronienie Ludu Nieba',
  'High Reaches': 'Wysokie Rubieże',
  'Enforcer Arena': 'Arena Egzekutora',

  // --- canopyApproach: Hale -----------------------------------------------
  [`Hale: Gale stalkers are thick in the canopy now.`]:
    `Hale: W koronie drzew roi się teraz od wichrołazów.`,
  [`Hale: The refuge is north — hurry.`]:
    `Hale: Schronienie jest na północy — pospiesz się.`,
  [`Hale: One of the giant trunks west of here has a false knothole.`]:
    `Hale: Jeden z wielkich pni na zachodzie ma fałszywy sęk.`,
  [`The knothole is hollow — a windkin cache!`]:
    `Sęk jest wydrążony — skrytka Ludu Wiatru!`,
  [`Found a tonic!`]: `Znaleziono eliksir!`,

  // --- canopyApproach: lore trigger (skyreach_approachLoreSeen) ----------
  [`A grinding hum rises from far below the clouds.`]:
    `Zgrzytliwy pogłos dobiega gdzieś spod dalekich obłoków.`,
  [`Gogu shivers. "That's where they want to take me."`]:
    `Gogu drży. "Właśnie tam chcą mnie zabrać."`,

  // --- canopyApproach: scout cache trigger --------------------------------
  [`Found a spare medkit in a hollow root.`]:
    `Znaleziono zapasową apteczkę w wydrążonym korzeniu.`,

  // --- skykinRefuge: Senna (WATCH_QUEST giver) ----------------------------
  [`Senna: The Current-well is singing straight to the Syndicate.`]:
    `Senna: Studnia Nurtu śpiewa prosto do Syndykatu.`,
  [`Senna: Still it in the High Reaches before they arrive.`]:
    `Senna: Ucisz ją w Wysokich Rubieżach, zanim dotrą.`,
  [`Senna: The enforcer is gone. The refuge stands.`]:
    `Senna: Egzekutorki już nie ma. Schronienie stoi.`,
  [`Senna: You stilled it. Thank the Current.`]:
    `Senna: Uciszyliście ją. Chwała Nurtowi.`,
  [`Senna: She's almost here — stand with us.`]:
    `Senna: Ona już niemal tu jest — stań z nami.`,
  [`Senna: Please hurry — they're getting closer.`]:
    `Senna: Pospiesz się — są coraz bliżej.`,

  // --- skykinRefuge: Orin (ROOST_QUEST giver) -----------------------------
  [`Orin: Wren never came back from scouting.`]:
    `Orin: Wren nie wrócił ze zwiadu.`,
  [`Orin: Please find them near the roost towers.`]:
    `Orin: Proszę, znajdź go koło wież gniazdowych.`,
  [`Orin: Wren's back safe. Thank you, Wando.`]:
    `Orin: Wren wrócił bezpiecznie. Dziękuję, Wando.`,
  [`Orin: Please, hurry — find Wren.`]:
    `Orin: Proszę, pospiesz się — znajdź Wrena.`,

  // --- skykinRefuge: Tamsin (hands over the Windward Charm) ---------------
  [`Tamsin: Take this Windward Charm.`]:
    `Tamsin: Weź ten Amulet Wichru.`,
  [`Tamsin: It opens the vine-locks up high.`]:
    `Tamsin: Otwiera pnączowe zapory tam w górze.`,
  [`Tamsin: The charm still hums warm. Good.`]:
    `Tamsin: Amulet wciąż ciepło pulsuje. Dobrze.`,
  [`Tamsin: The High Reaches are sealed in vine-lock.`]:
    `Tamsin: Wysokie Rubieże są zapieczętowane pnączami.`,

  // --- skykinRefuge: Fenn --------------------------------------------------
  [`Fenn: You're really Wando Ironhelm?`]:
    `Fenn: Naprawdę jesteś Wando Ironhelm?`,
  [`Fenn: Gogu doesn't look scary at all.`]:
    `Fenn: Gogu wcale nie wygląda strasznie.`,

  // --- highReaches: Wren (ROOST_QUEST completion) --------------------------
  [`Wren: Wando! You found me.`]:
    `Wren: Wando! Znalazłeś mnie.`,
  [`Wren: Here — this will steady Gogu's Focus.`]:
    `Wren: Masz — to uspokoi Skupienie Gogu.`,
  [`Wren: Steadier than I've felt in days.`]:
    `Wren: Spokojniej niż czułem się od dni.`,
  [`Wren: Oh — thank the Current, someone found me.`]:
    `Wren: Och — chwała Nurtowi, ktoś mnie znalazł.`,

  // --- highReaches: vine-lock gate trigger ---------------------------------
  [`Thick vines block the way. You need the Windward Charm.`]:
    `Gęste pnącza blokują drogę. Potrzebujesz Amuletu Wichru.`,

  // --- highReaches: Current-well beacon trigger ----------------------------
  [`The well sits dark and quiet now.`]:
    `Studnia jest już ciemna i cicha.`,
  [`The well hums, loud enough to feel in your teeth.`]:
    `Studnia brzęczy tak głośno, że czuć to w zębach.`,
  [`Gogu silences it. "They can't hear it now."`]:
    `Gogu ją ucisza. "Już jej nie usłyszą."`,
  [`A dim lantern-well hums quietly here.`]:
    `Przygasła studnia cicho brzęczy w tym miejscu.`,

  // --- highReaches: alcove cache trigger ------------------------------------
  [`Found a medkit in a root alcove.`]:
    `Znaleziono apteczkę w niszy korzeni.`,

  // --- enforcerArena: boss lead-in ------------------------------------------
  [`A figure drops from above on a glider-rig.`]:
    `Z góry opada postać na szybowcowym rygu.`,
  [`"Enforcer Vane," she says. "Hiding ends today."`]:
    `"Egzekutorka Vane" — mówi. "Dziś koniec chowania się."`,
  [`Wando steps in front of Gogu. "Not today."`]:
    `Wando staje przed Gogu. "Nie dzisiaj."`,

  // --- enforcerArena: onVictory ----------------------------------------------
  [`Enforcer Vane crashes against the rail, defeated.`]:
    `Egzekutorka Vane upada pokonana o poręcz.`,
  [`The refuge is safe — for now.`]:
    `Schronienie jest bezpieczne — przynajmniej na razie.`,
  [`Head back to the Starskiff. The Hollow awaits.`]:
    `Wróć na Starskiff. Pustka czeka.`,
})
