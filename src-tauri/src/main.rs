// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::OnceLock;
use std::process;

static RUNNING: OnceLock<bool> = OnceLock::new();

fn main() {
  // Single instance check via process list
  let exe_name = std::env::current_exe()
    .ok()
    .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_string()))
    .unwrap_or_else(|| "dthboost.exe".into());

  let output = std::process::Command::new("tasklist")
    .args(["/fo", "csv", "/nh"])
    .output()
    .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
    .unwrap_or_default();

  let count = output.to_lowercase().matches(&exe_name.to_lowercase()).count();

  if count > 1 {
    // Another instance is already running — try to bring it to front
    let _ = std::process::Command::new("powershell")
      .args(["-NoProfile", "-Command",
        "(Get-Process -Name dthboost -ErrorAction SilentlyContinue | Select-Object -First 1).MainWindowHandle"])
      .output();
    process::exit(0);
  }

  RUNNING.set(true).ok();
  dthboost_lib::run();
}
