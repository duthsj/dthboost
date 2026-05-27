import type { GameKey } from './types'
import { games } from '../data'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface SignalStripProps {
  language: Language
  activeGame: GameKey
}

export default function SignalStrip({ language, activeGame }: SignalStripProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)
  const game = games[activeGame] ?? games.Valorant

  return (
    <section className="signal-strip" aria-label="System signals">
      {game.signals.map((signal) => (
        <div className="signal" key={signal.label}>
          <span>{tx(signal.label)}</span>
          <strong>{tx(signal.value)}</strong>
          <div className={`bar ${signal.tone}`}>
            <i style={{ width: `${signal.level}%` }} />
          </div>
        </div>
      ))}
    </section>
  )
}
