# Define the touch & keyboard control scheme

Type: grilling
Status: resolved

## Question

What is the exact control scheme for the X-wing shooter (see [map.md](../map.md))?

Already decided on the map: auto-fire is always on, so the primary touch input is movement-only, and Gogu's special skill(s) fire via one separate explicit input. This ticket is blocked on the engine-selection ticket because the concrete implementation (virtual joystick vs. direct finger-follow drag, pointer API vs. engine-native input handling) depends on what the chosen engine offers out of the box — see [01-engine.md](01-engine.md), resolved as Phaser.

Resolve:
- Exact touch movement scheme: does the ship follow the finger directly (absolute position), or is movement relative/joystick-style (drag vector controls velocity/direction)?
- Desktop/keyboard equivalent for local dev/testing (e.g. arrow keys / WASD for movement).
- How Gogu's skill input is presented (a fixed on-screen button? where on screen, sized for a thumb on a small screen without blocking the play area).
- Any constraints Phaser's input system imposes that change the above (e.g. its `setInteractive({draggable:true})` API, pointer events, Scale Manager).

Work it live with the user, one question at a time.

## Answer

- **Movement:** direct finger-follow drag — the ship's position eases toward the pointer/touch position (clamped within the play-area bounds), using a `pointermove` listener on the whole game canvas rather than a draggable game object. The entire screen is the control surface — no tiny joystick nub to hunt for on a small screen.
- **Desktop equivalent:** arrow keys / WASD move the ship at a fixed speed in the corresponding direction, for local dev/testing.
- **Gogu skill input:** a fixed circular button, bottom-right corner, out of the way of the movement drag surface. Tap = Force Nudge, long-press (~400ms hold) = Force Wave (only fires if its meter is full). The button shows two stacked fill-rings for the two skills' charge state (see [04-gogu-skills.md](04-gogu-skills.md)).
- **Autofire:** continuous, no input — driven by a repeating Phaser timer event on the player ship, consistent with the map's decision to keep touch input movement-only.
