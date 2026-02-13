'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Palette } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsConsent: false,
    marketingConsent: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.termsConsent) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        terms_consent: formData.termsConsent,
        marketing_consent: formData.marketingConsent,
      });
      router.push('/design');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-brand-600">
            <Palette className="w-10 h-10" />
            <span className="text-3xl font-bold">Ware</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-clay-900">
            Create your account
          </h1>
          <p className="mt-2 text-clay-600">
            Start designing custom glazes today
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-clay-700 mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-clay-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-clay-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-clay-500">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-clay-700 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="termsConsent"
                  name="termsConsent"
                  type="checkbox"
                  required
                  checked={formData.termsConsent}
                  onChange={handleChange}
                  className="h-4 w-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-clay-300 rounded"
                />
                <label htmlFor="termsConsent" className="ml-2 block text-sm text-clay-700">
                  I agree to the{' '}
                  <a href="#" className="text-brand-600 hover:text-brand-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-brand-600 hover:text-brand-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="marketingConsent"
                  name="marketingConsent"
                  type="checkbox"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  className="h-4 w-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-clay-300 rounded"
                />
                <label htmlFor="marketingConsent" className="ml-2 block text-sm text-clay-700">
                  Send me updates about new features and glazes (optional)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-clay-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
