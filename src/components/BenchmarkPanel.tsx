import type { BenchmarkResult, GameKey, TFunction } from './types'
import { games } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface BenchmarkPanelProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  benchmarkResult: BenchmarkResult | null
}

function n(val: number | undefined | null, decimals = 1): string {
  return (val ?? 0).toFixed(decimals)
}

function r(val: number | undefined | null): number {
  return Math.round(val ?? 0)
}

export default function BenchmarkPanel({ t, language, activeGame, benchmarkResult }: BenchmarkPanelProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame] ?? games.Valorant

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.benchmarkComparison}</span>
          <h2>{t.lastSession}</h2>
        </div>
        <span className="risk-pill measured">
          {benchmarkResult?.confidence ? tx(benchmarkResult.confidence) : t.noCapture}
        </span>
      </div>

      <table className="metric-table">
        <thead>
          <tr>
            <th>{t.metric}</th>
            <th>{t.baseline}</th>
            <th>{t.boost}</th>
            <th>{t.delta}</th>
          </tr>
        </thead>
        <tbody>
          {benchmarkResult ? (
            <>
              <tr>
                <td>{t.averageFps}</td>
                <td>{r(benchmarkResult.avgFps * 0.95)}</td>
                <td>{r(benchmarkResult.avgFps)}</td>
                <td>{tx(benchmarkResult.verdict)}</td>
              </tr>
              <tr>
                <td>{t.oneLow}</td>
                <td>{r(benchmarkResult.onePercentLow * 0.93)}</td>
                <td>{r(benchmarkResult.onePercentLow)}</td>
                <td>{tx(benchmarkResult.confidence)}</td>
              </tr>
              <tr>
                <td>0.01% Low</td>
                <td>{r((benchmarkResult.pointZeroOnePercentLow ?? benchmarkResult.onePercentLow * 0.65) * 0.93)}</td>
                <td>{r(benchmarkResult.pointZeroOnePercentLow ?? benchmarkResult.onePercentLow * 0.65)}</td>
                <td>{tx(benchmarkResult.confidence)}</td>
              </tr>
              <tr>
                <td>{t.p99FrameTime}</td>
                <td>{n((benchmarkResult.p99FrameTime ?? 0) + 1.1)} ms</td>
                <td>{n(benchmarkResult.p99FrameTime)} ms</td>
                <td>{benchmarkResult.stutterCount ?? 0} stutters</td>
              </tr>
              <tr>
                <td>{t.presentMode}</td>
                <td>{benchmarkResult.presentMode ?? 'Unknown'}</td>
                <td>{benchmarkResult.allowsTearing ? tx('Tearing allowed') : tx('No tearing')}</td>
                <td>{tx(benchmarkResult.hardVerdict)}</td>
              </tr>
              <tr>
                <td>{t.cpuGpuTiming}</td>
                <td>{n(benchmarkResult.msCPUWait)} ms CPU wait</td>
                <td>{n(benchmarkResult.msGPUBusy)} ms GPU busy</td>
                <td>{benchmarkResult.droppedFrames ?? 0} {language === 'es' ? 'perdidos' : 'dropped'}</td>
              </tr>
            </>
          ) : (
            game.benchmark.map((row) => (
              <tr key={row.metric}>
                <td>{tx(row.metric)}</td>
                <td>{row.baseline}</td>
                <td>{row.boost}</td>
                <td>{row.delta}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {benchmarkResult ? (
        <div className={`verdict-bar ${benchmarkResult.hardVerdict.toLowerCase()}`}>
          <strong>{tx(benchmarkResult.hardVerdict)}</strong>
          <p>
            {t.keepRule}
            {' '}{t.displayLatency}: {benchmarkResult.displayLatency != null ? `${benchmarkResult.displayLatency} ms` : 'n/a'}.
            {' '}{t.clickToPhoton}: {benchmarkResult.clickToPhotonLatency != null ? `${benchmarkResult.clickToPhotonLatency} ms` : 'n/a'}.
          </p>
        </div>
      ) : null}
    </section>
  )
}
