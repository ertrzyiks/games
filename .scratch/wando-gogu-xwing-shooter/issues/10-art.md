# Define the art/asset pipeline & visual style

Type: grilling
Status: resolved

## Question

What art/asset pipeline and visual style should the X-wing shooter (see [map.md](../map.md)) use?

Blocked on the engine-selection ticket ([01-engine.md](01-engine.md), resolved as Phaser), since the viable options depend on what the chosen engine supports natively (Phaser has a texture/atlas pipeline). Worth noting as a reference point: `starforged` draws its sprites procedurally in code (see `starforged/src/assets/spriteTemplates.js`) rather than using image assets — that's one option here too, not a requirement.

Resolve:
- Procedural/code-drawn sprites (like `starforged`) vs. image-based sprite sheets vs. Phaser's own texture/atlas tooling — which fits this project's constraints (no art pipeline/tooling beyond what's already in the repo, kid-friendly visual style)?
- Overall visual style direction (simple flat shapes? more detailed pixel-art-style? consistent with the pseudo-Star-Wars, kid-friendly tone already set).
- How this choice affects iteration speed on the enemy/boss tickets (if those are still open, flag anything that should change in how they're specified).

Work it live with the user, one question at a time.

## Answer

- **Pipeline:** procedural/code-drawn sprites via Phaser's `Graphics` API, rendered once to a texture at startup (`generateTexture`) per shape — mirrors `starforged`'s `spriteTemplates.js` approach. No external image assets, no texture-atlas tooling, no new dependency beyond Phaser itself; keeps the repo's existing "no art pipeline" precedent intact.
- **Visual style:** simple flat shapes, bold outlines, bright saturated colors — clean, high-contrast silhouettes readable at scroll speed. Rounded, friendly forms throughout (rounded X-wing nose, round-eyed droids) — cartoon-ish and kid-friendly, nothing sharp/aggressive.
- **Implication for enemy/boss tickets:** describe enemies and bosses by shape/silhouette and color (e.g. "round-bodied droid with two stubby arms"), not by pixel-level detail — the procedural-shapes approach means a "design" is really just a Graphics-drawing recipe.
