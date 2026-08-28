import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useCreateProduct } from '../../hooks/useProducts';
import { validateImageFile, uploadProductImage, runWithConcurrency } from '../../lib/uploadImage';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MAX_FILES = 30;
const CONCURRENCY = 3;

type FileStatus = 'pending' | 'uploading' | 'done' | 'error';

interface BatchFile {
  id: string;
  file: File;
  preview: string;
  status: FileStatus;
  error?: string;
}

export default function BatchUploadModal({ open, onClose }: Props) {
  const create = useCreateProduct();

  const [files, setFiles] = useState<BatchFile[]>([]);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectError, setSelectError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const successCount = files.filter(f => f.status === 'done').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  function reset() {
    setFiles(prev => {
      prev.forEach(f => URL.revokeObjectURL(f.preview));
      return [];
    });
    setLabel(''); setPrice(''); setDescription(''); setCategory('');
    setSelectError(null);
    setRunning(false);
    setDone(false);
  }

  function handleClose() {
    if (running) return;
    reset();
    onClose();
  }

  function addFiles(fileList: FileList | File[]) {
    setSelectError(null);
    const incoming = Array.from(fileList);
    const room = MAX_FILES - files.length;

    if (incoming.length > room) {
      setSelectError(`You can batch up to ${MAX_FILES} images at a time — only added the first ${Math.max(room, 0)}.`);
    }

    const accepted: BatchFile[] = [];
    for (const file of incoming.slice(0, room)) {
      const err = validateImageFile(file);
      if (err) {
        setSelectError(prev => prev ?? `${file.name}: ${err}`);
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      });
    }
    setFiles(prev => [...prev, ...accepted]);
  }

  function removeFile(id: string) {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(f => f.id !== id);
    });
  }

  async function handleUploadAll() {
    setRunning(true);
    setDone(false);

    await runWithConcurrency(
      files.filter(f => f.status !== 'done'),
      async bf => {
        setFiles(prev => prev.map(f => (f.id === bf.id ? { ...f, status: 'uploading', error: undefined } : f)));
        try {
          const imageUrl = await uploadProductImage(bf.file);
          await create.mutateAsync({
            image_url: imageUrl,
            label: label.trim() || null,
            price: price.trim() ? Number(price) : null,
            description: description.trim() || null,
            category: category.trim() || null,
          });
          setFiles(prev => prev.map(f => (f.id === bf.id ? { ...f, status: 'done' } : f)));
        } catch (err) {
          setFiles(prev =>
            prev.map(f =>
              f.id === bf.id
                ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' }
                : f
            )
          );
        }
      },
      CONCURRENCY
    );

    setRunning(false);
    setDone(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed z-50 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-6 sm:w-full sm:max-w-2xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[92vh]"
            role="dialog" aria-modal="true" aria-label="Batch upload products"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Batch Upload</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={running}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-30"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Drop zone */}
              <div>
                <div
                  onClick={() => !running && fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); if (!running) addFiles(e.dataTransfer.files); }}
                  className={`border-2 border-dashed border-gray-200 rounded-lg transition-colors ${
                    running ? '' : 'cursor-pointer hover:border-gray-400'
                  }`}
                  style={{ minHeight: 110 }}
                >
                  <div className="flex flex-col items-center justify-center h-28 gap-1.5 text-gray-400">
                    <Upload size={24} />
                    <span className="text-sm">Click or drag up to {MAX_FILES} images</span>
                    <span className="text-xs">JPG, PNG, WebP — max 5 MB each</span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
                  />
                </div>
                {selectError && <p className="mt-1 text-xs text-red-500">{selectError}</p>}
              </div>

              {/* Thumbnail grid */}
              {files.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {files.length} image{files.length === 1 ? '' : 's'} selected
                    {done && ` — ${successCount} uploaded${errorCount ? `, ${errorCount} failed` : ''}`}
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {files.map(f => (
                      <div key={f.id} className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1' }}>
                        <img src={f.preview} alt="" className="w-full h-full object-cover" />
                        {!running && f.status !== 'done' && (
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
                            aria-label="Remove image"
                          >
                            <X size={12} />
                          </button>
                        )}
                        {f.status === 'uploading' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 size={18} className="text-white animate-spin" />
                          </div>
                        )}
                        {f.status === 'done' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Check size={18} className="text-white" />
                          </div>
                        )}
                        {f.status === 'error' && (
                          <div
                            className="absolute inset-0 bg-red-600/50 flex items-center justify-center"
                            title={f.error}
                          >
                            <AlertCircle size={18} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared metadata */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="batch-label" className="block text-sm font-medium text-gray-700 mb-1">
                    Label <span className="text-gray-400 font-normal">(optional, applied to all)</span>
                  </label>
                  <input
                    id="batch-label" type="text" value={label} onChange={e => setLabel(e.target.value)}
                    placeholder="e.g. New Arrivals"
                    disabled={running}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="batch-price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-gray-400 font-normal">(optional, applied to all)</span>
                  </label>
                  <input
                    id="batch-price" type="number" min="0" step="0.01" value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00"
                    disabled={running}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="batch-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-gray-400 font-normal">(optional, applied to all)</span>
                  </label>
                  <input
                    id="batch-category" type="text" value={category} onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Sarees"
                    disabled={running}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="batch-desc" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400 font-normal">(optional, applied to all)</span>
                  </label>
                  <input
                    id="batch-desc" type="text" value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Product description..."
                    disabled={running}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                Each image becomes its own product. Fields above apply to every image in this batch — edit individual products afterward if they need different details.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  type="button" onClick={handleClose} disabled={running}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-40"
                >
                  {done ? 'Close' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleUploadAll}
                  disabled={running || files.length === 0 || (done && errorCount === 0)}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {running
                    ? `Uploading... (${successCount + errorCount}/${files.length})`
                    : done
                    ? errorCount > 0
                      ? `Retry ${errorCount} Failed`
                      : 'All Uploaded'
                    : `Upload All (${files.length})`}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
