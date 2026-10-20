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
 *
 * Re-synced for the shortened (1 sentence/line, 2-line max, 3 for the boss
 * lead-in/victory) dialogue pass - all stale long-form entries removed.
 */
import { registerTranslations } from '../../engine/i18n.js'

registerTranslations('pl', {
  // Map segment names, shown in the HUD as "Rustmoor - {name}".
  Canyon: 'Kanion',
  Settlement: 'Osada',
  Depths: 'Głębiny',

  'Raiders hit us at dawn — Hollow Syndicate markings on their wagon.': 'Rajderzy napadli o świcie — znaki Syndykatu Pustki na ich wozie.',
  'Find proof deep in the old mine tunnels.': 'Znajdź dowody głęboko w starych tunelach kopalni.',
  "Rustmoor's safe from that captain's crew.": 'Rustmoor jest bezpieczne przed załogą tego kapitana.',
  "But the Syndicate's still watching the Drift.": 'Ale Syndykat wciąż obserwuje Dryf.',
  "So it's real — they're not done with Rustmoor.": 'Więc to prawda — nie skończyli z Rustmoor.',
  'Stop that raider captain and cut their leash.': 'Powstrzymaj tego kapitana rajderów i przetnij ich uzdę.',
  'No proof yet? Check the old mine tunnels.': 'Wciąż bez dowodów? Sprawdź stare tunele kopalni.',
  "That raider camp isn't just scavengers anymore.": 'Ten obóz rajderów to już nie tylko zbieracze złomu.',
  "This raider captain's squeezing us dry.": 'Ten kapitan rajderów wyciska z nas ostatnie soki.',
  "Deal with him, and I'll fuel your skiff myself.": 'Poradź sobie z nim, a osobiście zatankuję twój szkuner.',
  'My medkit cache is buried past the rockfall.': 'Moja skrzynka apteczek jest zakopana za zawałem.',
  "Take my pick — it'll clear the rubble.": 'Weź mój kilof — rozbije ten gruz.',
  'Pick served you well? Stay sharp out there.': 'Kilof dobrze się przysłużył? Miej się na baczności.',
  'You found it — the kits are still good!': 'Znalazłeś to — apteczki wciąż dobre!',
  'Take your share. (+2 medkits, DEF +1!)': 'Weź swoją część. (+2 apteczki, OBR +1!)',
  "Rockfall's east of the mid chamber. My pick breaks through.": 'Zawał jest na wschód od środkowej komory. Mój kilof przebije się przez niego.',
  'Gogu, are you Current-touched too?': 'Gogu, ty też jesteś Naznaczony Nurtem?',
  'Stay away from the rockfall — a scary boss lives there!': 'Nie podchodź do zawału — mieszka tam straszny szef!',
  'Raiders dug in deep down there.': 'Rajderzy zakopali się tam głęboko.',
  'Their captain answers to someone bigger now.': 'Ich kapitan odpowiada teraz przed kimś ważniejszym.',
  "There's a boulder up in the canyon that looks shoved into place.": 'W kanionie jest głaz, który wygląda jakby ktoś go tam wepchnął.',
  'Scavengers hide stashes like that. Worth a look.': 'Zbieracze chowają tak swoje skrytki. Warto zerknąć.',
  'You shove the boulder aside...': 'Odsuwasz głaz na bok...',
  'A scavenger stash! (+1 medkit, +1 tonic)': 'Skrytka zbieraczy! (+1 apteczka, +1 eliksir)',
  'You found their marker — I told you it was real.': 'Znalazłeś ich znak — mówiłam, że to prawda.',
  'Warn Dessa. Watch for that captain.': 'Uprzedź Dessę. Uważaj na tego kapitana.',
  'Raiders dragged me down here and left me chained.': 'Rajderzy zaciągnęli mnie tutaj i zostawili w kajdanach.',
  'I saw them meet someone in black sailcloth — Syndicate colors.': 'Widziałam, jak spotykają kogoś w czarnym płótnie — barwy Syndykatu.',
  'A jagged sigil is scratched into the wall.': 'Postrzępiony symbol jest wyryty w murze.',
  'Fresh boot prints lead deeper in.': 'Świeże odciski butów wiodą głębiej.',
  "You find Yara's cache — some medkits survived.": 'Znajdujesz skrzynkę Yary — kilka apteczek przetrwało.',
  'Worth bringing back to her.': 'Warto jej to zanieść.',
  "Yara's pick clears the rockfall. The way south opens.": 'Kilof Yary rozbija zawał. Droga na południe się otwiera.',
  'Fallen rock blocks the tunnel ahead.': 'Zwalone skały blokują tunel przed tobą.',
  "You'd need the right tool to clear it.": 'Potrzebowałbyś odpowiedniego narzędzia, by to usunąć.',
  'The tunnel opens into a torch-lit chamber.': 'Tunel otwiera się na komorę oświetloną pochodniami.',
  '"Hand him over — the Syndicate pays well," the raider sneers.': '"Oddaj go — Syndykat dobrze płaci" — szydzi rajder.',
  'Wando steps between them. "Not a chance."': 'Wando staje między nimi. "Nie ma szans."',
  'The captain gives up — a Syndicate sigil-coin rolls free.': 'Kapitan się poddaje — moneta-sygnet Syndykatu wypada na ziemię.',
  "Rustmoor's shakedown is over. Wando's skiff is fueled and ready.": 'Wyzysk Rustmoor się skończył. Szkuner Wando jest zatankowany i gotowy.',
  'Head back to the Starskiff — a new world awaits.': 'Wróć na Gwiezdny Szkuner — czeka nowy świat.',
})
