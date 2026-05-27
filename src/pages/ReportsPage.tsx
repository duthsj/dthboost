import type { Receipt, BenchmarkResult, Language } from '../components/types'
import type { TFunction } from '../components/types'
import { translatePhrase } from '../i18n'

interface ReportsPageProps {
  t: TFunction
  language: Language
  receipts: Receipt[]
  benchmarkResult: BenchmarkResult | null
}

export default function ReportsPage({ t, language, receipts, benchmarkResult }: ReportsPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)

  const handleExportJSON = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      receipts,
      benchmark: benchmarkResult,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dthboost-report-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => window.print()

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.receipts}</span>
          <h2>{t.changeHistory}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="action-btn secondary" onClick={handleExportJSON} type="button">
            Export JSON
          </button>
          <button className="action-btn secondary" onClick={handlePrint} type="button">
            Print
          </button>
        </div>
      </div>

      {receipts.length > 0 ? (
        <div className="receipt-history">
          {receipts.map((receipt) => (
            <div className="receipt-card" key={receipt.id}>
              <div>
                <strong>{tx(receipt.title)}</strong>
                <small>{receipt.scope} · {tx(receipt.risk)} · {tx(receipt.command)}</small>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
                <div>{tx(receipt.before)} → {tx(receipt.after)}</div>
                <div style={{ marginTop: 4 }}>{tx(receipt.rollback)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>{t.noChangesRecorded}</strong>
          <p>{t.receiptsEmpty}</p>
        </div>
      )}
    </section>
  )
}
