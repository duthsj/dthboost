import type { Receipt, EngineCommand } from '../components/types'
import type { Language } from '../i18n'
import type { TFunction } from '../components/types'
import { translatePhrase } from '../i18n'

interface SessionBoostPageProps {
  t: TFunction
  language: Language
  plan: Array<{ id: string; title: string; copy: string; receipt: string; enabled: boolean; risk?: string }>
  receipts: Receipt[]
  busyCommand: EngineCommand | null
  onTogglePlan: (id: string) => void
  onRollback: () => void
  onSelectReceipt: (r: Receipt) => void
}

export default function SessionBoostPage({
  t, language, plan, receipts, busyCommand, onTogglePlan, onRollback, onSelectReceipt,
}: SessionBoostPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.sessionBoost}</span>
          <h2>{t.plannedChanges}</h2>
        </div>
        <button
          className="action-btn danger"
          disabled={busyCommand !== null}
          onClick={onRollback}
          type="button"
        >
          {busyCommand === 'rollback_session' ? <><span className="spinner" />{t.restoring}</> : t.rollback}
        </button>
      </div>

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

      {receipts.length > 0 ? (
        <div className="receipt-history" style={{ marginTop: 18 }}>
          {receipts.map((receipt) => (
            <button className="receipt-card" key={receipt.id} onClick={() => onSelectReceipt(receipt)} type="button">
              <span>
                <strong>{tx(receipt.title)}</strong>
                <small>{receipt.scope} · {tx(receipt.risk)}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: 18 }}>
          <strong>{t.noChangesRecorded}</strong>
          <p>{t.receiptsEmpty}</p>
        </div>
      )}
    </section>
  )
}
