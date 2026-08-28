export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Only JPG, PNG, or WebP images are allowed.';
  if (file.size > MAX_IMAGE_SIZE_BYTES) return 'Image must be under 5 MB.';
  return null;
}

/** Reads a File, uploads it to Supabase Storage via the admin API, and returns its public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType: file.type, fileName: file.name }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          reject(new Error((body as { error?: string }).error ?? 'Upload failed'));
          return;
        }
        const data = (await res.json()) as { url: string };
        resolve(data.url);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Upload failed'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/** Runs `worker` over `items` with at most `concurrency` running at once. */
export async function runWithConcurrency<T>(
  items: T[],
  worker: (item: T, index: number) => Promise<void>,
  concurrency: number
): Promise<void> {
  let next = 0;
  async function run(): Promise<void> {
    const i = next++;
    if (i >= items.length) return;
    await worker(items[i], i);
    return run();
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
}
