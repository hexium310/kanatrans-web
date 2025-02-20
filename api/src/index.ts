import wasmModule from 'kanatrans-wasm/kanatrans-wasm.wasm';

import { worker } from '@/worker';

// biome-ignore lint/style/noDefaultExport:
export default worker(wasmModule);
