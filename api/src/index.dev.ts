import wasmModule from 'kanatrans-wasm/debug/kanatrans-wasm.wasm';

import { worker } from '@/worker';

const [handler, KanatransWorkerEntrypoint] = worker(wasmModule);

export { KanatransWorkerEntrypoint };

export default handler;
