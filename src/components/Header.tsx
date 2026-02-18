'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const { user, isDemoMode } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);

  const navLinks = [
    { href: '/design', label: 'Design' },
    { href: '/vision-board', label: 'Vision Board' },
    { href: '/library', label: 'My Glazes' },
    { href: '/waitlist', label: 'Join Waitlist' },
    { href: '/help', label: 'Help' },
  ];

  const isActive = (href: string) => pathname === href;

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

          {/* Cart + CTA - Desktop */}
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-clay-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-clay-200 pt-4">
            <div className="flex flex-col space-y-4">
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
                <span>Cart{cartItems.length > 0 ? ` (${cartItems.length})` : ''}</span>
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
