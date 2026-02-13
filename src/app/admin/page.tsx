'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  ordersToday: number;
  pendingQC: number;
  readyToBatch: number;
  shippedToday: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    ordersToday: 0,
    pendingQC: 0,
    readyToBatch: 0,
    shippedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('http://localhost:8000/api/manufacturing/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Mock data for development
        setStats({
          ordersToday: 12,
          pendingQC: 3,
          readyToBatch: 5,
          shippedToday: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Orders Today',
      value: stats.ordersToday,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: 'Pending QC',
      value: stats.pendingQC,
      icon: '🔬',
      color: 'bg-yellow-500',
      link: '/admin/qc',
    },
    {
      title: 'Ready to Batch',
      value: stats.readyToBatch,
      icon: '🏭',
      color: 'bg-purple-500',
      link: '/admin/queue?status=ready_to_batch',
    },
    {
      title: 'Shipped Today',
      value: stats.shippedToday,
      icon: '✅',
      color: 'bg-green-500',
      link: '/admin/queue?status=shipped',
    },
  ];

  const quickLinks = [
    { href: '/admin/queue?status=pending_qc', label: 'Review Pending QC', icon: '🔬' },
    { href: '/admin/queue?status=ready_to_batch', label: 'Start Batching', icon: '⚖️' },
    { href: '/admin/queue?status=batched', label: 'Print Labels', icon: '🏷️' },
    { href: '/admin/queue?status=labeled', label: 'Ship Orders', icon: '📮' },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manufacturing Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of production pipeline status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium text-gray-900">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-gray-600 text-center py-8">
          <p>Activity feed coming soon...</p>
        </div>
      </div>
    </div>
  );
}
