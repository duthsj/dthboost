import type { GameKey, RiskLevel } from './data'

export type EngineCommand =
  | 'scan'
  | 'snapshot'
  | 'benchmark'
  | 'apply_safe_session_boost'
  | 'rollback_session'
  | 'network_truth'
  | 'memory_stutter_test'
  | 'frametime_doctor'
  | 'input_path_audit'
  | 'bottleneck_classifier'
  | 'game_smoothness_lab'

export type EngineStatus =
  | 'idle'
  | 'scanning'
  | 'snapshot-ready'
  | 'benchmark-ready'
  | 'boost-armed'
  | 'boost-active'
  | 'rollback-ready'
  | 'reverting'
  | 'restored'
  | 'error'

export type Receipt = {
  id: string
  command: EngineCommand
  title: string
  risk: RiskLevel
  scope: 'HKCU' | 'HKLM' | 'Process' | 'Power' | 'Metrics' | 'Network'
  target: string
  before: string
  after: string
  rollback: string
  requiresAdmin: boolean
  requiresReboot: boolean
  timestamp: string
}

export type ScanResult = {
  detectedGames: Array<{
    game: GameKey
    process: string
    path: string
    installed: boolean
  }>
  gpuVendor: 'NVIDIA' | 'AMD' | 'Intel' | 'Unknown'
  refreshRate: string
  activePowerPlan: string
  gameMode: 'Enabled' | 'Disabled'
  overlays: string[]
}

export type BenchmarkResult = {
  avgFps: number
  onePercentLow: number
  pointOnePercentLow: number
  p95FrameTime: number
  p99FrameTime: number
  stutterCount: number
  droppedFrames: number
  cpuWait: string
  gpuWait: string
  presentMode: 'Hardware Composed' | 'Composed Flip' | 'Independent Flip'
  allowsTearing: boolean
  msBetweenPresents: number
  msCPUWait: number
  msGPUBusy: number
  displayLatency: number | null
  clickToPhotonLatency: number | null
  confidence: 'Trusted' | 'Needs retest' | 'Untrusted'
  verdict: 'Improved' | 'Neutral' | 'Worse after boost' | 'Baseline only'
  hardVerdict: 'Keep' | 'Rollback' | 'Retest'
}

export type NetworkTruthResult = {
  idlePing: number
  loadedPing: number
  jitter: number
  packetLoss: number
  bufferbloatGrade: 'A' | 'B' | 'C' | 'D'
  diagnosis: 'Clean route' | 'Bufferbloat likely' | 'Packet loss detected' | 'Wi-Fi instability'
  recommendation: string
}

export type MemoryStutterResult = {
  totalRamGb: number
  freeRamGb: number
  commitPercent: number
  hardFaultsPerSecond: number
  standbyPressure: 'Low' | 'Medium' | 'High'
  verdict: 'No memory tweak needed' | 'Retest with standby cleanup' | 'Close background apps first'
}

export type FrametimeDoctorResult = {
  framePacingScore: number
  p95FrameTime: number
  p99FrameTime: number
  pointOneLow: number
  tearRisk: 'Low' | 'Medium' | 'High'
  capAdvice: string
  diagnosis: 'Smooth' | 'False high FPS' | 'Frame pacing issue' | 'Retest required'
}

export type InputPathAuditResult = {
  pollingRate: string
  rawInputAdvice: string
  overlayRisk: 'Low' | 'Medium' | 'High'
  gameDvrState: 'Enabled' | 'Disabled'
  usbPowerSaving: 'Unknown' | 'Enabled' | 'Disabled'
  recommendation: string
}

export type BottleneckResult = {
  primary: 'CPU bound' | 'GPU bound' | 'Memory pressure' | 'Network under load' | 'Display pacing'
  confidence: number
  evidence: string[]
  nextTest: string
}

export type GameSmoothnessLabResult = {
  labName: string
  tests: Array<{
    name: string
    status: 'Ready' | 'Needs test' | 'Advanced' | 'Blocked'
    recommendation: string
  }>
}

export type EngineResult = {
  status: EngineStatus
  message: string
  receipts: Receipt[]
  scan?: ScanResult
  benchmark?: BenchmarkResult
  network?: NetworkTruthResult
  memory?: MemoryStutterResult
  frametime?: FrametimeDoctorResult
  inputPath?: InputPathAuditResult
  bottleneck?: BottleneckResult
  gameLab?: GameSmoothnessLabResult
}

const gameProcesses: Record<GameKey, string> = {
  Valorant: 'VALORANT-Win64-Shipping.exe',
  CS2: 'cs2.exe',
  Fortnite: 'FortniteClient-Win64-Shipping.exe',
}

const gamePaths: Record<GameKey, string> = {
  Valorant: 'C:\\Riot Games\\VALORANT\\live\\ShooterGame\\Binaries\\Win64',
  CS2: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64',
  Fortnite: 'C:\\Program Files\\Epic Games\\Fortnite\\FortniteGame\\Binaries\\Win64',
}

function stamp() {
  return new Date().toISOString()
}

function wait(ms = 420) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function receipt(
  command: EngineCommand,
  title: string,
  risk: RiskLevel,
  scope: Receipt['scope'],
  target: string,
  before: string,
  after: string,
  rollback: string,
  requiresAdmin = false,
  requiresReboot = false,
): Receipt {
  return {
    id: `${command}-${title.toLowerCase().replaceAll(' ', '-')}-${Date.now()}`,
    command,
    title,
    risk,
    scope,
    target,
    before,
    after,
    rollback,
    requiresAdmin,
    requiresReboot,
    timestamp: stamp(),
  }
}

export async function runEngineCommand(
  command: EngineCommand,
  game: GameKey,
): Promise<EngineResult> {
  await wait()

  if (command === 'scan') {
    return {
      status: 'scanning',
      message: 'System scan completed',
      receipts: [],
      scan: {
        detectedGames: (Object.keys(gameProcesses) as GameKey[]).map((key) => ({
          game: key,
          process: gameProcesses[key],
          path: gamePaths[key],
          installed: true,
        })),
        gpuVendor: game === 'Fortnite' ? 'NVIDIA' : game === 'Valorant' ? 'AMD' : 'NVIDIA',
        refreshRate: '240 Hz',
        activePowerPlan: 'Balanced',
        gameMode: 'Enabled',
        overlays: ['Discord', 'Steam', 'Xbox Game Bar'],
      },
    }
  }

  if (command === 'snapshot') {
    return {
      status: 'snapshot-ready',
      message: 'Rollback snapshot created',
      receipts: [
        receipt(
          command,
          'Active power plan snapshot',
          'Safe',
          'Power',
          'powercfg /getactivescheme',
          'Balanced',
          'Captured',
          'powercfg /setactive <previous_guid>',
        ),
        receipt(
          command,
          'GameDVR registry snapshot',
          'Measured',
          'HKCU',
          'Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR',
          'AppCaptureEnabled=1',
          'Captured',
          'Restore previous DWORD value',
        ),
      ],
    }
  }

  if (command === 'benchmark') {
    const baselineOnly = Math.random() > 0.72
    return {
      status: 'benchmark-ready',
      message: baselineOnly ? 'Baseline capture completed' : 'A/B capture completed',
      receipts: [
        receipt(
          command,
          'PresentMon capture',
          'Safe',
          'Metrics',
          `${gameProcesses[game]} --timed 90 --v2_metrics`,
          'No capture',
          'CSV report ready',
          'Delete generated report only',
        ),
      ],
      benchmark: {
        avgFps: game === 'Fortnite' ? 197 : game === 'CS2' ? 226 : 251,
        onePercentLow: game === 'Fortnite' ? 151 : game === 'CS2' ? 171 : 194,
        pointOnePercentLow: game === 'Fortnite' ? 119 : game === 'CS2' ? 137 : 162,
        p95FrameTime: game === 'Fortnite' ? 11.1 : game === 'CS2' ? 9.5 : 8.7,
        p99FrameTime: game === 'Fortnite' ? 16.8 : game === 'CS2' ? 14.2 : 12.4,
        stutterCount: game === 'Fortnite' ? 7 : game === 'CS2' ? 4 : 3,
        droppedFrames: game === 'Fortnite' ? 5 : game === 'CS2' ? 2 : 1,
        cpuWait: game === 'CS2' ? 'Medium' : 'Low',
        gpuWait: game === 'Fortnite' ? 'High' : 'Medium',
        presentMode: game === 'CS2' ? 'Composed Flip' : 'Independent Flip',
        allowsTearing: game !== 'Valorant',
        msBetweenPresents: game === 'Fortnite' ? 5.1 : game === 'CS2' ? 4.4 : 4.0,
        msCPUWait: game === 'CS2' ? 2.4 : 1.2,
        msGPUBusy: game === 'Fortnite' ? 4.8 : game === 'CS2' ? 3.2 : 2.8,
        displayLatency: game === 'Valorant' ? 11.8 : game === 'CS2' ? 13.7 : 16.4,
        clickToPhotonLatency: game === 'Valorant' ? 19.6 : null,
        confidence: baselineOnly ? 'Needs retest' : 'Trusted',
        verdict: baselineOnly ? 'Baseline only' : 'Improved',
        hardVerdict: baselineOnly ? 'Retest' : 'Keep',
      },
    }
  }

  if (command === 'apply_safe_session_boost') {
    return {
      status: 'boost-active',
      message: 'Safe Session Boost active',
      receipts: [
        receipt(
          command,
          'Game Mode',
          'Safe',
          'HKCU',
          'Software\\Microsoft\\GameBar\\AutoGameModeEnabled',
          '1',
          '1',
          'Restore previous DWORD value',
        ),
        receipt(
          command,
          'Temporary power plan',
          'Safe',
          'Power',
          'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
          'Balanced',
          'High performance',
          'powercfg /setactive <previous_guid>',
        ),
        receipt(
          command,
          'GPU preference',
          'Safe',
          'HKCU',
          `Software\\Microsoft\\DirectX\\UserGpuPreferences\\${gameProcesses[game]}`,
          'Not set',
          'GpuPreference=2',
          'Delete value or restore previous REG_SZ',
        ),
      ],
    }
  }

  if (command === 'network_truth') {
    return {
      status: 'benchmark-ready',
      message: 'Network Truth completed',
      receipts: [
        receipt(
          command,
          'Loaded latency test',
          'Measured',
          'Network',
          'gateway + public latency endpoints',
          'Untested',
          'Idle and loaded latency captured',
          'No system change applied',
        ),
      ],
      network: {
        idlePing: 18,
        loadedPing: game === 'Fortnite' ? 91 : 42,
        jitter: game === 'Fortnite' ? 12.6 : 4.8,
        packetLoss: game === 'CS2' ? 0.2 : 0,
        bufferbloatGrade: game === 'Fortnite' ? 'C' : 'B',
        diagnosis: game === 'Fortnite' ? 'Bufferbloat likely' : 'Clean route',
        recommendation:
          game === 'Fortnite'
            ? 'Recommend router SQM/QoS before trying route boosters.'
            : 'Route boosters are unlikely to help unless ISP routing changes under match load.',
      },
    }
  }

  if (command === 'memory_stutter_test') {
    return {
      status: 'benchmark-ready',
      message: 'Memory Stutter Test completed',
      receipts: [
        receipt(
          command,
          'Memory pressure sample',
          'Measured',
          'Metrics',
          'commit, standby pressure, hard faults',
          'Untested',
          'Memory pressure captured',
          'No cleanup applied',
        ),
      ],
      memory: {
        totalRamGb: 32,
        freeRamGb: game === 'CS2' ? 5.8 : 13.4,
        commitPercent: game === 'CS2' ? 74 : 48,
        hardFaultsPerSecond: game === 'CS2' ? 38 : 3,
        standbyPressure: game === 'CS2' ? 'Medium' : 'Low',
        verdict: game === 'CS2' ? 'Close background apps first' : 'No memory tweak needed',
      },
    }
  }

  if (command === 'frametime_doctor') {
    const p99 = game === 'CS2' ? 18.6 : game === 'Fortnite' ? 16.8 : 12.4
    return {
      status: 'benchmark-ready',
      message: 'Frametime Doctor completed',
      receipts: [
        receipt(
          command,
          'Frametime diagnosis',
          'Safe',
          'Metrics',
          `${gameProcesses[game]} PresentMon p95/p99/0.1 low`,
          'Untested',
          'Frame pacing report ready',
          'No system change applied',
        ),
      ],
      frametime: {
        framePacingScore: game === 'CS2' ? 61 : game === 'Fortnite' ? 68 : 84,
        p95FrameTime: game === 'CS2' ? 10.9 : game === 'Fortnite' ? 11.8 : 8.7,
        p99FrameTime: p99,
        pointOneLow: game === 'CS2' ? 118 : game === 'Fortnite' ? 104 : 162,
        tearRisk: game === 'CS2' ? 'High' : game === 'Fortnite' ? 'Medium' : 'Low',
        capAdvice:
          game === 'CS2'
            ? 'Test capped, uncapped and VRR paths. Keep the one with best p99, not highest average FPS.'
            : game === 'Fortnite'
              ? 'Test DX12 shader-prepared run against Performance Mode before changing render path.'
              : 'Keep Reflex or Anti-Lag path measured and avoid uncapped FPS if frame pacing worsens.',
        diagnosis: game === 'CS2' ? 'False high FPS' : game === 'Fortnite' ? 'Frame pacing issue' : 'Smooth',
      },
    }
  }

  if (command === 'input_path_audit') {
    return {
      status: 'benchmark-ready',
      message: 'Input Path Audit completed',
      receipts: [
        receipt(
          command,
          'Input path audit',
          'Safe',
          'Metrics',
          'mouse polling, overlays, GameDVR, USB power',
          'Untested',
          'Input path report ready',
          'No system change applied',
        ),
      ],
      inputPath: {
        pollingRate: game === 'Valorant' ? '4000 Hz detected' : '1000 Hz assumed',
        rawInputAdvice:
          game === 'Valorant'
            ? 'If using high polling rate, test Valorant Raw Input Buffer ON vs OFF.'
            : 'Keep mouse polling stable; do not change input stack during benchmark.',
        overlayRisk: game === 'Valorant' ? 'High' : 'Medium',
        gameDvrState: 'Enabled',
        usbPowerSaving: 'Unknown',
        recommendation:
          game === 'Valorant'
            ? 'Audit Discord overlay, Xbox captures and high polling rate before registry tweaks.'
            : 'Disable capture overlays for one A/B run and keep only if p99 improves.',
      },
    }
  }

  if (command === 'bottleneck_classifier') {
    const primary =
      game === 'Fortnite' ? 'GPU bound' : game === 'CS2' ? 'Display pacing' : 'CPU bound'
    return {
      status: 'benchmark-ready',
      message: 'Bottleneck classification completed',
      receipts: [
        receipt(
          command,
          'Bottleneck classifier',
          'Safe',
          'Metrics',
          'PresentMon + scan + memory + network signals',
          'Untested',
          'Bottleneck report ready',
          'No system change applied',
        ),
      ],
      bottleneck: {
        primary,
        confidence: game === 'CS2' ? 76 : 82,
        evidence:
          game === 'CS2'
            ? ['High average FPS', 'p99 spikes', 'VRR/refresh path likely involved']
            : game === 'Fortnite'
              ? ['GPU busy above 90%', 'p99 spikes during scene changes', 'shader/cache path should be tested']
              : ['CPU wait visible', 'overlays present', 'input path needs audit'],
        nextTest:
          game === 'CS2'
            ? 'Run CS2 Smoothness Lab with FPS cap and VRR combinations.'
            : game === 'Fortnite'
              ? 'Run Fortnite Stutter Lab with renderer and shader cache checks.'
              : 'Run Valorant Input Path Audit before scheduler tweaks.',
      },
    }
  }

  if (command === 'game_smoothness_lab') {
    return {
      status: 'benchmark-ready',
      message: `${game} Smoothness Lab completed`,
      receipts: [
        receipt(
          command,
          `${game} smoothness lab`,
          'Measured',
          'Metrics',
          `${gameProcesses[game]} game-specific test matrix`,
          'Untested',
          'Game lab recommendations ready',
          'No system change applied',
        ),
      ],
      gameLab: {
        labName:
          game === 'Valorant'
            ? 'Valorant Input and Overlay Lab'
            : game === 'CS2'
              ? 'CS2 Smoothness Lab'
              : 'Fortnite Stutter Lab',
        tests:
          game === 'Valorant'
            ? [
                {
                  name: 'Raw Input Buffer',
                  status: 'Needs test',
                  recommendation: 'A/B test ON vs OFF with current mouse polling rate.',
                },
                {
                  name: 'Discord overlay',
                  status: 'Ready',
                  recommendation: 'Disable overlay for one measured run.',
                },
                {
                  name: 'GameDVR captures',
                  status: 'Needs test',
                  recommendation: 'Disable only if p99 or stutter count improves.',
                },
              ]
            : game === 'CS2'
              ? [
                  {
                    name: 'FPS cap matrix',
                    status: 'Needs test',
                    recommendation: 'Compare uncapped, refresh cap and refresh plus margin.',
                  },
                  {
                    name: 'VRR path',
                    status: 'Needs test',
                    recommendation: 'Compare G-Sync/FreeSync path using p99, not average FPS.',
                  },
                  {
                    name: 'Core affinity',
                    status: 'Advanced',
                    recommendation: 'A/B test Core 0 exclusion only as Advanced.',
                  },
                ]
              : [
                  {
                    name: 'Renderer path',
                    status: 'Needs test',
                    recommendation: 'Compare DX12 shader-prepared run vs Performance Mode.',
                  },
                  {
                    name: 'Shader cache',
                    status: 'Ready',
                    recommendation: 'Clean only when stutter count suggests cache pressure.',
                  },
                  {
                    name: 'Frame generation',
                    status: 'Advanced',
                    recommendation: 'Avoid as competitive latency boost unless measured.',
                  },
                ],
      },
    }
  }

  return {
    status: 'restored',
    message: 'Previous state restored',
    receipts: [
      receipt(
        command,
        'Rollback session',
        'Safe',
        'Power',
        'snapshot receipts',
        'Boost active',
        'Previous state',
        'No further action',
      ),
    ],
  }
}
