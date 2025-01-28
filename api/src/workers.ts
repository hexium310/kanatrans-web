import { WASI } from '@cloudflare/workers-wasi';

// biome-ignore lint/suspicious/noEmptyInterface:
export interface Env {}

export const workers = (wasmModule: WebAssembly.Module) => {
  return {
    async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
      const stdout = new TransformStream<Uint8Array, Uint8Array>();
      const stderr = new TransformStream<Uint8Array, Uint8Array>();
      const wasi = new WASI({
        args: [request.url],
        stdin: request.body,
        stdout: stdout.writable,
        stderr: stderr.writable,
      });

      const instance = new WebAssembly.Instance(wasmModule, {
        // biome-ignore lint/style/useNamingConvention:
        wasi_snapshot_preview1: wasi.wasiImport,
      });

      ctx.waitUntil(wasi.start(instance));

      const [result, error] = await Promise.all([
        stdout.readable.getReader().read(),
        stderr.readable.getReader().read(),
      ]);

      if (error.value.byteLength > 0) {
        const message = new TextDecoder().decode(error.value);

        return Response.json({ error: { message } }, { status: 500 });
      }

      try {
        const response = JSON.parse(new TextDecoder().decode(result?.value));

        return Response.json(response, { status: response.error?.status ?? 200 });
      } catch (_e) {
        return Response.json({ error: { message: 'Failed to parse result as JSON' } }, { status: 500 });
      }
    },
  };
};
