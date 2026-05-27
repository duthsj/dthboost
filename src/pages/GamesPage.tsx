import type { GameKey } from '../data'
import type { Language } from '../i18n'
import { games } from '../data'
import { translatePhrase } from '../i18n'
import type { TFunction } from '../components/types'
import RecommendationsPanel from '../components/RecommendationsPanel'
import { VendorIntelPanel } from '../components/InfoPanels'

interface GamesPageProps {
  t: TFunction
  language: Language
  activeGame: GameKey
}

export default function GamesPage({ t, language, activeGame }: GamesPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)
  const game = games[activeGame] ?? games.Valorant

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{activeGame}</span>
          <h2>{tx(game.profile)}</h2>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{game.path}</p>

      <RecommendationsPanel t={t} language={language} activeGame={activeGame} />
      <div style={{ marginTop: 18 }}>
        <VendorIntelPanel t={t} language={language} activeGame={activeGame} />
      </div>
    </section>
  )
}
