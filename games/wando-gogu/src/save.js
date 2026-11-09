const KEY = 'wando-gogu:last-completed-stage'

// 0 means no stage completed yet. A clean stage clear is the only thing
// that writes here (map.md: "mid-stage death never overwrites saved progress").
export function getLastCompletedStage() {
  const raw = window.localStorage.getItem(KEY)
  const n = raw === null ? 0 : parseInt(raw, 10)
  return Number.isFinite(n) ? n : 0
}

export function setLastCompletedStage(stageNumber) {
  const current = getLastCompletedStage()
  if (stageNumber > current) {
    window.localStorage.setItem(KEY, String(stageNumber))
  }
}
