import type { Env } from '@/types/workers';
import { buildResponse } from './response';
import { execWasi } from './wasi';

export const worker = (wasmModule: WebAssembly.Module) => {
  return {
    async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
      const outputs = execWasi(request, _env, ctx, wasmModule);

      const [wasiOutput, error] = await Promise.all(outputs.map((v) => v.readable.getReader().read()));

      return buildResponse(wasiOutput, error);
    },
  };
};
