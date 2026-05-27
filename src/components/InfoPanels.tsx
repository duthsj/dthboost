import type { NetworkTruthResult, MemoryStutterResult, TFunction } from './types'
import { processAllowlist, vendorGuidance, safetyRules, workflowSteps } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'
import type { GameKey } from '../data'

function riskClass(risk: string) {
  return risk.toLowerCase().replace(' ', '-')
}

// ── Session Flow ──

export function SessionFlowPanel({ t, language }: { t: TFunction; language: Language }) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.sessionFlow}</span>
          <h2>{t.measureBoostRestore}</h2>
        </div>
      </div>
      <div className="stepper">
        {workflowSteps.map((step, index) => (
          <div className="step-row" key={step.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{tx(step.label)}</strong>
              <p>{tx(step.copy)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Network Truth ──

export function NetworkTruthPanel({ t, language, networkResult }: {
  t: TFunction; language: Language; networkResult: NetworkTruthResult | null
}) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.networkTruth}</span>
          <h2>{t.latencyUnderLoad}</h2>
        </div>
      </div>
      {networkResult ? (
        <div className="diagnostic-grid">
          <div><span>Idle</span><strong>{networkResult.idlePing} ms</strong></div>
          <div><span>Loaded</span><strong>{networkResult.loadedPing} ms</strong></div>
          <div><span>Jitter</span><strong>{networkResult.jitter} ms</strong></div>
          <div><span>Grade</span><strong>{networkResult.bufferbloatGrade}</strong></div>
          <p>{tx(networkResult.recommendation)}</p>
        </div>
      ) : (
        <div className="empty-state">
          <strong>{t.noNetworkTest}</strong>
          <p>{t.networkCopy}</p>
        </div>
      )}
    </section>
  )
}

// ── Memory Stutter ──

export function MemoryPanel({ t, language, memoryResult }: {
  t: TFunction; language: Language; memoryResult: MemoryStutterResult | null
}) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.memoryStutter}</span>
          <h2>{t.ramPressureEvidence}</h2>
        </div>
      </div>
      {memoryResult ? (
        <div className="diagnostic-grid">
          <div><span>Total</span><strong>{memoryResult.totalRamGb} GB</strong></div>
          <div><span>Free</span><strong>{memoryResult.freeRamGb} GB</strong></div>
          <div><span>Commit</span><strong>{memoryResult.commitPercent}%</strong></div>
          <div><span>Faults</span><strong>{memoryResult.hardFaultsPerSecond}/s</strong></div>
          <p>{tx(memoryResult.verdict)}</p>
        </div>
      ) : (
        <div className="empty-state">
          <strong>{t.noMemoryTest}</strong>
          <p>{t.memoryCopy}</p>
        </div>
      )}
    </section>
  )
}

// ── Process Allowlist ──

export function ProcessPanel({ t, language }: { t: TFunction; language: Language }) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.processAllowlist}</span>
          <h2>{t.closeOnlyApproved}</h2>
        </div>
      </div>
      <div className="process-list">
        {processAllowlist.map((item) => (
          <div className="process-row" key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <p>{tx(item.reason)}</p>
            </div>
            <span className={item.defaultAction === 'Blocked' ? 'risk-pill blocked' : 'risk-pill safe'}>
              {tx(item.defaultAction)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Vendor Intel ──

export function VendorIntelPanel({ t, language, activeGame }: {
  t: TFunction; language: Language; activeGame: GameKey
}) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.vendorIntelligence}</span>
          <h2>{activeGame} {t.latencyMap}</h2>
        </div>
      </div>
      <div className="safety-list">
        {(vendorGuidance[activeGame] ?? vendorGuidance.Valorant).map((item) => (
          <div className="intel-row" key={`${activeGame}-${item.label}`}>
            <div>
              <strong>{item.label}</strong>
              <p>{tx(item.value)}</p>
            </div>
            <span className={`risk-pill ${riskClass(item.risk)}`}>{tx(item.risk)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Safety Rules ──

export function SafetyPanel({ t, language }: { t: TFunction; language: Language }) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.safety}</span>
          <h2>{t.allowedSurface}</h2>
        </div>
        <span className="risk-pill safe">{t.clean}</span>
      </div>
      <div className="safety-list">
        {safetyRules.map((rule) => (
          <div className="safety-row" key={rule.label}>
            <strong>{tx(rule.label)}</strong>
            <span className={`risk-pill ${riskClass(rule.risk)}`}>{tx(rule.risk)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Activity Log ──

export function ActivityLog({ t, language, log }: {
  t: TFunction; language: Language; log: Array<{ label: string; time: string }>
}) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.activity}</span>
          <h2>{t.sessionLog}</h2>
        </div>
      </div>
      <div className="activity-list">
        {log.map((item) => (
          <div className="activity-row" key={`${item.time}-${item.label}`}>
            <span>{tx(item.label)}</span>
            <time>{item.time}</time>
          </div>
        ))}
      </div>
    </section>
  )
}
