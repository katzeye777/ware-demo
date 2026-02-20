import Link from 'next/link';
import { Palette, Flame, Users, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-6">
            About Ware
          </h1>
          <p className="text-xl text-clay-600 max-w-2xl mx-auto leading-relaxed">
            We make custom ceramic glazes to order. You pick the color &mdash;
            we turn it into a real, tested recipe and ship it to your studio.
          </p>
        </div>

        {/* Origin Story */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-clay-900 mb-4">
            Where This Started
          </h2>
          <div className="space-y-4 text-clay-700 leading-relaxed">
            <p>
              Ware grew out of decades of glaze research at a working ceramics
              studio. Thousands of test tiles. Hundreds of formulations.
              Years of careful documentation &mdash; every firing logged,
              every result recorded.
            </p>
            <p>
              We kept hearing the same thing from potters: &ldquo;I know
              the color I want, but I can&rsquo;t find a glaze that
              matches.&rdquo; Commercial glazes come in limited palettes.
              Mixing your own means months of testing. Most makers just
              settle for whatever&rsquo;s close enough.
            </p>
            <p>
              We thought that was a problem worth solving. So we built
              Ware &mdash; a way to start with the color in your head and
              end with a batch of glaze in your hands.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-clay-900 mb-6">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  Pick your color
                </h3>
                <p className="text-sm text-clay-600">
                  Use our design tool to dial in exactly the color you&rsquo;re
                  after. Browse the vision board for inspiration, or start from
                  scratch.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  We formulate your glaze
                </h3>
                <p className="text-sm text-clay-600">
                  Your recipe is built from thousands of real fired test
                  results &mdash; not guesswork. Every formulation is matched
                  to your specific color, cone, and finish.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  It arrives at your studio
                </h3>
                <p className="text-sm text-clay-600">
                  Your glaze ships as dry powder or pre-mixed, ready to use.
                  Every batch includes a safety data sheet and application
                  guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-clay-900 mb-6">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Palette className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  Color shouldn&rsquo;t be a compromise
                </h3>
                <p className="text-sm text-clay-600">
                  Your work deserves the exact color you envisioned, not the
                  closest thing on a shelf.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Flame className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  Tested, not theoretical
                </h3>
                <p className="text-sm text-clay-600">
                  Every recipe we send is backed by real fired test tiles.
                  We don&rsquo;t ship guesses.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  Made by ceramicists
                </h3>
                <p className="text-sm text-clay-600">
                  We&rsquo;re potters and glaze chemists. We understand
                  what you need because we need it too.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Heart className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-clay-900 mb-1">
                  Your craft matters
                </h3>
                <p className="text-sm text-clay-600">
                  Every piece you make is one of a kind. Your glaze should
                  be too.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-clay-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-clay-600 mb-6">
            You have the vision &mdash; now get the glaze to match it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/design"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Start Designing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/help/contact"
              className="btn-secondary"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
