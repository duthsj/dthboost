import type { GameKey, Language, TFunction } from './types'
import { games } from '../data'

interface GameReadyCardProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  readiness: number
  sessionState: string
  receiptsCount: number
}

const gameStyles: Record<GameKey, { color: string; bg: string; label: string }> = {
  Valorant: { color: '#fa4454', bg: 'rgba(250,68,84,0.10)', label: 'VALORANT' },
  CS2: { color: '#de9b35', bg: 'rgba(222,155,53,0.10)', label: 'COUNTER-STRIKE 2' },
  Fortnite: { color: '#9d4de0', bg: 'rgba(157,77,224,0.10)', label: 'FORTNITE' },
}

import { memo } from 'react'

function GameReadyCard({
  t, language, activeGame, readiness, sessionState, receiptsCount,
}: GameReadyCardProps) {
  const game = games[activeGame] ?? games.Valorant
  const boosted = sessionState === 'boosted'
  const gs = gameStyles[activeGame]

  return (
    <section className="panel game-ready-card">
      <div className="gr-left">
        <div className="gr-icon" style={{ background: gs.bg, border: `1px solid ${gs.color}22`, width: 'auto', padding: '8px 14px', borderRadius: 8 }}>
          <span style={{ color: gs.color, fontFamily: 'var(--font)', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>{gs.label}</span>
        </div>
        <div className="gr-info">
          <span className="eyebrow">{t.activeProfile}</span>
          <h2>{activeGame}</h2>
          <p>{game.path?.split('\\').pop()}</p>
        </div>
      </div>

      <div className="gr-center">
        <div className={`gr-score ${boosted ? 'boosted' : ''}`} style={{ '--score': `${readiness}%` } as React.CSSProperties}>
          <strong>{readiness}</strong>
          <span>{language === 'es' ? 'Preparación' : 'Readiness'}</span>
        </div>
      </div>

      <div className="gr-right">
        <div className="gr-stat">
          <span>{t.frameTimeP95}</span>
          <strong>{game.metrics.frameTimeP95}</strong>
        </div>
        <div className="gr-stat">
          <span>{t.oneLowEstimate}</span>
          <strong>{game.metrics.onePercentLow}</strong>
        </div>
        <div className="gr-stat">
          <span>{t.rollbackState}</span>
          <strong>{receiptsCount > 0 ? t.receiptReady : t.ready}</strong>
        </div>
        <div className="gr-stat">
          <span>{language === 'es' ? 'Boost' : 'Boost'}</span>
          <strong className={boosted ? 'on' : ''}>{boosted ? 'ACTIVE' : 'IDLE'}</strong>
        </div>
      </div>
    </section>
  )
}

export default memo(GameReadyCard)
