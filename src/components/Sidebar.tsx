import type { TFunction } from './types'
import { navItems } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface SidebarProps {
  t: TFunction
  language: Language
}

export default function Sidebar({ t, language }: SidebarProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)

  return (
    <aside className="sidebar" aria-label="DTHBoost navigation">
      <div className="brand">
        <div className="brand-mark">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="currentColor" opacity="0.9"/>
            <path d="M16 10 L22 16 L16 22 L10 16 Z" fill="#0b0c0b" opacity="0.7"/>
          </svg>
        </div>
        <div>
          <strong>DTHBoost</strong>
          <span>{t.competitiveSystemTuner}</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Primary">
        {navItems.map((item) => (
          <button
            className={item === 'Dashboard' ? 'nav-item active' : 'nav-item'}
            key={item}
            type="button"
          >
            {tx(item)}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="guard-panel">
          <div className="guard-status">
            <span className="status-dot" />
            <strong>{t.guardEnabled}</strong>
          </div>
          <p>{t.guardCopy}</p>
        </div>
      </div>
    </aside>
  )
}
