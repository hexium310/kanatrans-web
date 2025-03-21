import { WorkerEntrypoint } from 'cloudflare:workers';

import type { Env } from '@/types/workers';
import { buildResponse } from './response';
import { execWasi } from './wasi';

type WorkerEntrypointConstructorParameters = ConstructorParameters<typeof WorkerEntrypoint>;

class KanatransWorkerEntrypoint extends WorkerEntrypoint<Env> {
  protected wasmModule: WebAssembly.Module;

  constructor(wasmModule: WebAssembly.Module, ...args: WorkerEntrypointConstructorParameters) {
    super(...args);

    this.wasmModule = wasmModule;
  }

  async katakana(word: string) {
    const outputs = execWasi({ args: ['', '--rpc', word] }, this.env, this.ctx, this.wasmModule);

    const [output, error] = await Promise.all(outputs.map((v) => v.readable.getReader().read()));

    if (error.value.byteLength > 0) {
      const message = new TextDecoder().decode(error.value);

      return message;
    }

    const wasiResponse = new TextDecoder().decode(output?.value);

    return wasiResponse;
  }
}

export const worker = (wasmModule: WebAssembly.Module): [ExportedHandler<Env>, typeof WorkerEntrypoint<Env>] => {
  return [
    {
      async fetch(request, _env, ctx): Promise<Response> {
        const outputs = execWasi(
          {
            args: ['', '--rest', request.url],
            stdin: request.body,
          },
          _env,
          ctx,
          wasmModule,
        );

        const [wasiOutput, error] = await Promise.all(outputs.map((v) => v.readable.getReader().read()));

        return buildResponse(wasiOutput, error);
      },
    },
    class extends WorkerEntrypoint<Env> {
      constructor(...args: WorkerEntrypointConstructorParameters) {
        super(...args);

        // biome-ignore lint/correctness/noConstructorReturn:
        return new KanatransWorkerEntrypoint(wasmModule, ...args);
      }
    },
  ];
};
