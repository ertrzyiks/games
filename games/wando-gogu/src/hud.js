// DOM-overlay HUD: HP bars for Wando/both bases, the ability button (same
// bottom-corner pattern as the shooter's Gogu button), and the match-over
// overlay. See .scratch/wando-gogu-arts/issues/04-towers-base.md and
// 06-controls-camera.md.
export function createHud(container) {
  const root = document.createElement('div')
  root.style.cssText =
    'position:absolute;inset:0;pointer-events:none;font-family:sans-serif;color:#fff;user-select:none'
  container.appendChild(root)

  const bars = document.createElement('div')
  bars.style.cssText = 'position:absolute;top:10px;left:10px;right:10px;display:flex;flex-direction:column;gap:6px'
  root.appendChild(bars)

  function makeBar(label, color) {
    const wrap = document.createElement('div')
    wrap.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px'
    const text = document.createElement('span')
    text.textContent = label
    text.style.cssText = 'width:70px;flex:none'
    const track = document.createElement('div')
    track.style.cssText = 'flex:1;height:10px;background:rgba(0,0,0,0.4);border-radius:6px;overflow:hidden;max-width:160px'
    const fill = document.createElement('div')
    fill.style.cssText = `height:100%;background:${color};width:100%`
    track.appendChild(fill)
    wrap.appendChild(text)
    wrap.appendChild(track)
    bars.appendChild(wrap)
    return fill
  }

  const wandoFill = makeBar('Wando', '#5ad1ff')
  const allyBaseFill = makeBar('Ally Base', '#3a7bd5')
  const enemyBaseFill = makeBar('Enemy Base', '#d5473a')

  const abilityBtn = document.createElement('button')
  abilityBtn.textContent = ''
  abilityBtn.style.cssText =
    'position:absolute;right:20px;bottom:20px;width:70px;height:70px;border-radius:50%;' +
    'background:#1a2230;border:3px solid #5ad1ff;pointer-events:auto;cursor:pointer'
  root.appendChild(abilityBtn)

  // Manual fire button — attacking is player-triggered, not automatic, per
  // the 2026-11-25 change in .scratch/wando-gogu-arts/issues/06-controls-camera.md.
  const fireBtn = document.createElement('button')
  fireBtn.textContent = '⚔'
  fireBtn.style.cssText =
    'position:absolute;right:104px;bottom:20px;width:70px;height:70px;border-radius:50%;' +
    'background:#1a2230;border:3px solid #ff5a5a;color:#fff;font-size:28px;' +
    'pointer-events:auto;cursor:pointer'
  root.appendChild(fireBtn)

  const overlay = document.createElement('div')
  overlay.style.cssText =
    'position:absolute;inset:0;display:none;align-items:center;justify-content:center;' +
    'flex-direction:column;gap:16px;background:rgba(0,0,0,0.6);pointer-events:none'
  const overlayText = document.createElement('div')
  overlayText.style.cssText = 'font-size:40px;font-weight:bold'
  const restartBtn = document.createElement('button')
  restartBtn.textContent = 'Restart'
  restartBtn.style.cssText =
    'font-size:18px;padding:10px 20px;border-radius:8px;background:#5ad1ff;border:none;pointer-events:auto;cursor:pointer'
  overlay.appendChild(overlayText)
  overlay.appendChild(restartBtn)
  root.appendChild(overlay)

  return {
    abilityButton: abilityBtn,
    fireButton: fireBtn,
    restartButton: restartBtn,
    setWandoHp(frac) {
      wandoFill.style.width = `${Math.max(0, frac) * 100}%`
    },
    setAllyBaseHp(frac) {
      allyBaseFill.style.width = `${Math.max(0, frac) * 100}%`
    },
    setEnemyBaseHp(frac) {
      enemyBaseFill.style.width = `${Math.max(0, frac) * 100}%`
    },
    setAbilityCooldown(frac) {
      // frac: 1 = just used (fully on cooldown), 0 = ready.
      const pct = Math.round(frac * 100)
      abilityBtn.style.background = `conic-gradient(rgba(0,0,0,0.75) ${pct}%, #1a2230 ${pct}%)`
    },
    setFireCooldown(frac) {
      const pct = Math.round(frac * 100)
      fireBtn.style.background = `conic-gradient(rgba(0,0,0,0.75) ${pct}%, #1a2230 ${pct}%)`
    },
    showMatchOver(won) {
      overlay.style.display = 'flex'
      overlayText.textContent = won ? 'VICTORY' : 'DEFEAT'
      overlayText.style.color = won ? '#5ad1ff' : '#ff5a5a'
    },
  }
}
