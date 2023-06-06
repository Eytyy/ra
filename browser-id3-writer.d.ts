declare module 'browser-id3-writer' {
  export class ID3Writer {
    constructor(buffer: ArrayBuffer);
    setFrame(frameId: string, value: string | string[]): ID3Writer;
    setFile(uint8Array: Uint8Array): void;
    addTag(): void;
    updateData(): Promise<void>;
    createBlob(): Promise<Blob>;
    getBlob(): Promise<Blob>;
  }
}
