import { invoke } from '@tauri-apps/api/core'
import { runEngineCommand as runMockEngineCommand } from './engine'
import type { EngineCommand, EngineResult } from './engine'
import type { GameKey } from './data'

function isTauriRuntime() {
  return '__TAURI_INTERNALS__' in window
}

export async function runEngineCommand(
  command: EngineCommand,
  game: GameKey,
): Promise<EngineResult> {
  if (!isTauriRuntime()) {
    return runMockEngineCommand(command, game)
  }

  try {
    return await invoke<EngineResult>('run_engine_command', {
      request: { command, game },
    })
  } catch (error) {
    console.warn('DTHBoost helper unavailable, using mock engine', error)
    return runMockEngineCommand(command, game)
  }
}
