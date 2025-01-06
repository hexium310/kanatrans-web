import wasmModule from 'kanatrans-wasm/kanatrans-wasm.wasm';

import { workers } from './workers';

export default workers(wasmModule);
