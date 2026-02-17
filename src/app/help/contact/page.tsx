import Link from 'next/link';
import { ArrowLeft, Mail, LifeBuoy, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Link */}
        <Link
          href="/help"
          className="inline-flex items-center space-x-1 text-clay-600 hover:text-brand-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Help Center</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <Mail className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-clay-600 max-w-xl mx-auto">
            Real ceramicists on the other end. We&apos;re happy to help with anything — glaze questions, order issues, or just talking shop.
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-6 mb-12">
          {/* Email */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-brand-100 rounded-lg p-3 flex-shrink-0">
                <Mail className="w-6 h-6 text-brand-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-clay-900 mb-1">Email</h2>
                <p className="text-sm text-clay-600 mb-3">
                  Best for general questions, glaze advice, or anything that doesn&apos;t need an immediate reply.
                </p>
                <a
                  href="mailto:info@ceramicmaterialsworkshop.com"
                  className="text-brand-600 hover:text-brand-700 font-semibold"
                >
                  info@ceramicmaterialsworkshop.com
                </a>
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-lg p-3 flex-shrink-0">
                <LifeBuoy className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-clay-900 mb-1">Support Tickets</h2>
                <p className="text-sm text-clay-600 mb-3">
                  For order-specific issues — wrong color, damaged shipment, billing questions. Log in to track your conversation with our team.
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center space-x-1 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span>Open a Support Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-clay-900 mb-1">Response Times</h2>
                <div className="text-sm text-clay-600 space-y-2">
                  <p>
                    We aim to respond to all emails and support tickets within <strong>1 business day</strong>.
                  </p>
                  <p>
                    Our hours are <strong>Monday – Friday, 9 AM – 5 PM Eastern</strong>. Messages received on weekends or holidays will be answered the next business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card bg-clay-50 border-clay-200">
          <h2 className="font-bold text-clay-900 mb-4 text-center">
            Before You Reach Out
          </h2>
          <p className="text-sm text-clay-600 text-center mb-4">
            You might find your answer faster here:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/help/faq"
              className="flex items-center space-x-2 bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-clay-900">FAQ</span>
            </Link>
            <Link
              href="/help/troubleshooting"
              className="flex items-center space-x-2 bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <LifeBuoy className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span className="text-sm font-medium text-clay-900">Glaze Troubleshooting</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
