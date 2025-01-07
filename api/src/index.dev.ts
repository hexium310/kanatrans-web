import wasmModule from 'kanatrans-wasm/debug/kanatrans-wasm.wasm';

import { workers } from './workers';

// biome-ignore lint/style/noDefaultExport:
export default workers(wasmModule);
