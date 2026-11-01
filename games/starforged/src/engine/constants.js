export const TILE_SIZE = 16
// One more tile visible in every direction than the original 10x9 view
// (so +2 on each axis, not +1 - "one more" on both the left/right or
// top/bottom edges of a symmetric camera). Keep index.html's #game-stage
// `aspect-ratio` (CANVAS_WIDTH / CANVAS_HEIGHT) in sync with these if they
// ever change again - that's hardcoded CSS, not derived from here.
export const VIEW_COLS = 12
export const VIEW_ROWS = 11
export const CANVAS_WIDTH = TILE_SIZE * VIEW_COLS
export const CANVAS_HEIGHT = TILE_SIZE * VIEW_ROWS

export const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export const MOVE_DURATION_MS = 140
