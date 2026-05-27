import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import type { EngineCommand, Receipt, ScanResult, BenchmarkResult, NetworkTruthResult, MemoryStutterResult, FrametimeDoctorResult, InputPathAuditResult, BottleneckResult, GameSmoothnessLabResult } from './engine'
import { useDictionary } from './i18n'
import type { GameKey } from './data'
import { games, tweakPlan } from './data'
import { runEngineCommand } from './engineBridge'
import './App.css'

import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ReceiptDrawer from './components/ReceiptDrawer'
import StatusBar from './components/StatusBar'
import DashboardPage from './pages/DashboardPage'
import OptimizePage from './pages/OptimizePage'
import SettingsPage from './pages/SettingsPage'
import BenchmarkPage from './pages/BenchmarkPage'
import GamesPage from './pages/GamesPage'
import NetworkPage from './pages/NetworkPage'
import SafetyPage from './pages/SafetyPage'
import TweaksPage from './pages/TweaksPage'
import SessionBoostPage from './pages/SessionBoostPage'
import ReportsPage from './pages/ReportsPage'
import OnboardingWizard from './components/OnboardingWizard'
import { ToastProvider, useToast } from './components/Toast'
import { saveBenchmark } from './components/BenchmarkHistory'
import { playScanComplete, playBenchmarkComplete, playBoostActive, playRollback, playError } from './components/Sounds'

type PlanItem = { id: string; title: string; copy: string; receipt: string; enabled: boolean; risk?: string }
type LogEntry = { ts: number; msg: string }

function usePersist<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try { const stored = localStorage.getItem(`dthboost:${key}`); return stored ? JSON.parse(stored) : fallback }
    catch { return fallback }
  })
  const update = useCallback((next: T) => {
    setValue(next)
    try { localStorage.setItem(`dthboost:${key}`, JSON.stringify(next)) } catch { /* ok */ }
  }, [key])
  return [value, update]
}

function AppInner() {
  const validGames: GameKey[] = ['Valorant', 'CS2', 'Fortnite']
  const [language, setLanguage] = usePersist<'en' | 'es'>('language', 'en')
  const [storedGame, setStoredGame] = usePersist<string>('activeGame', 'Valorant')
  const activeGame: GameKey = validGames.includes(storedGame as GameKey) ? (storedGame as GameKey) : 'Valorant'
  const setActiveGame = (key: GameKey) => setStoredGame(key)
  const [sessionState, setSessionState] = useState('idle')
  const [busyCommand, setBusyCommand] = useState<EngineCommand | null>(null)
  const busyRef = useRef(false)
  const [plan, setPlan] = useState<PlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(`dthboost:plan-${storedGame}`)
      return saved ? JSON.parse(saved) : tweakPlan.map((item) => ({ ...item, enabled: true }))
    } catch { return tweakPlan.map((item) => ({ ...item, enabled: true })) }
  })
  const [, _setLog] = useState<LogEntry[]>([])
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
  const [onboardingDone, setOnboardingDone] = usePersist('onboardingDone', false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const { toast } = useToast()
  const t = useDictionary(language)
  const game = games[activeGame] ?? games.Valorant

  const readiness = useMemo(() => {
    const base = game.readiness ?? 60
    return Math.min(100, Math.max(0, base))
  }, [game.readiness])

  const addLog = useCallback((msg: string) => {
    const entry: LogEntry = { ts: Date.now(), msg }
    _setLog((prev: LogEntry[]) => [entry, ...prev].slice(0, 50))
  }, [])

  const runCommand = useCallback(async (command: EngineCommand) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusyCommand(command)
    addLog('Running ' + command + '...')
    try {
      const result = await runEngineCommand(command, activeGame)
      if (!result) return
      if (result.receipts && result.receipts.length > 0) {
        setReceipts((prev) => [...result.receipts, ...prev].slice(0, 40))
      }
      if (result.scan) setScanResult(result.scan)
      if (result.benchmark) {
        setBenchmarkResult(result.benchmark)
        saveBenchmark(result.benchmark, activeGame)
      }
      if (result.network) setNetworkResult(result.network)
      if (result.memory) setMemoryResult(result.memory)
      if (result.frametime) setFrametimeResult(result.frametime)
      if (result.inputPath) setInputPathResult(result.inputPath)
      if (result.bottleneck) setBottleneckResult(result.bottleneck)
      if (result.gameLab) setGameLabResult(result.gameLab)
      if (command === 'apply_safe_session_boost') { setSessionState('boosted'); playBoostActive(); toast('Boost active — 20 tweaks', 'success') }
      if (command === 'rollback_session') { setSessionState('idle'); setBenchmarkResult(null); playRollback(); toast('Restored', 'info') }
      if (command === 'scan') { playScanComplete(); toast('Scan done', 'success') }
      if (command === 'benchmark') playBenchmarkComplete()
      addLog('Completed ' + command)
    } catch (err) {
      addLog('Failed ' + command)
      toast('Failed: ' + command, 'error')
      playError()
    } finally {
      setBusyCommand(null)
      busyRef.current = false
    }
  }, [activeGame, addLog, toast])

  const handleSelectGame = useCallback((key: GameKey) => {
    setActiveGame(key)
    setSessionState('idle')
    setBenchmarkResult(null)
    setScanResult(null)
    setNetworkResult(null)
    setMemoryResult(null)
    setFrametimeResult(null)
    setInputPathResult(null)
    setBottleneckResult(null)
    setGameLabResult(null)
    try {
      const saved = localStorage.getItem(`dthboost:plan-${key}`)
      setPlan(saved ? JSON.parse(saved) : tweakPlan.map((item) => ({ ...item, enabled: true })))
    } catch { setPlan(tweakPlan.map((item) => ({ ...item, enabled: true }))) }
  }, [setActiveGame])

  const handleTogglePlan = useCallback((id: string) => {
    setPlan((prev) => {
      const next = prev.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
      try { localStorage.setItem(`dthboost:plan-${activeGame}`, JSON.stringify(next)) } catch { /* ok */ }
      return next
    })
  }, [activeGame])

  const handleOptimize = useCallback(async () => {
    if (busyRef.current) return
    try {
      await runCommand('scan')
      await new Promise(r => setTimeout(r, 600))
      await runCommand('benchmark')
      await new Promise(r => setTimeout(r, 600))
      await runCommand('apply_safe_session_boost')
    } catch { toast('Optimization interrupted', 'error') }
  }, [runCommand, toast])

  const handleToggleLanguage = useCallback(() => setLanguage(language === 'en' ? 'es' : 'en'), [language, setLanguage])

  const rollbackRef = useRef(runCommand)
  rollbackRef.current = runCommand
  const gameWasRunning = useRef(false)

  useEffect(() => {
    if (!onboardingDone) setShowOnboarding(true)
  }, [onboardingDone])

  useEffect(() => {
    if (sessionState !== 'boosted') return
    gameWasRunning.current = false
    const interval = setInterval(() => {
      runEngineCommand('watch_game', activeGame).then(result => {
        if (result.status === 'boost-active') {
          gameWasRunning.current = true
        } else if (gameWasRunning.current) {
          rollbackRef.current('rollback_session')
        }
      }).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [sessionState, activeGame])

  const handleFinishOnboarding = useCallback(() => {
    setOnboardingDone(true)
    setShowOnboarding(false)
    runCommand('scan')
  }, [setOnboardingDone, runCommand])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'o') { e.preventDefault(); handleOptimize() }
        if (e.key === 'r') { e.preventDefault(); runCommand('rollback_session') }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleOptimize, runCommand])

  return (
    <div className="app-shell">
      <Sidebar t={t} language={language} />
      <main className="workspace">
        <TopBar t={t} language={language} activeGame={activeGame} onSelectGame={handleSelectGame} onToggleLanguage={handleToggleLanguage} onOptimize={handleOptimize} busyCommand={busyCommand} />
        <StatusBar
          language={language}
          scanDone={!!scanResult}
          benchmarkDone={!!benchmarkResult}
          boostActive={sessionState === 'boosted'}
          receiptsCount={receipts.length}
          gpuVendor={scanResult?.gpuVendor ?? 'GPU ?'}
          refreshRate={scanResult?.refreshRate ?? 'Hz ?'}
          busyCommand={busyCommand}
          onOptimize={handleOptimize}
        />
        <Routes>
          <Route path="/" element={<DashboardPage t={t} language={language} activeGame={activeGame} readiness={readiness} sessionState={sessionState} receiptsCount={receipts.length} scanResult={scanResult} benchmarkResult={benchmarkResult} onOptimize={handleOptimize} busyCommand={busyCommand} />} />
          <Route path="/optimize" element={<OptimizePage t={t} language={language} activeGame={activeGame} plan={plan} receipts={receipts} busyCommand={busyCommand} benchmarkResult={benchmarkResult} scanResult={scanResult} onTogglePlan={handleTogglePlan} onRunCommand={runCommand} onOptimize={handleOptimize} onSelectReceipt={setSelectedReceipt} />} />
          <Route path="/history" element={<BenchmarkPage t={t} language={language} activeGame={activeGame} benchmarkResult={benchmarkResult} busyCommand={busyCommand} onRunCommand={runCommand} scanResult={scanResult} />} />
          <Route path="/settings" element={<SettingsPage t={t} language={language} busyCommand={busyCommand} onToggleLanguage={handleToggleLanguage} onRunCommand={runCommand} />} />
          <Route path="/games" element={<GamesPage t={t} language={language} activeGame={activeGame} />} />
          <Route path="/network" element={<NetworkPage t={t} language={language} networkResult={networkResult} memoryResult={memoryResult} />} />
          <Route path="/safety" element={<SafetyPage t={t} language={language} />} />
          <Route path="/tweaks" element={<TweaksPage t={t} language={language} activeGame={activeGame} busyCommand={busyCommand} onRunCommand={runCommand} plan={plan} frametimeResult={frametimeResult} bottleneckResult={bottleneckResult} inputPathResult={inputPathResult} gameLabResult={gameLabResult} />} />
          <Route path="/session" element={<SessionBoostPage t={t} language={language} plan={plan} receipts={receipts} busyCommand={busyCommand} onTogglePlan={handleTogglePlan} onRollback={() => runCommand('rollback_session')} onSelectReceipt={setSelectedReceipt} />} />
          <Route path="/reports" element={<ReportsPage t={t} language={language} receipts={receipts} benchmarkResult={benchmarkResult} />} />
        </Routes>
      </main>
      {selectedReceipt && <ReceiptDrawer t={t} language={language} receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
      {showOnboarding && <OnboardingWizard t={t} language={language as any} busyCommand={busyCommand} onScan={() => runCommand('scan')} onBenchmark={() => runCommand('benchmark')} onBoost={() => runCommand('apply_safe_session_boost')} onFinish={handleFinishOnboarding} onSkip={() => { setOnboardingDone(true); setShowOnboarding(false) }} />}
    </div>
  )
}

export default function App() { return <ToastProvider><AppInner /></ToastProvider> }
