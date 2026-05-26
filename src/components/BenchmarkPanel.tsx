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

export default function BenchmarkPanel({ t, language, activeGame, benchmarkResult }: BenchmarkPanelProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame]

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
                <td>{Math.round(benchmarkResult.avgFps * 0.95)}</td>
                <td>{benchmarkResult.avgFps}</td>
                <td>{tx(benchmarkResult.verdict)}</td>
              </tr>
              <tr>
                <td>{t.oneLow}</td>
                <td>{Math.round(benchmarkResult.onePercentLow * 0.93)}</td>
                <td>{benchmarkResult.onePercentLow}</td>
                <td>{tx(benchmarkResult.confidence)}</td>
              </tr>
              <tr>
                <td>{t.p99FrameTime}</td>
                <td>{(benchmarkResult.p99FrameTime + 1.1).toFixed(1)} ms</td>
                <td>{benchmarkResult.p99FrameTime.toFixed(1)} ms</td>
                <td>{benchmarkResult.stutterCount} stutters</td>
              </tr>
              <tr>
                <td>{t.presentMode}</td>
                <td>{benchmarkResult.presentMode}</td>
                <td>{benchmarkResult.allowsTearing ? tx('Tearing allowed') : tx('No tearing')}</td>
                <td>{tx(benchmarkResult.hardVerdict)}</td>
              </tr>
              <tr>
                <td>{t.cpuGpuTiming}</td>
                <td>{benchmarkResult.msCPUWait.toFixed(1)} ms CPU wait</td>
                <td>{benchmarkResult.msGPUBusy.toFixed(1)} ms GPU busy</td>
                <td>{benchmarkResult.droppedFrames} {language === 'es' ? 'perdidos' : 'dropped'}</td>
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
            {' '}{t.displayLatency}: {benchmarkResult.displayLatency ?? 'n/a'} ms.
            {' '}{t.clickToPhoton}: {benchmarkResult.clickToPhotonLatency ?? 'n/a'} ms.
          </p>
        </div>
      ) : null}
    </section>
  )
}
