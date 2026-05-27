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

  const result = await invoke<EngineResult>('run_engine_command', {
    request: { command, game },
  })

  if (!result || result.status === 'error') {
    throw new Error(result?.message || `Command ${command} failed`)
  }

  return result
}
