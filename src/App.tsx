import { useCallback, useMemo, useState } from 'react'
import type { EngineCommand, EngineResult } from './engine'
import { useDictionary } from './i18n'
import type { GameKey } from './data'
import { games, tweakPlan } from './data'
import { runEngineCommand } from './engineBridge'
import type {
  BenchmarkResult,
  BottleneckResult,
  FrametimeDoctorResult,
  GameSmoothnessLabResult,
  InputPathAuditResult,
  MemoryStutterResult,
  NetworkTruthResult,
  ScanResult,
  Receipt,
  EngineStatus,
} from './engine'
import './App.css'

import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import HeroPanel from './components/HeroPanel'
import SignalStrip from './components/SignalStrip'
import RecommendationsPanel from './components/RecommendationsPanel'
import SessionBoostPanel from './components/SessionBoostPanel'
import ReceiptDrawer from './components/ReceiptDrawer'
import BenchmarkPanel from './components/BenchmarkPanel'
import DiagnosisCenter from './components/DiagnosisCenter'
import {
  SessionFlowPanel,
  NetworkTruthPanel,
  MemoryPanel,
  ProcessPanel,
  VendorIntelPanel,
  SafetyPanel,
  ActivityLog,
} from './components/InfoPanels'
type PlanItem = {
  id: string
  title: string
  copy: string
  receipt: string
  enabled: boolean
}

type LogEntry = {
  ts: number
  msg: string
}

export default function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [activeGame, setActiveGame] = useState<GameKey>('Valorant')
  const [scoreOffset, setScoreOffset] = useState(0)
  const [sessionState, setSessionState] = useState('idle')
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('idle')
  const [busyCommand, setBusyCommand] = useState<EngineCommand | null>(null)
  const [plan, setPlan] = useState<PlanItem[]>(() =>
    tweakPlan.map((item) => ({ ...item, enabled: false }))
  )
  const [log, setLog] = useState<LogEntry[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null)
  const [networkResult, setNetworkResult] = useState<NetworkTruthResult | null>(null)
  const [memoryResult, setMemoryResult] = useState<MemoryStutterResult | null>(null)
  const [frametimeResult, setFrametimeResult] = useState<FrametimeDoctorResult | null>(null)
  const [inputPathResult, setInputPathResult] = useState<InputPathAuditResult | null>(null)
  const [bottleneckResult, setBottleneckResult] = useState<BottleneckResult | null>(null)
  const [gameLabResult, setGameLabResult] = useState<GameSmoothnessLabResult | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)

  const t = useDictionary(language)

  const game = games[activeGame]

  const readiness = useMemo(() => {
    const base = game.readiness ?? 60
    return Math.min(100, Math.max(0, base + scoreOffset))
  }, [game.readiness, scoreOffset])

  const enabledPlan = useMemo(() => plan.filter((p) => p.enabled), [plan])

  const likelyCause = useMemo(() => {
    if (bottleneckResult) {
      return bottleneckResult.primaryBottleneck
    }
    if (frametimeResult && frametimeResult.score < 70) {
      return frametimeResult.advice
    }
    if (memoryResult && memoryResult.score < 70) {
      return 'RAM pressure'
    }
    if (networkResult && networkResult.grade !== 'A') {
      return networkResult.grade === 'F' ? 'Severe latency' : 'Network jitter'
    }
    return 'Unknown'
  }, [bottleneckResult, frametimeResult, memoryResult, networkResult])

  const canBoost = useMemo(
    () => sessionState !== 'boosted' && sessionState !== 'busy',
    [sessionState]
  )

  const statusCopy = useMemo(() => {
    if (readiness >= 90) return t.readyForCompetition
    if (readiness >= 70) return t.goodToGo
    if (readiness >= 40) return t.needsAttention
    return t.critical
  }, [readiness, t])

  const addLog = useCallback((msg: string) => {
    const entry = { ts: Date.now(), msg }
    setLog((prev) => [entry, ...prev].slice(0, 50))
  }, [])
  const runCommand = useCallback(
    async (command: EngineCommand) => {
      if (busyCommand) return
      setBusyCommand(command)
      setEngineStatus('running')
      addLog('Running ' + command + '...')

      try {
        const result = await runEngineCommand(command, activeGame)
        setEngineStatus('idle')

        if (!result) return

        const results = result.results || []
        if (result.receipt) {
          setReceipts((prev) => [result.receipt!, ...prev].slice(0, 20))
        }

        for (const r of results) {
          if (r.receipt) {
            setReceipts((prev) => [r.receipt!, ...prev].slice(0, 20))
          }
          if (r.benchmark) setBenchmarkResult(r.benchmark)
          if (r.scan) setScanResult(r.scan)
          if (r.networkTruth) setNetworkResult(r.networkTruth)
          if (r.memoryStutter) setMemoryResult(r.memoryStutter)
          if (r.frametimeDoctor) setFrametimeResult(r.frametimeDoctor)
          if (r.inputPathAudit) setInputPathResult(r.inputPathAudit)
          if (r.bottleneckClassifier) setBottleneckResult(r.bottleneckClassifier)
          if (r.gameSmoothnessLab) setGameLabResult(r.gameSmoothnessLab)
        }

        if (command === 'scan' && result.scan) {
          setScanResult(result.scan)
        }

        if (command === 'benchmark' && result.benchmark) {
          setBenchmarkResult(result.benchmark)
          setScoreOffset(result.benchmark.score ?? 0)
        }

        if (command === 'apply_safe_session_boost') {
          setSessionState('boosted')
          const boost = result.benchmark ?? result.results?.[0]?.benchmark
          if (boost?.score !== undefined) {
            setScoreOffset((prev) => prev + Math.round((boost.score ?? 0) / 2))
          }
        }

        if (command === 'rollback_session') {
          setSessionState('idle')
          setScoreOffset(0)
          setBenchmarkResult(null)
        }

        addLog('Completed ' + command)
      } catch (err) {
        console.error('Command failed:', command, err)
        addLog('Failed ' + command)
        setEngineStatus('error')
      } finally {
        setBusyCommand(null)
      }
    },
    [busyCommand, activeGame, addLog]
  )
  const handleSelectGame = useCallback((key: GameKey) => {
    setActiveGame(key)
    setSessionState('idle')
    setScoreOffset(0)
    setBenchmarkResult(null)
    setScanResult(null)
    setNetworkResult(null)
    setMemoryResult(null)
    setFrametimeResult(null)
    setInputPathResult(null)
    setBottleneckResult(null)
    setGameLabResult(null)
  }, [])

  const handleTogglePlan = useCallback((id: string) => {
    setPlan((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    )
  }, [])

  const handleRollback = useCallback(() => {
    runCommand('rollback_session')
  }, [runCommand])

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'))
  }, [])
  return (
    <div className="app-shell">
      <Sidebar t={t} language={language} />

      <main className="workspace">
        <TopBar
          t={t}
          language={language}
          activeGame={activeGame}
          busyCommand={busyCommand}
          canBoost={canBoost}
          onSelectGame={handleSelectGame}
          onScan={() => runCommand('scan')}
          onBenchmark={() => runCommand('benchmark')}
          onBoost={() => runCommand('apply_safe_session_boost')}
          onToggleLanguage={handleToggleLanguage}
        />

        <HeroPanel
          t={t}
          language={language}
          activeGame={activeGame}
          readiness={readiness}
          statusCopy={statusCopy}
          likelyCause={likelyCause}
          sessionState={sessionState}
          receiptsCount={receipts.length}
          bottleneckResult={bottleneckResult}
        />

        <SignalStrip
          t={t}
          language={language}
          activeGame={activeGame}
        />

        <div className="grid-2col">
          <RecommendationsPanel
            t={t}
            language={language}
            activeGame={activeGame}
          />

          <BenchmarkPanel
            t={t}
            language={language}
            activeGame={activeGame}
            benchmarkResult={benchmarkResult}
          />
        </div>

        <DiagnosisCenter
          t={t}
          language={language}
          activeGame={activeGame}
          frametimeResult={frametimeResult}
          bottleneckResult={bottleneckResult}
          inputPathResult={inputPathResult}
          gameLabResult={gameLabResult}
          busyCommand={busyCommand}
          onRunCommand={runCommand}
        />

        <div className="grid-3col">
          <NetworkTruthPanel
            t={t}
            language={language}
            networkResult={networkResult}
          />
          <MemoryPanel
            t={t}
            language={language}
            memoryResult={memoryResult}
          />
          <ProcessPanel
            t={t}
            language={language}
          />
          <VendorIntelPanel
            t={t}
            language={language}
            activeGame={activeGame}
          />
          <SafetyPanel
            t={t}
            language={language}
          />
          <ActivityLog
            t={t}
            language={language}
            log={log}
          />
        </div>

        <SessionFlowPanel
          t={t}
          language={language}
        />
      </main>

      <aside className="side-panel">
        <SessionBoostPanel
          t={t}
          language={language}
          plan={plan}
          enabledPlan={enabledPlan}
          receipts={receipts}
          busyCommand={busyCommand}
          onTogglePlan={handleTogglePlan}
          onRollback={handleRollback}
          onSelectReceipt={setSelectedReceipt}
        />
      </aside>

      {selectedReceipt && (
        <ReceiptDrawer
          t={t}
          language={language}
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  )
}
