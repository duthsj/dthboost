import type { BenchmarkResult, EngineCommand, GameKey, Language } from '../components/types'
import BenchmarkPanel from '../components/BenchmarkPanel'
import type { TFunction } from '../components/types'
import { realChangeLabs } from '../data'
import { translatePhrase } from '../i18n'
import BenchmarkHistory, { shareBenchmarkCard, predictFPS } from '../components/BenchmarkHistory'

interface BenchmarkPageProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  benchmarkResult: BenchmarkResult | null
  busyCommand: EngineCommand | null
  isAdmin: boolean
  onRunCommand: (cmd: EngineCommand) => void
  onRestartAsAdmin: () => void
  scanResult?: { gpuVendor?: string } | null
}

export default function BenchmarkPage({ t, language, activeGame, benchmarkResult, busyCommand, isAdmin, onRunCommand, onRestartAsAdmin, scanResult }: BenchmarkPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  const isDownloading = busyCommand === 'install_presentmon'
  const prediction = predictFPS(scanResult?.gpuVendor ?? 'Unknown', activeGame)

  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PresentMon</span>
            <h2>Setup</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`action-btn ${busyCommand === 'pre_warm_system' ? 'secondary' : 'secondary'}`}
              disabled={busyCommand !== null}
              onClick={() => onRunCommand('pre_warm_system')}
              type="button"
            >
              {busyCommand === 'pre_warm_system' ? <><span className="spinner" />Warming...</> : 'Pre-Warm System'}
            </button>
            <button
              className={`action-btn ${isDownloading ? 'secondary' : 'primary'}`}
              disabled={isDownloading}
              onClick={() => onRunCommand('install_presentmon')}
              type="button"
            >
              {isDownloading ? <><span className="spinner" />Downloading...</> : 'Install PresentMon'}
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5 }}>
          Pre-Warm primes your RAM, GPU and CPU for ranked. Install PresentMon to enable real benchmark capture.
        </p>
      </section>

      {!isAdmin && (
        <div style={{
          background: '#fa445411', border: '1px solid #fa445444', borderRadius: 8,
          padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 13, color: '#fa4454', flex: 1 }}>
            Administrator privileges required for real PresentMon benchmark capture. Without admin, benchmark will show estimated values instead of your real FPS data.
          </span>
          <button
            className="action-btn"
            onClick={onRestartAsAdmin}
            type="button"
            style={{ fontSize: 12, padding: '6px 14px', background: '#fa4454', border: 'none', color: '#fff', borderRadius: 6, fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Run as Admin
          </button>
        </div>
      )}

      {/* FPS Prediction */}
      <div className="signal-strip">
        <div className="signal">
          <span>Predicted Min FPS</span>
          <strong>{prediction.min}</strong>
          <div className="bar amber"><i style={{ width: `${(prediction.min / 400) * 100}%` }} /></div>
        </div>
        <div className="signal">
          <span>Predicted Avg FPS</span>
          <strong style={{ color: 'var(--green)' }}>{prediction.avg}</strong>
          <div className="bar green"><i style={{ width: `${(prediction.avg / 400) * 100}%` }} /></div>
        </div>
        <div className="signal">
          <span>Predicted Max FPS</span>
          <strong style={{ color: 'var(--cyan)' }}>{prediction.max}</strong>
          <div className="bar cyan"><i style={{ width: `${(prediction.max / 400) * 100}%` }} /></div>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: -8, marginBottom: 12, paddingLeft: 4 }}>
        {prediction.confidence}
      </p>

      <BenchmarkPanel t={t} language={language} activeGame={activeGame} benchmarkResult={benchmarkResult} />

      {benchmarkResult && (
        <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 12 }}>
          <button
            className="action-btn secondary"
            onClick={() => shareBenchmarkCard(benchmarkResult, activeGame, language)}
            type="button"
          >
            Share as PNG
          </button>
        </div>
      )}

      <BenchmarkHistory t={t} activeGame={activeGame} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.realChangeLabs}</span>
            <h2>{t.evidenceBeforeTweaks}</h2>
          </div>
        </div>
        <div className="lab-grid">
          {realChangeLabs.map((lab) => (
            <article className="lab-card" key={lab.title}>
              <div className="lab-topline">
                <h3>{tx(lab.title)}</h3>
                <span className={`risk-pill ${lab.risk.toLowerCase()}`}>{tx(lab.risk)}</span>
              </div>
              <strong>{tx(lab.metric)}</strong>
              <p>{tx(lab.signal)}</p>
              <small>{tx(lab.action)}</small>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
