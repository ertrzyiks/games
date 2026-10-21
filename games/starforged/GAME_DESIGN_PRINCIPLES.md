# Starforged — Game Design Principles

Rules every change to Starforged must keep. Check new or edited content
against this list before committing.

## Tone: adventure, not violence

Starforged is a family-friendly adventure. Fights happen, but nobody bleeds
and nobody dies.

- **No blood.** No bleeding, wounds, gore, or blood-based figures of speech
  ("bleeding us dry" → "squeezing us dry").
- **No killing or death.** Characters and enemies are *defeated*, *give up*,
  *retreat*, or *are stopped*, never killed, slain, or dead. Avoid words like
  "kill", "dead", "die", "murder", "corpse", or "grave", and euphemisms that
  mean death in context ("the captain falls", "your party has fallen").
  This also applies to machines and objects: a relay is *shut down*, alarms
  are *down*, a device *shuts down*.
- **No death threats.** Villains can threaten to capture, take, or lock away,
  not to kill ("Kneel, and hand him over", not "Kneel, and he lives").
- **Missing, not dead.** Lost characters are *missing* or *gone*, and they get
  found.
- **Translations follow the same rules.** Polish text must not bring back
  what the English avoids. For example, use "zaginęła" (*went missing*), not
  "zginęła" (*died*), and avoid "poległ", "zabić", "krew" or "padlinożerca".
  Translations are keyed by the exact English string, so when you change an
  English line, change its key in `src/i18n/pl/*.js` too.

Battle mechanics (HP, damage, defeat, weapons such as blasters) are fine; the
rules above are about how the text describes them.

## Compatibility

See the repo-root `Agents.md`: small screens and touch input are first-class.
