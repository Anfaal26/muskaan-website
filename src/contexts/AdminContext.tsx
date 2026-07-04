import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AdminState {
  isAdmin: boolean;
  username: string | null;
  loading: boolean;
  /** Call after successful login to update state without re-fetch */
  setAdmin: (username: string) => void;
  /** Call after logout to clear state */
  clearAdmin: () => void;
}

const AdminContext = createContext<AdminState>({
  isAdmin: false,
  username: null,
  loading: true,
  setAdmin: () => null,
  clearAdmin: () => null,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Server-side check: reads the httpOnly cookie — JS cannot access it directly
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then((data: { username?: string } | null) => {
        if (data?.username) {
          setIsAdmin(true);
          setUsername(data.username);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  function setAdmin(u: string) {
    setIsAdmin(true);
    setUsername(u);
  }

  function clearAdmin() {
    setIsAdmin(false);
    setUsername(null);
  }

  return (
    <AdminContext.Provider value={{ isAdmin, username, loading, setAdmin, clearAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}
