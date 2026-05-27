import type { TFunction } from './types'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  t: TFunction
  language: Language
}

const routeMap: Record<string, string> = {
  Dashboard: '/',
  Optimize: '/optimize',
  History: '/history',
  Settings: '/settings',
  Games: '/games',
  Network: '/network',
  Safety: '/safety',
  Tweaks: '/tweaks',
  Session: '/session',
  Reports: '/reports',
}

const icons: Record<string, string> = {
  Dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  Optimize: 'M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
  History: 'M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
  Settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.484.484 0 00-.41-.3h-3.98c-.2 0-.38.12-.44.3l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.18.23.3.44.3h3.98c.2 0 .38-.12.44-.3l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  Games: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  Network: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  Safety: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
  Tweaks: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  Session: 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z',
  Reports: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
}

export default function Sidebar({ t, language }: SidebarProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)

  return (
    <aside className="sidebar" aria-label="DTHBoost navigation">
      <div className="brand">
        <div className="brand-mark" style={{ background: 'transparent', width: 'auto', height: 'auto', border: 'none' }}>
          <svg width="130" height="38" viewBox="0 0 400 120" fill="none">
            <defs>
              <linearGradient id="b" x1="0" y1="0" x2="400" y2="0">
                <stop offset="0%" stop-color="#78d08f"/><stop offset="100%" stop-color="#68c6bd"/>
              </linearGradient>
            </defs>
            <text x="0" y="78" font-family="'Inter','Segoe UI',sans-serif" font-weight="900" font-size="64" fill="url(#b)" letter-spacing="-2">DTH</text>
            <text x="150" y="78" font-family="'Inter','Segoe UI',sans-serif" font-weight="200" font-size="64" fill="#e2e3de" letter-spacing="6">BOOST</text>
            <text x="2" y="100" font-family="'Inter','Segoe UI',sans-serif" font-weight="400" font-size="11" fill="#8a8b86" letter-spacing="4">OPTIMIZER</text>
          </svg>
        </div>
      </div>

      <nav className="nav-list" aria-label="Primary">
        {navOrder.map((label) => {
          const path = routeMap[label]
          if (!path) return null
          return (
            <NavLink
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              key={label}
              to={path}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
                <path d={icons[label] || icons.Dashboard} />
              </svg>
              {tx(label)}
            </NavLink>
          )
        })}
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

const navOrder = [
  'Dashboard',
  'Optimize',
  'History',
  'Settings',
  'Games',
  'Network',
  'Safety',
  'Tweaks',
  'Session',
  'Reports',
]
