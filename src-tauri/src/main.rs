// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::net::TcpListener;
use std::process;

const SINGLE_INSTANCE_PORT: u16 = 19827;

fn main() {
  match TcpListener::bind(("127.0.0.1", SINGLE_INSTANCE_PORT)) {
    Ok(listener) => {
      std::mem::forget(listener);
    }
    Err(_) => {
      // Another instance is running — bring its window to front
      let _ = std::process::Command::new("powershell")
        .args([
          "-NoProfile",
          "-Command",
          "$c=@'\n[DllImport(\"user32.dll\")] public static extern bool SetForegroundWindow(IntPtr hWnd);\n[DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);\n[DllImport(\"user32.dll\")] public static extern bool IsIconic(IntPtr hWnd);\n'@; Add-Type -MemberDefinition $c -Name Win -Namespace T; $p=Get-Process -Name dthboost -ErrorAction SilentlyContinue|Where-Object{$_.MainWindowHandle -ne 0}|Select-Object -First 1; if($p){[T.Win]::ShowWindow($p.MainWindowHandle,9);[T.Win]::SetForegroundWindow($p.MainWindowHandle)}",
        ])
        .output();
      process::exit(0);
    }
  }

  dthboost_lib::run();
}
