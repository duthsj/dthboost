import type { CSSProperties } from 'react'
import type {
  BenchmarkResult,
  BottleneckResult,
  EngineCommand,
  EngineStatus,
  FrametimeDoctorResult,
  GameSmoothnessLabResult,
  InputPathAuditResult,
  MemoryStutterResult,
  NetworkTruthResult,
  Receipt,
  ScanResult,
} from '../engine'
import type { GameKey } from '../data'
import type { Language } from '../i18n'

export type {
  BenchmarkResult,
  BottleneckResult,
  EngineCommand,
  EngineStatus,
  FrametimeDoctorResult,
  GameSmoothnessLabResult,
  InputPathAuditResult,
  MemoryStutterResult,
  NetworkTruthResult,
  Receipt,
  ScanResult,
  GameKey,
  Language,
  CSSProperties,
}

export interface AppState {
  language: Language
  activeGame: GameKey
  scoreOffset: number
  sessionState: string
  engineStatus: EngineStatus
  busyCommand: EngineCommand | null
  plan: Array<{
    id: string
    title: string
    copy: string
    receipt: string
    enabled: boolean
  }>
  log: Array<{ label: string; time: string }>
  receipts: Receipt[]
  selectedReceipt: Receipt | null
  scanResult: ScanResult | null
  benchmarkResult: BenchmarkResult | null
  networkResult: NetworkTruthResult | null
  memoryResult: MemoryStutterResult | null
  frametimeResult: FrametimeDoctorResult | null
  inputPathResult: InputPathAuditResult | null
  bottleneckResult: BottleneckResult | null
  gameLabResult: GameSmoothnessLabResult | null
}

export interface AppActions {
  setLanguage: (lang: Language) => void
  selectGame: (key: GameKey) => void
  togglePlan: (id: string) => void
  runCommand: (command: EngineCommand) => Promise<void>
  setSelectedReceipt: (receipt: Receipt | null) => void
}

export type TFunction = Record<string, string>

export function mapLog(log: Array<{ ts: number; msg: string }>): Array<{ label: string; time: string }> {
  return log.map((entry) => ({
    label: entry.msg,
    time: new Date(entry.ts).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
  }))
}
