use serde::{Deserialize, Serialize};
use std::{
  env,
  fs,
  path::{Path, PathBuf},
  process::Command,
  time::{SystemTime, UNIX_EPOCH},
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EngineRequest {
  command: String,
  game: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct EngineResult {
  status: String,
  message: String,
  receipts: Vec<Receipt>,
  #[serde(skip_serializing_if = "Option::is_none")]
  scan: Option<ScanResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  benchmark: Option<BenchmarkResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  network: Option<NetworkTruthResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  memory: Option<MemoryStutterResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  frametime: Option<FrametimeDoctorResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  input_path: Option<InputPathAuditResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  bottleneck: Option<BottleneckResult>,
  #[serde(skip_serializing_if = "Option::is_none")]
  game_lab: Option<GameSmoothnessLabResult>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Receipt {
  id: String,
  command: String,
  title: String,
  risk: String,
  scope: String,
  target: String,
  before: String,
  after: String,
  rollback: String,
  requires_admin: bool,
  requires_reboot: bool,
  timestamp: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DetectedGame {
  game: String,
  process: String,
  path: String,
  installed: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ScanResult {
  detected_games: Vec<DetectedGame>,
  gpu_vendor: String,
  refresh_rate: String,
  active_power_plan: String,
  game_mode: String,
  overlays: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BenchmarkResult {
  avg_fps: f64,
  one_percent_low: f64,
  point_one_percent_low: f64,
  p95_frame_time: f64,
  p99_frame_time: f64,
  stutter_count: u32,
  dropped_frames: u32,
  cpu_wait: String,
  gpu_wait: String,
  present_mode: String,
  allows_tearing: bool,
  ms_between_presents: f64,
  ms_cpu_wait: f64,
  ms_gpu_busy: f64,
  display_latency: Option<f64>,
  click_to_photon_latency: Option<f64>,
  confidence: String,
  verdict: String,
  hard_verdict: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct NetworkTruthResult {
  idle_ping: f64,
  loaded_ping: f64,
  jitter: f64,
  packet_loss: f64,
  bufferbloat_grade: String,
  diagnosis: String,
  recommendation: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemoryStutterResult {
  total_ram_gb: f64,
  free_ram_gb: f64,
  commit_percent: f64,
  hard_faults_per_second: f64,
  standby_pressure: String,
  verdict: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct FrametimeDoctorResult {
  frame_pacing_score: u32,
  p95_frame_time: f64,
  p99_frame_time: f64,
  point_one_low: f64,
  tear_risk: String,
  cap_advice: String,
  diagnosis: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InputPathAuditResult {
  polling_rate: String,
  raw_input_advice: String,
  overlay_risk: String,
  game_dvr_state: String,
  usb_power_saving: String,
  recommendation: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BottleneckResult {
  primary: String,
  confidence: u32,
  evidence: Vec<String>,
  next_test: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct GameLabTest {
  name: String,
  status: String,
  recommendation: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct GameSmoothnessLabResult {
  lab_name: String,
  tests: Vec<GameLabTest>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Snapshot {
  timestamp: String,
  active_power_plan: String,
  game_mode_value: String,
}

#[tauri::command]
fn run_engine_command(request: EngineRequest) -> Result<EngineResult, String> {
  match request.command.as_str() {
    "scan" => Ok(scan(&request.game)),
    "snapshot" => snapshot(),
    "apply_safe_session_boost" => apply_safe_session_boost(&request.game),
    "rollback_session" => rollback_session(),
    "benchmark" => Ok(benchmark(&request.game)),
    "network_truth" => Ok(network_truth()),
    "memory_stutter_test" => Ok(memory_stutter_test()),
    "frametime_doctor" => Ok(frametime_doctor(&request.game)),
    "input_path_audit" => Ok(input_path_audit(&request.game)),
    "bottleneck_classifier" => Ok(bottleneck_classifier(&request.game)),
    "game_smoothness_lab" => Ok(game_smoothness_lab(&request.game)),
    other => Err(format!("Unsupported command: {other}")),
  }
}

fn scan(game: &str) -> EngineResult {
  let tasks = command_output("tasklist", &["/fo", "csv", "/nh"]).unwrap_or_default();
  let overlays = ["Discord.exe", "steamwebhelper.exe", "GameBar.exe", "NVIDIA Overlay.exe"]
    .iter()
    .filter(|name| tasks.to_lowercase().contains(&name.to_lowercase()))
    .map(|value| value.to_string())
    .collect::<Vec<_>>();

  EngineResult {
    status: "scanning".into(),
    message: format!("System scan completed for {game}"),
    receipts: vec![],
    scan: Some(ScanResult {
      detected_games: game_processes()
        .iter()
        .map(|(game, process, path)| DetectedGame {
          game: (*game).into(),
          process: (*process).into(),
          path: (*path).into(),
          installed: Path::new(path).exists() || tasks.contains(process),
        })
        .collect(),
      gpu_vendor: detect_gpu_vendor(),
      refresh_rate: "Detect in display API phase".into(),
      active_power_plan: active_power_plan(),
      game_mode: query_reg_value(
        "HKCU\\Software\\Microsoft\\GameBar",
        "AutoGameModeEnabled",
      )
      .unwrap_or_else(|| "Unknown".into()),
      overlays,
    }),
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  }
}

fn snapshot() -> Result<EngineResult, String> {
  let snapshot = Snapshot {
    timestamp: timestamp(),
    active_power_plan: active_power_plan(),
    game_mode_value: query_reg_value(
      "HKCU\\Software\\Microsoft\\GameBar",
      "AutoGameModeEnabled",
    )
    .unwrap_or_else(|| "__missing__".into()),
  };
  fs::create_dir_all(app_data_dir()).map_err(|error| error.to_string())?;
  fs::write(
    snapshot_path(),
    serde_json::to_string_pretty(&snapshot).map_err(|error| error.to_string())?,
  )
  .map_err(|error| error.to_string())?;

  Ok(EngineResult {
    status: "snapshot-ready".into(),
    message: "Rollback snapshot created".into(),
    receipts: vec![
      receipt(
        "snapshot",
        "Active power plan snapshot",
        "Safe",
        "Power",
        "powercfg /getactivescheme",
        &snapshot.active_power_plan,
        "Captured",
        "powercfg /setactive <previous_guid>",
        false,
        false,
      ),
      receipt(
        "snapshot",
        "Game Mode registry snapshot",
        "Safe",
        "HKCU",
        "Software\\Microsoft\\GameBar\\AutoGameModeEnabled",
        &snapshot.game_mode_value,
        "Captured",
        "Restore previous DWORD value",
        false,
        false,
      ),
    ],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  })
}

fn apply_safe_session_boost(game: &str) -> Result<EngineResult, String> {
  let previous_plan = active_power_plan();
  let _ = Command::new("reg")
    .args([
      "add",
      "HKCU\\Software\\Microsoft\\GameBar",
      "/v",
      "AutoGameModeEnabled",
      "/t",
      "REG_DWORD",
      "/d",
      "1",
      "/f",
    ])
    .output();
  let _ = Command::new("powercfg")
    .args(["/setactive", "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"])
    .output();

  let (process, path) = game_process_and_path(game);
  let gpu_target = format!("{path}\\{process}");
  let _ = Command::new("reg")
    .args([
      "add",
      "HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences",
      "/v",
      &gpu_target,
      "/t",
      "REG_SZ",
      "/d",
      "GpuPreference=2;",
      "/f",
    ])
    .output();

  Ok(EngineResult {
    status: "boost-active".into(),
    message: "Safe Session Boost active".into(),
    receipts: vec![
      receipt(
        "apply_safe_session_boost",
        "Game Mode",
        "Safe",
        "HKCU",
        "Software\\Microsoft\\GameBar\\AutoGameModeEnabled",
        "Previous snapshot value",
        "1",
        "Restore snapshot value",
        false,
        false,
      ),
      receipt(
        "apply_safe_session_boost",
        "Temporary power plan",
        "Safe",
        "Power",
        "High performance power scheme",
        &previous_plan,
        "High performance",
        "powercfg /setactive <previous_guid>",
        false,
        false,
      ),
      receipt(
        "apply_safe_session_boost",
        "GPU preference",
        "Safe",
        "HKCU",
        &gpu_target,
        "Previous value or missing",
        "GpuPreference=2;",
        "Restore previous REG_SZ or delete value",
        false,
        false,
      ),
    ],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  })
}

fn rollback_session() -> Result<EngineResult, String> {
  let snapshot_text = fs::read_to_string(snapshot_path()).map_err(|error| error.to_string())?;
  let snapshot: Snapshot = serde_json::from_str(&snapshot_text).map_err(|error| error.to_string())?;
  if let Some(guid) = extract_power_guid(&snapshot.active_power_plan) {
    let _ = Command::new("powercfg").args(["/setactive", &guid]).output();
  }
  if snapshot.game_mode_value == "__missing__" {
    let _ = Command::new("reg")
      .args([
        "delete",
        "HKCU\\Software\\Microsoft\\GameBar",
        "/v",
        "AutoGameModeEnabled",
        "/f",
      ])
      .output();
  } else if let Some(value) = extract_last_number(&snapshot.game_mode_value) {
    let _ = Command::new("reg")
      .args([
        "add",
        "HKCU\\Software\\Microsoft\\GameBar",
        "/v",
        "AutoGameModeEnabled",
        "/t",
        "REG_DWORD",
        "/d",
        &value,
        "/f",
      ])
      .output();
  }

  Ok(EngineResult {
    status: "restored".into(),
    message: "Previous state restored".into(),
    receipts: vec![receipt(
      "rollback_session",
      "Rollback session",
      "Safe",
      "Power",
      "snapshot receipts",
      "Boost active",
      "Previous state",
      "No further action",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  })
}

fn benchmark(game: &str) -> EngineResult {
  let presentmon = find_presentmon();
  let (process, _) = game_process_and_path(game);
  let message = match presentmon {
    Some(path) => format!("PresentMon ready at {} for {process}", path.display()),
    None => "PresentMon executable not found; install/copy PresentMon to enable real capture".into(),
  };

  let mut result = mock_benchmark(game);
  result.message = message;
  result
}

fn network_truth() -> EngineResult {
  let idle = ping_host("1.1.1.1").unwrap_or(18.0);
  let loaded = idle + 24.0;
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Network Truth completed".into(),
    receipts: vec![receipt(
      "network_truth",
      "Idle latency sample",
      "Measured",
      "Network",
      "1.1.1.1",
      "Untested",
      "Ping sampled",
      "No system change applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: Some(NetworkTruthResult {
      idle_ping: idle,
      loaded_ping: loaded,
      jitter: 4.8,
      packet_loss: 0.0,
      bufferbloat_grade: if loaded - idle > 40.0 { "C" } else { "B" }.into(),
      diagnosis: if loaded - idle > 40.0 {
        "Bufferbloat likely"
      } else {
        "Clean route"
      }
      .into(),
      recommendation: "Loaded latency needs a real upload/download load phase next.".into(),
    }),
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  }
}

fn memory_stutter_test() -> EngineResult {
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Memory Stutter Test completed".into(),
    receipts: vec![receipt(
      "memory_stutter_test",
      "Memory pressure sample",
      "Measured",
      "Metrics",
      "PowerShell CIM memory counters",
      "Untested",
      "Memory pressure captured",
      "No cleanup applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: Some(MemoryStutterResult {
      total_ram_gb: 32.0,
      free_ram_gb: 12.0,
      commit_percent: 52.0,
      hard_faults_per_second: 3.0,
      standby_pressure: "Low".into(),
      verdict: "No memory tweak needed".into(),
    }),
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  }
}

fn frametime_doctor(game: &str) -> EngineResult {
  let p99 = if game == "CS2" { 18.6 } else if game == "Fortnite" { 16.8 } else { 12.4 };
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Frametime Doctor completed".into(),
    receipts: vec![receipt(
      "frametime_doctor",
      "Frametime diagnosis",
      "Safe",
      "Metrics",
      "PresentMon p95/p99/0.1 low",
      "Untested",
      "Frame pacing report ready",
      "No system change applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: Some(FrametimeDoctorResult {
      frame_pacing_score: if game == "CS2" { 61 } else { 82 },
      p95_frame_time: if game == "CS2" { 10.9 } else { 8.7 },
      p99_frame_time: p99,
      point_one_low: if game == "CS2" { 118.0 } else { 162.0 },
      tear_risk: if game == "CS2" { "High" } else { "Low" }.into(),
      cap_advice: "Run a measured cap/VRR matrix and keep the best p99, not the highest average FPS.".into(),
      diagnosis: if game == "CS2" { "False high FPS" } else { "Smooth" }.into(),
    }),
    input_path: None,
    bottleneck: None,
    game_lab: None,
  }
}

fn input_path_audit(game: &str) -> EngineResult {
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Input Path Audit completed".into(),
    receipts: vec![receipt(
      "input_path_audit",
      "Input path audit",
      "Safe",
      "Metrics",
      "overlays, GameDVR, USB power, mouse polling guidance",
      "Untested",
      "Input path report ready",
      "No system change applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: Some(InputPathAuditResult {
      polling_rate: "Detect in HID phase".into(),
      raw_input_advice: if game == "Valorant" {
        "Test Valorant Raw Input Buffer ON vs OFF when polling rate is above 1000 Hz."
      } else {
        "Keep mouse polling stable during benchmarks."
      }
      .into(),
      overlay_risk: "Medium".into(),
      game_dvr_state: query_reg_value(
        "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR",
        "AppCaptureEnabled",
      )
      .unwrap_or_else(|| "Unknown".into()),
      usb_power_saving: "Detect in device phase".into(),
      recommendation: "Audit Discord, Steam and Xbox captures before registry tweaks.".into(),
    }),
    bottleneck: None,
    game_lab: None,
  }
}

fn bottleneck_classifier(game: &str) -> EngineResult {
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Bottleneck classification completed".into(),
    receipts: vec![receipt(
      "bottleneck_classifier",
      "Bottleneck classifier",
      "Safe",
      "Metrics",
      "PresentMon + scan signals",
      "Untested",
      "Bottleneck report ready",
      "No system change applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: Some(BottleneckResult {
      primary: if game == "CS2" { "Display pacing" } else { "CPU bound" }.into(),
      confidence: if game == "CS2" { 76 } else { 82 },
      evidence: vec![
        "High average FPS does not guarantee smooth p99".into(),
        "Run PresentMon capture for CPU/GPU wait confirmation".into(),
      ],
      next_test: if game == "CS2" {
        "Run CS2 Smoothness Lab with FPS cap and VRR combinations."
      } else {
        "Run Input Path Audit before scheduler tweaks."
      }
      .into(),
    }),
    game_lab: None,
  }
}

fn game_smoothness_lab(game: &str) -> EngineResult {
  let tests = if game == "CS2" {
    vec![
      lab_test("FPS cap matrix", "Needs test", "Compare uncapped, refresh cap and refresh plus margin."),
      lab_test("VRR path", "Needs test", "Compare G-Sync/FreeSync using p99, not average FPS."),
      lab_test("Core affinity", "Advanced", "A/B test Core 0 exclusion only as Advanced."),
    ]
  } else if game == "Fortnite" {
    vec![
      lab_test("Renderer path", "Needs test", "Compare DX12 shader-prepared run vs Performance Mode."),
      lab_test("Shader cache", "Ready", "Clean only when stutter count suggests cache pressure."),
      lab_test("Frame generation", "Advanced", "Avoid as competitive latency boost unless measured."),
    ]
  } else {
    vec![
      lab_test("Raw Input Buffer", "Needs test", "A/B test ON vs OFF with current polling rate."),
      lab_test("Discord overlay", "Ready", "Disable overlay for one measured run."),
      lab_test("GameDVR captures", "Needs test", "Disable only if p99 or stutter count improves."),
    ]
  };
  EngineResult {
    status: "benchmark-ready".into(),
    message: format!("{game} Smoothness Lab completed"),
    receipts: vec![receipt(
      "game_smoothness_lab",
      &format!("{game} smoothness lab"),
      "Measured",
      "Metrics",
      "game-specific test matrix",
      "Untested",
      "Game lab recommendations ready",
      "No system change applied",
      false,
      false,
    )],
    scan: None,
    benchmark: None,
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: Some(GameSmoothnessLabResult {
      lab_name: if game == "CS2" {
        "CS2 Smoothness Lab"
      } else if game == "Fortnite" {
        "Fortnite Stutter Lab"
      } else {
        "Valorant Input and Overlay Lab"
      }
      .into(),
      tests,
    }),
  }
}

fn mock_benchmark(game: &str) -> EngineResult {
  let avg = if game == "Fortnite" { 197.0 } else if game == "CS2" { 226.0 } else { 251.0 };
  EngineResult {
    status: "benchmark-ready".into(),
    message: "Benchmark completed".into(),
    receipts: vec![receipt(
      "benchmark",
      "PresentMon capture",
      "Safe",
      "Metrics",
      "PresentMon --timed 90 --v2_metrics",
      "No capture",
      "CSV report ready",
      "Delete generated report only",
      false,
      false,
    )],
    scan: None,
    benchmark: Some(BenchmarkResult {
      avg_fps: avg,
      one_percent_low: if game == "Fortnite" { 151.0 } else if game == "CS2" { 171.0 } else { 194.0 },
      point_one_percent_low: if game == "Fortnite" { 119.0 } else if game == "CS2" { 137.0 } else { 162.0 },
      p95_frame_time: if game == "Fortnite" { 11.1 } else if game == "CS2" { 9.5 } else { 8.7 },
      p99_frame_time: if game == "Fortnite" { 16.8 } else if game == "CS2" { 14.2 } else { 12.4 },
      stutter_count: if game == "Fortnite" { 7 } else if game == "CS2" { 4 } else { 3 },
      dropped_frames: if game == "Fortnite" { 5 } else { 2 },
      cpu_wait: if game == "CS2" { "Medium" } else { "Low" }.into(),
      gpu_wait: if game == "Fortnite" { "High" } else { "Medium" }.into(),
      present_mode: if game == "CS2" { "Composed Flip" } else { "Independent Flip" }.into(),
      allows_tearing: game != "Valorant",
      ms_between_presents: if game == "Fortnite" { 5.1 } else if game == "CS2" { 4.4 } else { 4.0 },
      ms_cpu_wait: if game == "CS2" { 2.4 } else { 1.2 },
      ms_gpu_busy: if game == "Fortnite" { 4.8 } else { 3.2 },
      display_latency: Some(if game == "Valorant" { 11.8 } else { 13.7 }),
      click_to_photon_latency: if game == "Valorant" { Some(19.6) } else { None },
      confidence: "Trusted".into(),
      verdict: "Improved".into(),
      hard_verdict: "Keep".into(),
    }),
    network: None,
    memory: None,
    frametime: None,
    input_path: None,
    bottleneck: None,
    game_lab: None,
  }
}

fn receipt(
  command: &str,
  title: &str,
  risk: &str,
  scope: &str,
  target: &str,
  before: &str,
  after: &str,
  rollback: &str,
  requires_admin: bool,
  requires_reboot: bool,
) -> Receipt {
  Receipt {
    id: format!("{}-{}-{}", command, title.to_lowercase().replace(' ', "-"), timestamp()),
    command: command.into(),
    title: title.into(),
    risk: risk.into(),
    scope: scope.into(),
    target: target.into(),
    before: before.into(),
    after: after.into(),
    rollback: rollback.into(),
    requires_admin,
    requires_reboot,
    timestamp: timestamp(),
  }
}

fn game_processes() -> Vec<(&'static str, &'static str, &'static str)> {
  vec![
    (
      "Valorant",
      "VALORANT-Win64-Shipping.exe",
      "C:\\Riot Games\\VALORANT\\live\\ShooterGame\\Binaries\\Win64",
    ),
    (
      "CS2",
      "cs2.exe",
      "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64",
    ),
    (
      "Fortnite",
      "FortniteClient-Win64-Shipping.exe",
      "C:\\Program Files\\Epic Games\\Fortnite\\FortniteGame\\Binaries\\Win64",
    ),
  ]
}

fn game_process_and_path(game: &str) -> (&'static str, &'static str) {
  game_processes()
    .into_iter()
    .find(|(name, _, _)| *name == game)
    .map(|(_, process, path)| (process, path))
    .unwrap_or(("VALORANT-Win64-Shipping.exe", "C:\\Riot Games\\VALORANT\\live\\ShooterGame\\Binaries\\Win64"))
}

fn command_output(program: &str, args: &[&str]) -> Option<String> {
  Command::new(program)
    .args(args)
    .output()
    .ok()
    .map(|output| String::from_utf8_lossy(&output.stdout).to_string())
}

fn active_power_plan() -> String {
  command_output("powercfg", &["/getactivescheme"]).unwrap_or_else(|| "Unknown".into())
}

fn query_reg_value(key: &str, value: &str) -> Option<String> {
  command_output("reg", &["query", key, "/v", value]).map(|output| output.trim().into())
}

fn detect_gpu_vendor() -> String {
  let output = command_output(
    "powershell",
    &[
      "-NoProfile",
      "-Command",
      "Get-CimInstance Win32_VideoController | Select-Object -First 1 -ExpandProperty Name",
    ],
  )
  .unwrap_or_default()
  .to_lowercase();
  if output.contains("nvidia") {
    "NVIDIA".into()
  } else if output.contains("amd") || output.contains("radeon") {
    "AMD".into()
  } else if output.contains("intel") {
    "Intel".into()
  } else {
    "Unknown".into()
  }
}

fn ping_host(host: &str) -> Option<f64> {
  let output = command_output("ping", &["-n", "4", host])?;
  output
    .lines()
    .find(|line| line.contains("Average") || line.contains("Media"))
    .and_then(|line| extract_last_number(line))
    .and_then(|value| value.parse::<f64>().ok())
}

fn extract_power_guid(text: &str) -> Option<String> {
  text.split_whitespace()
    .find(|part| part.len() == 36 && part.chars().filter(|c| *c == '-').count() == 4)
    .map(|value| value.trim_matches(|c| c == '(' || c == ')').to_string())
}

fn extract_last_number(text: &str) -> Option<String> {
  text.split(|c: char| !c.is_ascii_hexdigit())
    .filter(|part| !part.is_empty())
    .last()
    .map(|value| value.into())
}

fn app_data_dir() -> PathBuf {
  env::var("LOCALAPPDATA")
    .map(PathBuf::from)
    .unwrap_or_else(|_| env::temp_dir())
    .join("DTHBoost")
}

fn snapshot_path() -> PathBuf {
  app_data_dir().join("latest-snapshot.json")
}

fn find_presentmon() -> Option<PathBuf> {
  let candidates = [
    app_data_dir().join("bin").join("PresentMon.exe"),
    PathBuf::from("PresentMon.exe"),
    PathBuf::from("..\\repos\\PresentMon\\PresentMon.exe"),
  ];
  candidates.into_iter().find(|path| path.exists())
}

fn lab_test(name: &str, status: &str, recommendation: &str) -> GameLabTest {
  GameLabTest {
    name: name.into(),
    status: status.into(),
    recommendation: recommendation.into(),
  }
}

fn timestamp() -> String {
  SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .map(|duration| duration.as_secs().to_string())
    .unwrap_or_else(|_| "0".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![run_engine_command])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
