import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, Check, Loader2 } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { validateImageFile, uploadProductImage } from '../../lib/uploadImage';
import { generateImageVariants, blobToFile, type ImageVariant } from '../../lib/imageAugment';
import LabelSelect from './LabelSelect';
import type { DbProduct } from '../../types';

interface Props {
  open: boolean;
  product?: DbProduct | null;
  onClose: () => void;
}

interface GeneratedVariant extends ImageVariant {
  selected: boolean;
}

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

  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [generated, setGenerated] = useState<GeneratedVariant[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    if (open && product) {
      setLabel(product.label ?? '');
      setPrice(product.price != null ? String(product.price) : '');
      setDescription(product.description ?? '');
      setCategory(product.category ?? '');
      setImagePreview(product.image_url);
      setExistingGallery(product.gallery_urls ?? []);
    } else if (open && !product) {
      setLabel(''); setPrice(''); setDescription(''); setCategory('');
      setImageFile(null); setImagePreview(null);
      setExistingGallery([]);
    }
    clearGenerated();
    setUploadError(null);
    setGenError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  function clearGenerated() {
    setGenerated(prev => {
      prev.forEach(v => URL.revokeObjectURL(v.previewUrl));
      return [];
    });
  }

  function handleFile(file: File) {
    setUploadError(null);
    const err = validateImageFile(file);
    if (err) {
      setUploadError(err);
      return;
    }
    clearGenerated();
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGenerateViews() {
    if (!imageFile) return;
    setGenError(null);
    setGenerating(true);
    try {
      const variants = await generateImageVariants(imageFile);
      setGenerated(variants.map(v => ({ ...v, selected: false })));
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate views');
    } finally {
      setGenerating(false);
    }
  }

  function toggleVariant(key: string) {
    setGenerated(prev => prev.map(v => (v.key === key ? { ...v, selected: !v.selected } : v)));
  }

  function removeExistingGalleryImage(url: string) {
    setExistingGallery(prev => prev.filter(u => u !== url));
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
        imageUrl = await uploadProductImage(imageFile);
      }

      const selectedVariants = generated.filter(v => v.selected);
      const uploadedVariantUrls = await Promise.all(
        selectedVariants.map(v =>
          uploadProductImage(blobToFile(v.blob, `${v.key}-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`))
        )
      );

      const body = {
        image_url: imageUrl,
        gallery_urls: [...existingGallery, ...uploadedVariantUrls],
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

              {/* Generate more views */}
              {imageFile && (
                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/60">
                  <button
                    type="button"
                    onClick={handleGenerateViews}
                    disabled={generating}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer disabled:opacity-50"
                  >
                    {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {generating ? 'Generating...' : 'Generate More Views'}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">
                    Free, local variants from this photo (mirrored, detail zoom, brightened) — not new camera angles.
                  </p>
                  {genError && <p className="mt-1 text-xs text-red-500">{genError}</p>}

                  {generated.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Select which to include with this listing:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {generated.map(v => (
                          <button
                            key={v.key}
                            type="button"
                            onClick={() => toggleVariant(v.key)}
                            className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                            style={{ aspectRatio: '1/1' }}
                          >
                            <img src={v.previewUrl} alt={v.label} className="w-full h-full object-cover" />
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-colors ${
                                v.selected ? 'bg-indigo-600/40' : 'bg-black/0 hover:bg-black/20'
                              }`}
                            >
                              {v.selected && (
                                <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                  <Check size={14} className="text-white" />
                                </span>
                              )}
                            </div>
                            <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/50 rounded px-1 py-0.5 text-center truncate">
                              {v.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Existing gallery images (edit mode) */}
              {existingGallery.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Photos</label>
                  <div className="grid grid-cols-4 gap-2">
                    {existingGallery.map(url => (
                      <div key={url} className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(url)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
                          aria-label="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Label <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <LabelSelect id="label" value={label} onChange={setLabel} disabled={isPending} />
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
