export type OutputStream = TransformStream<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>;

export type OutputStreamReadResult = ReadableStreamReadResult<Uint8Array<ArrayBufferLike>>;
