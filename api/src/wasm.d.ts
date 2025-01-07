declare module '*.wasm' {
  // biome-ignore lint/style/noDefaultExport:
  export default WebAssembly.Module;
}
