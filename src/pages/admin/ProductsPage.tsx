import { useState } from 'react';
import { MoreVertical, Plus, Trash2, Pencil } from 'lucide-react';
import { useAdminProducts, useDeleteProduct } from '../../hooks/useProducts';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductModal from '../../components/admin/ProductModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import type { DbProduct } from '../../types';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts(page);
  const deleteProduct = useDeleteProduct();

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<DbProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Multi-select
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.ceil(total / pageSize);

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    await deleteProduct.mutateAsync(id);
    setDeleteId(null);
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  async function handleBulkDelete() {
    await Promise.all([...selected].map(id => deleteProduct.mutateAsync(id)));
    setSelected(new Set());
    setSelectMode(false);
    setBulkDeleteOpen(false);
  }

  return (
    <AdminLayout
      title="Products"
      action={
        <div className="flex items-center gap-2">
          {selectMode && selected.size > 0 && (
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
            >
              <Trash2 size={15} />
              Delete ({selected.size})
            </button>
          )}
          <button
            type="button"
            onClick={() => { setSelectMode(m => !m); setSelected(new Set()); }}
            className={`px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              selectMode
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {selectMode ? 'Cancel Select' : 'Select'}
          </button>
          <button
            type="button"
            onClick={() => { setEditProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
          >
            <Plus size={16} />
            Upload New
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_60px_1fr_1fr_auto] items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {selectMode && <span>#</span>}
            <span>No.</span>
            <span>Image</span>
            <span>Label</span>
            <span>Price</span>
            <span />
          </div>

          {products.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No products found. Upload your first product!
            </div>
          )}

          {products.map((p, i) => (
            <div
              key={p.id}
              className={`grid items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                selectMode
                  ? 'grid-cols-[24px_auto_60px_1fr_1fr_auto]'
                  : 'grid-cols-[auto_60px_1fr_1fr_auto]'
              } ${selected.has(p.id) ? 'bg-indigo-50' : ''}`}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                  aria-label={`Select ${p.label ?? 'product'}`}
                />
              )}

              <span className="text-xs text-gray-400 font-mono">
                {(page - 1) * pageSize + i + 1}
              </span>

              <img
                src={p.image_url}
                alt={p.label ?? 'Product'}
                className="w-14 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                loading="lazy"
              />

              <span className="text-sm text-gray-900 truncate">
                {p.label ?? <span className="text-gray-400 italic">Latest Collection</span>}
              </span>

              <span className="text-sm text-gray-600 font-mono">
                {p.price != null ? `৳${p.price}` : <span className="text-gray-400 italic">No price</span>}
              </span>

              {/* Three-dot menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
                  aria-label="Options"
                >
                  <MoreVertical size={16} />
                </button>

                {openMenu === p.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 text-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => { setEditProduct(p); setShowModal(true); setOpenMenu(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeleteId(p.id); setOpenMenu(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {total} products — Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add modal */}
      <ProductModal
        open={showModal}
        product={editProduct}
        onClose={() => { setShowModal(false); setEditProduct(null); }}
      />

      {/* Single delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to delete this product? This cannot be undone."
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteProduct.isPending}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Delete ${selected.size} products?`}
        message="This will permanently delete all selected products and their images. This cannot be undone."
        confirmLabel={`Delete ${selected.size}`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
        loading={deleteProduct.isPending}
      />
    </AdminLayout>
  );
}
