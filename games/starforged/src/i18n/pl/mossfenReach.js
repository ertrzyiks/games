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
  // Map segment names, shown in the HUD as "Mossfen Reach - {name}".
  'Reach Approach': 'Podejście do Mateczni',
  Settlement: 'Osada',
  'Deep Mire': 'Głębokie Mokradła',
  "Warden's Lair": 'Legowisko Strażnika',

  // --- approach: juro ---
  [`Bog-stalkers nest past the reeds — stay on the mud.`]:
    `Błotne czyhacze gnieżdżą się za trzcinami — trzymaj się błota.`,
  [`Settlement's through the north gate. Go tell the elders.`]:
    `Osada jest za północną bramą. Powiedz starszyźnie.`,
  [`That mossy rock east of here looks hollow. Worth a look.`]:
    `Ten omszały głaz na wschodzie wygląda na wydrążony. Warto zerknąć.`,
  [`The moss-rock grinds aside, revealing a hidden passage!`]:
    `Omszały głaz odsuwa się, odkrywając skryte przejście!`,
  [`You push through into a small hollow beyond the reach...`]:
    `Wchodzisz do niewielkiej wnęki poza granicami Reach...`,
  [`Found a tonic and a medkit!`]:
    `Znaleziono eliksir i apteczkę!`,

  // --- approach: lore trigger ---
  [`Gogu goes still. "I was born here."`]:
    `Gogu zamiera. "Urodziłem się tutaj."`,
  [`"The Syndicate came for the Current first."`]:
    `"Syndykat przybył tu najpierw po Nurt."`,

  // --- approach: cache trigger ---
  [`A waterproofed satchel, hidden in the reeds.`]:
    `Nieprzemakalna sakwa, skryta w trzcinach.`,
  [`Found a medkit!`]:
    `Znaleziono apteczkę!`,

  // --- settlement: finnTheTracker ---
  [`Finn grips his spear. "My kin Wick is missing in the Mire."`]:
    `Finn zaciska dłoń na włóczni. "Moja krewna Wick zaginęła w Mokradłach."`,
  [`"Please — find her."`]:
    `"Proszę — znajdź ją."`,
  [`Wick's home safe, telling everyone her story.`]:
    `Wick jest bezpieczna i opowiada wszystkim swoją historię.`,
  [`"Any kin of yours is kin of the Reach now."`]:
    `"Każdy twój bliski jest teraz bliskim Rozlewiska."`,
  [`"You found her!" Finn beams with relief.`]:
    `"Znalazłeś ją!" Finn aż promienieje z ulgi.`,
  [`He hands you a medkit for the road.`]:
    `Wręcza ci apteczkę na drogę.`,
  [`"She went in past the gate-tree. Hurry."`]:
    `"Poszła za drzewo-bramę. Pospiesz się."`,

  // --- settlement: birchKeeper ---
  [`"The Syndicate dug for something at the old shrine."`]:
    `"Syndykat kopał po coś przy starej świątyni."`,
  [`"I need to know what. Follow the shrine path."`]:
    `"Muszę wiedzieć, po co. Idź ścieżką do świątyni."`,
  [`"The Warden's quiet now, but the Syndicate won't stop."`]:
    `"Strażnik ucichł, ale Syndykat się nie zatrzyma."`,
  [`"Watch the sky when you leave, Wando."`]:
    `"Pilnuj nieba, gdy odejdziesz, Wando."`,
  [`"A siphon rig — they were draining the Current itself."`]:
    `"Instalacja ssąca — wyciągali sam Nurt."`,
  [`"Something corrupted guards the rest. Go in strength."`]:
    `"Coś skażone strzeże resztek. Idź w sile."`,
  [`"Follow the shrine path into the Mire."`]:
    `"Idź ścieżką do świątyni w głąb Mokradeł."`,

  // --- settlement: mireChild ---
  [`"You feel the hum too? That's the Current."`]:
    `"Ty też czujesz ten pomruk? To Nurt."`,
  [`"I trade medkits and tonics — found most of it myself!"`]:
    `"Handluję apteczkami i eliksirami — większość sam znalazłem!"`,

  // --- settlement: selaNetmender ---
  [`"The deep channel runs black — no kinlight, no crossing."`]:
    `"Głęboki kanał płynie czarno — bez światła rodowego się nie przejdzie."`,
  [`"Wick carries a glow-reed lantern. Find it."`]:
    `"Wick miała lampion ze świetlistej trzciny. Znajdź go."`,

  // --- deepMire: oldHarl ---
  [`"Lived in these roots since before the nets came."`]:
    `"Żyję w tych korzeniach, odkąd nie było tu sieci."`,
  [`"Something woke in the deep water. Mind yourself."`]:
    `"Coś zbudziło się w głębokiej wodzie. Miej się na baczności."`,

  // --- deepMire: Wick rescue trigger ---
  [`Tangled in root-snares: Wick, Finn's kin.`]:
    `Uwikłana w korzeniowe sidła: Wick, krewna Finna.`,
  [`"Take this kinlight — it wards off the dark."`]:
    `"Weź to światło rodowe — odpędza mrok."`,

  // --- deepMire: dark-water gate trigger ---
  [`The water runs black here.`]:
    `Woda płynie tu czarno.`,
  [`No kinlight, no crossing.`]:
    `Bez światła rodowego się nie przejdzie.`,

  // --- deepMire: Syndicate evidence trigger ---
  [`A cracked Syndicate siphon rig, half-buried in muck.`]:
    `Popękana instalacja ssąca Syndykatu, na wpół zagrzebana w szlamie.`,
  [`"Mossroot nodes test positive for Current draw..."`]:
    `"Węzły korzeni mchu wykazują pobór Nurtu..."`,

  // --- deepMire: cache trigger ---
  [`A waterproof satchel, wedged in the roots.`]:
    `Nieprzemakalna sakwa, wklinowana w korzenie.`,

  // --- wardenLair: boss lead-in trigger ---
  [`The corridor opens on a sunken grotto.`]:
    `Korytarz otwiera się na zatopioną grotę.`,
  [`"Bog Warden..." Gogu's voice shakes. "What did they do to it?"`]:
    `"Strażnik Bagna..." Głos Gogu drży. "Co mu zrobili?"`,
  [`Wando raises his shield. "Gogu — stay close."`]:
    `Wando podnosi tarczę. "Gogu — trzymaj się blisko."`,

  // --- wardenLair: boss onVictory ---
  [`The corrupted plating cracks away; only still water remains.`]:
    `Skażony pancerz pęka i osypuje się; zostaje tylko spokojna woda.`,
  [`Wando finds a scorched Syndicate medallion. "There's a bigger station out there — Ashvault."`]:
    `Wando znajduje osmolony medalion Syndykatu. "Tam dalej jest większa stacja — Ashvault."`,
  [`"Then that's where we go," Gogu says. Head back to the Starskiff. (+25 credits)`]:
    `"Więc tam wyruszamy," mówi Gogu. Wracaj na Starskiffa. (+25 kredytów)`,
})
