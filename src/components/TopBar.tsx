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
  isAdmin: boolean
  onSelectGame: (key: GameKey) => void
  onToggleLanguage: () => void
  onOptimize: () => void
  onRestartAsAdmin: () => void
}

const gameColors: Record<string, string> = { Valorant: '#fa4454', CS2: '#de9b35', Fortnite: '#9d4de0' }

export default function TopBar({ t: _t, language, activeGame, busyCommand, isAdmin, onSelectGame, onToggleLanguage, onOptimize, onRestartAsAdmin }: TopBarProps) {
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
        {!isAdmin && (
          <button
            className="action-btn"
            onClick={onRestartAsAdmin}
            type="button"
            title="Restart with administrator privileges to enable real benchmark capture and all tweaks"
            style={{ fontSize: 12, padding: '6px 14px', background: '#fa445422', border: '1px solid #fa4454', color: '#fa4454', borderRadius: 6, fontWeight: 600 }}
          >
            Run as Admin
          </button>
        )}
        {isAdmin && (
          <span style={{ fontSize: 11, padding: '6px 12px', background: '#78d08f22', border: '1px solid #78d08f', color: '#78d08f', borderRadius: 6, fontWeight: 600 }}>
            ADMIN
          </span>
        )}
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
