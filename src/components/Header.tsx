'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isDemoMode } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/design', label: 'Design' },
    { href: '/vision-board', label: 'Vision Board' },
    { href: '/waitlist', label: 'Join Waitlist' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-brand-600">
            <Palette className="w-8 h-8" />
            <span className="text-2xl font-bold">Ware</span>
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

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
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
