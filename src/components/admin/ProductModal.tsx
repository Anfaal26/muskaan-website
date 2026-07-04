import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import type { DbProduct } from '../../types';

interface Props {
  open: boolean;
  product?: DbProduct | null;
  onClose: () => void;
}

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ProductModal({ open, product, onClose }: Props) {
  const isEdit = !!product;
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const isPending = create.isPending || update.isPending;

  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && product) {
      setLabel(product.label ?? '');
      setPrice(product.price != null ? String(product.price) : '');
      setDescription(product.description ?? '');
      setCategory(product.category ?? '');
      setImagePreview(product.image_url);
    } else if (open && !product) {
      setLabel(''); setPrice(''); setDescription(''); setCategory('');
      setImageFile(null); setImagePreview(null);
    }
    setUploadError(null);
  }, [open, product]);

  function handleFile(file: File) {
    setUploadError(null);
    if (!ALLOWED.includes(file.type)) {
      setUploadError('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType: file.type, fileName: file.name }),
        });
        if (!res.ok) reject(new Error('Upload failed'));
        const data = (await res.json()) as { url: string };
        resolve(data.url);
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);

    if (!isEdit && !imageFile) {
      setUploadError('Please select an image.');
      return;
    }

    try {
      let imageUrl = product?.image_url ?? '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const body = {
        image_url: imageUrl,
        label: label.trim() || null,
        price: price.trim() ? Number(price) : null,
        description: description.trim() || null,
        category: category.trim() || null,
      };

      if (isEdit && product) {
        await update.mutateAsync({ id: product.id, ...body });
      } else {
        await create.mutateAsync(body);
      }
      onClose();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed z-50 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-10 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]"
            role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit product' : 'Add new product'}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit Product' : 'Upload New Product'}
              </h2>
              <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                  className="relative border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ minHeight: 140 }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                      <Upload size={28} />
                      <span className="text-sm">Click or drag to upload</span>
                      <span className="text-xs">JPG, PNG, WebP — max 5 MB</span>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>
                {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
              </div>

              {/* Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Label <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="label" type="text" value={label} onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. New Arrivals"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-gray-400 font-normal">(optional — leave blank to hide)</span>
                </label>
                <input
                  id="price" type="number" min="0" step="0.01" value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="desc" value={description} onChange={e => setDescription(e.target.value)}
                  rows={3} placeholder="Product description..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="category" type="text" value={category} onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. Ethnic Wear"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={isPending}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Upload Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
