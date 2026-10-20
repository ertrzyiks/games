import { registerTranslations } from '../../engine/i18n.js'

// Polish translations for every static dialogue line in
// src/worlds/skyreachCanopy.js — NPC dialogue arrays/functions and
// ctx.showDialogue() trigger lines. Dynamic battle combat-log lines are
// handled separately via the tf() template system in battle/battleScene.js
// and are intentionally not covered here. The world's `name` field
// ("Skyreach Canopy") is left untranslated as a proper noun, matching the
// other world/location names (Starskiff, the Drift, the Hollow) that read
// better kept as-is.

registerTranslations('pl', {
  // --- canopyApproach: Hale ---------------------------------------------
  [`Hale: Don't go further without your wits about you — gale stalkers have been thick in the canopy since the Syndicate started climbing.`]:
    `Hale: Nie idź dalej bez głowy na karku — w koronie drzew aż roi się od wichrołazów, od kiedy Syndykat zaczął się tu wdrapywać.`,
  [`Hale: An enforcer led the last patrol. Moved like the wind owed her something. I barely got out.`]:
    `Hale: Ostatni patrol prowadziła egzekutorka. Ruszała się, jakby wiatr był jej coś winien. Ledwo stamtąd uszedłem.`,
  [`Hale: The refuge is just past the north walk. Go — warn them, if you haven't already.`]:
    `Hale: Schronienie jest tuż za północnym pomostem. Idź — ostrzeż ich, jeśli jeszcze nie zdążyłeś.`,

  // --- canopyApproach: lore trigger (skyreach_approachLoreSeen) ---------
  [`A gust off the canopy carries a low, grinding hum from far below the clouds.`]:
    `Podmuch od strony korony drzew niesie niski, zgrzytliwy pogłos gdzieś spod dalekich obłoków.`,
  [`Gogu presses close to Wando, trembling. "That sound... it comes from where they want to take me."`]:
    `Gogu przytula się do Wando'a, drżąc. "Ten dźwięk... dochodzi stamtąd, dokąd chcą mnie zabrać."`,
  [`Somewhere beneath the Drift, the Hollow Syndicate waits in their stronghold — the Hollow itself.`]:
    `Gdzieś pod Driftem czeka Syndykat Pustki, zaszyty w swojej twierdzy — w samej Pustce.`,
  [`Wando tightens the straps on his plate. Whatever's happening up ahead, it's already found this place.`]:
    `Wando zaciska rzemienie napierśnika. Cokolwiek czeka ich dalej, już znalazło to miejsce.`,

  // --- canopyApproach: scout cache trigger -------------------------------
  [`Tucked into a hollow root, a scout cache yields a spare medkit.`]:
    `Ukryta w wydrążonym korzeniu skrytka zwiadowców skrywa zapasową apteczkę.`,

  // --- skykinRefuge: Senna (WATCH_QUEST giver) ---------------------------
  [`Senna: Wando. Gogu. You feel it too — the hum under our floor is louder every day.`]:
    `Senna: Wando. Gogu. Wy też to czujecie — pogłos pod naszą podłogą jest coraz głośniejszy.`,
  [`Senna: The Syndicate tracks the Current like a hound tracks blood. Our well up in the High Reaches is singing right to them.`]:
    `Senna: Syndykat wyczuwa Nurt jak pies wyczuwa krew. Nasza studnia tam, w Wysokich Rubieżach, śpiewa im prosto do uszu.`,
  [`Senna: An enforcer is already climbing toward us. If we shroud the well before she arrives, we buy the refuge time.`]:
    `Senna: Egzekutorka już się do nas wspina. Jeśli zagłuszymy studnię, zanim dotrze, kupimy schronieniu czas.`,
  [`Senna: Go. Find the well in the High Reaches and still it, before they find us first.`]:
    `Senna: Idź. Znajdź studnię w Wysokich Rubieżach i ucisz ją, zanim oni znajdą nas pierwsi.`,
  [`Senna: The enforcer is gone, and the refuge is still standing. We owe you both more than words.`]:
    `Senna: Egzekutorki już nie ma, a schronienie wciąż stoi. Jesteśmy wam winni więcej niż słowa.`,
  [`Senna: The Hollow waits below the clouds, same as the map showed. End what they started, Wando.`]:
    `Senna: Pustka czeka pod obłokami, tak jak wskazywała mapa. Zakończ to, co zaczęli, Wando.`,
  [`Senna: You stilled it. Thank the Current, you stilled it.`]:
    `Senna: Uciszyliście ją. Chwała Nurtowi, uciszyliście ją.`,
  [`Senna: One of our scouts escaped Syndicate hands years back. Before she died, she drew us a map — she swore it marked their stronghold. The Hollow.`]:
    `Senna: Jedna z naszych zwiadowczyń uciekła z rąk Syndykatu wiele lat temu. Zanim umarła, narysowała nam mapę — przysięgała, że oznaczyła na niej ich twierdzę. Pustkę.`,
  [`Senna: I never thought we'd need it. Keep it close, Wando. If the enforcer falls here, you'll have somewhere to carry the fight next.`]:
    `Senna: Nigdy nie sądziłam, że będzie nam potrzebna. Zatrzymaj ją przy sobie, Wando. Jeśli egzekutorka padnie tutaj, będziesz wiedział, dokąd zanieść walkę dalej.`,
  [`Senna: But first — she is almost here. Stand with us.`]:
    `Senna: Ale najpierw — ona już niemal tu jest. Stań z nami.`,
  [`Senna: The well's hum still carries. Please, hurry — I can feel them getting closer.`]:
    `Senna: Pogłos studni wciąż się niesie. Proszę, pospiesz się — czuję, że są coraz bliżej.`,

  // --- skykinRefuge: Orin (ROOST_QUEST giver) ----------------------------
  [`Orin: Wren went scouting the enforcer's climb and never came back down.`]:
    `Orin: Wren poszedł śledzić wspinaczkę egzekutorki i nie wrócił.`,
  [`Orin: Last I saw, they were headed past the vine-locks toward the old roost towers.`]:
    `Orin: Ostatnio widziałem go, jak szedł za pnączowe zapory, w stronę starych wież gniazdowych.`,
  [`Orin: Please — find them. Wren knows those towers better than any of us, but that counts for nothing against a Syndicate blade.`]:
    `Orin: Proszę — znajdź go. Wren zna te wieże lepiej niż ktokolwiek z nas, ale to nic nie znaczy wobec ostrza Syndykatu.`,
  [`Orin: Wren told me what you did up there. The Reaches feel steadier with them back.`]:
    `Orin: Wren powiedział mi, co zrobiłeś tam w górze. Rubieże czują się spokojniejsze, odkąd on wrócił.`,
  [`Orin: Whatever happens with the enforcer — you have our wings at your back, Wando.`]:
    `Orin: Cokolwiek stanie się z egzekutorką — masz nasze skrzydła za plecami, Wando.`,
  [`Orin: Please, hurry. I keep listening for wingbeats that aren't Wren's.`]:
    `Orin: Proszę, pospiesz się. Wciąż nasłuchuję uderzeń skrzydeł, które nie należą do Wrena.`,

  // --- skykinRefuge: Tamsin (hands over the Windward Charm) --------------
  [`Tamsin: Heading into the High Reaches for Orin's sake? Take this.`]:
    `Tamsin: Idziesz do Wysokich Rubieży dla Orina? Weź to.`,
  [`Tamsin: A Windward Charm. The vine-locks up there answer to it — they were woven to keep Syndicate scouts out, not kin.`]:
    `Tamsin: Amulet Wichru. Pnączowe zapory tam w górze go słuchają — spleciono je, by trzymać z daleka zwiadowców Syndykatu, nie swoich.`,
  [`Tamsin: Hold onto it. You will need it to reach the high roosts at all.`]:
    `Tamsin: Trzymaj go przy sobie. Bez niego nie dotrzesz do wysokich gniazd.`,
  [`Tamsin: The charm still hums warm in your hand. Good. The Reaches don't forgive the unprepared.`]:
    `Tamsin: Amulet wciąż ciepło pulsuje w twojej dłoni. Dobrze. Rubieże nie wybaczają nieprzygotowanym.`,
  [`Tamsin: The High Reaches used to be a nursery for fledgling Skykin. Now half of it is choked in vine-lock, sealed since the first Syndicate raid.`]:
    `Tamsin: Wysokie Rubieże były kiedyś gniazdem dla młodych Niebian. Teraz połowa jest zadławiona pnączami, zapieczętowana od pierwszego najazdu Syndykatu.`,

  // --- skykinRefuge: Fenn -------------------------------------------------
  [`Fenn: Are you really Wando Ironhelm? The forge-clan exile with the Current-touched kid?`]:
    `Fenn: To naprawdę ty jesteś Wando Ironhelm? Wygnaniec z klanu kowali, z dzieciakiem dotkniętym Nurtem?`,
  [`Fenn: Gogu doesn't look scary at all. Everyone up here talks about the Current like it's a monster, but Gogu just looks like... a kid.`]:
    `Fenn: Gogu wcale nie wygląda strasznie. Wszyscy tu w górze mówią o Nurcie, jakby to był jakiś potwór, a Gogu wygląda po prostu jak... dzieciak.`,
  [`Fenn: I hope the enforcer doesn't come. But if she does, I hope you're as tough as the stories say.`]:
    `Fenn: Mam nadzieję, że egzekutorka nie przyjdzie. Ale jeśli przyjdzie, to mam nadzieję, że jesteś tak twardy, jak mówią opowieści.`,

  // --- highReaches: Wren (ROOST_QUEST completion) ------------------------
  [`Wren: Wando?! You actually came all the way up here.`]:
    `Wren: Wando?! Naprawdę wspiąłeś się tu, na samą górę.`,
  [`Wren: I got turned around chasing an enforcer's scout past the vine-locks. Thought I'd be stuck roosting here till the Current went quiet for good.`]:
    `Wren: Zgubiłem się, ścigając zwiadowcę egzekutorki za pnączowymi zaporami. Myślałem, że zostanę tu uwięziony, aż Nurt ucichnie na dobre.`,
  [`Wren: Here — let me show Gogu how we steady the Current up in the high air. It might help in a real fight.`]:
    `Wren: Chodź — pokażę Gogu, jak uspokajamy Nurt tu, w górnym powietrzu. Może to pomóc w prawdziwej walce.`,
  [`Wren: (Gogu feels something settle, like a held breath finally let go. Gogu's Focus capacity increased!)`]:
    `Wren: (Gogu czuje, jak coś się uspokaja, jakby wreszcie wypuszczono wstrzymywany oddech. Pojemność Skupienia Gogu wzrosła!)`,
  [`Wren: Tell Orin I'm alright. And Wando — that enforcer's close. Be ready.`]:
    `Wren: Powiedz Orinowi, że nic mi nie jest. I Wando — ta egzekutorka jest już blisko. Bądź gotowy.`,
  [`Wren: Still steadier than I've felt in days. Thank you — truly.`]:
    `Wren: Wciąż czuję się spokojniej niż od dni. Dziękuję — naprawdę.`,
  [`Wren: ...? Who— ! Oh. Oh, thank the Current, someone finally found me.`]:
    `Wren: ...? Kto— ! Och. Och, chwała Nurtowi, ktoś mnie wreszcie znalazł.`,

  // --- highReaches: vine-lock gate trigger --------------------------------
  [`Thick vine-cord seals the path. Only a Windward Charm will loosen it.`]:
    `Gęsty pnączowy sznur pieczętuje ścieżkę. Tylko Amulet Wichru zdoła go rozwiązać.`,

  // --- highReaches: Current-well beacon trigger ---------------------------
  [`The Current-well sits dark and quiet now.`]:
    `Studnia Nurtu jest już ciemna i cicha.`,
  [`A squat lantern-well pulses with raw Current-light, humming loud enough to feel in your teeth.`]:
    `Przyniska latarniowa studnia pulsuje surowym światłem Nurtu, brzęczy tak głośno, że czuć to w zębach.`,
  [`Gogu reaches out and the hum drops to nothing. "There. They can't hear it anymore."`]:
    `Gogu wyciąga rękę, a pogłos zamiera do zera. "Już. Teraz nie mogą go już usłyszeć."`,
  [`A dim lantern-well hums quietly here, half-buried in root and moss.`]:
    `Przygasła latarniowa studnia cicho brzęczy, na wpół wtopiona w korzenie i mech.`,

  // --- highReaches: alcove cache trigger -----------------------------------
  [`A narrow root-alcove hides a scout cache.`]:
    `Wąska nisza w korzeniach skrywa skrytkę zwiadowców.`,
  [`Found a medkit!`]:
    `Znaleziono apteczkę!`,

  // --- enforcerArena: boss lead-in -----------------------------------------
  [`The arena floor opens beneath the high towers, wind screaming through broken rafters.`]:
    `Podłoga areny rozwiera się pod wysokimi wieżami, wiatr wrzeszczy przez połamane krokwie.`,
  [`A figure drops from above on a glider-rig, armor humming with stolen Current-charge.`]:
    `Z góry opada postać na szybowcowym rygu, zbroja brzęczy skradzionym ładunkiem Nurtu.`,
  [`"Enforcer Vane," she says, landing light as a blade. "The refuge ends its hiding today."`]:
    `"Egzekutorka Vane" — mówi, lądując lekko jak ostrze. "Schronienie dziś przestaje się chować."`,
  [`Wando steps between her and Gogu. "Not today. Not while I'm standing."`]:
    `Wando staje między nią a Gogu. "Nie dzisiaj. Nie, póki stoję na nogach."`,

  // --- enforcerArena: onVictory ---------------------------------------------
  [`Enforcer Vane crashes against the arena rail, her glider-rig sparking out.`]:
    `Egzekutorka Vane uderza o poręcz areny, jej szybowcowy ryg gaśnie w snopie iskier.`,
  [`"...the Hollow... will still..." Her voice fades as the stolen Current-charge bleeds out of her armor.`]:
    `"...Pustka... wciąż będzie..." Jej głos zamiera, gdy skradziony ładunek Nurtu uchodzi z jej zbroi.`,
  [`Senna's voice carries up from below: the refuge is safe, for now.`]:
    `Głos Senny niesie się z dołu: schronienie jest bezpieczne, przynajmniej na razie.`,
  [`With the enforcer fallen, the location the old scout's map once marked is confirmed — the Hollow itself, buried beneath the Drift's deepest clouds.`]:
    `Gdy egzekutorka upadła, potwierdza się miejsce, które niegdyś oznaczyła mapa starej zwiadowczyni — sama Pustka, pogrzebana pod najgłębszymi obłokami Driftu.`,
  [`Wando looks to Gogu. "That's where they want to take you. So that's where we end it."`]:
    `Wando patrzy na Gogu. "Właśnie tam chcą cię zabrać. Więc właśnie tam to zakończymy."`,
  [`The way down into the Hollow lies open. The final confrontation awaits.`]:
    `Droga w głąb Pustki stoi otworem. Czeka ostateczna konfrontacja.`,
  [`Head back to the Starskiff to set course for the Hollow.`]:
    `Wróć na Starskiff, by wytyczyć kurs na Pustkę.`,
})
