// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::net::TcpListener;
use std::process;

const SINGLE_INSTANCE_PORT: u16 = 19827;

fn main() {
  // Reliable single-instance check via TCP bind
  match TcpListener::bind(("127.0.0.1", SINGLE_INSTANCE_PORT)) {
    Ok(listener) => {
      // We hold this port for the lifetime of the app.
      // The listener is intentionally never dropped.
      std::mem::forget(listener);
    }
    Err(_) => {
      // Port is already bound — another instance is running.
      // Try to bring the existing window to front.
      let _ = std::process::Command::new("powershell")
        .args([
          "-NoProfile",
          "-Command",
          "(Get-Process -Name dthboost -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1).MainWindowHandle",
        ])
        .output();
      process::exit(0);
    }
  }

  dthboost_lib::run();
}
