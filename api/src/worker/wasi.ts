import { WASI } from '@cloudflare/workers-wasi';

import type { OutputStream } from '@/types/output';
import type { Env } from '@/types/workers';

export const execWasi = (
  request: Request,
  _env: Env,
  ctx: ExecutionContext,
  wasmModule: WebAssembly.Module,
): OutputStream[] => {
  const stdout = new TransformStream<Uint8Array, Uint8Array>();
  const stderr = new TransformStream<Uint8Array, Uint8Array>();
  const wasi = new WASI({
    args: ['', '--rest', request.url],
    stdin: request.body,
    stdout: stdout.writable,
    stderr: stderr.writable,
  });

  const instance = new WebAssembly.Instance(wasmModule, {
    // biome-ignore lint/style/useNamingConvention:
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  ctx.waitUntil(wasi.start(instance));

  return [stdout, stderr];
};
