# Define the touch & keyboard control scheme

Type: grilling
Blocked by: 01

## Question

What is the exact control scheme for the X-wing shooter (see [map.md](../map.md))?

Already decided on the map: auto-fire is always on, so the primary touch input is movement-only, and Gogu's special skill(s) fire via one separate explicit input. This ticket is blocked on the engine-selection ticket because the concrete implementation (virtual joystick vs. direct finger-follow drag, pointer API vs. engine-native input handling) depends on what the chosen engine offers out of the box — see [01-engine.md](01-engine.md), resolved as Phaser.

Resolve:
- Exact touch movement scheme: does the ship follow the finger directly (absolute position), or is movement relative/joystick-style (drag vector controls velocity/direction)?
- Desktop/keyboard equivalent for local dev/testing (e.g. arrow keys / WASD for movement).
- How Gogu's skill input is presented (a fixed on-screen button? where on screen, sized for a thumb on a small screen without blocking the play area).
- Any constraints Phaser's input system imposes that change the above (e.g. its `setInteractive({draggable:true})` API, pointer events, Scale Manager).

Work it live with the user, one question at a time.
