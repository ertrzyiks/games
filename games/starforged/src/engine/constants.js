export const TILE_SIZE = 16
export const VIEW_COLS = 10
export const VIEW_ROWS = 9
export const CANVAS_WIDTH = TILE_SIZE * VIEW_COLS
export const CANVAS_HEIGHT = TILE_SIZE * VIEW_ROWS

export const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export const MOVE_DURATION_MS = 140
