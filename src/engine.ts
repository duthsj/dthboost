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
  | 'close_background_apps'
  | 'watch_game'
  | 'install_presentmon'
  | 'pre_warm_system'
  | 'check_gpu_driver'
  | 'toggle_autostart'
  | 'check_admin'
  | 'restart_as_admin'
  | 'thermal_check'
  | 'dpc_latency'
  | 'auto_boost_if_game'
  | 'check_vbs'
  | 'disable_vbs'
  | 'disable_sysmain'
  | 'network_throttling'
  | 'power_throttling_off'
  | 'games_mmcss_profile'
  | 'set_game_priority'
  | 'optimize_game_config'
  | 'backup_game_config'
  | 'restore_game_config'

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
  | 'admin_required'
  | 'error'

export type Receipt = {
  id: string
  command: EngineCommand
  title: string
  risk: RiskLevel
  scope: 'HKCU' | 'HKLM' | 'Process' | 'Power' | 'Metrics' | 'Network' | 'System' | 'Service' | 'Game'
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
  cpuModel?: string
  ramInfo?: string
  diskInfo?: string
  gpuDriver?: string
}

export type BenchmarkResult = {
  avgFps: number
  onePercentLow: number
  pointOnePercentLow: number
  pointZeroOnePercentLow: number
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
  return String(Date.now())
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
        pointZeroOnePercentLow: game === 'Fortnite' ? 81 : game === 'CS2' ? 94 : 121,
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
    return {
      status: 'idle',
      message: 'Frametime Doctor (browser mock — real data requires desktop app + benchmark)',
      receipts: [receipt(command, 'Frametime diagnosis', 'Measured', 'Metrics', 'PresentMon CSV', 'Browser mock', 'Run in desktop app', 'No system change', false, false)],
    }
  }

  if (command === 'input_path_audit') {
    return {
      status: 'idle',
      message: 'Input Path Audit (browser mock — real data requires desktop app)',
      receipts: [receipt(command, 'Input path audit', 'Measured', 'Metrics', 'Mouse/overlays/GameDVR/USB', 'Browser mock', 'Run in desktop app', 'No system change', false, false)],
    }
  }

  if (command === 'bottleneck_classifier') {
    return {
      status: 'idle',
      message: 'Bottleneck classification (browser mock — real data requires desktop app + benchmark)',
      receipts: [receipt(command, 'Bottleneck classifier', 'Measured', 'Metrics', 'PresentMon + WMI + DPC', 'Browser mock', 'Run in desktop app', 'No system change', false, false)],
    }
  }

  if (command === 'game_smoothness_lab') {
    return {
      status: 'idle',
      message: `${game} Smoothness Lab (browser mock — real data requires desktop app + benchmark)`,
      receipts: [receipt(command, `${game} smoothness lab`, 'Measured', 'Metrics', 'System state', 'Browser mock', 'Run in desktop app', 'No system change', false, false)],
    }
  }

  if (command === 'check_admin') {
    return {
      status: 'idle',
      message: 'Admin check (browser mock — always reports as non-admin)',
      receipts: [],
    }
  }

  if (command === 'restart_as_admin') {
    return {
      status: 'error',
      message: 'Restart as Admin is only available in the desktop app.',
      receipts: [],
    }
  }

  if (command === 'check_vbs') {
    return {
      status: 'idle',
      message: 'VBS check (browser mock — VBS status unknown)',
      receipts: [receipt(command, 'VBS status', 'Safe', 'System', 'Hypervisor', '?', '?', 'No change', false, false)],
    }
  }

  if (command === 'disable_vbs') {
    return {
      status: 'boost-active',
      message: 'VBS disabled (browser mock). REBOOT REQUIRED.',
      receipts: [receipt(command, 'VBS disabled', 'Advanced', 'System', 'Hypervisor+DeviceGuard', 'Enabled', 'Disabled', 'Re-enable via bcdedit', true, true)],
    }
  }

  if (command === 'disable_sysmain') {
    return {
      status: 'boost-active',
      message: 'SysMain disabled (browser mock)',
      receipts: [receipt(command, 'SysMain disabled', 'Safe', 'Service', 'SysMain', 'Running', 'Disabled', 'sc config SysMain start=auto', false, false)],
    }
  }

  if (command === 'network_throttling') {
    return {
      status: 'boost-active',
      message: 'Network throttling disabled (browser mock)',
      receipts: [receipt(command, 'Network throttling', 'Safe', 'HKLM', 'SystemProfile', 'Default', 'ffffffff', 'Set to a (default)', false, false)],
    }
  }

  if (command === 'power_throttling_off') {
    return {
      status: 'boost-active',
      message: 'Power throttling disabled (browser mock)',
      receipts: [receipt(command, 'Power throttling', 'Safe', 'HKLM', 'PowerThrottling', 'Default', '1 (disabled)', 'Set to 0', false, false)],
    }
  }

  if (command === 'games_mmcss_profile') {
    return {
      status: 'boost-active',
      message: 'MMCSS Games profile extended (browser mock)',
      receipts: [receipt(command, 'Games MMCSS profile', 'Safe', 'HKLM', 'MMCSS\\Games', 'Default', 'GPU=8 CPU=6 Sched=High', 'Delete keys', false, false)],
    }
  }

  if (command === 'set_game_priority') {
    return {
      status: 'boost-active',
      message: `${gameProcesses[game]} priority set to HIGH (browser mock)`,
      receipts: [receipt(command, 'Game process priority', 'Safe', 'Process', gameProcesses[game], 'Normal', 'High', 'Reverts on restart', false, false)],
    }
  }

  if (command === 'optimize_game_config') {
    return {
      status: 'boost-active',
      message: `${game} config optimized (browser mock)`,
      receipts: [receipt(command, `${game} config optimized`, 'Safe', 'Game', 'Config files', 'Default', 'Optimized', 'Restore from backup', false, false)],
    }
  }

  if (command === 'backup_game_config') {
    return {
      status: 'idle',
      message: `${game} config backed up (browser mock)`,
      receipts: [receipt(command, `${game} config backup`, 'Safe', 'Game', 'Config files', 'Original', 'Backed up', 'No rollback needed', false, false)],
    }
  }

  if (command === 'restore_game_config') {
    return {
      status: 'idle',
      message: `${game} config restored (browser mock)`,
      receipts: [receipt(command, `${game} config restore`, 'Safe', 'Game', 'Backup', 'Optimized', 'Original', 'No further action', false, false)],
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
