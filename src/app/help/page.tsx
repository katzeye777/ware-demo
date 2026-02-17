import Link from 'next/link';
import { HelpCircle, BookOpen, MessageSquare, Mail, LifeBuoy, ArrowRight } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-100 rounded-full p-4">
              <HelpCircle className="w-12 h-12 text-brand-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg text-clay-600 max-w-2xl mx-auto">
            Whether you&apos;re troubleshooting a glaze issue or have a question about your order, we&apos;re here for you.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Troubleshooting Guide — featured */}
          <Link href="/help/troubleshooting" className="md:col-span-2">
            <div className="card bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    Glaze Troubleshooting Guide
                  </h2>
                  <p className="text-brand-100 mb-3">
                    Crawling, crazing, pinholing, color shifts — find out what went wrong and how to fix it. Interactive diagnostic plus a full reference for 12 common glaze flaws.
                  </p>
                  <span className="inline-flex items-center space-x-1 font-semibold text-sm">
                    <span>Start diagnosing</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* FAQ */}
          <Link href="/help/faq">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-clay-900 mb-2">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-clay-600 text-sm">
                    Ordering, pricing, shipping, color matching, application tips — quick answers to the things makers ask most.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Contact */}
          <Link href="/help/contact">
            <div className="card hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-clay-900 mb-2">
                    Contact Us
                  </h2>
                  <p className="text-clay-600 text-sm">
                    Have a question that isn&apos;t covered here? Reach out directly — real ceramicists on the other end.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Support Tickets */}
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-100 rounded-lg p-3">
              <LifeBuoy className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-clay-900 mb-2">
            Need Help With an Order?
          </h2>
          <p className="text-clay-600 text-sm mb-4">
            If you have an issue with a specific order — wrong color, damaged shipment, or anything else — open a support ticket and we&apos;ll sort it out.
          </p>
          <Link
            href="/support"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Go to Support Tickets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
