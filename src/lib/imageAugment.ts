export interface ImageVariant {
  key: string;
  label: string;
  blob: Blob;
  previewUrl: string;
}

function loadImage(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, objectUrl });
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      mimeType,
      0.92
    );
  });
}

function mirror(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function detailZoom(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const { naturalWidth: w, naturalHeight: h } = img;
  const cropW = w * 0.6;
  const cropH = h * 0.6;
  const sx = (w - cropW) / 2;
  const sy = (h - cropH) / 2;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, w, h);
  return canvas;
}

function brightened(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.filter = 'brightness(1.08) contrast(1.04) saturate(1.06)';
  ctx.drawImage(img, 0, 0);
  return canvas;
}

const GENERATORS: { key: string; label: string; run: (img: HTMLImageElement) => HTMLCanvasElement }[] = [
  { key: 'mirror', label: 'Mirrored', run: mirror },
  { key: 'detail', label: 'Detail Zoom', run: detailZoom },
  { key: 'bright', label: 'Brightened', run: brightened },
];

/**
 * Generates simple derivative views from a single product photo entirely in the
 * browser (mirror, a zoomed detail crop, a brightened variant) — no AI model,
 * no external API. These are visual variety, not new camera angles.
 */
export async function generateImageVariants(file: File): Promise<ImageVariant[]> {
  const { img, objectUrl } = await loadImage(file);
  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  try {
    const variants = await Promise.all(
      GENERATORS.map(async g => {
        const canvas = g.run(img);
        const blob = await canvasToBlob(canvas, mimeType);
        return { key: g.key, label: g.label, blob, previewUrl: URL.createObjectURL(blob) };
      })
    );
    return variants;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, { type: blob.type });
}
