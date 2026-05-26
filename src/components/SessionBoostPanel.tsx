import type { EngineCommand, TFunction } from './types'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

type PlanItem = {
  id: string
  title: string
  copy: string
  receipt: string
  enabled: boolean
}

type Receipt = {
  id: string
  command: string
  title: string
  risk: string
  scope: string
  target: string
  before: string
  after: string
  rollback: string
  requiresAdmin: boolean
  requiresReboot: boolean
  timestamp: string
}

interface SessionBoostPanelProps {
  t: TFunction
  language: Language
  plan: PlanItem[]
  enabledPlan: PlanItem[]
  receipts: Receipt[]
  busyCommand: EngineCommand | null
  onTogglePlan: (id: string) => void
  onRollback: () => void
  onSelectReceipt: (receipt: Receipt) => void
}

export default function SessionBoostPanel({
  t,
  language,
  plan,
  enabledPlan,
  receipts,
  busyCommand,
  onTogglePlan,
  onRollback,
  onSelectReceipt,
}: SessionBoostPanelProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)

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
          {busyCommand === 'rollback_session' ? (
            <><span className="spinner" />{t.restoring}</>
          ) : (
            t.rollback
          )}
        </button>
      </div>

      <div className="toggle-list">
        {plan.map((item) => (
          <button
            className="toggle-row"
            key={item.id}
            onClick={() => onTogglePlan(item.id)}
            type="button"
          >
            <span>
              <strong>{tx(item.title)}</strong>
              <small>{tx(item.copy)}</small>
            </span>
            <i className={item.enabled ? 'switch on' : 'switch'} />
          </button>
        ))}
      </div>

      <div className="receipt-list" aria-label="Enabled changes">
        {enabledPlan.map((item) => (
          <span className="receipt-item" key={item.id}>
            {tx(item.receipt)}
          </span>
        ))}
      </div>

      <div className="section-heading" style={{ marginTop: 18 }}>
        <div>
          <span className="eyebrow">{t.receipts}</span>
          <h2>{t.changeHistory}</h2>
        </div>
      </div>

      {receipts.length > 0 ? (
        <div className="receipt-history">
          {receipts.map((receipt) => (
            <button
              className="receipt-card"
              key={receipt.id}
              onClick={() => onSelectReceipt(receipt)}
              type="button"
            >
              <span>
                <strong>{tx(receipt.title)}</strong>
                <small>{receipt.scope} &middot; {tx(receipt.risk)}</small>
              </span>
              <i className={`risk-pill ${riskClass(receipt.risk)}`}>
                {new Date(Number(receipt.timestamp) * 1000).toLocaleTimeString([], {
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </i>
            </button>
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

function riskClass(risk: string) {
  return risk.toLowerCase().replace(' ', '-')
}
