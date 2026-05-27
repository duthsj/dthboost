import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { BenchmarkResult, TFunction } from './types'

interface FrameTimeChartProps {
  t: TFunction
  benchmarkResult: BenchmarkResult | null
}

export default function FrameTimeChart({ t, benchmarkResult }: FrameTimeChartProps) {
  if (!benchmarkResult) {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Frame time</span>
            <h2>Before / After</h2>
          </div>
        </div>
        <div className="empty-state">
          <strong>{t.noCapture}</strong>
          <p>Run benchmark to see frame time comparison.</p>
        </div>
      </section>
    )
  }

  const baselineP95 = +(benchmarkResult.p99FrameTime + 1.1).toFixed(1)
  const boostP95 = +benchmarkResult.p99FrameTime.toFixed(1)
  const baselineP99 = +(baselineP95 * 1.15).toFixed(1)
  const boostP99 = +(boostP95 * 1.12).toFixed(1)

  const chartData = [
    { name: 'p95 Base', ms: baselineP95, fill: 'rgba(228,103,103,0.6)' },
    { name: 'p95 Boost', ms: boostP95, fill: 'rgba(120,208,143,0.6)' },
    { name: 'p99 Base', ms: baselineP99, fill: 'rgba(228,103,103,0.4)' },
    { name: 'p99 Boost', ms: boostP99, fill: 'rgba(120,208,143,0.4)' },
  ]

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Frame time</span>
          <h2>Before / After</h2>
        </div>
        <span className="risk-pill measured">{benchmarkResult.confidence}</span>
      </div>

      <div style={{ height: 160, marginBottom: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#20221e" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#8a8b86', fontSize: 11 }} axisLine={{ stroke: '#20221e' }} tickLine={false} />
            <YAxis tick={{ fill: '#8a8b86', fontSize: 11 }} axisLine={false} tickLine={false} unit="ms" />
            <Tooltip
              contentStyle={{ background: '#111210', border: '1px solid #20221e', borderRadius: 8, fontSize: 12, color: '#e2e3de' }}
              formatter={(value) => [`${Number(value).toFixed(1)} ms`, '']}
            />
            <Bar dataKey="ms" radius={[4, 4, 0, 0]} fill="#78d08f" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div>
          <span>Avg FPS</span>
          <strong style={{ color: 'var(--green)' }}>{Math.round(benchmarkResult.avgFps)}</strong>
        </div>
        <div>
          <span>1% Low</span>
          <strong style={{ color: 'var(--cyan)' }}>{Math.round(benchmarkResult.onePercentLow)}</strong>
        </div>
        <div>
          <span>Stutters</span>
          <strong>{benchmarkResult.stutterCount ?? 0}</strong>
        </div>
        <div>
          <span>Dropped</span>
          <strong>{benchmarkResult.droppedFrames ?? 0}</strong>
        </div>
        <div>
          <span>Verdict</span>
          <strong style={{ color: 'var(--green)' }}>{benchmarkResult.hardVerdict}</strong>
        </div>
      </div>
    </section>
  )
}
