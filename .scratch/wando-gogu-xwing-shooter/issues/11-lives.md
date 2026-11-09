# Define lives, game-over, and continue-from-last-stage flow

Type: grilling
Status: resolved

## Question

What are the lives/game-over rules and the continue-from-last-stage flow for the X-wing shooter (see [map.md](../map.md))?

Already decided on the map: the only persisted state is the last completed stage (no high scores, no inventory, no leveling). This ticket fixes what happens around death and session boundaries.

Resolve:
- How many lives does the player have per attempt, if any (could also be a no-lives, restart-on-hit model — decide which)?
- What happens on death: restart the current stage from its beginning, respawn in place, or something else? What happens if lives run out (if lives exist)?
- How does "continue from last completed stage" surface to the player on launch (a stage-select screen? automatic resume? a title screen with a "continue" option)?
- Interaction between mid-stage death and the saved progress — does dying mid-stage ever overwrite the saved "last completed stage," or only a clean stage clear does?

Work it live with the user, one question at a time.

## Answer

- **Lives:** 3 per attempt, classic arcade count, kid-friendly.
- **On hit:** ship does a harmless "poof" (puff of smoke/stars, no gore), loses a life, respawns at the bottom of the screen after a ~1.5s invulnerability window. Weapon level (Twin Blaster) and Shield Orb both reset to base on respawn — power-ups don't survive a death.
- **On losing all 3 lives:** Game Over screen; retry restarts the *current* stage from its beginning (never bounces back further than that), to keep frustration low.
- **Continue flow:** completing a stage (beating its boss) immediately saves "last completed stage" to localStorage. On launch, a simple stage-select screen offers: play Stage 1, or jump to the next uncompleted stage if progress exists, plus the option to replay any already-completed stage (no hard progression lock, since there's no meta-progression to protect).
- **Mid-stage death never overwrites saved progress** — only a clean stage-clear updates "last completed stage."
