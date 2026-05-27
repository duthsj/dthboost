import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { BenchmarkResult, TFunction } from './types'

interface HistoryEntry {
  benchmark: BenchmarkResult
  game: string
  date: string
  fps: number
  oneLow: number
  p99: number
}

const STORAGE_KEY = 'dthboost:benchmark-history'

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveBenchmark(benchmark: BenchmarkResult, game: string) {
  const history = loadHistory()
  history.unshift({
    benchmark,
    game,
    date: new Date().toISOString(),
    fps: benchmark.avgFps,
    oneLow: benchmark.onePercentLow,
    p99: benchmark.p99FrameTime,
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)))
}

interface BenchmarkHistoryProps {
  t: TFunction
  activeGame: string
}

export default function BenchmarkHistory({ t: _t, activeGame }: BenchmarkHistoryProps) {
  const history = useMemo(() => loadHistory(), [])

  const gameHistory = history.filter(h => h.game === activeGame)
  const hasData = gameHistory.length > 0
  const best = gameHistory[0]
  const trend = gameHistory.length >= 2
    ? gameHistory[0].fps - gameHistory[gameHistory.length - 1].fps
    : 0

  if (!hasData) {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">History</span>
            <h2>Benchmark timeline</h2>
          </div>
        </div>
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{opacity:0.3}}>
            <path d="M3 3v18h18M7 16l4-4 4 4 5-5"/>
          </svg>
          <strong>No benchmark history yet</strong>
          <p>Run benchmarks to track your performance over time. Compare before/after boosts.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">History</span>
          <h2>{activeGame} Benchmark Timeline</h2>
        </div>
        <span className={`risk-pill ${trend > 0 ? 'safe' : trend < 0 ? 'blocked' : 'measured'}`}>
          {trend > 0 ? `+${trend.toFixed(0)} FPS trend` : trend < 0 ? `${trend.toFixed(0)} FPS trend` : 'Stable'}
        </span>
      </div>

      <div style={{ height: 120, marginBottom: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gameHistory.slice(0, 12).reverse()} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#20221e" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#8a8b86', fontSize: 10 }} axisLine={{ stroke: '#20221e' }} tickLine={false} tickFormatter={d => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })} />
            <YAxis tick={{ fill: '#8a8b86', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111210', border: '1px solid #20221e', borderRadius: 8, fontSize: 12, color: '#e2e3de' }} />
            <Line type="monotone" dataKey="fps" stroke="#78d08f" strokeWidth={2} dot={{ r: 3, fill: '#78d08f' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {best && (
        <div className="chart-stats">
          <div>
            <span>Best FPS</span>
            <strong style={{ color: 'var(--green)' }}>{best.fps.toFixed(0)}</strong>
          </div>
          <div>
            <span>Best 1% Low</span>
            <strong style={{ color: 'var(--cyan)' }}>{best.oneLow.toFixed(0)}</strong>
          </div>
          <div>
            <span>Best p99</span>
            <strong>{best.p99.toFixed(1)}ms</strong>
          </div>
          <div>
            <span>Runs</span>
            <strong>{gameHistory.length}</strong>
          </div>
          <div>
            <span>Trend</span>
            <strong style={{ color: trend > 0 ? 'var(--green)' : 'var(--red)' }}>
              {trend > 0 ? '+' : ''}{trend.toFixed(0)} FPS
            </strong>
          </div>
        </div>
      )}
    </section>
  )
}

// Shareable benchmark card export as PNG
export function shareBenchmarkCard(benchmark: BenchmarkResult, game: string, _language?: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 340
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = '#0b0c0b'
  ctx.beginPath()
  ctx.roundRect(0, 0, 600, 340, 16)
  ctx.fill()

  // Border glow
  ctx.strokeStyle = '#78d08f33'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(1, 1, 598, 338, 16)
  ctx.stroke()

  // Title
  ctx.fillStyle = '#78d08f'
  ctx.font = 'bold 14px "Inter", system-ui, sans-serif'
  ctx.fillText('DTHBoost Benchmark', 24, 36)

  // Game
  ctx.fillStyle = '#e2e3de'
  ctx.font = 'bold 28px "Inter", system-ui, sans-serif'
  ctx.fillText(game, 24, 70)

  // Score
  ctx.fillStyle = '#78d08f'
  ctx.font = 'bold 72px "JetBrains Mono", monospace'
  ctx.fillText(benchmark.avgFps.toFixed(0), 24, 148)
  ctx.fillStyle = '#8a8b86'
  ctx.font = '14px "Inter", system-ui, sans-serif'
  ctx.fillText('Average FPS', 24, 168)

  // Stats grid
  const stats = [
    { label: '1% Low', value: benchmark.onePercentLow.toFixed(0) + ' FPS', x: 24, y: 210 },
    { label: '0.1% Low', value: (benchmark.pointOnePercentLow ?? 0).toFixed(0) + ' FPS', x: 24, y: 245 },
    { label: 'p95 Frame Time', value: benchmark.p95FrameTime.toFixed(1) + ' ms', x: 220, y: 210 },
    { label: 'p99 Frame Time', value: benchmark.p99FrameTime.toFixed(1) + ' ms', x: 220, y: 245 },
    { label: 'Stutters', value: String(benchmark.stutterCount ?? 0), x: 420, y: 210 },
    { label: 'Dropped', value: String(benchmark.droppedFrames ?? 0) + ' frames', x: 420, y: 245 },
    { label: 'Confidence', value: benchmark.confidence, x: 24, y: 285 },
    { label: 'Verdict', value: benchmark.hardVerdict, x: 220, y: 285 },
  ]

  stats.forEach(s => {
    ctx.fillStyle = '#8a8b86'
    ctx.font = '11px "Inter", system-ui, sans-serif'
    ctx.fillText(s.label, s.x, s.y)
    ctx.fillStyle = '#e2e3de'
    ctx.font = 'bold 16px "JetBrains Mono", monospace'
    ctx.fillText(s.value, s.x, s.y + 18)
  })

  // Footer
  ctx.fillStyle = '#5c5d58'
  ctx.font = '10px "Inter", system-ui, sans-serif'
  ctx.fillText('Optimized by DTHBoost — dthboost.github.io', 24, 322)
  ctx.fillText(new Date().toLocaleDateString(), 560 - ctx.measureText(new Date().toLocaleDateString()).width, 322)

  // Download
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dthboost-benchmark-${game}-${new Date().toISOString().slice(0, 10)}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// FPS prediction based on GPU + game
export function predictFPS(gpuVendor: string, game: string): { min: number; avg: number; max: number; confidence: string } {
  const isNVIDIA = gpuVendor?.toLowerCase().includes('nvidia')
  const isAMD = gpuVendor?.toLowerCase().includes('amd')

  if (game === 'Valorant') {
    if (isNVIDIA) return { min: 180, avg: 250, max: 400, confidence: 'CPU-bound game. Any RTX/GTX 1660+ hits 200+ FPS easily.' }
    if (isAMD) return { min: 160, avg: 230, max: 380, confidence: 'AMD GPUs perform well. RX 6600+ for competitive 240Hz.' }
    return { min: 120, avg: 200, max: 300, confidence: 'Valorant is CPU-bound. A discrete GPU helps but CPU matters more.' }
  }
  if (game === 'CS2') {
    if (isNVIDIA) return { min: 140, avg: 220, max: 350, confidence: 'CS2 favors NVIDIA. RTX 3060+ for stable 240Hz. Source 2 engine is GPU-heavy.' }
    if (isAMD) return { min: 130, avg: 200, max: 320, confidence: 'CS2 works well on AMD. RX 6700+ recommended for high refresh.' }
    return { min: 100, avg: 180, max: 280, confidence: 'CS2 is more GPU intensive than CS:GO. Dedicated GPU recommended.' }
  }
  if (game === 'Fortnite') {
    if (isNVIDIA) return { min: 100, avg: 180, max: 280, confidence: 'Fortnite varies by mode. Performance Mode gives 2x FPS. DX12 is more stable.' }
    if (isAMD) return { min: 90, avg: 160, max: 260, confidence: 'AMD performs well in DX12 mode. Performance Mode also available.' }
    return { min: 60, avg: 120, max: 200, confidence: 'Fortnite is demanding. Use Performance Mode for competitive play.' }
  }
  return { min: 60, avg: 120, max: 200, confidence: 'Run a benchmark for accurate hardware-specific prediction.' }
}
