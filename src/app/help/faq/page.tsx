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
        answer: 'Dry powder is $15 per pint (350g). Larger batches are priced proportionally — for example, 1 kg is about $42.86. Pre-mixed (wet) glazes carry a 30% surcharge to cover mixing, packaging, and the heavier shipping weight.',
      },
      {
        question: 'Should I order dry or wet?',
        answer: 'We recommend dry powder for most potters. It costs less, ships cheaper (you\'re not paying to ship water), and stores indefinitely on your shelf. Just add water when you\'re ready to use it — we include mixing instructions and videos. Wet (pre-mixed) is available if you prefer, but it costs more, ships heavier, and has a longer lead time.',
      },
      {
        question: 'Can I reorder the same glaze later?',
        answer: 'Yes. Every glaze you order is saved to your account. You can reorder the exact same recipe in any batch size at any time.',
      },
    ],
  },
  {
    name: 'Glazes & Materials',
    items: [
      {
        question: 'What cone range do your glazes fire to?',
        answer: 'Our standard glazes are formulated for cone 6 oxidation, which is the most common firing range for studio potters. If you need cone 10, cone 04, or a different range, select it during the design process and we\'ll adjust the recipe accordingly.',
      },
      {
        question: 'Are your glazes food safe?',
        answer: 'Our base recipes are formulated with food-safe materials and tested to meet ASTM and FDA leaching standards when fired to the recommended cone. That said, food safety also depends on your firing conditions, application thickness, and kiln atmosphere. We include specific guidance with every order.',
      },
      {
        question: 'What materials are in the glaze?',
        answer: 'Our base glaze uses nepheline syenite, whiting, kaolin, silica, Ferro Frit 3195, and bentonite, plus CMC gum as a binder and a small amount of preservative (Kathon CG). Color comes from commercially available ceramic stains blended to match your chosen color.',
      },
      {
        question: 'How do I apply the glaze?',
        answer: 'Our glazes work with dipping, pouring, spraying, and brushing. We recommend dipping or pouring for the most even coat. Apply to bisqueware at a specific gravity of about 1.45–1.50 for dipping. Each order includes application instructions tailored to your batch size.',
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
        answer: 'Our color matching is based on thousands of real fired test tiles measured with a spectrophotometer. The color you see in the preview is derived from actual fired results, not a digital guess. That said, every kiln is different — your results may vary slightly depending on your firing schedule, atmosphere, and clay body.',
      },
      {
        question: 'What if the color I want isn\'t achievable in a glaze?',
        answer: 'Some colors (very bright neons, certain fluorescents) fall outside the range of what ceramic stains can produce at high temperatures. If your chosen color is out of gamut, we\'ll show you the closest achievable match and let you adjust from there.',
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
        answer: 'Dry powder is sealed in heavy-duty, resealable bags inside a sturdy shipping box. Wet glaze is packed in sealed plastic containers with leak-proof lids, wrapped and cushioned for transit. Both include a printed label with your recipe name and application instructions.',
      },
    ],
  },
  {
    name: 'Returns & Issues',
    items: [
      {
        question: 'What if my glaze color doesn\'t match what I expected?',
        answer: 'Glaze color depends on many variables — kiln temperature, atmosphere, clay body, and application thickness. If your fired result looks significantly different from the preview, open a support ticket with photos and your firing details. We\'ll work with you to troubleshoot or reformulate.',
      },
      {
        question: 'Can I return a glaze?',
        answer: 'Because every batch is custom-mixed to order, we can\'t accept returns on opened or used product. If your shipment arrives damaged or the wrong product was sent, contact us immediately and we\'ll make it right.',
      },
      {
        question: 'What if my shipment arrives damaged?',
        answer: 'Take photos of the damaged package and product, then open a support ticket or email us at info@ceramicmaterialsworkshop.com. We\'ll send a replacement at no charge.',
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
