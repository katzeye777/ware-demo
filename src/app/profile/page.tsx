'use client';

import { useAuth } from '@/lib/auth';
import { User, Mail, MapPin, Bell, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-clay-900 mb-8">
        Account Settings
      </h1>

      {/* Profile Info */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-clay-900">
              {user?.name || 'User'}
            </h2>
            <p className="text-clay-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-clay-100">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-clay-400" />
              <div>
                <p className="text-sm font-medium text-clay-900">Full Name</p>
                <p className="text-sm text-clay-500">{user?.name}</p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-clay-100">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-clay-400" />
              <div>
                <p className="text-sm font-medium text-clay-900">Email</p>
                <p className="text-sm text-clay-500">{user?.email}</p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-clay-100">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-clay-400" />
              <div>
                <p className="text-sm font-medium text-clay-900">
                  Shipping Address
                </p>
                <p className="text-sm text-clay-500">No address on file</p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Add
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-clay-100">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-clay-400" />
              <div>
                <p className="text-sm font-medium text-clay-900">
                  Notifications
                </p>
                <p className="text-sm text-clay-500">
                  Email updates for orders and new glazes
                </p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-clay-400" />
              <div>
                <p className="text-sm font-medium text-clay-900">Password</p>
                <p className="text-sm text-clay-500">Last changed: Never</p>
              </div>
            </div>
            <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/orders"
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          View Order History
        </Link>
        <Link
          href="/help"
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          Help Center
        </Link>
      </div>
    </div>
  );
}
