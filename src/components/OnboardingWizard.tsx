import { useState } from 'react'
import type { EngineCommand, TFunction } from './types'
import type { Language } from '../i18n'

interface OnboardingWizardProps {
  t: TFunction
  language: Language
  busyCommand: EngineCommand | null
  onScan: () => void
  onBenchmark: () => void
  onBoost: () => void
  onFinish: () => void
  onSkip: () => void
}

const steps = [
  { key: 'scan', label: '1. Scan', desc: 'Detect games, GPU, refresh rate and active Windows state.' },
  { key: 'benchmark', label: '2. Benchmark', desc: 'Run PresentMon baseline before changing anything.' },
  { key: 'boost', label: '3. Boost', desc: 'Apply session-safe changes with automatic rollback.' },
]

export default function OnboardingWizard({
  t, language: _language, busyCommand, onScan, onBenchmark, onBoost, onFinish, onSkip,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(0)

  const actions: Record<string, () => void> = {
    scan: onScan,
    benchmark: onBenchmark,
    boost: onBoost,
  }

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <strong>DTHBoost Setup</strong>
          <button className="action-btn ghost" onClick={onSkip} type="button">Skip</button>
        </div>

        <div className="onboarding-steps">
          {steps.map((s, i) => (
            <div key={s.key} className={`onboarding-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <span>{i + 1}</span>
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        <div className="onboarding-body">
          <h2>{current.label}</h2>
          <p>{current.desc}</p>
        </div>

        <div className="onboarding-actions">
          {step > 0 && (
            <button className="action-btn secondary" onClick={() => setStep(step - 1)} type="button" disabled={busyCommand !== null}>
              Back
            </button>
          )}
          <button
            className="action-btn primary"
            disabled={busyCommand !== null}
            onClick={() => {
              actions[current.key]()
              if (isLast) {
                setTimeout(onFinish, 800)
              } else {
                setTimeout(() => setStep(step + 1), 600)
              }
            }}
            type="button"
          >
            {busyCommand !== null ? (
              <><span className="spinner" />{t.measuring}</>
            ) : isLast ? (
              'Finish'
            ) : (
              `Run ${current.label.slice(3)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
