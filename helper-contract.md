# DTHBoost helper contract

Rust is not installed in this workspace, so the Tauri/helper binary is not generated yet. The app is wired against this contract through `src/engine.ts`.

## Commands

### scan

Purpose:
- Detect games, GPU vendor, refresh rate, overlays, Game Mode and active power plan.

Input:

```json
{
  "command": "scan",
  "game": "Valorant"
}
```

Output:

```json
{
  "status": "scanning",
  "message": "System scan completed",
  "scan": {
    "detectedGames": [],
    "gpuVendor": "NVIDIA",
    "refreshRate": "240 Hz",
    "activePowerPlan": "Balanced",
    "gameMode": "Enabled",
    "overlays": ["Discord", "Steam"]
  },
  "receipts": []
}
```

### snapshot

Purpose:
- Capture rollback state before any write.

Must capture:
- Active power plan GUID.
- Registry values touched by enabled tweaks.
- Process closer allowlist state.
- Timestamp and game profile.

### benchmark

Purpose:
- Run PresentMon against the selected game process.

Expected process names:
- Valorant: `VALORANT-Win64-Shipping.exe`
- CS2: `cs2.exe`
- Fortnite: `FortniteClient-Win64-Shipping.exe`

Required metrics:
- Avg FPS.
- 1% low.
- 0.1% low.
- p95 frame time.
- p99 frame time.
- stutter count.
- dropped frames.
- CPU wait.
- GPU wait.
- present mode.
- allows tearing.
- milliseconds between presents.
- display latency when available.
- click-to-photon latency when available.
- confidence.
- verdict.
- hard verdict: keep, rollback or retest.

### apply_safe_session_boost

Purpose:
- Apply only Safe changes.

Allowed first slice:
- Game Mode.
- Temporary power plan.
- GPU preference per game executable.

Every operation must return a receipt with:
- command.
- title.
- risk.
- scope.
- target.
- before.
- after.
- rollback.
- requiresAdmin.
- requiresReboot.
- timestamp.

### rollback_session

Purpose:
- Restore from the latest snapshot and receipts.

Rules:
- Never guess missing old values.
- If rollback cannot prove the previous value, surface an error.
- On app startup, detect orphaned active sessions and offer restore.

## Anti-cheat constraints

The helper must not:
- Inject DLLs.
- Hook DirectX, Vulkan or game render paths.
- Read or write game memory.
- Suspend, kill or modify anti-cheat services.
- Automate input.
- Modify game files.

## Future Tauri bridge

The React app should replace `runEngineCommand` with:

```ts
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('run_engine_command', {
  command,
  game,
})
```

The returned JSON should match the current `EngineResult` type.

### network_truth

Purpose:
- Measure idle latency, loaded latency, jitter and packet loss.
- Diagnose bufferbloat or route instability before recommending route boosters.

### memory_stutter_test

Purpose:
- Measure RAM pressure, commit, hard faults and standby pressure.
- Recommend memory cleanup only when evidence supports it.

### frametime_doctor

Purpose:
- Detect false high FPS, p99 spikes, frame pacing issues and tearing risk.
- Recommend FPS cap, VRR path or retest without applying changes.

### input_path_audit

Purpose:
- Audit mouse polling, Raw Input Buffer guidance, overlays, GameDVR and USB power warnings.
- Especially important for Valorant users reporting high FPS but bad input feel.

### bottleneck_classifier

Purpose:
- Classify likely cause: CPU, GPU, memory, network or display pacing.
- Must return evidence and the next test to run.

### game_smoothness_lab

Purpose:
- Return game-specific test matrix:
  - Valorant: Raw Input Buffer, overlay, GameDVR, Reflex/Anti-Lag guidance.
  - CS2: FPS cap matrix, VRR path, present mode, affinity as Advanced only.
  - Fortnite: DX12 vs Performance Mode, shader cache, frame generation warning.
