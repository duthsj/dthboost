import type { EngineCommand, BenchmarkResult, ScanResult } from '../engine'
import type { GameKey } from '../data'
import type { Language } from '../i18n'
import type { TFunction } from '../components/types'
import GameReadyCard from '../components/GameReadyCard'
import SignalStrip from '../components/SignalStrip'

interface DashboardPageProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  readiness: number
  sessionState: string
  receiptsCount: number
  scanResult: ScanResult | null
  benchmarkResult: BenchmarkResult | null
  onOptimize: () => void
  busyCommand: EngineCommand | null
}

export default function DashboardPage({
  t, language, activeGame, readiness, sessionState, receiptsCount,
  scanResult, benchmarkResult, onOptimize, busyCommand,
}: DashboardPageProps) {
  const boosted = sessionState === 'boosted'
  const hasData = !!scanResult

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <GameReadyCard
        t={t} language={language} activeGame={activeGame}
        readiness={readiness} sessionState={sessionState}
        receiptsCount={receiptsCount}
      />

      <SignalStrip language={language} activeGame={activeGame} />

      {scanResult && (
        <div className="signal-strip">
          <div className="signal">
            <span>{language === 'es' ? 'GPU' : 'GPU'}</span>
            <strong style={{ fontSize: 16 }}>{scanResult.gpuVendor}</strong>
          </div>
          <div className="signal">
            <span>{language === 'es' ? 'Refresco' : 'Refresh'}</span>
            <strong style={{ fontSize: 16 }}>{scanResult.refreshRate || 'Unknown'}</strong>
          </div>
          <div className="signal">
            <span>{language === 'es' ? 'Plan de energía' : 'Power Plan'}</span>
            <strong style={{ fontSize: 16 }}>{scanResult.activePowerPlan || 'Unknown'}</strong>
          </div>
        </div>
      )}

      <section className="panel" style={{ textAlign: 'center', padding: 32, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {!hasData && !boosted && (
          <>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              {language === 'es' ? 'Listo para optimizar' : 'Ready to optimize'}
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 400 }}>
              {language === 'es' ? 'Haz clic en el botón para escanear, medir y aplicar 20 tweaks automáticamente.' : 'Click the button to scan, benchmark, and apply 20 tweaks automatically.'}
            </p>
          </>
        )}

        {hasData && !boosted && (
          <>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              {language === 'es' ? 'Sistema escaneado' : 'System scanned'}
            </p>
            {benchmarkResult && (
              <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--green)' }}>{Math.round(benchmarkResult.avgFps)}</span>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Avg FPS</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--cyan)' }}>{Math.round(benchmarkResult.onePercentLow)}</span>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>1% Low</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--text)' }}>{benchmarkResult.stutterCount ?? 0}</span>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Stutters</p>
                </div>
              </div>
            )}
          </>
        )}

        {boosted && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 0 30px rgba(120,208,143,.3)' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#050704"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', marginBottom: 4 }}>
              {language === 'es' ? 'Optimizado' : 'Optimized'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              {language === 'es' ? '20 tweaks activos. Ahora abre tu juego.' : '20 tweaks active. Now launch your game.'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 24, maxWidth: 380 }}>
              {language === 'es' ? 'Los tweaks ya están aplicados. Tu juego arrancará optimizado desde el primer frame. Al cerrar el juego, todo se restaura automáticamente.' : 'Tweaks are already applied. Your game will launch fully optimized from the first frame. Everything auto-restores when you close the game.'}
            </p>
          </>
        )}

        <button
          className="action-btn primary"
          disabled={busyCommand !== null}
          onClick={onOptimize}
          type="button"
          style={{ fontSize: 18, padding: '16px 48px', fontWeight: 800, borderRadius: 14 }}
        >
          {busyCommand ? (
            <><span className="spinner" />{language === 'es' ? 'Trabajando...' : 'Working...'}</>
          ) : boosted ? (
            language === 'es' ? 'Re-Optimizar' : 'Re-Optimize'
          ) : (
            language === 'es' ? 'Optimizar 1-Clic' : 'Optimize 1-Click'
          )}
        </button>
      </section>
    </div>
  )
}
