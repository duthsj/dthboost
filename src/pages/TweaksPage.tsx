import type { EngineCommand, FrametimeDoctorResult, BottleneckResult, InputPathAuditResult, GameSmoothnessLabResult } from '../components/types'
import type { Language } from '../i18n'
import type { TFunction } from '../components/types'
import { translatePhrase } from '../i18n'
import DiagnosisCenter from '../components/DiagnosisCenter'
import type { GameKey } from '../data'

interface TweaksPageProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  busyCommand: EngineCommand | null
  onRunCommand: (command: EngineCommand) => void
  plan: Array<{ id: string; title: string; copy: string; receipt: string; enabled: boolean; risk?: string }>
  frametimeResult: FrametimeDoctorResult | null
  bottleneckResult: BottleneckResult | null
  inputPathResult: InputPathAuditResult | null
  gameLabResult: GameSmoothnessLabResult | null
}

export default function TweaksPage({
  t, language, activeGame, busyCommand, onRunCommand, plan,
  frametimeResult, bottleneckResult, inputPathResult, gameLabResult,
}: TweaksPageProps) {
  const tx = (v: string | number | null | undefined) => translatePhrase(v, language)

  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.sessionBoost}</span>
            <h2>{t.plannedChanges}</h2>
          </div>
        </div>
        <div className="toggle-list">
          {plan.map((item) => (
            <div className="toggle-row" key={item.id}>
              <span>
                <strong>{tx(item.title)}</strong>
                <small>{tx(item.copy)}</small>
              </span>
              <i className={item.enabled ? 'switch on' : 'switch'} />
            </div>
          ))}
        </div>
      </section>

      <DiagnosisCenter
        t={t}
        language={language}
        activeGame={activeGame}
        frametimeResult={frametimeResult}
        bottleneckResult={bottleneckResult}
        inputPathResult={inputPathResult}
        gameLabResult={gameLabResult}
        busyCommand={busyCommand}
        onRunCommand={onRunCommand}
      />
    </>
  )
}
