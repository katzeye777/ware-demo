'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Palette,
  ShoppingCart,
  ChevronDown,
  Package,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const { user, logout, isDemoMode } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);

  const navLinks = [
    { href: '/design', label: 'Design' },
    { href: '/vision-board', label: 'Vision Board' },
    { href: '/library', label: 'My Glazes' },
    { href: '/waitlist', label: 'Join Waitlist' },
    { href: '/help', label: 'Help' },
  ];

  const accountMenuItems = [
    { href: '/library', label: 'My Glazes', icon: Palette },
    { href: '/orders', label: 'Order History', icon: Package },
    { href: '/profile', label: 'Account Settings', icon: Settings },
    { href: '/help', label: 'Help Center', icon: HelpCircle },
  ];

  const isActive = (href: string) => pathname === href;

  // Build initials from user name
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const firstName = user?.name?.split(' ')[0] || 'Account';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Ware" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-600'
                    : 'text-clay-700 hover:text-brand-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + CTA + Account - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative text-clay-700 hover:text-brand-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link href="/design" className="btn-primary text-sm">
              Start Designing
            </Link>

            {/* User Account Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center space-x-2 text-clay-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">{firstName}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      accountOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAccountOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-clay-200 rounded-lg shadow-lg z-20 py-1">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-clay-100">
                        <p className="text-sm font-semibold text-clay-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-clay-500">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {accountMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-clay-700 hover:bg-clay-50 hover:text-brand-600 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-clay-100 py-1">
                        <button
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-clay-500 hover:bg-clay-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-clay-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-clay-200 pt-4">
            <div className="flex flex-col space-y-4">
              {/* User info - mobile */}
              {user && (
                <div className="flex items-center space-x-3 pb-4 border-b border-clay-200">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-clay-900 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-clay-500">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Account links - mobile */}
              {user && (
                <>
                  {accountMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-medium text-clay-700 flex items-center space-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-clay-200 pt-4" />
                </>
              )}

              {/* Main nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium ${
                    isActive(link.href) ? 'text-brand-600' : 'text-clay-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                className="font-medium text-clay-700 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  Cart{cartItems.length > 0 ? ` (${cartItems.length})` : ''}
                </span>
              </Link>
              <div className="border-t border-clay-200 pt-4">
                <Link
                  href="/design"
                  className="btn-primary text-center block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Designing
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
