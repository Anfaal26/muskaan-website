import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, DollarSign, Plus } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useProducts';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductModal from '../../components/admin/ProductModal';
import type { DashboardStats, DbProduct } from '../../types';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();
  const [showModal, setShowModal] = useState(false);
  const stats = data as DashboardStats | undefined;

  const statCards = [
    { label: 'Total Products', value: stats?.total ?? 0, icon: Package, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'No Price Set', value: stats?.noPrice ?? 0, icon: DollarSign, color: 'bg-amber-50 text-amber-700' },
    { label: 'No Label Set', value: stats?.noLabel ?? 0, icon: Tag, color: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      action={
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
        >
          <Plus size={16} />
          Upload New Product
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent products */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Recently Added</h2>
              <Link to="/admin/products" className="text-xs text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
            <ul>
              {(stats?.recent ?? []).map((p: DbProduct) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <img
                    src={p.image_url}
                    alt={p.label ?? 'Product'}
                    className="w-12 h-12 object-cover rounded-lg shrink-0 bg-gray-100"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {p.label ?? <span className="text-gray-400 italic">No label</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.price != null ? `৳${p.price}` : 'No price'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
              {(stats?.recent ?? []).length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-gray-400">
                  No products yet. Upload your first one!
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <ProductModal open={showModal} onClose={() => setShowModal(false)} />
    </AdminLayout>
  );
}
