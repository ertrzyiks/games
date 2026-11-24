import * as THREE from 'three'

// Whole-screen drag-to-move via a ground-plane raycast, same philosophy as
// the shooter's drag-to-move control — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md.
export function setupMovementInput(renderer, camera, groundMesh, onTarget) {
  const raycaster = new THREE.Raycaster()
  const pointerNdc = new THREE.Vector2()
  const dom = renderer.domElement

  function pointerToWorld(event) {
    const rect = dom.getBoundingClientRect()
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointerNdc, camera)
    const hits = raycaster.intersectObject(groundMesh)
    if (hits.length > 0) onTarget(hits[0].point)
  }

  let dragging = false
  dom.addEventListener('pointerdown', (e) => {
    dragging = true
    pointerToWorld(e)
  })
  dom.addEventListener('pointermove', (e) => {
    if (dragging) pointerToWorld(e)
  })
  window.addEventListener('pointerup', () => {
    dragging = false
  })
}

export function setupKeyboardInput(onDirection) {
  const held = new Set()
  window.addEventListener('keydown', (e) => held.add(e.key.toLowerCase()))
  window.addEventListener('keyup', (e) => held.delete(e.key.toLowerCase()))
  return () => {
    let dx = 0
    let dz = 0
    if (held.has('arrowleft') || held.has('a')) dx -= 1
    if (held.has('arrowright') || held.has('d')) dx += 1
    if (held.has('arrowup') || held.has('w')) dz -= 1
    if (held.has('arrowdown') || held.has('s')) dz += 1
    if (dx !== 0 || dz !== 0) onDirection(dx, dz)
  }
}
