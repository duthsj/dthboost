import type { EngineCommand } from './types'
import type { GameKey } from '../data'
import { games } from '../data'
import type { Language } from '../i18n'
import { translatePhrase } from '../i18n'
import type { TFunction } from './types'

interface TopBarProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  busyCommand: EngineCommand | null
  canBoost: boolean
  onSelectGame: (key: GameKey) => void
  onScan: () => void
  onBenchmark: () => void
  onBoost: () => void
  onToggleLanguage: () => void
}

export default function TopBar({
  t,
  language,
  activeGame,
  busyCommand,
  canBoost,
  onSelectGame,
  onScan,
  onBenchmark,
  onBoost,
  onToggleLanguage,
}: TopBarProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame]

  return (
    <header className="topbar">
      <div className="title-block">
        <h1>{t.dashboard}</h1>
        <p>{game.path}</p>
      </div>

      <div className="game-tabs" role="tablist" aria-label="Game">
        {(Object.keys(games) as GameKey[]).map((key) => (
          <button
            className={key === activeGame ? 'tab active' : 'tab'}
            key={key}
            onClick={() => onSelectGame(key)}
            role="tab"
            type="button"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="action-row">
        <button
          className="language-toggle"
          onClick={onToggleLanguage}
          type="button"
        >
          {language.toUpperCase()}
        </button>
        <button
          className="action-btn secondary"
          disabled={busyCommand !== null}
          onClick={onScan}
          type="button"
        >
          {busyCommand === 'scan' ? (
            <><span className="spinner" />{t.scanning}</>
          ) : (
            t.scan
          )}
        </button>
        <button
          className="action-btn secondary"
          disabled={busyCommand !== null}
          onClick={onBenchmark}
          type="button"
        >
          {busyCommand === 'benchmark' ? (
            <><span className="spinner" />{t.measuring}</>
          ) : (
            t.benchmark
          )}
        </button>
        <button
          className="action-btn primary"
          disabled={!canBoost}
          onClick={onBoost}
          title={canBoost ? 'Arm Safe Session Boost' : t.needBaseline}
          type="button"
        >
          {busyCommand === 'apply_safe_session_boost' ? (
            <><span className="spinner" />{t.arming}</>
          ) : canBoost ? (
            t.boost
          ) : (
            t.needBaseline
          )}
        </button>
      </div>
    </header>
  )
}
