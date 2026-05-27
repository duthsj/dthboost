import type {
  BottleneckResult,
  EngineCommand,
  FrametimeDoctorResult,
  GameSmoothnessLabResult,
  GameKey,
  InputPathAuditResult,
  TFunction,
} from './types'
import { translatePhrase } from '../i18n'
import type { Language } from '../i18n'

interface DiagnosisCenterProps {
  t: TFunction
  language: Language
  activeGame: GameKey
  frametimeResult: FrametimeDoctorResult | null
  bottleneckResult: BottleneckResult | null
  inputPathResult: InputPathAuditResult | null
  gameLabResult: GameSmoothnessLabResult | null
  busyCommand: EngineCommand | null
  onRunCommand: (command: EngineCommand) => void
}

export default function DiagnosisCenter({
  t,
  language,
  activeGame,
  frametimeResult,
  bottleneckResult,
  inputPathResult,
  gameLabResult,
  busyCommand,
  onRunCommand,
}: DiagnosisCenterProps) {
  const tx = (value: string | number | null | undefined) => translatePhrase(value, language)

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.diagnosisCenter}</span>
          <h2>{t.whyHighFpsBad}</h2>
        </div>
        <span className="risk-pill safe">{t.noChanges}</span>
      </div>

      <div className="lab-actions">
        {[
          { command: 'frametime_doctor' as EngineCommand, title: 'Frametime Doctor' },
          { command: 'bottleneck_classifier' as EngineCommand, title: 'Bottleneck Classifier' },
          { command: 'input_path_audit' as EngineCommand, title: 'Input Path Audit' },
          { command: 'game_smoothness_lab' as EngineCommand, title: 'Game Smoothness Lab' },
        ].map((action) => (
          <button
            className="action-btn secondary"
            disabled={busyCommand !== null}
            key={action.command}
            onClick={() => onRunCommand(action.command)}
            type="button"
          >
            {busyCommand === action.command ? (
              <><span className="spinner" />{tx('Running')}</>
            ) : (
              tx(action.title)
            )}
          </button>
        ))}
        <button
          className="action-btn secondary"
          disabled={busyCommand !== null}
          onClick={() => onRunCommand('network_truth')}
          type="button"
        >
          {busyCommand === 'network_truth' ? (
            <><span className="spinner" />{t.testingNetwork}</>
          ) : (
            t.runNetworkTruth
          )}
        </button>
        <button
          className="action-btn secondary"
          disabled={busyCommand !== null}
          onClick={() => onRunCommand('memory_stutter_test')}
          type="button"
        >
          {busyCommand === 'memory_stutter_test' ? (
            <><span className="spinner" />{t.testingMemory}</>
          ) : (
            t.runMemoryTest
          )}
        </button>
      </div>

      <div className="diagnosis-center">
        <article>
          <span>{t.frametime}</span>
          <strong>{frametimeResult?.diagnosis ? tx(frametimeResult.diagnosis) : t.notTested}</strong>
          <p>
            {frametimeResult
              ? `${frametimeResult.framePacingScore}/100 pacing, p99 ${frametimeResult.p99FrameTime} ms. ${tx(frametimeResult.capAdvice)}`
              : tx('Run Frametime Doctor to detect p99 spikes, tearing risk and false high FPS.')}
          </p>
        </article>
        <article>
          <span>{t.bottleneck}</span>
          <strong>{bottleneckResult?.primary ? tx(bottleneckResult.primary) : t.unknown}</strong>
          <p>
            {bottleneckResult
              ? `${bottleneckResult.confidence}% confidence. ${tx(bottleneckResult.nextTest)}`
              : tx('Run Bottleneck Classifier before applying CPU, GPU, memory or network tweaks.')}
          </p>
        </article>
        <article>
          <span>{t.inputPath}</span>
          <strong>{inputPathResult?.overlayRisk ? tx(inputPathResult.overlayRisk) : t.notAudited}</strong>
          <p>
            {inputPathResult
              ? `${inputPathResult.pollingRate}. ${tx(inputPathResult.recommendation)}`
              : tx('Run Input Path Audit for mouse polling, overlays, captures and USB power warnings.')}
          </p>
        </article>
        <article>
          <span>{t.gameLab}</span>
          <strong>{gameLabResult?.labName ? tx(gameLabResult.labName) : `${activeGame} ${t.notTested.toLowerCase()}`}</strong>
          <p>
            {gameLabResult?.tests
              ? gameLabResult.tests.map((test) => `${tx(test.name)}: ${tx(test.status)}`).join(' / ')
              : tx('Run the game-specific lab for Valorant, CS2 or Fortnite recommendations.')}
          </p>
        </article>
      </div>
    </section>
  )
}
