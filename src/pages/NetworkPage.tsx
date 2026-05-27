import type { NetworkTruthResult, MemoryStutterResult } from '../components/types'
import type { Language } from '../i18n'
import type { TFunction } from '../components/types'
import { NetworkTruthPanel, MemoryPanel } from '../components/InfoPanels'
import { competitorMatrix } from '../data'

interface NetworkPageProps {
  t: TFunction
  language: Language
  networkResult: NetworkTruthResult | null
  memoryResult: MemoryStutterResult | null
}

export default function NetworkPage({ t, language, networkResult, memoryResult }: NetworkPageProps) {
  return (
    <>
      <NetworkTruthPanel t={t} language={language} networkResult={networkResult} />
      <MemoryPanel t={t} language={language} memoryResult={memoryResult} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Competitive landscape</span>
            <h2>Competitor analysis</h2>
          </div>
        </div>
        <div className="competitor-table">
          {competitorMatrix.map((row) => (
            <article className="competitor-row" key={row.competitor}>
              <h3>{row.competitor}</h3>
              <p>{row.strength}</p>
              <small style={{ color: 'var(--red)' }}>{row.gap}</small>
              <strong>{row.dthboostMove}</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
