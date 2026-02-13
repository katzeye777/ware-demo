'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store locally for demo (replace with Formspree or backend API for production)
    const entry = {
      email,
      name,
      interest,
      submitted_at: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('ware_waitlist') || '[]');
    existing.push(entry);
    localStorage.setItem('ware_waitlist', JSON.stringify(existing));

    // Simulate a brief delay for UX
    await new Promise((r) => setTimeout(r, 600));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clay-50 to-brand-50">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-clay-900 mb-4">
            You&apos;re on the list!
          </h1>
          <p className="text-lg text-clay-600 mb-8">
            We&apos;ll notify you as soon as custom glaze ordering is available.
            Thank you for your interest in Ware.
          </p>
          <div className="space-y-3">
            <Link
              href="/design"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Keep Exploring the Design Tool</span>
            </Link>
            <div>
              <Link
                href="/vision-board"
                className="text-brand-600 hover:text-brand-700 font-medium text-sm"
              >
                Browse the Vision Board &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Back Link */}
        <Link
          href="/design"
          className="inline-flex items-center space-x-1 text-clay-600 hover:text-brand-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Design Tool</span>
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="bg-brand-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-lg text-clay-600 max-w-lg mx-auto">
            Custom glaze ordering is launching soon. Join the waitlist to be
            the first to know when you can order your perfect glaze.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="card max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-clay-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-clay-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-clay-700 mb-1"
              >
                What are you most interested in? (optional)
              </label>
              <select
                id="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="input-field"
              >
                <option value="">Select...</option>
                <option value="custom_color">Custom color matching</option>
                <option value="small_batch">Small batch ordering</option>
                <option value="glaze_library">Public glaze library</option>
                <option value="studio_use">Studio / classroom use</option>
                <option value="commercial">Commercial production</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !name.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Color Match',
              desc: 'Pick any color and get a precise stain recipe matched to your glaze.',
            },
            {
              title: 'AI Preview',
              desc: 'See a photorealistic rendering of your glaze on ceramic before ordering.',
            },
            {
              title: 'Ships Ready',
              desc: 'Receive a pre-mixed glaze batch ready to use in your studio.',
            },
          ].map((item) => (
            <div key={item.title} className="card text-center">
              <h3 className="font-semibold text-clay-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-clay-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
