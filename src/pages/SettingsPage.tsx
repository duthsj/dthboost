import { useState } from 'react'
import type { EngineCommand, Language, TFunction } from '../components/types'
import { isSoundEnabled, toggleSound } from '../components/Sounds'

interface SettingsPageProps {
  t: TFunction
  language: Language
  busyCommand: EngineCommand | null
  autoBoost: boolean
  onToggleLanguage: () => void
  onToggleAutoBoost: () => void
  onRunCommand: (cmd: EngineCommand) => void
}

export default function SettingsPage({ t: _t, language, busyCommand: _bc, autoBoost, onToggleLanguage, onToggleAutoBoost, onRunCommand }: SettingsPageProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled())

  const handleToggleSound = () => {
    const next = toggleSound()
    setSoundOn(next)
  }

  const es = language === 'es'

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{es ? 'Configuración' : 'Settings'}</span>
          <h2>{es ? 'Preferencias' : 'Preferences'}</h2>
        </div>
      </div>

      <div className="toggle-list">
        <div className="toggle-row" onClick={onToggleLanguage} style={{ cursor: 'pointer' }}>
          <span>
            <strong>{es ? 'Idioma' : 'Language'}</strong>
            <small>{language === 'es' ? 'Español — Cambiar a English' : 'English — Switch to Español'}</small>
          </span>
          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>
            {language.toUpperCase()}
          </span>
        </div>

        <div className="toggle-row" onClick={handleToggleSound} style={{ cursor: 'pointer' }}>
          <span>
            <strong>{es ? 'Sonidos' : 'Sound Effects'}</strong>
            <small>{es ? 'Feedback auditivo al completar acciones' : 'Audio feedback when actions complete'}</small>
          </span>
          <i className={soundOn ? 'switch on' : 'switch'} />
        </div>

        <div className="toggle-row" onClick={() => onRunCommand('toggle_autostart')} style={{ cursor: 'pointer' }}>
          <span>
            <strong>{es ? 'Iniciar con Windows' : 'Start with Windows'}</strong>
            <small>{es ? 'DTHBoost se abre automáticamente al encender la PC' : 'DTHBoost launches automatically when you turn on your PC'}</small>
          </span>
          <i className={'switch'} />
        </div>

        <div className="toggle-row" onClick={onToggleAutoBoost} style={{ cursor: 'pointer' }}>
          <span>
            <strong>{es ? 'Auto-Boost al detectar juego' : 'Auto-Boost on game detection'}</strong>
            <small>{es ? 'Optimiza automáticamente cuando abres tu juego. Sin hacer clic.' : 'Automatically optimize when you launch your game. No click needed.'}</small>
          </span>
          <i className={autoBoost ? 'switch on' : 'switch'} />
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <strong style={{ color: 'var(--text)', fontSize: 14 }}>DTHBoost v0.9.0</strong>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
          {es ? 'Optimizador competitivo gratuito y open source.' : 'Free and open source competitive gaming optimizer.'}
          <br />
          {es ? 'Sesión segura · 20 tweaks · Benchmark real · Anti-cheat safe' : 'Session-only · 20 tweaks · Real benchmark · Anti-cheat safe'}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          <span className="risk-pill safe" style={{ fontSize: 10 }}>Tauri 2</span>
          <span className="risk-pill measured" style={{ fontSize: 10 }}>React 19</span>
          <span className="risk-pill safe" style={{ fontSize: 10 }}>Rust</span>
          <span className="risk-pill measured" style={{ fontSize: 10 }}>PresentMon</span>
        </div>
      </div>
    </section>
  )
}
