import type { CSSProperties } from 'react'
import type { BottleneckResult, GameKey, TFunction } from './types'
import { games } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface HeroPanelProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  readiness: number
  statusCopy: string
  likelyCause: string
  sessionState: string
  receiptsCount: number
  bottleneckResult: BottleneckResult | null
}

export default function HeroPanel({
  t,
  language,
  activeGame,
  readiness,
  statusCopy,
  likelyCause,
  sessionState,
  receiptsCount,
  bottleneckResult,
}: HeroPanelProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame] ?? games.Valorant

  return (
    <section className="hero-panel" aria-label="Current system state">
      <div className="readiness">
        <div
          className="score-ring"
          style={{ '--score': `${readiness}%` } as CSSProperties}
        >
          <strong>{readiness}</strong>
          <span>{language === 'es' ? 'Preparación' : 'Readiness'}</span>
        </div>
        <div className="score-ring-glow" />
      </div>

      <div className="hero-copy">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.activeProfile}</span>
            <h2>{tx(game.profile)}</h2>
          </div>
          <span className="risk-pill safe">{t.safeFirst}</span>
        </div>

        <p className="diagnosis">{tx(statusCopy)}</p>

        <div className="cause-banner">
          <span>{t.likelyCause}</span>
          <strong>{tx(likelyCause)}</strong>
          <p>
            {bottleneckResult
              ? tx(bottleneckResult.nextTest)
              : t.runDiagnosisFirst}
          </p>
        </div>

        <dl className="metric-list">
          <div>
            <dt>{t.frameTimeP95}</dt>
            <dd>{game.metrics.frameTimeP95}</dd>
          </div>
          <div>
            <dt>{t.oneLowEstimate}</dt>
            <dd>{game.metrics.onePercentLow}</dd>
          </div>
          <div>
            <dt>{t.latencyPath}</dt>
            <dd>{tx(sessionState)}</dd>
          </div>
          <div>
            <dt>{t.rollbackState}</dt>
            <dd>{receiptsCount > 0 ? t.receiptReady : t.ready}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
