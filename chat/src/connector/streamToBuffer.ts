export default async function streamToBuffer(
  readableStream: NodeJS.ReadableStream | undefined
): Promise<Buffer> {
  if (!readableStream) return Buffer.alloc(0);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (data) => {
      chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
    });
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", reject);
  });
}
