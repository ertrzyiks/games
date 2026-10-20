/**
 * Polish translations for Mossfen Reach (World 2) dialogue.
 *
 * Covers every static NPC dialogue line, every branch of the quest-aware
 * dialogue(state) functions (Finn the Tracker / Birch Keeper), and every
 * ctx.showDialogue(...) call used by the world's triggers (lore reveal,
 * Wick rescue, the dark-water gate, the Syndicate evidence cache, the loot
 * caches, and the Bog Warden boss lead-in + onVictory sequence).
 *
 * The world's display name ("Mossfen Reach") is left untranslated as a
 * proper noun, so it has no entry here.
 */
import { registerTranslations } from '../../engine/i18n.js'

registerTranslations('pl', {
  // --- approach: juro ---
  [`Stay off the deep mud past the reeds — bog-stalkers nest thick this close to the settlement gate.`]:
    `Trzymaj się z daleka od głębokiego bagna za trzcinami — błotne czyhacze gnieżdżą się tu gęsto, tak blisko bram osady.`,
  [`Moss's kin have kept watch here since the Syndicate cutters first came through. We don't forget a face like that.`]:
    `Krewni Mossa trzymają tu wartę od dnia, gdy pierwsze krążowniki Syndykatu się tu zjawiły. Takiej twarzy się nie zapomina.`,
  [`Settlement's through the north gate. Tell the elders Kade Ironhelm walks with the boy now — they'll want to see that for themselves.`]:
    `Osada jest za północną bramą. Powiedz starszyźnie, że Kade Ironhelm teraz idzie u boku chłopca — będą chcieli zobaczyć to na własne oczy.`,

  // --- approach: lore trigger (4,4) ---
  [`Moss goes still, eyes fixed on the dark water.`]:
    `Moss zamiera, nie odrywając wzroku od czarnej wody.`,
  [`"This place... I was born here. Before the nets, before the running."`]:
    `"To miejsce... urodziłem się tutaj. Przed sieciami, przed ucieczką."`,
  [`"The Syndicate came for the Current in the mud. We were the first they hunted."`]:
    `"Syndykat przybył po Nurt skryty w błocie. Byliśmy pierwszymi, na których zaczęli polować."`,

  // --- approach: cache trigger (13,9) ---
  [`Tucked beneath the reeds, a waterproofed satchel.`]:
    `Wśród trzcin skryta nieprzemakalna sakwa.`,
  [`Found a medkit!`]:
    `Znaleziono apteczkę!`,

  // --- settlement: finnTheTracker ---
  [`Finn's knuckles are white around his spear shaft.`]:
    `Knykcie Finna bieleją na drzewcu włóczni.`,
  [`"My kin Wick went into the Deep Mire two days back, scouting the old shrine path — she hasn't come back."`]:
    `"Moja krewna Wick dwa dni temu poszła w głąb Głębokich Mokradeł, by zbadać starą ścieżkę do świątyni — i nie wróciła."`,
  [`"The stalkers have gotten bolder since the raid. If you're headed into the mire anyway... please, look for her."`]:
    `"Czyhacze stały się śmielsze od czasu napadu. Jeśli i tak idziesz w głąb mokradeł... proszę, poszukaj jej."`,
  [`Wick's back at her mother's fire, telling the story to anyone who'll sit still long enough.`]:
    `Wick wróciła do ogniska matki i opowiada tę historię każdemu, kto usiedzi w miejscu dość długo, by jej wysłuchać.`,
  [`I won't forget this, Kade. Any kin of yours is kin of the Reach now.`]:
    `Nie zapomnę tego, Kade. Każdy twój bliski jest teraz bliskim Rozlewiska.`,
  [`Finn's shoulders drop the moment he sees you. "You found her. You actually found her."`]:
    `Finnowi opadają ramiona, gdy cię widzi. "Znalazłeś ją. Naprawdę ją znalazłeś."`,
  [`He presses a medkit into your hands. "Take this for the road — least I can do."`]:
    `Wciska ci w ręce apteczkę. "Weź to na drogę — to najmniej, co mogę zrobić."`,
  [`She went in past the gate-tree, following the old shrine path. Please — hurry.`]:
    `Poszła za drzewo-bramę, trzymając się starej ścieżki do świątyni. Proszę — pospiesz się.`,

  // --- settlement: birchKeeper ---
  [`The reeds remember the night the sky cracked and the Syndicate's cutters came hunting fenling kin.`]:
    `Trzciny pamiętają noc, gdy niebo pękło i krążowniki Syndykatu przybyły polować na fenlingów.`,
  [`Moss was not the only child born to the Current here — the others were taken, or ran deep into the mire and never came back.`]:
    `Moss nie był jedynym dzieckiem zrodzonym tu z Nurtu — inne zostały zabrane albo uciekły w głąb mokradeł i nigdy nie wróciły.`,
  [`They didn't just take our kin. They were digging for something in the old shrine grounds, deep in the mire. I need to know what.`]:
    `Nie zabrali tylko naszych bliskich. Kopali po coś na terenach starej świątyni, głęboko w mokradłach. Muszę wiedzieć, po co.`,
  [`The Warden's gone quiet, and the mire breathes easier for it. But Kade — whatever they built with what they learned here, it's still running somewhere out there.`]:
    `Strażnik ucichł i mokradła oddychają teraz lżej. Ale Kade — to, co zbudowali z tego, czego się tu nauczyli, wciąż działa gdzieś tam, na zewnątrz.`,
  [`Watch the sky when you leave the Reach. The Syndicate doesn't stop just because one guard dog falls.`]:
    `Pilnuj nieba, gdy opuścisz Rozlewisko. Syndykat nie przestaje działać tylko dlatego, że padł jeden pies stróżujący.`,
  [`A siphon rig, you say — and notes on 'mossroot nodes.' That's the Current itself they were after, pulled straight out of the bog.`]:
    `Instalacja ssąca, mówisz — i notatki o 'węzłach korzeni mchu'. To sam Nurt, po który przyszli, wyciągnięty prosto z bagna.`,
  [`Something is guarding the rest of it now. Corrupted, the hunters say — wearing the shape of what used to watch over us.`]:
    `Coś teraz strzeże resztek tego miejsca. Skażone, mówią łowcy — przybrało postać tego, co dawniej nas pilnowało.`,
  [`If you mean to go further, go in strength. That thing won't let you walk past it.`]:
    `Jeśli zamierzasz iść dalej, idź w sile. Ta istota nie pozwoli ci po prostu obok siebie przejść.`,
  [`Follow the shrine path into the Deep Mire. If they left anything behind, it'll be there.`]:
    `Idź ścieżką do świątyni w głąb Głębokich Mokradeł. Jeśli coś po sobie zostawili, będzie tam.`,

  // --- settlement: mireChild ---
  [`You feel it too, don't you? The hum under the ground — that's the Current, same as what sings in Moss.`]:
    `Ty też to czujesz, prawda? Ten pomruk pod ziemią — to Nurt, ten sam, który śpiewa w Mossie.`,
  [`Our kin used to gather at the old shrine, before the Hollow Syndicate started dragging nets through the bog.`]:
    `Nasi bliscy zbierali się przy starej świątyni, zanim Syndykat Hollow zaczął ciągnąć sieci przez bagno.`,
  [`Tell Moss the Reach still waits for him, whenever the running stops.`]:
    `Powiedz Mossowi, że Rozlewisko wciąż na niego czeka, kiedy tylko ucieczka się skończy.`,

  // --- settlement: selaNetmender ---
  [`Mind the deep channel past the shrine path — the water runs black down there, thick with old Current. No kinlight, no crossing, not if you want to see what's holding it back.`]:
    `Uważaj na głęboki kanał za ścieżką do świątyni — woda płynie tam czarna, gęsta od starego Nurtu. Bez światła rodowego nie przejdziesz, nie jeśli chcesz jeszcze zobaczyć, co ją powstrzymuje.`,
  [`Wick used to carry a glow-reed lantern on her scouting runs. If she dropped it out there, it'd still ward off the worst of the dark.`]:
    `Wick zawsze brała na zwiady lampion ze świetlistej trzciny. Jeśli gdzieś go zgubiła, wciąż powinien odpędzać najgorszy mrok.`,
  [`The Syndicate never liked how bright this place burned. Guess that's why they came back for seconds.`]:
    `Syndykatowi nigdy nie podobało się, jak jasno płonie to miejsce. Pewnie dlatego wrócili po więcej.`,

  // --- deepMire: oldHarl ---
  [`Don't mind me — I've lived in these root-hollows since before the nets came.`]:
    `Nie zwracaj na mnie uwagi — żyję w tych korzeniowych norach, odkąd jeszcze nie było tu sieci.`,
  [`Something changed in the deep water after the raid. Whatever used to sleep down there is awake now, and it answers to the Syndicate's mark.`]:
    `Coś się zmieniło w głębokiej wodzie po napadzie. Cokolwiek tam spało, teraz się obudziło i odpowiada na znak Syndykatu.`,
  [`If you're set on going further, keep your wits about you. The Warden doesn't forgive distraction.`]:
    `Jeśli zdecydowałeś się iść dalej, miej się na baczności. Strażnik nie wybacza chwili nieuwagi.`,

  // --- deepMire: Wick rescue trigger (6,3) ---
  [`Tangled in root-snares, a young fenling scout struggles against the mud — Wick, Finn's kin.`]:
    `Uwikłana w korzeniowe sidła, młoda zwiadowczyni fenlingów szamocze się w błocie — Wick, krewna Finna.`,
  [`"You found me! The stalkers nearly had me. Here — take this, it'll ward off the deep dark."`]:
    `"Znalazłeś mnie! Czyhacze mnie już prawie dostały. Masz — weź to, odpędzi najgłębszy mrok."`,
  [`Wick presses a glowing kinlight reed into your hand before slipping back toward the settlement.`]:
    `Wick wciska ci w rękę świecącą trzcinę światła rodowego, po czym umyka w stronę osady.`,

  // --- deepMire: dark-water gate trigger (9,7) ---
  [`The water here runs black — the current pulls at your boots like something unseen is holding on.`]:
    `Woda płynie tu czarna — prąd ciągnie za twoje buty, jakby coś niewidzialne się ich czepiało.`,
  [`Without a kinlight to ward it off, you can't risk going further.`]:
    `Bez światła rodowego, które by to odpędziło, nie możesz ryzykować dalszej drogi.`,

  // --- deepMire: Syndicate evidence trigger (11,12) ---
  [`Half-buried in the muck: a cracked Syndicate siphon rig, its collection vials shattered.`]:
    `Na wpół zagrzebana w szlamie: popękana instalacja ssąca Syndykatu, z roztrzaskanymi fiolkami zbiorczymi.`,
  [`A waterlogged ledger page survives inside. "...mossroot nodes test positive for sustained Current draw — recommend full extraction once site is secured..."`]:
    `Wewnątrz zachowała się przemoczona strona dziennika. "...węzły korzeni mchu wykazują stały pobór Nurtu — zalecana pełna ekstrakcja po zabezpieczeniu stanowiska..."`,
  [`Whatever they were drawing out of the Reach, they meant to come back for more of it.`]:
    `Cokolwiek wyciągali z Rozlewiska, zamierzali wrócić po więcej.`,

  // --- deepMire: cache trigger (13,11) ---
  [`Wedged into a root hollow, a waterproof satchel.`]:
    `Wklinowana w korzeniowe wgłębienie nieprzemakalna sakwa.`,

  // --- wardenLair: boss lead-in trigger (3,4) ---
  [`The corridor opens onto a sunken grotto, Current-light flickering sick and green through cracked root walls.`]:
    `Korytarz otwiera się na zatopioną grotę, gdzie chorobliwie zielone światło Nurtu migocze przez popękane korzeniowe ściany.`,
  [`At its center, half-fused with corroded Syndicate plating, something that was once a guardian of the Reach turns to face you.`]:
    `W jej centrum, na wpół zrośnięte ze skorodowanym pancerzem Syndykatu, coś, co kiedyś było strażnikiem Rozlewiska, odwraca się, by stanąć z tobą twarzą w twarz.`,
  [`"Bog Warden... no." Moss's voice shakes. "That used to watch over the shrine. What did they do to it?"`]:
    `"Strażnik Bagna... nie." Głos Mossa drży. "To dawniej czuwało nad świątynią. Co mu zrobili?"`,
  [`Kade raises his shield. "Whatever it is now, it's standing between us and answers. Moss — stay close."`]:
    `Kade podnosi tarczę. "Kimkolwiek teraz jest, stoi między nami i odpowiedziami. Moss — trzymaj się blisko."`,

  // --- wardenLair: boss onVictory ---
  [`The corrupted plating cracks and sloughs away; the light bleeds out of the creature until only still water remains.`]:
    `Skażony pancerz pęka i osypuje się; światło wycieka z istoty, aż pozostaje jedynie spokojna woda.`,
  [`Moss kneels at the water's edge. "It's free. Whatever they did to it... it's finally free."`]:
    `Moss klęka na brzegu wody. "Jest wolne. Cokolwiek mu zrobili... wreszcie jest wolne."`,
  [`Kade pulls a scorched Syndicate medallion from the wreckage — the same mark from the siphon rig in the mire.`]:
    `Kade wyciąga z wraku osmolony medalion Syndykatu — ten sam znak, co na instalacji ssącej w mokradłach.`,
  [`"This isn't the only place they've been digging," Kade says grimly. "There's a station out past the reach, Ashvault — word is they're building something bigger there. A Current Extractor, they call it."`]:
    `"To nie jedyne miejsce, w którym kopali," mówi Kade ponuro. "Jest stacja daleko za Rozlewiskiem, Ashvault — mówią, że budują tam coś większego. Ekstraktor Nurtu, tak to nazywają."`,
  [`"Then that's where we go next," Moss says, steadier now. "Before they finish it."`]:
    `"Więc tam wyruszamy," mówi Moss, już spokojniejszy. "Zanim to dokończą."`,
  [`Head back to the Starskiff to set course for Ashvault Station.`]:
    `Wracaj na Starskiffa, by wyznaczyć kurs na Stację Ashvault.`,
})
