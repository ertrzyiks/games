# Define lives, game-over, and continue-from-last-stage flow

Type: grilling

## Question

What are the lives/game-over rules and the continue-from-last-stage flow for the X-wing shooter (see [map.md](../map.md))?

Already decided on the map: the only persisted state is the last completed stage (no high scores, no inventory, no leveling). This ticket fixes what happens around death and session boundaries.

Resolve:
- How many lives does the player have per attempt, if any (could also be a no-lives, restart-on-hit model — decide which)?
- What happens on death: restart the current stage from its beginning, respawn in place, or something else? What happens if lives run out (if lives exist)?
- How does "continue from last completed stage" surface to the player on launch (a stage-select screen? automatic resume? a title screen with a "continue" option)?
- Interaction between mid-stage death and the saved progress — does dying mid-stage ever overwrite the saved "last completed stage," or only a clean stage clear does?

Work it live with the user, one question at a time.
