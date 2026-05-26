import type { GameKey, TFunction } from './types'
import { games } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface RecommendationsPanelProps {
  t: TFunction
  language: Language
  activeGame: GameKey
}

function riskClass(risk: string) {
  return risk.toLowerCase().replace(' ', '-')
}

export default function RecommendationsPanel({ t, language, activeGame }: RecommendationsPanelProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame]

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.recommendations}</span>
          <h2>{t.nextBestChanges}</h2>
        </div>
      </div>

      <div className="recommendation-list">
        {game.recommendations.map((item) => (
          <article className="recommendation" key={item.title}>
            <div>
              <h3>{tx(item.title)}</h3>
              <p>{tx(item.copy)}</p>
              <small>
                {t.expected}: {tx(item.expectedMetric)}. {t.rollback}: {tx(item.rollbackRule)}
              </small>
            </div>
            <span className={`risk-pill ${riskClass(item.risk)}`}>
              {tx(item.risk)}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
