import type { EngineCommand } from './types'
import type { GameKey } from '../data'
import { games } from '../data'
import type { Language } from '../i18n'
import type { TFunction } from './types'

interface TopBarProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  busyCommand: EngineCommand | null
  onSelectGame: (key: GameKey) => void
  onToggleLanguage: () => void
  onOptimize: () => void
}

const gameColors: Record<string, string> = { Valorant: '#fa4454', CS2: '#de9b35', Fortnite: '#9d4de0' }

export default function TopBar({ t: _t, language, activeGame, busyCommand, onSelectGame, onToggleLanguage, onOptimize }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="game-tabs" role="tablist" aria-label="Game">
        {(Object.keys(games) as GameKey[]).map((key) => {
          const active = key === activeGame
          return (
            <button
              className={active ? 'tab active' : 'tab'}
              key={key}
              onClick={() => onSelectGame(key)}
              role="tab"
              type="button"
              style={active ? { background: gameColors[key], borderColor: gameColors[key], color: '#0b0c0b' } : {}}
            >
              {key}
            </button>
          )
        })}
      </div>

      <div className="action-row">
        <button className="language-toggle" onClick={onToggleLanguage} type="button">
          {language.toUpperCase()}
        </button>
        <button
          className="action-btn primary"
          disabled={busyCommand !== null}
          onClick={onOptimize}
          type="button"
          style={{ fontSize: 15, padding: '10px 28px', fontWeight: 800 }}
        >
          {busyCommand ? <><span className="spinner" />Working...</> : 'Optimize 1-Click'}
        </button>
      </div>
    </header>
  )
}
