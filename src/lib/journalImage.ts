const MAX_BYTES = 1024 * 1024;

export class JournalImageTooLargeError extends Error {
  constructor() {
    super('IMAGE_TOO_LARGE');
    this.name = 'JournalImageTooLargeError';
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * 演示用：本地 ObjectURL 预览 + base64 写入 `journal.pages[i].imageUrl`。
 * 大于 1MB 抛错（可提示用户压缩后再选）。
 */
export async function prepareJournalPageImage(file: File): Promise<{
  imageUrl: string;
  objectUrl: string;
  revokeObjectUrl: () => void;
}> {
  if (file.size > MAX_BYTES) {
    throw new JournalImageTooLargeError();
  }
  const objectUrl = URL.createObjectURL(file);
  const imageUrl = await readFileAsDataUrl(file);
  return {
    imageUrl,
    objectUrl,
    revokeObjectUrl: () => URL.revokeObjectURL(objectUrl),
  };
}
