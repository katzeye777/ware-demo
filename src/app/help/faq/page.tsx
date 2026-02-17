'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    name: 'Ordering',
    items: [
      {
        question: 'How do I order a custom glaze?',
        answer: 'Start by picking a color using our design tool. Choose your finish (glossy, satin, or matte), select your batch size, and place your order. Your glaze is mixed to order and shipped directly to your studio.',
      },
      {
        question: 'What is the minimum order size?',
        answer: 'The smallest batch we offer is one pint (350g), which is enough for 4–6 small pieces. From there you can order in 500g increments up to a 5-gallon bucket (15 kg).',
      },
      {
        question: 'How much does it cost?',
        answer: 'It depends on whether you order dry or wet. Dry powder is the default and more affordable option — it ships lighter, stores indefinitely, and you just add water when you\'re ready. Wet (pre-mixed) glazes cost more because of the additional mixing, heavier packaging, and shipping weight. You\'ll see exact pricing for your batch size during checkout.',
      },
      {
        question: 'Should I order dry or wet?',
        answer: 'We recommend dry powder for most potters. It costs less, ships cheaper (you\'re not paying to ship water), and stores indefinitely on your shelf. Just add water when you\'re ready to use it — we include mixing instructions and videos. Wet (pre-mixed) is available if you prefer, but it costs more, ships heavier, and has a longer lead time. We can include a dust mask too, if you need one — just add it on in your final order.',
      },
      {
        question: 'Can I reorder the same glaze later?',
        answer: 'Yes. Every glaze you order is saved to your account. You can reorder the exact same recipe in any batch size at any time.',
      },
      {
        question: 'Can I keep my recipe private?',
        answer: 'By default, your glaze recipe gets added to the Vision Board so other makers can discover and order it too. If you\'d prefer to keep your recipe just for you, we offer private recipes for a small additional fee. Private glazes won\'t appear on the Vision Board or be available to anyone else.',
      },
    ],
  },
  {
    name: 'Glazes & Materials',
    items: [
      {
        question: 'What cone range do your glazes fire to?',
        answer: 'We currently offer glazes from cone 4 through cone 10. Our plan is to expand into every firing temperature eventually, but for now that\'s the range. Select your cone during the design process.',
      },
      {
        question: 'Are your glazes food safe?',
        answer: 'Our base recipes are formulated with food-safe materials and tested to meet ASTM and FDA leaching standards when fired to the recommended cone. That said, food safety also depends on your firing conditions, application thickness, and kiln atmosphere. We include specific guidance with every order.',
      },
      {
        question: 'What materials are in the glaze?',
        answer: 'The same materials you\'d use if you mixed your own glazes in your studio — feldspars, frits, clays, silica, and fluxes. Every recipe is formulated specifically for the color and finish you chose, so the exact blend varies. We include a full materials list with every order.',
      },
      {
        question: 'How do I apply the glaze?',
        answer: 'Our glazes work with any application method — dipping, pouring, spraying, or brushing. We want to hear from you how you plan to use them, because there are materials we can add to make them more brushable or better suited to other methods. Let us know during ordering and we\'ll tailor the recipe to your workflow.',
      },
      {
        question: 'Can I mix your glaze with other glazes?',
        answer: 'We don\'t recommend mixing our glazes with other brands or recipes, as the chemistry may not be compatible. However, you can layer our glazes over or under other glazes for interesting effects — just test on a small piece first.',
      },
    ],
  },
  {
    name: 'Color Matching',
    items: [
      {
        question: 'How accurate is the color match?',
        answer: 'Our color matching is built on over three decades of glaze research and hundreds of thousands of glaze tests. It\'s our goal to create glazes that match your vision as closely as possible. But as you know in ceramics, there can always be variation — every kiln is different, and your results may shift depending on your firing schedule, atmosphere, and clay body.',
      },
      {
        question: 'What if the color I want isn\'t achievable in a glaze?',
        answer: 'As you know, glazes aren\'t paint — because of the chemistry of the kiln, some colors just aren\'t achievable, and we want to be real with you about what\'s possible. If your chosen color is outside what we can reliably produce, we\'ll show you the closest match and let you adjust from there. But we\'re always testing, and we hope to create some of those impossible colors for you down the road.',
      },
      {
        question: 'Can I send a photo of a color I want to match?',
        answer: 'Yes! Upload a photo in the design tool and click on the color you want. We\'ll extract the color value and find the closest glaze match. Keep in mind that screen colors and lighting can affect how a photo looks — the fired result is matched to the color data, not the photo itself.',
      },
      {
        question: 'Will the glaze look the same on different clay bodies?',
        answer: 'Clay body affects glaze color, especially with thinner applications or translucent glazes. A dark stoneware will shift colors differently than a white porcelain. We recommend testing a small batch on your specific clay body before committing to a large order.',
      },
    ],
  },
  {
    name: 'Shipping & Delivery',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Dry powder orders typically ship within 3–5 business days. Wet (pre-mixed) orders take 5–7 business days due to the additional mixing and packaging. Once shipped, delivery is usually 3–5 business days via USPS Priority or UPS Ground, depending on your location.',
      },
      {
        question: 'Where do you ship?',
        answer: 'We currently ship within the continental United States. Alaska, Hawaii, and international shipping are coming soon. If you\'re outside the US, join the waitlist and we\'ll notify you when we expand.',
      },
      {
        question: 'How is the glaze packaged?',
        answer: 'Dry powder is vacuum-sealed to eliminate possible bag pops during shipping and minimize package size, then packed in an envelope or box depending on your batch size. Wet glaze is packed in sealed plastic containers with leak-proof lids, wrapped and cushioned for transit. Both include a printed label with your recipe name and application instructions. We try to minimize the materials we use in every part of our process — from packaging to water to labels — to keep things simple and reduce our waste stream and environmental impact.',
      },
    ],
  },
  {
    name: 'Returns & Issues',
    items: [
      {
        question: 'What if my glaze color doesn\'t match what I expected?',
        answer: 'Glaze color depends on many variables — kiln temperature, atmosphere, clay body, and application thickness. If you want to tweak your glaze for the next time you order — alter the shade, or fix common glaze-to-clay-body issues like crazing — go to your dashboard, click on "Reorder This Glaze," and select the "Make Some Changes" button. You can adjust the recipe to work better for you. If your fired result looks significantly off from the preview, open a support ticket with photos and your firing details and we\'ll help sort it out.',
      },
      {
        question: 'Can I return a glaze?',
        answer: 'Because every batch is custom-mixed to order, we can\'t accept returns on opened or used product. If your shipment arrives damaged or the wrong product was sent, contact us immediately and we\'ll make it right.',
      },
      {
        question: 'What if my shipment arrives damaged?',
        answer: 'Take photos of the damaged package and product, then open a support ticket. We\'ll send a replacement at no charge.',
      },
    ],
  },
  {
    name: 'Sharing',
    items: [
      {
        question: 'How can I share how my glaze turned out?',
        answer: 'Please share your real-world results with us! In your Library, you\'ll find the option to take a photo and share it, along with adding notes about how the glaze is working for you. Everything you share helps us make things better for your next batch — and for every maker who orders after you. So please share.',
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-clay-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-brand-600 transition-colors"
      >
        <span className="font-medium text-clay-900 pr-4">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-clay-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-clay-600 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
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
            <div className="bg-blue-100 rounded-full p-4">
              <HelpCircle className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-clay-600">
            Quick answers to the things makers ask most.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_DATA.map((category) => (
            <div key={category.name} className="card">
              <h2 className="text-xl font-bold text-clay-900 mb-4">
                {category.name}
              </h2>
              <div>
                {category.items.map((item) => (
                  <AccordionItem key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <p className="text-clay-600 mb-4">
            Don&apos;t see your question here?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/help/contact"
              className="btn-primary inline-flex items-center justify-center space-x-2"
            >
              <span>Contact Us</span>
            </Link>
            <Link
              href="/help/troubleshooting"
              className="btn-secondary inline-flex items-center justify-center space-x-2"
            >
              <span>Glaze Troubleshooting Guide</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
