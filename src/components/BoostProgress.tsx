import { useEffect, useState } from 'react'

interface BoostProgressProps {
  active: boolean
}

export default function BoostProgress({ active }: BoostProgressProps) {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('')

  useEffect(() => {
    if (!active) { setPct(0); setPhase(''); return }

    let unlisten: (() => void) | undefined
    const isTauri = '__TAURI_INTERNALS__' in window

    if (isTauri) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen<{ pct: number; phase: string }>('boost-progress', (event) => {
          setPct(event.payload.pct)
          setPhase(event.payload.phase)
        }).then(fn => { unlisten = fn })
      }).catch(() => {})
    } else {
      // Browser mock: simulate progress
      const steps = [
        { pct: 5, phase: 'Detecting hardware...' },
        { pct: 25, phase: 'Power plan + USB + PCIe + Core Parking...' },
        { pct: 50, phase: 'GameDVR + GameBar + Fullscreen optimizations...' },
        { pct: 75, phase: 'Network + MMCSS + GPU clocks + Spectre...' },
        { pct: 90, phase: 'Defender + Timer + Adapters...' },
        { pct: 100, phase: 'Done!' },
      ]
      let i = 0
      const interval = setInterval(() => {
        if (i < steps.length) {
          setPct(steps[i].pct)
          setPhase(steps[i].phase)
          i++
        } else {
          clearInterval(interval)
        }
      }, 400)
      return () => clearInterval(interval)
    }

    return () => { unlisten?.() }
  }, [active])

  if (!active) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      padding: '6px 16px', background: 'rgba(5,7,4,0.95)',
      borderBottom: '1px solid rgba(120,208,143,0.15)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, color: '#767973' }}>
          <span style={{ fontWeight: 600 }}>{phase || 'Preparing...'}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#78d08f' }}>{pct}%</span>
        </div>
        <div style={{
          height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #78d08f, #68c6bd)',
            borderRadius: 3, transition: 'width 0.5s cubic-bezier(.25,.1,.25,1)'
          }} />
        </div>
      </div>
    </div>
  )
}
