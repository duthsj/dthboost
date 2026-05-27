import type { EngineCommand, BenchmarkResult, Receipt, ScanResult } from '../engine'
import type { GameKey } from '../data'
import type { Language } from '../i18n'
import { translatePhrase } from '../i18n'
import type { TFunction } from '../components/types'
import { predictFPS } from '../components/BenchmarkHistory'

interface OptimizePageProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  plan: Array<{ id: string; title: string; copy: string; receipt: string; enabled: boolean; risk?: string }>
  receipts: Receipt[]
  busyCommand: EngineCommand | null
  benchmarkResult: BenchmarkResult | null
  scanResult: ScanResult | null
  onTogglePlan: (id: string) => void
  onRunCommand: (cmd: EngineCommand) => void
  onOptimize: () => void
  onSelectReceipt: (r: Receipt) => void
}

export default function OptimizePage({
  t: _t, language, activeGame, plan, receipts, busyCommand,
  benchmarkResult: _br, scanResult, onTogglePlan, onRunCommand: _orc, onOptimize, onSelectReceipt,
}: OptimizePageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  const prediction = predictFPS(scanResult?.gpuVendor ?? 'Unknown', activeGame)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 24 }}>
      {/* FPS Prediction */}
      {scanResult && (
        <section className="panel">
          <div className="section-heading"><h2>Estimated FPS for {activeGame}</h2></div>
          <div className="signal-strip" style={{ marginTop: 12 }}>
            <div className="signal"><span>Min</span><strong>{prediction.min}</strong></div>
            <div className="signal"><span>Avg</span><strong style={{ color: 'var(--green)' }}>{prediction.avg}</strong></div>
            <div className="signal"><span>Max</span><strong style={{ color: 'var(--cyan)' }}>{prediction.max}</strong></div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8 }}>{prediction.confidence}</p>
        </section>
      )}

      {/* One-click button */}
      <section className="panel" style={{ textAlign: 'center', padding: 28 }}>
        <button
          className="action-btn primary"
          disabled={busyCommand !== null}
          onClick={onOptimize}
          type="button"
          style={{ fontSize: 18, padding: '16px 48px', fontWeight: 800 }}
        >
          {busyCommand ? <><span className="spinner" />Working...</> : 'Optimize 1-Click'}
        </button>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 10 }}>
          {language === 'es' ? 'Escanea, mide y aplica 20 tweaks automáticamente' : 'Scans, benchmarks, and applies 20 tweaks automatically'}
        </p>
      </section>

      {/* Tweak toggles */}
      <section className="panel">
        <div className="section-heading"><h2>{language === 'es' ? 'Elige tus tweaks' : 'Choose your tweaks'}</h2></div>
        <div className="toggle-list">
          {plan.map((item) => (
            <button className="toggle-row" key={item.id} onClick={() => onTogglePlan(item.id)} type="button">
              <span>
                <strong>{tx(item.title)}</strong>
                <small>{tx(item.copy)}</small>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.risk && <span className={`risk-pill ${(item.risk || 'safe').toLowerCase()}`} style={{ fontSize: 10, padding: '2px 6px' }}>{tx(item.risk)}</span>}
                <i className={item.enabled ? 'switch on' : 'switch'} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Receipts */}
      {receipts.length > 0 && (
        <section className="panel">
          <div className="section-heading"><h2>{language === 'es' ? 'Recibos' : 'Receipts'}</h2></div>
          <div className="receipt-history">
            {receipts.slice(0, 10).map((receipt) => (
              <button className="receipt-card" key={receipt.id} onClick={() => onSelectReceipt(receipt)} type="button">
                <span>
                  <strong>{tx(receipt.title)}</strong>
                  <small>{receipt.scope} · {tx(receipt.risk)}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
