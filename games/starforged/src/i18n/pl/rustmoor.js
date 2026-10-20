/**
 * Polish translations for Rustmoor world dialogue (games/starforged/src/worlds/rustmoor.js).
 *
 * Keys are exact-match source strings from rustmoor.js; dialogue.js runs every
 * line shown to the player through t(), so registering them here is enough -
 * no changes to the world file itself are needed.
 *
 * Deliberately NOT translated:
 *  - 'Scavenger Captain' (enemy display name - not dialogue text, out of scope).
 *  - 'Signs of the Syndicate' / "Yara's Buried Cache" (quest titles passed to
 *    startQuest(); nothing in the game currently renders them through t(), so
 *    a dictionary entry here would be a no-op).
 *  - The world name 'Rustmoor' - kept as a proper noun/place name, so no entry
 *    is registered for it either.
 *  - Dynamic battle combat-log lines (e.g. "X uses Y! Z takes N damage.") -
 *    those are template-based in battle/battleScene.js, not per-world text.
 */
import { registerTranslations } from '../../engine/i18n.js'

registerTranslations('pl', {
  "They came at dawn — black sails, no warning. Took half our grain before we even armed up.": "Przyszli o świcie — czarne żagle, bez ostrzeżenia. Zabrali połowę naszego zboża, zanim zdążyliśmy się uzbroić.",
  "I saw their mark burned into the wagon side. Hollow Syndicate, same as the stories out of Mossfen.": "Widziałam ich znak wypalony na burcie wozu. Syndykat Pustki, tak jak w opowieściach z Mossfen.",
  "If they're scouting this far into the canyon, Rustmoor's just the start. Find proof, deep in the old mine tunnels.": "Jeśli zwiadują tak daleko w kanionie, Rustmoor to tylko początek. Znajdź dowody, głęboko w starych tunelach kopalni.",
  "Rustmoor's clear of that captain's crew, thanks to you. For now.": "Rustmoor jest wolne od załogi tego kapitana, dzięki tobie. Na razie.",
  "Burn marks like that mean the Syndicate is still watching the Drift. Keep your guard up out there.": "Takie wypalone znaki znaczą, że Syndykat wciąż obserwuje Dryf. Miej się na baczności tam na zewnątrz.",
  "You found their sign in the depths? Then it's real — they're not done with Rustmoor.": "Znalazłeś ich znak w głębinach? Więc to prawda — nie skończyli z Rustmoor.",
  "That raider captain's been taking a cut for the Syndicate's silence. End him and you cut their leash on this canyon.": "Ten kapitan rajderów brał dla Syndykatu udział za milczenie. Zabij go, a przetniesz ich uzdę na ten kanion.",
  "Still haven't found proof? The old mine tunnels west of the settlement — that's where their scouts would have passed through.": "Wciąż nie znalazłeś dowodów? Stare tunele kopalni na zachód od osady — to tamtędy musieli przechodzić ich zwiadowcy.",
  "Be careful. Whatever's running that raider camp down there isn't just scavengers anymore.": "Bądź ostrożny. To, co rządzi tym obozem rajderów, to już nie tylko zbieracze złomu.",
  "Rustmoor's held on through worse than raiders, but this captain's bleeding us slow.": "Rustmoor przetrwało gorsze rzeczy niż rajderzy, ale ten kapitan wykrwawia nas powoli.",
  "Wando — if you and the boy can deal with him, I'll see your skiff gets fueled myself.": "Wando — jeśli ty i chłopiec poradzicie sobie z nim, osobiście dopilnuję, żeby wasz szkuner został zatankowany.",
  "Yara and Dessa both have their ears to the ground. Talk to them before you head into the tunnels.": "Yara i Dessa mają oko i ucho na wszystko, co się dzieje. Pogadaj z nimi, zanim wejdziesz do tuneli.",
  "You're headed into the tunnels? Then do an old trader a favor.": "Idziesz do tuneli? To wyświadcz starej handlarce przysługę.",
  "I had a cache of medkits stashed past the old rockfall before the raiders ran us out.": "Miałam schowaną skrzynkę apteczek za starym zawałem, zanim rajderzy nas wygnali.",
  "Take my mining pick — it's the only thing that'll shift that rubble now. Bring back what's left and I'll split it with you.": "Weź mój kilof górniczy — to jedyne, co teraz ruszy ten gruz. Przynieś, co zostało, a podzielę się z tobą.",
  "That pick's served you well, I hope. Mind yourself out there — the canyon's quieter, but not safe.": "Ten kilof dobrze ci się przysłużył, mam nadzieję. Uważaj tam na zewnątrz — w kanionie jest spokojniej, ale nie bezpiecznie.",
  "You found it! Half-crushed, but the kits inside are still good.": "Znalazłeś to! Na pół zgniecione, ale apteczki w środku wciąż dobre.",
  "Here — take a share, and keep the rest. That old armor of yours could use the extra plating too.": "Masz — weź swoją część, a resztę zatrzymaj. Ta twoja stara zbroja też skorzysta na dodatkowym poszyciu.",
  "(You gained 2 medkits and Wando's defense increased!)": "(Zdobyto 2 apteczki, a obrona Wando'a wzrosła!)",
  "The rockfall's past the mid chamber, east side. My pick should break through — look for the gap in the tunnel wall.": "Zawał jest za środkową komorą, po wschodniej stronie. Mój kilof powinien przebić się przez niego — szukaj szczeliny w murze tunelu.",
  "Gogu! Are you a Current-touched too? My gran says that's why the lights flicker when you're near.": "Gogu! Ty też jesteś Naznaczony Nurtem? Moja babcia mówi, że przez to migają światła, kiedy jesteś w pobliżu.",
  "Don't go past the rockfall in the tunnels without a grown-up. That's where the scary raider boss lives!": "Nie wchodź za zawał w tunelach bez dorosłego. Tam mieszka ten straszny szef rajderów!",
  "Mind yourself down there. Raiders've dug in deep, and their captain doesn't fight fair.": "Uważaj tam w dole. Rajderzy zakopali się głęboko, a ich kapitan nie walczy czysto.",
  "Word is he answers to someone bigger these days. Didn't used to be that organized.": "Mówią, że ostatnio odpowiada przed kimś ważniejszym. Wcześniej nie byli tak zorganizowani.",
  "You found their marker, then. I told you it was real.": "Więc znalazłeś ich znak. Mówiłam, że to prawda.",
  "Get back to the surface and warn Dessa properly — and watch for that captain. He answers to someone now.": "Wróć na powierzchnię i uprzedź dobrze Dessę — i uważaj na tego kapitana. Teraz odpowiada przed kimś innym.",
  "Raiders dragged me down here when they hit my wagon. Left me chained once they realized I had nothing worth taking.": "Rajderzy zaciągnęli mnie tutaj, kiedy napadli na mój wóz. Zostawili mnie w kajdanach, gdy zrozumieli, że nie mam nic wartego zabrania.",
  "I saw them meet someone in black sailcloth near an old marker, deeper in. Hollow Syndicate colors, if the stories are true.": "Widziałam, jak spotykają się z kimś w czarnym płótnie żeglarskim przy starym znaku, głębiej w środku. Barwy Syndykatu Pustki, jeśli te opowieści są prawdziwe.",
  "Scratched into the tunnel wall: a jagged sigil, half-covered in soot. Not a scavenger's mark.": "Wyryty w murze tunelu: postrzępiony symbol, na pół pokryty sadzą. To nie znak zbieracza złomu.",
  "Fresh boot prints lead deeper in — someone was here recently, and not alone.": "Świeże odciski butów wiodą głębiej — ktoś był tu niedawno, i nie sam.",
  "Tucked behind a fallen beam, you find Yara's old supply cache — raiders picked through it, but some medkits survived.": "Schowana za zwaloną belką, znajdujesz starą skrzynkę zapasów Yary — rajderzy ją przegrzebali, ale kilka apteczek przetrwało.",
  "Worth bringing back to her.": "Warto to jej zanieść.",
  "Yara's old mining pick makes short work of the rockfall. The way south opens up.": "Stary kilof górniczy Yary szybko rozprawia się z zawałem. Droga na południe się otwiera.",
  "A wall of fallen rock and old timber blocks the tunnel ahead.": "Ściana zwalonych kamieni i starego drewna blokuje tunel przed tobą.",
  "You'd need the right tool to clear a path through — someone back in the settlement might have one.": "Potrzebowałbyś odpowiedniego narzędzia, by przebić się przez to — ktoś w osadzie może je mieć.",
  "The tunnel opens into a wide, torch-lit chamber — scrap armor piled like trophies against the walls.": "Tunel otwiera się na szeroką, oświetloną pochodniami komorę — złomowa zbroja ułożona jak trofea wzdłuż murów.",
  "\"Another fool wandered into my canyon,\" a scarred raider sneers, hefting a jagged blade. \"The Syndicate pays well for Current-touched brats. Hand him over.\"": "\"Kolejny głupiec zabłądził do mojego kanionu\" — szydzi pokryty bliznami rajder, podnosząc postrzępione ostrze. \"Syndykat dobrze płaci za bachory naznaczone Nurtem. Oddaj go.\"",
  "Wando steps between them, shield raised. \"Not a chance.\"": "Wando staje między nimi z podniesioną tarczą. \"Nie ma szans.\"",
  "The captain collapses amid his own scrap-metal trophies, a Syndicate contact's sigil-coin rolling free of his coat.": "Kapitan osuwa się pośród własnych złomowych trofeów, a z jego płaszcza wypada moneta-sygnet kontaktu Syndykatu.",
  "With Rustmoor's shakedown broken, the settlement makes good on its word — Wando's skiff sits fueled and ready at the canyon's edge.": "Gdy wyzysk Rustmoor zostaje złamany, osada dotrzymuje słowa — szkuner Wando'a stoi zatankowany i gotowy na skraju kanionu.",
  "But the sigil-coin is proof enough: the Hollow Syndicate is real, and it is already moving through the Drift.": "Ale moneta-sygnet jest dowodem wystarczającym: Syndykat Pustki jest realny i już przemieszcza się przez Dryf.",
  "Head back to the Starskiff — a new world on the Drift is ready to chart.": "Wróć na Gwiezdny Szkuner — nowy świat na Dryfie jest gotowy do odkrycia.",
})
