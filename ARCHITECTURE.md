# DTHBoost architecture draft

## Product stance

DTHBoost is not a blind tweaker. It is a measured, reversible optimization cockpit for Valorant, CS2 and Fortnite.

The first product rule is simple: benchmark, snapshot, apply, verify, rollback.

## Recommended stack

- Desktop shell: Tauri 2.
- UI: React + TypeScript + Vite.
- System layer: Rust commands exposed through Tauri.
- Elevated actions: separate helper for admin-only changes.
- Metrics: Intel PresentMon CLI/service first, GPU vendor APIs later.

## Frontend modules

- Home: game selector, readiness, current status and the next best action.
- Session Boost: temporary plan and game-process lifecycle.
- Benchmark: baseline, boost, delta, confidence and export.
- Profiles: Valorant, CS2, Fortnite with Safe, Competitive and Lab modes.
- Safety & Receipts: allowed surface, blocked actions, snapshots and rollback history.

## Backend modules

### Game detector

- Detect known install paths.
- Watch running processes.
- Avoid opening or inspecting protected game memory.
- Emit lifecycle events: detected, launched, foreground, stopped.

### Snapshot manager

- Store active power plan GUID.
- Store registry values before changes.
- Store changed process list and user allowlist.
- Persist receipts as JSON.

### Tweak engine

Each tweak should include:

- id
- title
- risk
- requiresAdmin
- reversible
- detect
- apply
- verify
- revert
- receipt

### PresentMon runner

- Run timed capture.
- Filter by process name.
- Export CSV.
- Parse FPS, 1% low, p95/p99 frame time, CPU wait, GPU busy and dropped frames.

### Session boost

- Wait for selected game process.
- Apply temporary changes.
- Monitor game exit.
- Revert automatically.
- Surface any revert failure in the UI.

## MVP actions

- Scan game paths.
- Prepare rollback snapshot.
- Run PresentMon baseline.
- Apply temporary power plan.
- Audit overlays through user allowlist.
- Toggle GameDVR-related values with rollback.
- Detect refresh rate and warn about DRR/VRR mismatches.
- Export before/after report.

## First implementation slice

Build these commands first:

1. `scan`
2. `snapshot`
3. `benchmark`
4. `apply_safe_session_boost`
5. `rollback_session`

Only three changes should be applyable in the first safe slice:

- Game Mode.
- Temporary power plan.
- GPU preference per game executable.

GameDVR and MMCSS should come next as `Measured` changes. HAGS and IFEO PerfOptions belong behind A/B testing and advanced warnings.

## UX flow

The main user flow should be:

1. Scan PC.
2. Select or confirm detected game.
3. Measure baseline.
4. Review three to five recommended changes.
5. Arm Session Boost.
6. Open the game.
7. Apply temporary changes while the game runs.
8. Revert when the game exits.
9. Measure boosted run.
10. Keep, revert or retest.

The app should always show a human status, not only a score:

- No game detected.
- No trusted capture yet.
- Baseline ready.
- Session armed.
- Session active.
- Reverting.
- Reboot required.
- Worse after boost.
- Blocked by DTHBoost safety policy.

## Explicitly blocked

- DLL injection.
- Game memory reading or writing.
- Anti-cheat bypass or tampering.
- Kernel driver in the MVP.
- Macros, recoil tools or input automation.
- Aggressive RAM cleaners.
- Disabling Defender.
- BCDEdit or HPET changes as default tweaks.

## Implementation status

- React/Vite app shell exists in `src`.
- UI state simulates scan, benchmark, boost and rollback.
- Evidence UI now includes Real Change Labs, Vendor Intelligence, Session Flow and Innovation Backlog.
- `src/engine.ts` defines the helper contract and mock engine.
- Receipt drawer shows command, scope, target, before, after and rollback.
- Mock engine now includes Network Truth and Memory Stutter Test.
- Mock engine now includes Frametime Doctor, Input Path Audit, Bottleneck Classifier and Game Smoothness Lab.
- Boost is gated behind a trusted benchmark in the UI.
- Benchmark now surfaces PresentMon-style fields: present mode, tearing, dropped frames, CPU wait, GPU busy, display latency and click-to-photon when available.
- UI includes process allowlist and keeps competitor/backlog analysis in documentation, not the player dashboard.
- `helper-contract.md` and `src/helper-contract.schema.json` define the future Rust/Tauri bridge.
- Real Tauri/Rust commands are not wired yet.
