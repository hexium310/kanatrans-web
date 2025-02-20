import wasmModule from 'kanatrans-wasm/debug/kanatrans-wasm.wasm';

import { worker } from '@/worker';

// biome-ignore lint/style/noDefaultExport:
export default worker(wasmModule);
