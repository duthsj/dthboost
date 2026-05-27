import type { EngineCommand, Language } from './types'

interface StatusBarProps {
  language: Language
  scanDone: boolean
  benchmarkDone: boolean
  boostActive: boolean
  receiptsCount: number
  gpuVendor: string
  refreshRate: string
  busyCommand: EngineCommand | null
  onOptimize: () => void
}

export default function StatusBar({
  language, scanDone, benchmarkDone, boostActive,
  receiptsCount, gpuVendor, refreshRate, busyCommand, onOptimize,
}: StatusBarProps) {
  const es = language === 'es'

  const statusColor = boostActive ? 'var(--green)' : benchmarkDone ? 'var(--cyan)' : scanDone ? 'var(--amber)' : 'var(--text-dim)'
  const statusLabel = boostActive ? (es ? 'OPTIMIZADO' : 'BOOSTED')
    : benchmarkDone ? (es ? 'LISTO PARA JUGAR' : 'READY TO PLAY')
    : scanDone ? (es ? 'ESCANEADO' : 'SCANNED')
    : (es ? 'SIN CONFIGURAR' : 'NOT SET UP')

  return (
    <section className="panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 10, height: 10, borderRadius: 999, background: statusColor,
          boxShadow: `0 0 8px ${statusColor}`,
        }} />
        <strong style={{ fontSize: 13, color: statusColor, fontFamily: 'var(--font-mono)' }}>
          {statusLabel}
        </strong>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
        <span>{gpuVendor || 'GPU ?'}</span>
        <span>{refreshRate || 'Hz ?'}</span>
        <span>{receiptsCount} {es ? 'recibos' : 'receipts'}</span>
      </div>

      <button
        className="action-btn primary"
        disabled={busyCommand !== null}
        onClick={onOptimize}
        type="button"
        title={es ? 'Escanear, medir y optimizar automáticamente' : 'Scan, benchmark and boost automatically'}
        style={{ fontSize: 13, padding: '6px 14px', minHeight: 32 }}
      >
        {busyCommand ? (
          <><span className="spinner" /> {es ? 'Optimizando...' : 'Optimizing...'}</>
        ) : (
          <>{es ? 'Optimizar ' : 'Optimize '}{es ? 'con 1 clic' : '1-Click'}</>
        )}
      </button>
    </section>
  )
}
