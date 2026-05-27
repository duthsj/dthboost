export type GameKey = 'Valorant' | 'CS2' | 'Fortnite'
export type RiskLevel = 'Safe' | 'Measured' | 'Advanced' | 'Lab' | 'Blocked'

export const navItems = [
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

export const games: Record<
  GameKey,
  {
    path: string
    profile: string
    readiness: number
    metrics: {
      frameTimeP95: string
      onePercentLow: string
    }
    signals: Array<{
      label: string
      value: string
      level: number
      tone: 'green' | 'cyan' | 'amber'
    }>
    recommendations: Array<{
      title: string
      risk: RiskLevel
      copy: string
      expectedMetric: string
      rollbackRule: string
    }>
    benchmark: Array<{
      metric: string
      baseline: string
      boost: string
      delta: string
    }>
  }
> = {
  Valorant: {
    path: 'Valorant detected at Riot Games\\VALORANT\\live',
    profile: 'Competitive',
    readiness: 78,
    metrics: {
      frameTimeP95: '8.6 ms',
      onePercentLow: '192 FPS',
    },
    signals: [
      { label: 'CPU wait', value: 'Low', level: 28, tone: 'green' },
      { label: 'GPU busy', value: '84%', level: 84, tone: 'cyan' },
      { label: 'Background load', value: 'Medium', level: 55, tone: 'amber' },
    ],
    recommendations: [
      {
        title: 'Run baseline benchmark',
        risk: 'Safe',
        copy: 'Creates a clean comparison before changing power, overlays or scheduler values.',
        expectedMetric: 'Trusted p95/p99 frametime baseline',
        rollbackRule: 'No system changes are applied.',
      },
      {
        title: 'Apply temporary power profile',
        risk: 'Safe',
        copy: 'Switches during the match and restores the previous plan after the game exits.',
        expectedMetric: 'Higher 1% low or lower CPU wait',
        rollbackRule: 'Restore previous power plan on game exit.',
      },
      {
        title: 'Audit Discord and capture overlays',
        risk: 'Safe',
        copy: 'Keeps only the overlays the player explicitly allows.',
        expectedMetric: 'Lower p99 or lower stutter count',
        rollbackRule: 'Re-enable overlay if p99 does not improve.',
      },
    ],
    benchmark: [
      { metric: 'Average FPS', baseline: '238', boost: '251', delta: '+5.4%' },
      { metric: '1% low', baseline: '181', boost: '194', delta: '+7.1%' },
      { metric: 'p95 frame time', baseline: '9.4 ms', boost: '8.7 ms', delta: '-0.7 ms' },
    ],
  },
  CS2: {
    path: 'CS2 detected at Steam\\steamapps\\common\\Counter-Strike Global Offensive',
    profile: 'Competitive',
    readiness: 72,
    metrics: {
      frameTimeP95: '9.1 ms',
      onePercentLow: '176 FPS',
    },
    signals: [
      { label: 'CPU wait', value: 'Medium', level: 48, tone: 'amber' },
      { label: 'GPU busy', value: '76%', level: 76, tone: 'cyan' },
      { label: 'Background load', value: 'High', level: 72, tone: 'amber' },
    ],
    recommendations: [
      {
        title: 'Verify launch options',
        risk: 'Safe',
        copy: 'Keeps current Source 2 friendly options and removes stale commands.',
        expectedMetric: 'Cleaner frametime variance',
        rollbackRule: 'Restore previous launch options if p99 worsens.',
      },
      {
        title: 'Session power profile',
        risk: 'Safe',
        copy: 'Uses a temporary plan and restores the previous active GUID.',
        expectedMetric: 'Improved 1% lows without higher p99',
        rollbackRule: 'Restore previous GUID when CS2 exits.',
      },
      {
        title: 'Process closer allowlist',
        risk: 'Advanced',
        copy: 'Closes only user-approved tools and never targets protected processes.',
        expectedMetric: 'Lower background load and fewer stutters',
        rollbackRule: 'Do not close if launcher, voice or anti-cheat dependency is required.',
      },
    ],
    benchmark: [
      { metric: 'Average FPS', baseline: '214', boost: '226', delta: '+5.6%' },
      { metric: '1% low', baseline: '159', boost: '171', delta: '+7.5%' },
      { metric: 'p95 frame time', baseline: '10.3 ms', boost: '9.5 ms', delta: '-0.8 ms' },
    ],
  },
  Fortnite: {
    path: 'Fortnite detected at Epic Games\\Fortnite\\FortniteGame',
    profile: 'Stable low latency',
    readiness: 81,
    metrics: {
      frameTimeP95: '10.2 ms',
      onePercentLow: '148 FPS',
    },
    signals: [
      { label: 'CPU wait', value: 'Low', level: 31, tone: 'green' },
      { label: 'GPU busy', value: '91%', level: 91, tone: 'cyan' },
      { label: 'Background load', value: 'Low', level: 24, tone: 'green' },
    ],
    recommendations: [
      {
        title: 'Check performance mode state',
        risk: 'Safe',
        copy: 'Confirms the selected renderer and stores the previous state.',
        expectedMetric: 'Lower stutter count in one measured run',
        rollbackRule: 'Keep previous renderer unless A/B capture improves.',
      },
      {
        title: 'Shader cache hygiene',
        risk: 'Measured',
        copy: 'Runs only when stutter pattern suggests cache pressure.',
        expectedMetric: 'Lower p99 after shader warmup',
        rollbackRule: 'Do not clean again if first-run stutter worsens.',
      },
      {
        title: 'Driver low latency guidance',
        risk: 'Safe',
        copy: 'Surfaces NVIDIA Reflex or AMD Anti-Lag settings outside the game process.',
        expectedMetric: 'Lower latency path without p99 regression',
        rollbackRule: 'Restore previous driver/game setting if capture worsens.',
      },
    ],
    benchmark: [
      { metric: 'Average FPS', baseline: '186', boost: '197', delta: '+5.9%' },
      { metric: '1% low', baseline: '139', boost: '151', delta: '+8.6%' },
      { metric: 'p95 frame time', baseline: '12.4 ms', boost: '11.1 ms', delta: '-1.3 ms' },
    ],
  },
}

export const tweakPlan = [
  { id: 'game-mode', title: 'Game Mode ON', copy: 'Prioritizes CPU for gaming', receipt: 'registry: GameBar\\AutoGameModeEnabled', enabled: true, risk: 'Safe' as const },
  { id: 'power-plan', title: 'High Performance power plan', copy: 'Prevents CPU throttling during matches', receipt: 'powercfg /setactive high-perf-guid', enabled: true, risk: 'Safe' as const },
  { id: 'gpu-pref', title: 'GPU preference (force dGPU)', copy: 'Forces dedicated GPU for game executable', receipt: 'registry: DirectX\\UserGpuPreferences', enabled: true, risk: 'Safe' as const },
  { id: 'gamedvr', title: 'GameDVR / background recording OFF', copy: 'Frees GPU encoder — proven +3-8% FPS', receipt: 'registry: GameDVR\\AppCaptureEnabled=0', enabled: true, risk: 'Safe' as const },
  { id: 'fullscreen-opt', title: 'Fullscreen optimizations OFF', copy: 'Reduces input lag on borderless/windowed modes', receipt: 'registry: GameConfigStore', enabled: true, risk: 'Measured' as const },
  { id: 'gamebar', title: 'Game Bar tips & widgets OFF', copy: 'Removes overlay overhead and distractions', receipt: 'registry: GameBar\\ShowStartupPanel=0', enabled: true, risk: 'Safe' as const },
  { id: 'usb-suspend', title: 'USB Selective Suspend OFF', copy: 'Prevents input device inconsistency', receipt: 'powercfg: USB suspend setting', enabled: true, risk: 'Safe' as const },
  { id: 'pcie-link', title: 'PCIe Link State Power Mgmt OFF', copy: 'Prevents GPU micro-stutter from PCIe power saving', receipt: 'powercfg: PCIe ASPM setting', enabled: true, risk: 'Measured' as const },
  { id: 'core-parking', title: 'Core Parking OFF', copy: 'All CPU cores active — proven +5-10% 1% lows', receipt: 'powercfg: core parking index = 100', enabled: true, risk: 'Measured' as const },
  { id: 'cpu-priority', title: 'CPU Priority High for game', copy: 'Gives game process highest CPU scheduling', receipt: 'wmic: setpriority 128', enabled: true, risk: 'Safe' as const },
  { id: 'standby-clean', title: 'Standby list cleaner', copy: 'Clears RAM standby cache — reduces stutter on <32GB', receipt: 'powershell: GC collect + EmptyWorkingSet', enabled: true, risk: 'Measured' as const },
  { id: 'network-throttle', title: 'Network Throttling Index OFF', copy: 'Maximizes network bandwidth for gaming', receipt: 'registry: SystemProfile\\SystemResponsiveness=0', enabled: true, risk: 'Measured' as const },
  { id: 'tcp-nodelay', title: 'TCP NoDelay + LSO OFF (Nagle)', copy: 'Reduces network latency 2-5ms', receipt: 'registry: MSMQ\\TCPNoDelay + NetAdapter LSO', enabled: true, risk: 'Measured' as const },
  { id: 'mmcss', title: 'MMCSS Games scheduling priority', copy: 'Audio/GPU thread priority boost for gaming', receipt: 'registry: Multimedia\\SystemProfile\\Tasks\\Games', enabled: true, risk: 'Measured' as const },
  { id: 'timer-res', title: 'Timer resolution 0.5ms', copy: 'Windows checks input 30x more often than default', receipt: 'NtSetTimerResolution(5000)', enabled: true, risk: 'Measured' as const },
  { id: 'gpu-max', title: 'Force GPU max clocks (NVIDIA)', copy: 'Prevents GPU clock drops during gameplay', receipt: 'registry: GPU PowerMizer PerfLevelSrc', enabled: false, risk: 'Measured' as const },
  { id: 'gpu-amd', title: 'Force GPU max clocks (AMD)', copy: 'Enables GPU overdrive for consistent clocks', receipt: 'registry: GPU PP_SclkOverdriveGrid', enabled: false, risk: 'Measured' as const },
  { id: 'defender-excl', title: 'Defender exclusion for game folder', copy: 'Stops Windows Defender from scanning game files during play', receipt: 'Add-MpPreference -ExclusionPath', enabled: true, risk: 'Measured' as const },
  { id: 'spectre', title: 'Spectre/Meltdown mitigations OFF', copy: 'Regains 3-10% CPU perf on Intel — reboot required', receipt: 'registry: Memory Management\\FeatureSettings', enabled: false, risk: 'Advanced' as const },
  { id: 'msi-mode', title: 'MSI Mode + Interrupt Moderation OFF', copy: 'Reduces DPC latency and input lag — reboot required', receipt: 'registry: PCI MSISupported + NetAdapter', enabled: false, risk: 'Advanced' as const },
]

export const safetyRules: Array<{ label: string; risk: RiskLevel }> = [
  { label: 'Windows settings', risk: 'Safe' },
  { label: 'Driver APIs', risk: 'Advanced' },
  { label: 'Game memory access', risk: 'Blocked' },
]

export const workflowSteps = [
  {
    label: 'Scan',
    copy: 'Detect games, GPU, refresh rate, Game Mode and active power plan.',
  },
  {
    label: 'Baseline',
    copy: 'Capture PresentMon data before changing anything.',
  },
  {
    label: 'Arm',
    copy: 'Apply only session-safe changes with a rollback snapshot.',
  },
  {
    label: 'Compare',
    copy: 'Keep, retest or restore based on frametime deltas.',
  },
]

export const realChangeLabs: Array<{
  title: string
  metric: string
  signal: string
  action: string
  risk: RiskLevel
}> = [
  {
    title: 'Frametime truth',
    metric: 'p95, p99, 1% low',
    signal: 'Detects whether a tweak improved stability instead of only average FPS.',
    action: 'Use PresentMon before and after every boost.',
    risk: 'Safe',
  },
  {
    title: 'Bufferbloat check',
    metric: 'Idle vs loaded latency',
    signal: 'Finds ping spikes caused by router queues during upload/download load.',
    action: 'Recommend SQM/QoS router changes only when loaded latency is bad.',
    risk: 'Measured',
  },
  {
    title: 'Memory stutter test',
    metric: 'Commit, standby pressure, hard faults',
    signal: 'Separates real RAM pressure from placebo RAM cleaning.',
    action: 'Only suggest standby cleaning when stutter evidence exists.',
    risk: 'Measured',
  },
  {
    title: 'Vendor latency map',
    metric: 'GPU vendor, game support, frame cap',
    signal: 'Matches Reflex, Anti-Lag 2 or driver low latency to the exact game.',
    action: 'Guide the user to the lowest-latency supported mode.',
    risk: 'Safe',
  },
]

export const diagnosisActions = [
  {
    command: 'frametime_doctor',
    title: 'Frametime Doctor',
    copy: 'Find false high FPS, p99 spikes, tearing risk and cap advice.',
  },
  {
    command: 'bottleneck_classifier',
    title: 'Bottleneck Classifier',
    copy: 'Decide if the issue is CPU, GPU, memory, network or display pacing.',
  },
  {
    command: 'input_path_audit',
    title: 'Input Path Audit',
    copy: 'Check overlays, captures, mouse polling and Valorant raw input guidance.',
  },
  {
    command: 'game_smoothness_lab',
    title: 'Game Smoothness Lab',
    copy: 'Run Valorant, CS2 or Fortnite specific test recommendations.',
  },
] as const

export const innovationBacklog: Array<{
  title: string
  proof: string
  change: string
  risk: RiskLevel
}> = [
  {
    title: 'Auto rollback when boost is worse',
    proof: 'If p99 frametime or 1% low worsens after boost, the app recommends restore.',
    change: 'Compare baseline and boosted PresentMon captures.',
    risk: 'Safe',
  },
  {
    title: 'Session-only Windows tuning',
    proof: 'Persistent tweaks are the main trust problem in optimizer tools.',
    change: 'Apply power, overlays and process rules only while the game is running.',
    risk: 'Safe',
  },
  {
    title: 'Router diagnosis instead of fake ping promises',
    proof: 'Bufferbloat tests compare idle latency with latency under load.',
    change: 'Show loaded latency and recommend SQM/QoS when the router is the issue.',
    risk: 'Measured',
  },
  {
    title: 'Anti-cheat visible boundary',
    proof: 'Valorant and other competitive games punish invasive tooling.',
    change: 'Show blocked actions and never touch memory, hooks or anti-cheat services.',
    risk: 'Blocked',
  },
]

export const vendorGuidance: Record<GameKey, Array<{
  label: string
  value: string
  risk: RiskLevel
}>> = {
  Valorant: [
    { label: 'NVIDIA', value: 'Prefer in-game Reflex when available.', risk: 'Safe' },
    { label: 'AMD', value: 'Anti-Lag 2 is relevant on supported Radeon GPUs.', risk: 'Safe' },
    { label: 'Rule', value: 'Do not inject latency tools into the game process.', risk: 'Blocked' },
  ],
  CS2: [
    { label: 'NVIDIA', value: 'Use driver low latency only if Reflex is not available.', risk: 'Measured' },
    { label: 'CPU', value: 'Affinity and priority rules must be A/B tested.', risk: 'Advanced' },
    { label: 'Rule', value: 'Avoid hooks, overlays or memory tools.', risk: 'Blocked' },
  ],
  Fortnite: [
    { label: 'NVIDIA', value: 'Reflex plus correct frame cap is the clean path.', risk: 'Safe' },
    { label: 'AMD', value: 'Avoid frame generation as a competitive latency boost.', risk: 'Measured' },
    { label: 'Renderer', value: 'DX12 shader prep or Performance Mode needs per-PC testing.', risk: 'Measured' },
  ],
}

export const processAllowlist = [
  {
    name: 'Discord.exe',
    type: 'Overlay',
    defaultAction: 'Ask',
    reason: 'Can add overlay and capture overhead, but many players need voice chat.',
  },
  {
    name: 'chrome.exe',
    type: 'Browser',
    defaultAction: 'Close',
    reason: 'Often consumes memory, video decode and background CPU during matches.',
  },
  {
    name: 'steamwebhelper.exe',
    type: 'Launcher',
    defaultAction: 'Keep',
    reason: 'Required by Steam ecosystem; only audit overlay settings.',
  },
  {
    name: 'vgc.exe',
    type: 'Anti-cheat',
    defaultAction: 'Blocked',
    reason: 'DTHBoost never suspends, kills or modifies anti-cheat services.',
  },
]

export const competitorMatrix: Array<{
  competitor: string
  strength: string
  gap: string
  dthboostMove: string
}> = [
  {
    competitor: 'Razer Cortex',
    strength: 'Simple game boosting, process cleanup and launcher UX.',
    gap: 'Limited technical receipt and weak A/B proof for each change.',
    dthboostMove: 'Receipts plus PresentMon before/after for every boost.',
  },
  {
    competitor: 'Process Lasso',
    strength: 'Mature process rules, ProBalance and performance mode.',
    gap: 'Powerful but general-purpose, not game-specific or anti-cheat guided.',
    dthboostMove: 'Session rules tuned for Valorant, CS2 and Fortnite with rollback.',
  },
  {
    competitor: 'ExitLag',
    strength: 'Multipath routing and route optimization for bad ISP paths.',
    gap: 'Routing helps only when path or packet stability is the bottleneck.',
    dthboostMove: 'Network Truth tests decide when routing tools are actually relevant.',
  },
  {
    competitor: 'Hone',
    strength: 'Aggressive one-click optimization and commercial polish.',
    gap: 'Users must trust a black box and broad tweaks may not fit every PC.',
    dthboostMove: 'No black box: explain, measure, apply, compare, revert.',
  },
  {
    competitor: 'AtlasOS',
    strength: 'Deep debloat and lower idle overhead.',
    gap: 'Requires OS-level commitment and can affect support or compatibility.',
    dthboostMove: 'Session-only gains without replacing Windows.',
  },
]
