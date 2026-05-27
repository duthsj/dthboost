# DTHBoost — Free Competitive Gaming Optimizer

**Benchmark. Boost. Restore.** Session-only Windows optimization for Valorant, CS2, and Fortnite.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-blue)](https://github.com/dthboost/dthboost/releases)
[![Version](https://img.shields.io/badge/version-0.8.0-brightgreen)](https://github.com/dthboost/dthboost/releases)

## Why DTHBoost?

Most gaming optimizers are black boxes — they apply permanent tweaks you can't undo, can't verify, and might trigger anti-cheat. DTHBoost is different:

- **Session-only**: Every tweak reverts when your game exits
- **Measurable**: Real benchmarks with Intel PresentMon before and after
- **Transparent**: Every change has a receipt with before/after values and rollback instructions
- **Anti-cheat safe**: No DLL injection, no memory access, no kernel drivers

## Features

- **20 Elite Tweaks** — Power plan, GameDVR, Core Parking, MMCSS, Timer Resolution, Spectre/Meltdown mitigation toggle, MSI Mode, and more
- **Real Benchmark** — Intel PresentMon integration for FPS, 1% lows, p95/p99 frame times, stutter count
- **One-Click Optimize** — Scan → Benchmark → Boost, all automatic
- **Auto-Rollback** — Detects when game exits and restores everything
- **Receipts & Proof** — Every tweak logged with evidence
- **Benchmark History** — Track performance over time with timeline
- **FPS Prediction** — Estimated FPS based on your GPU before you benchmark
- **Share Cards** — Export benchmark results as PNG for Discord/Reddit
- **Pre-Warm System** — Prime RAM, GPU, and CPU before ranked
- **GPU Driver Check** — Compares installed driver vs latest from NVIDIA/AMD
- **Per-Game Profiles** — Different tweak configs for Valorant, CS2, Fortnite
- **Keyboard Shortcuts** — Ctrl+S Scan, Ctrl+B Benchmark, Ctrl+G Boost, Ctrl+R Rollback
- **English & Español** — Full bilingual support

## Download

**[Download latest release](https://github.com/dthboost/dthboost/releases/latest)**

Windows 10/11 · ~7 MB · No admin required for most features

## How It Works

1. **Scan** — Detects games, GPU, refresh rate, overlays, Windows state
2. **Benchmark** — Runs PresentMon to measure your real FPS, frame times, and latency
3. **Boost** — Applies 20 proven tweaks (power plan, GameDVR off, Core Parking off, timer resolution, and more)
4. **Play** — Enjoy smoother, lower-latency gaming
5. **Auto-Restore** — Everything reverts when you exit the game. Or rollback manually anytime.

## Tech Stack

- **Desktop Shell**: [Tauri 2](https://tauri.app) (Rust)
- **Frontend**: React 19 + TypeScript + Vite 8
- **Benchmark Engine**: Intel PresentMon
- **System Tweaks**: powercfg, registry, WMI, PowerShell (all CREATE_NO_WINDOW)

## Safety

DTHBoost **never**:
- Injects DLLs or hooks into games
- Reads or writes game memory
- Modifies anti-cheat services
- Installs kernel drivers
- Automates input or macros

It only changes standard Windows settings through documented APIs — and restores them after your session.

## Development

```bash
# Install dependencies
npm install

# Run in browser (mock engine)
npm run dev

# Run as desktop app (real engine)
npm run tauri dev

# Build for production
npm run tauri build
```

## License

MIT — free and open source forever.

---

Built with [Tauri](https://tauri.app), [React](https://react.dev), and [PresentMon](https://github.com/GameTechDev/PresentMon).
