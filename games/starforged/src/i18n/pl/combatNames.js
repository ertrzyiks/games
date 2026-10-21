import { registerTranslations } from '../../engine/i18n.js'

// Enemy and move display names defined inside each world file
// (worlds/rustmoor.js etc., via registerEnemies/registerMoves), plus quest
// titles passed to startQuest() (these ARE translated — ShipScene's Quest
// Log page renders them through t(q.name)). Kept in its own file, separate
// from each world's dialogue translations file, so the per-chapter
// translation work and this pass never touch the same source file.
registerTranslations('pl', {
  // Rustmoor
  'Rustmoor Raider': 'Najeźdźca z Rustmoor',
  'Raider Scout': 'Zwiadowca Najeźdźców',
  'Scavenger Captain': 'Kapitan Szabrowników',
  'Raider Slash': 'Cięcie Najeźdźcy',
  'Scout Jab': 'Dźgnięcie Zwiadowcy',
  'Shrapnel Burst': 'Odłamkowy Wybuch',

  // Mossfen Reach
  'Bog Stalker': 'Bagienny Tropiciel',
  'Mire Lurker': 'Czyhający w Bagnie',
  'Reed Viper': 'Trzcinowa Żmija',
  'Bog Warden': 'Strażnik Bagna',
  'Mire Grasp': 'Uchwyt Bagna',
  'Bog Slam': 'Bagienny Cios',
  'Venom Bite': 'Jadowite Ukąszenie',
  'Corrupted Surge': 'Skażony Impuls',
  'Mire Regeneration': 'Bagienna Regeneracja',

  // Ashvault Station
  'Cinder Trooper': 'Żołnierz Popiołu',
  'Scrap Lurker': 'Czyhający w Złomie',
  'Reclaimer Drone': 'Dron Odzysku',
  'Syndicate Foreman': 'Brygadzista Syndykatu',
  'Shock Baton': 'Pałka Elektryczna',
  'Overload Vent': 'Przeciążony Wylot',
  'Chain Lash': 'Łańcuchowe Uderzenie',
  'Rusted Claw': 'Zardzewiały Pazur',
  'Drone Pulse': 'Impuls Drona',

  // Skyreach Canopy
  'Gale Stalker': 'Tropiciel Wichru',
  'Wind Reaver': 'Grabieżca Wiatru',
  'Root Lurker': 'Czyhający w Korzeniach',
  'Enforcer Vane': 'Egzekutorka Vane',
  'Wind Slash': 'Cięcie Wiatru',
  'Talon Rake': 'Pazurowe Drapnięcie',
  'Root Coil': 'Korzeniowy Uścisk',
  'Cyclone Cleave': 'Cyklonowe Rozcięcie',
  'Downdraft Slam': 'Cios Opadającego Wiatru',
  Stormshear: 'Burzowe Rozdarcie',

  // The Hollow
  'Hollow Elite Guard': 'Elitarny Strażnik Czeluści',
  'Hollow Shadow Agent': 'Cieniowy Agent Czeluści',
  'Syndicate Warden': 'Strażnik Syndykatu',
  'Shock Lance': 'Lanca Elektryczna',
  'Crushing Blow': 'Miażdżący Cios',
  'Resonant Slam': 'Rezonansowy Cios',
  'Syndicate Venom': 'Jad Syndykatu',
  "Warden's Resolve": 'Determinacja Strażnika',

  // Quest titles (startQuest's 3rd arg), rendered in the Quest Log.
  'Signs of the Syndicate': 'Ślady Syndykatu',
  "Yara's Buried Cache": 'Zakopana Skrzynia Yary',
  'The Lost Scout': 'Zaginiony Zwiadowca',
  'What the Syndicate Took': 'Co Zabrał Syndykat',
  'Free Tamsin': 'Uwolnij Tamsin',
  'The Current Extractor': 'Ekstraktor Nurtu',
  'Shroud the Current-Well': 'Osłoń Studnię Nurtu',
  'Find Wren in the High Reaches': 'Znajdź Wren w Wysokich Ostępach',
  'Break the Hollow': 'Złam Pustkę',
})
