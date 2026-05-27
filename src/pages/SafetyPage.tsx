import type { Language } from '../components/types'
import type { TFunction } from '../components/types'
import { SafetyPanel, ProcessPanel } from '../components/InfoPanels'
import { innovationBacklog } from '../data'
import { translatePhrase } from '../i18n'

interface SafetyPageProps {
  t: TFunction
  language: Language
}

export default function SafetyPage({ t, language }: SafetyPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)

  return (
    <>
      <SafetyPanel t={t} language={language} />
      <ProcessPanel t={t} language={language} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Innovation</span>
            <h2>Backlog</h2>
          </div>
        </div>
        <div className="innovation-list">
          {innovationBacklog.map((item) => (
            <div className="innovation-row" key={item.title}>
              <div>
                <h3>{tx(item.title)}</h3>
                <p>{tx(item.proof)}</p>
                <small>{tx(item.change)}</small>
              </div>
              <span className={`risk-pill ${item.risk.toLowerCase()}`}>{tx(item.risk)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
