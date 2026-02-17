'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, SupportTicket } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { MessageCircle, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    order_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadTickets();
    }
  }, [user, authLoading, router]);

  const loadTickets = async () => {
    try {
      const data = await api.getUserTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const ticket = await api.createTicket({
        subject: newTicket.subject,
        message: newTicket.message,
        order_id: newTicket.order_id || undefined,
      });

      // Reset form and refresh tickets
      setNewTicket({ subject: '', message: '', order_id: '' });
      setShowNewTicketForm(false);
      loadTickets();

      // Navigate to the new ticket
      router.push(`/support/${ticket.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-clay-900 mb-2">Support</h1>
          <p className="text-clay-600">Get help with your orders and glazes</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-clay-900 mb-4">Create New Ticket</h2>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-clay-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="input-field"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-clay-700 mb-2">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={newTicket.order_id}
                onChange={(e) => setNewTicket({ ...newTicket, order_id: e.target.value })}
                className="input-field"
                placeholder="ORD-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-clay-700 mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                className="input-field resize-none"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewTicketForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-clay-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-clay-900 mb-2">
            No Support Tickets
          </h3>
          <p className="text-clay-600 mb-6">
            You haven't created any support tickets yet
          </p>
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Ticket</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/support/${ticket.id}`}>
              <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-clay-900">
                        {ticket.subject}
                      </h3>
                      <StatusBadge status={ticket.status} type="ticket" />
                    </div>

                    <div className="text-sm text-clay-600 space-y-1">
                      <p>
                        Created {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {ticket.order_id && (
                        <p className="font-mono text-xs">
                          Order: {ticket.order_id}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ticket.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : ticket.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-clay-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Help Resources */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="font-semibold text-clay-900 mb-2">FAQ</h3>
          <p className="text-sm text-clay-600 mb-4">
            Find answers to common questions
          </p>
          <a href="/help/faq" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            Browse FAQ →
          </a>
        </div>

        <div className="card text-center">
          <h3 className="font-semibold text-clay-900 mb-2">Email Support</h3>
          <p className="text-sm text-clay-600 mb-4">
            Reach us directly via email
          </p>
          <a
            href="mailto:info@ceramicmaterialsworkshop.com"
            className="text-brand-600 hover:text-brand-700 text-sm font-medium"
          >
            info@ceramicmaterialsworkshop.com →
          </a>
        </div>

        <div className="card text-center">
          <h3 className="font-semibold text-clay-900 mb-2">Live Chat</h3>
          <p className="text-sm text-clay-600 mb-4">
            Chat with us in real-time
          </p>
          <button className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            Start Chat →
          </button>
        </div>
      </div>
    </div>
  );
}
