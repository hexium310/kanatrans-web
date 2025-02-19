import { WASI } from '@cloudflare/workers-wasi';
import { ProblemDocument } from 'http-problem-details';
import type { ProblemDocumentOptions } from 'http-problem-details/dist/ProblemDocument';

// biome-ignore lint/suspicious/noEmptyInterface:
export interface Env {}

export const workers = (wasmModule: WebAssembly.Module) => {
  return {
    async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
      const stdout = new TransformStream<Uint8Array, Uint8Array>();
      const stderr = new TransformStream<Uint8Array, Uint8Array>();
      const wasi = new WASI({
        args: ['', request.url],
        stdin: request.body,
        stdout: stdout.writable,
        stderr: stderr.writable,
      });

      const instance = new WebAssembly.Instance(wasmModule, {
        // biome-ignore lint/style/useNamingConvention:
        wasi_snapshot_preview1: wasi.wasiImport,
      });

      ctx.waitUntil(wasi.start(instance));

      const [wasiOutput, wasiError] = await Promise.all([
        stdout.readable.getReader().read(),
        stderr.readable.getReader().read(),
      ]);

      if (wasiError.value.byteLength > 0) {
        const message = new TextDecoder().decode(wasiError.value);

        return responseFromProblemDetails({
          status: 500,
          detail: message,
        });
      }

      try {
        const wasiResponse = new TextDecoder().decode(wasiOutput?.value).split('\n');
        const status = Number.parseInt(wasiResponse[0], 10);
        const body = JSON.parse(wasiResponse[1]);

        if (Object.hasOwn(body, 'status')) {
          return responseFromProblemDetails(body);
        }

        return Response.json(body, { status });
      } catch (e) {
        return responseFromProblemDetails({
          status: 500,
          detail: e instanceof SyntaxError ? e.message : 'Unexpected error',
        });
      }
    },
  };
};

function responseFromProblemDetails(fields: ProblemDocumentOptions): Response {
  const problemDocument = new ProblemDocument(fields);

  const status = problemDocument.status;
  const headers = new Headers();
  headers.append('Content-Type', 'application/problem+json');

  return Response.json(problemDocument, { status, headers });
}
