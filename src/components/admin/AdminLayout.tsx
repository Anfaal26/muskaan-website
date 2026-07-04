import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Menu, X } from 'lucide-react';
import { useAdminContext } from '../../contexts/AdminContext';

interface Props {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminLayout({ children, title, action }: Props) {
  const { username, clearAdmin } = useAdminContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => null);
    clearAdmin();
    navigate('/');
  }

  const navItems = (
    <nav className="flex flex-col gap-1 flex-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 p-4 min-h-screen">
        <div className="mb-8 px-1">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Muskaan Admin</span>
          {username && <p className="text-sm text-gray-600 mt-1 truncate">{username}</p>}
        </div>
        {navItems}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-60 bg-white border-r border-gray-200 p-4 flex flex-col transition-transform duration-250 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Muskaan Admin</span>
          <button type="button" onClick={() => setSidebarOpen(false)} className="p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        {navItems}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex-1">{title}</h1>
          {action}
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
