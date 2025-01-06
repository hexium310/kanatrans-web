import wasmModule from 'kanatrans-wasm/debug/kanatrans-wasm.wasm';

import { workers } from './workers';

export default workers(wasmModule);
