let enabled = true

try {
  const stored = localStorage.getItem('dthboost:sound')
  if (stored !== null) enabled = stored === 'true'
} catch { enabled = true }

export function isSoundEnabled() { return enabled }

export function toggleSound(): boolean {
  enabled = !enabled
  try { localStorage.setItem('dthboost:sound', String(enabled)) } catch { /* ok */ }
  return enabled
}

function beep(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.08) {
  if (!enabled) return
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* audio not available */ }
}

export function playScanComplete() { beep(880, 0.15, 'sine', 0.06); setTimeout(() => beep(1100, 0.2, 'sine', 0.06), 150) }
export function playBenchmarkComplete() { beep(660, 0.12, 'triangle', 0.05); setTimeout(() => beep(880, 0.12, 'triangle', 0.05), 120); setTimeout(() => beep(1100, 0.2, 'triangle', 0.06), 240) }
export function playBoostActive() { beep(440, 0.3, 'sawtooth', 0.04); setTimeout(() => beep(660, 0.3, 'sawtooth', 0.04), 200); setTimeout(() => beep(880, 0.4, 'sawtooth', 0.05), 400) }
export function playRollback() { beep(660, 0.2, 'sine', 0.04); setTimeout(() => beep(440, 0.3, 'sine', 0.05), 200) }
export function playError() { beep(200, 0.3, 'square', 0.06); setTimeout(() => beep(150, 0.4, 'square', 0.06), 250) }
export function playClick() { beep(1200, 0.05, 'sine', 0.03) }
