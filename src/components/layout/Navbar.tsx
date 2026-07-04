import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Shield, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAdminContext } from '../../contexts/AdminContext';

const navLinks = [
  { label: 'Products', to: '/shop' },
  { label: 'New Arrivals', to: '/shop/new-arrivals', gold: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  const itemCount = useCartStore(s => s.itemCount());
  const wishlistCount = useWishlistStore(s => s.items.length);
  const openCart = useCartStore(s => s.openDrawer);
  const navigate = useNavigate();
  const { isAdmin, username, clearAdmin } = useAdminContext();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    clearAdmin();
    setAdminMenuOpen(false);
    navigate('/');
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(249,247,244,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
          <Link to="/" aria-label="Muskaan Boutique — go to homepage" className="shrink-0">
            <img src="/logo.jpg" alt="Muskaan Boutique" className="h-10 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors duration-150 hover:text-[var(--color-gold)] ${
                    isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink)]'
                  } ${l.gold ? 'text-[var(--color-gold)] font-medium' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  key="search"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder="Search..."
                    className="w-full border-b border-[var(--color-ink)] bg-transparent text-sm py-1 px-1 focus:outline-none text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
                    aria-label="Search products"
                  />
                </motion.form>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchVal(''); }}
              className="p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? <X size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={18} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-gold)] text-[var(--color-ink)] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-gold)] text-[var(--color-ink)] text-[10px] font-bold flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Admin icon — shown only when logged in */}
            {isAdmin && (
              <div ref={adminMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(o => !o)}
                  className="p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
                  aria-label="Admin menu"
                  title={`Logged in as ${username ?? 'admin'}`}
                >
                  <Shield size={18} aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {adminMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-sm shadow-lg border overflow-hidden"
                      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setAdminMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors"
                      >
                        <LayoutDashboard size={14} aria-hidden="true" />
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                      >
                        <LogOut size={14} aria-hidden="true" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type="button"
              className="lg:hidden p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'var(--color-bg)' }}
          >
            <div className="flex flex-col h-full pt-24 px-8 gap-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 border-b border-[var(--color-border)] font-display text-3xl font-light text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              {isAdmin && (
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.07 }}>
                  <NavLink
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 border-b border-[var(--color-border)] font-display text-3xl font-light text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Admin
                  </NavLink>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex gap-4"
              >
                {[{ to: '/about', label: 'Our Story' }, { to: '/contact', label: 'Contact' }].map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" aria-hidden="true" />
    </>
  );
}
