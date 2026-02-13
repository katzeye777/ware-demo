'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user role - replace with actual auth check
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual auth API call
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const userData = await response.json();
        if (userData.role !== 'staff' && userData.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(userData);
      } catch (error) {
        // For development, allow access
        console.warn('Auth check failed, allowing access for development');
        setUser({ role: 'admin' });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/queue', label: 'Manufacturing Queue', icon: '🏭' },
    { href: '/admin/qc', label: 'QC Review', icon: '🔬' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Ware Manufacturing</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            Logged in as <span className="text-white font-medium">{user?.role || 'Admin'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
