'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, BookOpen } from 'lucide-react';

interface GlazeFlaw {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  explanation: string;
}

const GLAZE_FLAWS: GlazeFlaw[] = [
  {
    id: 'crawling',
    name: 'Crawling',
    emoji: '🕳️',
    shortDesc: 'Glaze pulls away from the surface.',
    explanation:
      'This happens before melt. It is adhesion or drying shrinkage. Fix handling and raw glaze behavior first.',
  },
  {
    id: 'crazing',
    name: 'Crazing',
    emoji: '🕸️',
    shortDesc: 'Fine crack network in the glaze.',
    explanation:
      'This is glaze fit. The glaze is in tension. It is chemistry relative to the body.',
  },
  {
    id: 'shivering',
    name: 'Shivering',
    emoji: '💥',
    shortDesc: 'Glaze flakes or chips.',
    explanation:
      'This is compression failure. It is glaze fit.',
  },
  {
    id: 'pinholing',
    name: 'Pinholing',
    emoji: '📌',
    shortDesc: 'Small holes in an otherwise melted surface.',
    explanation:
      'Pinholes are gas and viscosity. Either gas is still escaping when the glaze seals, or the melt cannot heal.',
  },
  {
    id: 'running',
    name: 'Running',
    emoji: '💧',
    shortDesc: 'Glaze flowed down the piece.',
    explanation:
      'Glazes only run for three reasons: They are too thick. They were fired too hot. Or they were too thick and too hot. There is no fourth reason.',
  },
  {
    id: 'color-shift',
    name: 'Unexpected Color',
    emoji: '🎨',
    shortDesc: 'The fired color looks different from what you expected.',
    explanation:
      'Color is chemistry first. Atmosphere, temperature, cooling, thickness, and alkaline-earth selection all matter.',
  },
  {
    id: 'matte-surface',
    name: 'Matte Instead of Gloss',
    emoji: '🪨',
    shortDesc: 'Glaze should be glossy but came out matte.',
    explanation:
      'In a properly engineered glaze, matte instead of gloss means underfired. Full stop.',
  },
  {
    id: 'thin-dry',
    name: 'Thin or Dry Surface',
    emoji: '🧱',
    shortDesc: 'Surface feels rough or incomplete.',
    explanation:
      'If the surface feels rough or incomplete, it is thin or underfired.',
  },
];

function SymptomCard({
  flaw,
  onClick,
}: {
  flaw: GlazeFlaw;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer text-left border-2 border-transparent"
    >
      <div className="text-3xl mb-2">{flaw.emoji}</div>
      <h3 className="font-bold text-clay-900 mb-1">{flaw.name}</h3>
      <p className="text-xs text-clay-600 leading-snug">{flaw.shortDesc}</p>
    </button>
  );
}

function FlawSection({ flaw }: { flaw: GlazeFlaw }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id={flaw.id} className="scroll-mt-24">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full card hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{flaw.emoji}</span>
            <div className="text-left">
              <h3 className="text-xl font-bold text-clay-900">{flaw.name}</h3>
              <p className="text-sm text-clay-600">{flaw.shortDesc}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-6 h-6 text-clay-400 flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border border-clay-200 rounded-lg p-6">
          <p className="text-sm text-clay-700 leading-relaxed">
            {flaw.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TroubleshootingPage() {
  const scrollToFlaw = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      const button = element.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/help"
          className="inline-flex items-center space-x-1 text-clay-600 hover:text-brand-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Help Center</span>
        </Link>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-100 rounded-full p-4">
              <BookOpen className="w-12 h-12 text-brand-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Glaze Troubleshooting Guide
          </h1>
          <p className="text-lg text-clay-600 max-w-2xl mx-auto">
            Something went wrong in the kiln? Start here.
          </p>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GLAZE_FLAWS.map((flaw) => (
              <SymptomCard
                key={flaw.id}
                flaw={flaw}
                onClick={() => scrollToFlaw(flaw.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {GLAZE_FLAWS.map((flaw) => (
            <FlawSection key={flaw.id} flaw={flaw} />
          ))}
        </div>

        <div className="mt-16 card bg-clay-100 text-center">
          <p className="text-clay-700 text-sm">
            More specific troubleshooting guidance is included with your purchase — check your account dashboard for help tailored to your glaze and firing setup.
          </p>
        </div>
      </div>
    </div>
  );
}
