import { CANVAS_WIDTH } from '../engine/constants.js'
import { t } from '../engine/i18n.js'

/**
 * Small, unobtrusive party status readout drawn in the top-right corner of
 * the overworld. Deliberately minimal (name, level, HP) so it never
 * overlaps the world-name label overworldScene.js draws top-left.
 */
export function drawHud(ctx, state) {
  if (!state || !state.party) return

  const members = Object.values(state.party)
  if (members.length === 0) return

  const lineH = 7
  const padding = 3
  const rowWidth = 54
  const boxW = rowWidth + padding * 2
  const boxH = members.length * lineH + padding * 2
  const x = CANVAS_WIDTH - boxW - 3
  const y = 3

  ctx.fillStyle = 'rgba(11, 13, 18, 0.75)'
  ctx.fillRect(x, y, boxW, boxH)
  ctx.strokeStyle = '#3a3f4b'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, boxW, boxH)

  ctx.font = '6px Consolas, Menlo, monospace'
  members.forEach((member, i) => {
    const rowY = y + padding + (i + 1) * lineH - 2
    const alive = member.hp > 0
    ctx.fillStyle = alive ? '#e8e8e8' : '#e0564b'
    ctx.fillText(`${t(member.name)} L${member.level}`, x + padding, rowY)
    ctx.fillStyle = alive ? '#9ba1b4' : '#e0564b'
    ctx.fillText(`${member.hp}/${member.maxHp}`, x + padding + 30, rowY)
  })
}
