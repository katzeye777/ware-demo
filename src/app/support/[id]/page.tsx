'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, SupportTicket, TicketMessage } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Send, ArrowLeft, Paperclip } from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ticketId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && ticketId) {
      loadTicketDetails();
    }
  }, [user, authLoading, router, ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTicketDetails = async () => {
    try {
      const [ticketData, messagesData] = await Promise.all([
        api.getTicket(ticketId),
        api.getTicketMessages(ticketId),
      ]);

      setTicket(ticketData);
      setMessages(messagesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);
    setError('');

    try {
      const message = await api.addTicketMessage(ticketId, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          <p className="mt-4 text-clay-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-clay-900 mb-2">Ticket Not Found</h2>
        <p className="text-clay-600 mb-6">{error || 'This ticket does not exist.'}</p>
        <Link href="/support" className="btn-primary">
          Back to Support
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <Link
        href="/support"
        className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-6 inline-flex items-center space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Support</span>
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-clay-900 mb-2">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-clay-600">
              <span>
                Created {new Date(ticket.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {ticket.order_id && (
                <>
                  <span>•</span>
                  <span className="font-mono">Order: {ticket.order_id}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={ticket.status} type="ticket" />
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

      {/* Messages */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-clay-900 mb-4">Messages</h2>

        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-md rounded-lg p-4 ${
                  message.sender_type === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-clay-100 text-clay-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {message.sender_type === 'user' ? 'You' : 'Support Team'}
                  </span>
                  <span className="text-xs opacity-75">
                    {new Date(message.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                {message.image_url && (
                  <img
                    src={message.image_url}
                    alt="Attachment"
                    className="mt-2 rounded max-w-full"
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== 'closed' && (
          <form onSubmit={handleSendMessage} className="border-t border-clay-200 pt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
                {error}
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input-field flex-1"
                disabled={isSending}
              />
              <button
                type="button"
                className="btn-secondary flex items-center justify-center px-4"
                title="Attach file (coming soon)"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={isSending || !newMessage.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{isSending ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </form>
        )}

        {ticket.status === 'closed' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700">
              This ticket has been closed. If you need further assistance, please create a new ticket.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
