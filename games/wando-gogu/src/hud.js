// DOM-overlay HUD: HP bars for Wando/both bases, the ability button (same
// bottom-corner pattern as the shooter's Gogu button), and the match-over
// overlay. See .scratch/wando-gogu-arts/issues/04-towers-base.md and
// 06-controls-camera.md.
export function createHud(container) {
  const root = document.createElement('div')
  root.style.cssText =
    'position:absolute;inset:0;pointer-events:none;font-family:sans-serif;color:#fff;user-select:none'
  container.appendChild(root)

  // Crosshair — fixed at screen center, marking exactly where manual fire's
  // straight-ahead raycast points (see ai.js's findForwardTarget).
  const crosshair = document.createElement('div')
  crosshair.style.cssText =
    'position:absolute;left:50%;top:50%;width:24px;height:24px;transform:translate(-50%,-50%)'
  crosshair.innerHTML =
    '<div style="position:absolute;left:50%;top:0;width:2px;height:8px;background:#fff;transform:translateX(-50%);box-shadow:0 0 2px #000"></div>' +
    '<div style="position:absolute;left:50%;bottom:0;width:2px;height:8px;background:#fff;transform:translateX(-50%);box-shadow:0 0 2px #000"></div>' +
    '<div style="position:absolute;top:50%;left:0;height:2px;width:8px;background:#fff;transform:translateY(-50%);box-shadow:0 0 2px #000"></div>' +
    '<div style="position:absolute;top:50%;right:0;height:2px;width:8px;background:#fff;transform:translateY(-50%);box-shadow:0 0 2px #000"></div>'
  root.appendChild(crosshair)

  // Battle-state strip: both bases and all four towers laid out like an
  // unrolled lane — [ally base][ally tower near-base][ally tower near-mid]
  // -- [enemy tower near-mid][enemy tower near-base][enemy base] — so the
  // gap between the two flex groups itself reads as the lane's midpoint,
  // with a thin divider line reinforcing it.
  const topStrip = document.createElement('div')
  topStrip.style.cssText =
    'position:absolute;top:10px;left:10px;right:10px;display:flex;align-items:center;justify-content:space-between'
  root.appendChild(topStrip)

  const midDivider = document.createElement('div')
  midDivider.style.cssText =
    'position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:rgba(255,255,255,0.3);transform:translateX(-50%)'
  topStrip.appendChild(midDivider)

  const allyGroup = document.createElement('div')
  allyGroup.style.cssText = 'display:flex;align-items:center;gap:4px'
  topStrip.appendChild(allyGroup)

  const enemyGroup = document.createElement('div')
  enemyGroup.style.cssText = 'display:flex;align-items:center;gap:4px'
  topStrip.appendChild(enemyGroup)

  function makeBaseBar(color) {
    const track = document.createElement('div')
    track.style.cssText =
      'width:64px;height:10px;background:rgba(0,0,0,0.4);border-radius:5px;overflow:hidden;flex:none'
    const fill = document.createElement('div')
    fill.style.cssText = `height:100%;background:${color};width:100%`
    track.appendChild(fill)
    return { el: track, fill }
  }

  function makeTowerIcon(color) {
    const track = document.createElement('div')
    track.style.cssText =
      'position:relative;width:13px;height:22px;background:rgba(0,0,0,0.4);border-radius:3px;' +
      'overflow:hidden;flex:none'
    const fill = document.createElement('div')
    fill.style.cssText = `position:absolute;left:0;right:0;bottom:0;background:${color};height:100%;` +
      'transition:height 150ms,background 150ms'
    track.appendChild(fill)
    return { el: track, fill, color }
  }

  const allyBase = makeBaseBar('#3a7bd5')
  const allyTowerNearBase = makeTowerIcon('#3a7bd5')
  const allyTowerNearMid = makeTowerIcon('#3a7bd5')
  allyGroup.appendChild(allyBase.el)
  allyGroup.appendChild(allyTowerNearBase.el)
  allyGroup.appendChild(allyTowerNearMid.el)

  const enemyTowerNearMid = makeTowerIcon('#d5473a')
  const enemyTowerNearBase = makeTowerIcon('#d5473a')
  const enemyBase = makeBaseBar('#d5473a')
  enemyGroup.appendChild(enemyTowerNearMid.el)
  enemyGroup.appendChild(enemyTowerNearBase.el)
  enemyGroup.appendChild(enemyBase.el)

  function setTowerIcon(icon, frac) {
    icon.fill.style.height = `${Math.max(0, frac) * 100}%`
    icon.fill.style.background = frac > 0 ? icon.color : '#2a2a2a'
  }

  // Wando's own HP and gold sit just below the strip, on opposite sides.
  const wandoWrap = document.createElement('div')
  wandoWrap.style.cssText = 'position:absolute;top:32px;left:10px;display:flex;align-items:center;gap:6px'
  root.appendChild(wandoWrap)
  const wandoLabel = document.createElement('span')
  wandoLabel.textContent = 'Wando'
  wandoLabel.style.cssText = 'font-size:11px'
  const wandoTrack = document.createElement('div')
  wandoTrack.style.cssText = 'width:70px;height:8px;background:rgba(0,0,0,0.4);border-radius:4px;overflow:hidden'
  const wandoFill = document.createElement('div')
  wandoFill.style.cssText = 'height:100%;background:#5ad1ff;width:100%'
  wandoTrack.appendChild(wandoFill)
  wandoWrap.appendChild(wandoLabel)
  wandoWrap.appendChild(wandoTrack)

  // Gold — a placeholder economy for a later shop, see
  // .scratch/wando-gogu-arts/issues/04-towers-base.md.
  const goldText = document.createElement('div')
  goldText.style.cssText =
    'position:absolute;top:32px;right:10px;font-size:13px;font-weight:bold;color:#ffcc33;' +
    'text-shadow:0 0 3px #000'
  root.appendChild(goldText)

  // Floating "+N" gold-gain popups spawn here and animate themselves away —
  // see spawnGoldGain below.
  const goldPopupLayer = document.createElement('div')
  goldPopupLayer.style.cssText = 'position:absolute;top:32px;right:10px'
  root.appendChild(goldPopupLayer)

  // Respawn countdown — shown only while Wando's crash sequence is grounded.
  const countdown = document.createElement('div')
  countdown.style.cssText =
    'position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);display:none;' +
    'font-size:64px;font-weight:bold;color:#fff;text-shadow:0 0 10px #000'
  root.appendChild(countdown)

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

  // Special-action buttons (rocket, turbo): icon + a dedicated cooldown
  // overlay layer (not the button's own background, so the icon stays put
  // and legible underneath a clock-wipe mask) + a key-shortcut badge. The
  // badge sits partially outside the button's own box (negative offset), so
  // the button must NOT have overflow:hidden — the mask already clips
  // itself to a circle via its own border-radius, no clipping container
  // needed, and one very nearly clipped the badge off entirely before.
  // Both live together in a centered flex row (bottom-center) rather than
  // each being individually absolute-positioned, so they stay a visually
  // paired unit regardless of viewport width.
  const specialActionsRow = document.createElement('div')
  specialActionsRow.style.cssText =
    'position:absolute;left:50%;bottom:20px;transform:translateX(-50%);display:flex;gap:10px'
  root.appendChild(specialActionsRow)

  function makeActionButton({ icon, borderColor, keyLabel }) {
    const btn = document.createElement('button')
    btn.style.cssText =
      `position:relative;width:70px;height:70px;border-radius:50%;` +
      `background:#1a2230;border:3px solid ${borderColor};color:#fff;pointer-events:auto;cursor:pointer`

    const iconEl = document.createElement('span')
    iconEl.textContent = icon
    iconEl.style.cssText =
      'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
      'font-size:28px;transition:filter 150ms,opacity 150ms'
    btn.appendChild(iconEl)

    // The clock-wipe: a dark pie slice whose angle shrinks from a full
    // circle (just used) back to nothing (ready) as cooldown elapses.
    const mask = document.createElement('div')
    mask.style.cssText = 'position:absolute;inset:0;border-radius:50%'
    btn.appendChild(mask)

    const label = document.createElement('span')
    label.textContent = keyLabel
    label.style.cssText =
      `position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;` +
      `background:${borderColor};color:#1a2230;font-size:12px;font-weight:bold;line-height:20px;` +
      'text-align:center;box-shadow:0 0 2px #000'
    btn.appendChild(label)

    specialActionsRow.appendChild(btn)

    return {
      button: btn,
      setCooldown(frac) {
        const pct = Math.round(frac * 100)
        mask.style.background = `conic-gradient(rgba(0,0,0,0.78) ${pct}%, transparent ${pct}%)`
        iconEl.style.filter = frac > 0 ? 'grayscale(1) brightness(0.65)' : 'none'
        iconEl.style.opacity = frac > 0 ? '0.6' : '1'
      },
    }
  }

  // Rocket — fires forward like the gun (see ai.js's fireRocket) rather
  // than the original straight-down bomb, which fell behind Wando as she
  // kept flying and was never actually seen.
  const rocket = makeActionButton({
    icon: '\u{1F680}',
    borderColor: '#ffa03c',
    keyLabel: '1',
  })

  // Turbo — a temporary speed boost, the other special action.
  const turbo = makeActionButton({
    icon: '⚡',
    borderColor: '#7cffb2',
    keyLabel: '2',
  })

  // Hit marker — a brief flash next to the crosshair confirming a shot
  // actually landed, since the crosshair alone gives no feedback on a hit.
  const hitMarker = document.createElement('div')
  hitMarker.style.cssText =
    'position:absolute;left:50%;top:50%;width:30px;height:30px;' +
    'transform:translate(-50%,-50%) scale(0.5);opacity:0;pointer-events:none;' +
    'transition:transform 180ms ease-out,opacity 220ms ease-out'
  hitMarker.innerHTML =
    '<div style="position:absolute;left:4px;top:4px;width:9px;height:2px;background:#ffcc33;transform:rotate(45deg)"></div>' +
    '<div style="position:absolute;right:4px;top:4px;width:9px;height:2px;background:#ffcc33;transform:rotate(-45deg)"></div>' +
    '<div style="position:absolute;left:4px;bottom:4px;width:9px;height:2px;background:#ffcc33;transform:rotate(-45deg)"></div>' +
    '<div style="position:absolute;right:4px;bottom:4px;width:9px;height:2px;background:#ffcc33;transform:rotate(45deg)"></div>'
  root.appendChild(hitMarker)
  let hitMarkerTimer = null

  // Gyroscope instrument — a cockpit artificial-horizon ball (pitch, as a
  // vertical sky/ground split) plus a rotating heading marker (yaw). Added
  // 2026-11-25 since pitch no longer auto-levels, so the player needs a way
  // to read their current attitude — see
  // .scratch/wando-gogu-arts/issues/06-controls-camera.md.
  const GYRO_SIZE = 84
  const gyroWrap = document.createElement('div')
  gyroWrap.style.cssText =
    `position:absolute;left:20px;bottom:20px;width:${GYRO_SIZE}px;height:${GYRO_SIZE}px;` +
    'border-radius:50%;overflow:hidden;border:3px solid #cfd8e3;background:#000'
  root.appendChild(gyroWrap)

  const horizon = document.createElement('div')
  horizon.style.cssText =
    'position:absolute;left:-30%;top:-100%;width:160%;height:300%;' +
    'background:linear-gradient(to bottom, #5ad1ff 0%, #5ad1ff 50%, #3f6b3a 50%, #3f6b3a 100%)'
  gyroWrap.appendChild(horizon)

  const headingRing = document.createElement('div')
  headingRing.style.cssText = 'position:absolute;inset:0'
  const headingMarker = document.createElement('div')
  headingMarker.style.cssText =
    'position:absolute;left:50%;top:3px;width:0;height:0;margin-left:-5px;' +
    'border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:7px solid #ffcc33'
  headingRing.appendChild(headingMarker)
  gyroWrap.appendChild(headingRing)

  const nose = document.createElement('div')
  nose.style.cssText =
    'position:absolute;left:50%;top:50%;width:30px;height:3px;background:#fff;' +
    'transform:translate(-50%,-50%);box-shadow:0 0 2px #000'
  gyroWrap.appendChild(nose)

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
    rocketButton: rocket.button,
    turboButton: turbo.button,
    restartButton: restartBtn,
    setWandoHp(frac) {
      wandoFill.style.width = `${Math.max(0, frac) * 100}%`
    },
    setAllyBaseHp(frac) {
      allyBase.fill.style.width = `${Math.max(0, frac) * 100}%`
    },
    setEnemyBaseHp(frac) {
      enemyBase.fill.style.width = `${Math.max(0, frac) * 100}%`
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
    // frac: 1 = just used (fully masked/dimmed), 0 = ready.
    setRocketCooldown(frac) {
      rocket.setCooldown(frac)
    },
    setTurboCooldown(frac) {
      turbo.setCooldown(frac)
    },
    // allyFracs: [nearBaseFrac, nearMidFrac]. enemyFracsMidFirst:
    // [nearMidFrac, nearBaseFrac] — already in the left-to-right display
    // order for the enemy group, which mirrors the ally group outward from
    // the shared midpoint.
    setTowerStates(allyFracs, enemyFracsMidFirst) {
      setTowerIcon(allyTowerNearBase, allyFracs[0])
      setTowerIcon(allyTowerNearMid, allyFracs[1])
      setTowerIcon(enemyTowerNearMid, enemyFracsMidFirst[0])
      setTowerIcon(enemyTowerNearBase, enemyFracsMidFirst[1])
    },
    setGyro(yawRad, pitchFrac) {
      // pitchFrac: -1..1 (nose down..nose up). Nose up moves the horizon
      // strip down in the display (you're looking up into more sky).
      const offsetPx = pitchFrac * GYRO_SIZE * 0.5
      horizon.style.transform = `translateY(${offsetPx}px)`
      const yawDeg = (yawRad * 180) / Math.PI
      headingRing.style.transform = `rotate(${-yawDeg}deg)`
    },
    showMatchOver(won) {
      overlay.style.display = 'flex'
      overlayText.textContent = won ? 'VICTORY' : 'DEFEAT'
      overlayText.style.color = won ? '#5ad1ff' : '#ff5a5a'
    },
    setCrosshairVisible(visible) {
      crosshair.style.display = visible ? 'block' : 'none'
    },
    setGold(amount) {
      goldText.textContent = `\u{1F4B0} ${amount}`
    },
    showHitMarker() {
      clearTimeout(hitMarkerTimer)
      // Reset to the start state synchronously, then let the next frame
      // apply the transition target — otherwise the browser coalesces the
      // "already there" state and skips the transition on repeat hits.
      hitMarker.style.transition = 'none'
      hitMarker.style.transform = 'translate(-50%,-50%) scale(0.5)'
      hitMarker.style.opacity = '0'
      requestAnimationFrame(() => {
        hitMarker.style.transition = 'transform 180ms ease-out,opacity 220ms ease-out'
        hitMarker.style.transform = 'translate(-50%,-50%) scale(1)'
        hitMarker.style.opacity = '1'
        hitMarkerTimer = setTimeout(() => {
          hitMarker.style.opacity = '0'
        }, 160)
      })
    },
    spawnGoldGain(amount) {
      const el = document.createElement('div')
      el.textContent = `+${amount}`
      el.style.cssText =
        'position:absolute;top:0;right:0;font-size:13px;font-weight:bold;color:#ffe08a;' +
        'text-shadow:0 0 3px #000;transition:transform 850ms ease-out,opacity 850ms ease-out;' +
        'transform:translateY(0);opacity:1'
      goldPopupLayer.appendChild(el)
      requestAnimationFrame(() => {
        el.style.transform = 'translateY(-28px)'
        el.style.opacity = '0'
      })
      setTimeout(() => el.remove(), 900)
    },
    // seconds: null/0 hides it, otherwise shows a big centered number.
    setRespawnCountdown(seconds) {
      if (!seconds) {
        countdown.style.display = 'none'
        return
      }
      countdown.style.display = 'block'
      countdown.textContent = String(seconds)
    },
  }
}
