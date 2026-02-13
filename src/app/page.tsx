import Link from 'next/link';
import { Palette, Sparkles, Shield, Truck, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              Custom Ceramic Glazes, Made to Order
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Design Your
              <br />
              <span className="text-brand-100">Perfect Glaze</span>
            </h1>

            <p className="text-xl md:text-2xl text-brand-50 mb-10 max-w-2xl mx-auto">
              Choose any color. We'll match it with precision and deliver your custom glaze ready to use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/design" className="inline-flex items-center justify-center space-x-2 bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg">
                <Sparkles className="w-6 h-6" />
                <span>Start Designing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link href="/vision-board" className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
                <Palette className="w-6 h-6" />
                <span>Browse Vision Board</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-clay-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-clay-600 max-w-2xl mx-auto">
              From color selection to your studio door in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-clay-900 mb-3">
                Choose Your Color
              </h3>
              <p className="text-clay-600">
                Pick any color using our advanced color picker, upload a photo, or browse our gallery
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-clay-900 mb-3">
                We Match It Precisely
              </h3>
              <p className="text-clay-600">
                Our algorithm finds the perfect glaze formula to match your color with lab-tested accuracy
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-clay-900 mb-3">
                Delivered Ready to Use
              </h3>
              <p className="text-clay-600">
                Your custom glaze arrives at your door, professionally mixed and ready to apply
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-clay-50 to-brand-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-clay-900 mb-4">
              Why Choose Ware?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Color Precision
              </h3>
              <p className="text-sm text-clay-600">
                Industry-leading ΔE color matching for exact results every time
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-sm text-clay-600">
                Every batch is quality tested before shipping to ensure consistency
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-sm text-clay-600">
                Your custom glaze ships within 5-7 business days, ready to use
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Expert Support
              </h3>
              <p className="text-sm text-clay-600">
                Our ceramics experts are here to help with any questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-clay-900 mb-4">
                Loved by Ceramic Artists
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-clay-700 mb-4">
                  "Ware has completely changed my workflow. I can finally match the exact colors my clients want without endless test tiles. The precision is incredible!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold text-clay-900">Sarah Kim</p>
                    <p className="text-sm text-clay-600">Professional Potter</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-clay-700 mb-4">
                  "As a teacher, Ware saves me so much time. Students can experiment with color digitally before committing to a glaze. It's a game-changer for education."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold">
                    MJ
                  </div>
                  <div>
                    <p className="font-semibold text-clay-900">Marcus Johnson</p>
                    <p className="text-sm text-clay-600">Ceramics Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-500 to-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create?
            </h2>
            <p className="text-xl text-brand-50 mb-10">
              Join hundreds of ceramic artists who've discovered the future of glaze design
            </p>
            <Link href="/design" className="inline-flex items-center justify-center space-x-2 bg-white text-brand-600 hover:bg-brand-50 font-semibold px-10 py-5 rounded-lg transition-colors text-lg shadow-xl">
              <Sparkles className="w-6 h-6" />
              <span>Start Your First Design</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-brand-100 text-sm">
              No credit card required to start designing
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
