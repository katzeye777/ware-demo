import Link from 'next/link';
import { Palette, Sparkles, Shield, Truck, Star, ArrowRight } from 'lucide-react';

/* Curated test tile images for hero marquee — selected for color diversity */
const MARQUEE_ROW_1 = [
  '/vision-board/6450_3.75_6026_1.25_6_ox_2.JPG',   // Tangerine Flame (orange)
  '/vision-board/6388_1_6026_0.5_6_ox_2.JPG',        // Midnight Ink (deep blue)
  '/vision-board/6450_7.5_6388_0.3_6_ox_2.JPG',      // Moss Floor (green)
  '/vision-board/6026_2.5_6388_0.7_6_ox_2.JPG',      // Eggplant Velvet (purple)
  '/vision-board/6450_7.5_6026_0.25_6_ox_2.JPG',     // Canyon Gold (gold)
  '/vision-board/6026_2.5_6450_0.0_6_ox_2.JPG',      // Lobster Red (red)
  '/vision-board/6450_3.75_6388_0.4_6_ox_2.JPG',     // Tidal Slate (teal)
];

const MARQUEE_ROW_2 = [
  '/vision-board/6026_1.25_6388_0.15_6_ox_2.JPG',    // Wisteria Field (mauve)
  '/vision-board/6450_7.5_6388_0.7_6_ox_2.JPG',      // River Jade (green)
  '/vision-board/6026_2.5_6600_1.4_6_ox_2.JPG',      // Espresso (brown)
  '/vision-board/6388_1_6450_1.5_6_ox_2.JPG',        // Electric Cobalt (cobalt)
  '/vision-board/6450_3.75_6026_0.125_6_ox_2.JPG',   // Honey Amber (amber)
  '/vision-board/6026_1.25_6388_0.05_6_ox_2.JPG',    // Old Mauve (pink-brown)
  '/vision-board/6450_7.5_6600_0.2_6_ox_2.JPG',      // Golden Olive (yellow-green)
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white py-20 md:py-32 overflow-hidden">
        {/* Scrolling tile marquee — background layer */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 md:gap-4 opacity-[0.18] pointer-events-none" aria-hidden="true">
          {/* Row 1 — scrolls left */}
          <div className="flex w-max animate-marquee">
            {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((src, i) => (
              <div key={`r1-${i}`} className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 mx-1.5 md:mx-2">
                <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
              </div>
            ))}
          </div>
          {/* Row 2 — scrolls right */}
          <div className="flex w-max animate-marquee-reverse">
            {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((src, i) => (
              <div key={`r2-${i}`} className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 mx-1.5 md:mx-2">
                <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Hero content — foreground */}
        <div className="relative z-10 container mx-auto px-4 text-center">
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
              Imagine a color. Any color. Now imagine it on your next piece — that's where this starts.
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
              From your imagination to your studio shelf in three simple steps
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
                Pick a color from your imagination, snap a photo of something that inspires you, or browse the gallery
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-clay-900 mb-3">
                Design Your Glaze
              </h3>
              <p className="text-clay-600">
                Dial in the temperature, texture, glossiness, and more — your glaze is crafted from thousands of real fired test results
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-clay-900 mb-3">
                Make It Yours
              </h3>
              <p className="text-clay-600">
                Your custom glaze arrives at your studio door, ready to bring your vision to life
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
              Built Around Your Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Get the Color You See
              </h3>
              <p className="text-sm text-clay-600">
                Every recipe comes from real fired test tiles — so what you see is what comes out of the kiln
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Consistent, Every Time
              </h3>
              <p className="text-sm text-clay-600">
                Your glaze is tested before it ships — so you can focus on making, not troubleshooting
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                Studio-Ready Fast
              </h3>
              <p className="text-sm text-clay-600">
                From your idea to your shelf in 5–7 days — so you stay in your creative flow
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-lg text-clay-900 mb-2">
                You're Not Alone
              </h3>
              <p className="text-sm text-clay-600">
                Have a question about firing, application, or color? Real ceramicists are here to help
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
                From Makers Like You
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
              You have the vision — now get the glaze to match it
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
