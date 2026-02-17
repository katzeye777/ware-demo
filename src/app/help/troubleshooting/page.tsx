'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, BookOpen, Search } from 'lucide-react';

/* ─────────────────────────────────────────────
   Flaw Data — 9 glaze flaws
   ───────────────────────────────────────────── */

interface GlazeFlaw {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  looksLike: string;
  causes: string[];
  fixes: string[];
  prevention: string[];
}

const GLAZE_FLAWS: GlazeFlaw[] = [
  {
    id: 'crawling',
    name: 'Crawling',
    emoji: '🕳️',
    shortDesc: 'Glaze pulls away from the surface.',
    looksLike:
      'The glaze has pulled back from the clay, beading up and leaving bare spots. This happens before the glaze melts. It is an adhesion or drying shrinkage problem. Fix how you handle your ware and how the raw glaze behaves first — this is not a firing issue.',
    causes: [
      'Dusty, oily, or contaminated bisqueware — the glaze cannot grip the surface.',
      'Glaze applied too thick — excessive coats shrink as they dry, crack, and pull away.',
      'High-shrinkage raw materials in the glaze (too much ball clay or bentonite).',
      'Touching or disturbing the dried glaze coat before firing.',
      'Re-wetting an already dried glaze layer.',
    ],
    fixes: [
      'Clean your bisqueware before glazing — rinse under water and let it dry completely.',
      'Apply glaze thinner. For dipping, a 2–3 second dip is usually enough.',
      'Reduce ball clay or bentonite. If you need suspension, use CMC gum instead.',
      'Don\'t touch glazed surfaces before firing.',
    ],
    prevention: [
      'Handle bisqueware with clean hands or gloves.',
      'Store bisque in a clean, covered area.',
      'Test your application thickness on a scrap piece first.',
    ],
  },
  {
    id: 'crazing',
    name: 'Crazing',
    emoji: '🕸️',
    shortDesc: 'Fine crack network in the glaze.',
    looksLike:
      'A web of fine hairline cracks across the glaze surface. May appear immediately out of the kiln or develop over days or weeks. You might hear it — tiny pinging sounds as the kiln cools. This is glaze fit. The glaze is in tension. It is chemistry relative to the body.',
    causes: [
      'The glaze has a higher thermal expansion than the clay body — as the piece cools, the glaze wants to shrink more than the clay, so it cracks.',
      'Too much sodium or potassium (high-expansion fluxes) in the glaze.',
      'Too little silica or alumina to form a stable glass network.',
    ],
    fixes: [
      'Add silica to the glaze — this lowers thermal expansion. Start with 5% and test.',
      'Reduce high-expansion fluxes (sodium, potassium). Shift toward calcium or lithium sources.',
      'Add alumina through kaolin — this stiffens the glaze and lowers expansion.',
    ],
    prevention: [
      'Test new glazes on tiles before using them on finished work.',
      'Use a clay body and glaze that are designed to fit each other.',
      'If a glaze consistently crazes on your clay, it may never fit. Switch the recipe.',
    ],
  },
  {
    id: 'shivering',
    name: 'Shivering',
    emoji: '💥',
    shortDesc: 'Glaze flakes or chips off the surface.',
    looksLike:
      'Chips, flakes, or curled shards of glaze lifting off the clay body. The flakes can be razor-sharp. This is compression failure — the opposite of crazing. The glaze is under too much compression because it has a lower thermal expansion than the clay. It is glaze fit.',
    causes: [
      'The glaze has a lower thermal expansion than the clay body — the clay shrinks more, putting the glaze under compression until it buckles and pops off.',
      'Too much silica or lithium in the glaze.',
      'Incompatible clay body and glaze combination.',
    ],
    fixes: [
      'Increase glaze expansion by adding sodium or potassium flux (soda feldspar, nepheline syenite).',
      'Reduce silica or lithium-based materials.',
      'If adjusting the glaze doesn\'t work, try a different clay body.',
    ],
    prevention: [
      'Always test new glaze-clay combinations on tiles before production.',
      'Pay attention to edges and rims — shivering starts there first.',
      'Any piece that shows shivering should not be used as functional ware — the flakes are sharp.',
    ],
  },
  {
    id: 'pinholing',
    name: 'Pinholing',
    emoji: '📌',
    shortDesc: 'Small holes in an otherwise melted surface.',
    looksLike:
      'Small, round holes dotting an otherwise smooth glaze surface. The glaze around each hole melted properly — it just didn\'t fill in where gas escaped. Pinholes are gas and viscosity. Either gas is still escaping when the glaze seals over, or the melt is too viscous to heal itself.',
    causes: [
      'Gas escaping from the clay body after the glaze has sealed — organics, carbonates, or sulfates that didn\'t burn out in bisque.',
      'Glaze not reaching full maturity — not hot enough or not held long enough at peak for the melt to smooth over.',
      'Firing too fast through the mid-range, not giving gases time to escape before the glaze closes.',
    ],
    fixes: [
      'Add a 15–30 minute soak at peak temperature so the glaze has time to heal.',
      'Slow down through the burn-out zone to let gases escape before the glaze seals.',
      'Fire your bisque higher to burn out organics and carbonates before the glaze firing.',
    ],
    prevention: [
      'Bisque fire high enough to burn out all organic matter.',
      'Don\'t rush the firing — give the kiln time in the mid-range.',
      'Hold at peak for at least 10–15 minutes.',
    ],
  },
  {
    id: 'blistering',
    name: 'Blistering',
    emoji: '🫧',
    shortDesc: 'Large bubbles or ruptured craters.',
    looksLike:
      'Large bubbles, raised blisters, or open craters on the glaze surface. Blisters may be intact domes or broken ragged-edged craters. This is aggressive gas entrapment. It usually behaves as if it was fired too hot.',
    causes: [
      'Over-firing — too hot, causing excessive gas release from clay or glaze materials.',
      'Firing too fast at high temperatures — gas generated faster than the melt can release it.',
      'Thick glaze application trapping gas in a deep molten layer.',
    ],
    fixes: [
      'Reduce peak temperature — even half a cone lower can make a significant difference.',
      'Slow down the firing rate in the last 100°C before peak.',
      'Apply glaze thinner.',
    ],
    prevention: [
      'Use witness cones to verify your actual kiln temperature.',
      'Test glazes at multiple thicknesses to find the sweet spot.',
    ],
  },
  {
    id: 'running',
    name: 'Running',
    emoji: '💧',
    shortDesc: 'Glaze has flowed down the piece and pooled at the bottom.',
    looksLike:
      'Thick drips, runs, or curtains of glaze flowing down the surface. The glaze may pool at the base or fuse the piece to the kiln shelf. Glazes only run for three reasons: They are too thick. They were fired too hot. Or they were too thick and too hot. There is no fourth reason.',
    causes: [
      'Applied too thick.',
      'Fired too hot.',
      'Applied too thick and fired too hot.',
    ],
    fixes: [
      'Apply glaze thinner, especially on the lower half of the piece.',
      'Reduce peak temperature.',
      'Leave the bottom of the piece unglazed as a buffer zone.',
    ],
    prevention: [
      'Always wax or leave the bottom of your pots unglazed.',
      'Use a kiln cookie under any piece glazed with a runny or unknown glaze.',
    ],
  },
  {
    id: 'color-shift',
    name: 'Unexpected Color',
    emoji: '🎨',
    shortDesc: 'The fired color looks different from what you expected.',
    looksLike:
      'The color out of the kiln doesn\'t match what you intended — duller, more muted, a different hue, or unevenly colored. Color is chemistry first. Atmosphere, temperature, cooling rate, application thickness, and alkaline-earth selection all matter.',
    causes: [
      'Kiln atmosphere — oxidation vs. reduction changes how colorant oxides develop.',
      'Firing temperature off — even half a cone shifts color.',
      'Clay body influence — dark or iron-bearing clays shift glaze colors.',
      'Application thickness — many colorants are thickness-sensitive.',
      'Cooling rate — some colors are sensitive to how fast the kiln cools.',
    ],
    fixes: [
      'Verify your firing schedule with witness cones.',
      'Try the glaze on a lighter clay body to see the true color.',
      'Adjust application thickness — test at thin, medium, and thick.',
      'For cooling-sensitive colors, try a slow cool from peak.',
    ],
    prevention: [
      'Make test tiles on the same clay body you\'ll use for finished work.',
      'Fire test tiles in the same kiln and location as your final piece.',
      'Keep a firing log so you can reproduce successful results.',
    ],
  },
  {
    id: 'matte-surface',
    name: 'Matte Instead of Gloss',
    emoji: '🪨',
    shortDesc: 'Glaze should be glossy but came out matte or satin.',
    looksLike:
      'A flat, non-reflective surface where you expected gloss. The color may also appear duller than expected. In a properly engineered glaze, matte instead of gloss means underfired. Full stop.',
    causes: [
      'Underfired — the glaze didn\'t reach maturity.',
    ],
    fixes: [
      'Fire higher or add a soak at peak temperature.',
      'Verify your actual temperature with witness cones — controllers can be off.',
    ],
    prevention: [
      'Always use witness cones.',
      'If a glaze is consistently matte when it shouldn\'t be, your kiln is not reaching temperature.',
    ],
  },
  {
    id: 'thin-dry',
    name: 'Thin or Dry Surface',
    emoji: '🧱',
    shortDesc: 'Surface feels rough or incomplete.',
    looksLike:
      'The glaze surface feels rough, gritty, or incomplete. It may look textured or granular rather than smooth. If the surface feels rough or incomplete, it is thin or underfired.',
    causes: [
      'Glaze applied too thin — not enough material to form a complete glassy layer.',
      'Underfired — the glaze didn\'t get hot enough to fully melt.',
    ],
    fixes: [
      'Apply glaze thicker — the coat should fully cover the bisque color.',
      'Fire higher or add a soak at peak temperature.',
      'Re-fire the piece at the correct cone.',
    ],
    prevention: [
      'Check specific gravity to ensure consistent application thickness.',
      'Use witness cones to verify temperature.',
    ],
  },
];

/* ─────────────────────────────────────────────
   Components
   ───────────────────────────────────────────── */

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
        <div className="mt-2 bg-white border border-clay-200 rounded-lg p-6 space-y-6">
          {/* What it looks like */}
          <div>
            <h4 className="font-bold text-clay-900 mb-2 flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                IDENTIFY
              </span>
              <span>What It Looks Like</span>
            </h4>
            <p className="text-sm text-clay-700 leading-relaxed">
              {flaw.looksLike}
            </p>
          </div>

          {/* What causes it */}
          <div>
            <h4 className="font-bold text-clay-900 mb-2 flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded">
                CAUSES
              </span>
              <span>What Causes It</span>
            </h4>
            <ul className="space-y-2">
              {flaw.causes.map((cause, i) => (
                <li key={i} className="text-sm text-clay-700 flex items-start space-x-2">
                  <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to fix it */}
          <div>
            <h4 className="font-bold text-clay-900 mb-2 flex items-center space-x-2">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                FIX
              </span>
              <span>How to Fix It</span>
            </h4>
            <ul className="space-y-2">
              {flaw.fixes.map((fix, i) => (
                <li key={i} className="text-sm text-clay-700 flex items-start space-x-2">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div>
            <h4 className="font-bold text-clay-900 mb-2 flex items-center space-x-2">
              <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-1 rounded">
                PREVENT
              </span>
              <span>Prevention</span>
            </h4>
            <ul className="space-y-2">
              {flaw.prevention.map((tip, i) => (
                <li key={i} className="text-sm text-clay-700 flex items-start space-x-2">
                  <span className="text-brand-500 mt-1 flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function TroubleshootingPage() {
  const scrollToFlaw = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Also open the section
      const button = element.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-brand-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
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
            <div className="bg-brand-100 rounded-full p-4">
              <BookOpen className="w-12 h-12 text-brand-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-4">
            Glaze Troubleshooting Guide
          </h1>
          <p className="text-lg text-clay-600 max-w-2xl mx-auto">
            Something went wrong in the kiln? Start here. Click on what you&apos;re seeing and we&apos;ll help you figure out what happened and how to fix it.
          </p>
        </div>

        {/* ─── Interactive Diagnostic ─── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-clay-900 mb-2 text-center">
            What Does Your Glaze Look Like?
          </h2>
          <p className="text-sm text-clay-600 mb-6 text-center">
            Click on the symptom that best describes what you&apos;re seeing.
          </p>
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

        {/* ─── Reference Guide ─── */}
        <div>
          <h2 className="text-2xl font-bold text-clay-900 mb-6 flex items-center space-x-2">
            <Search className="w-6 h-6 text-brand-600" />
            <span>Full Reference Guide</span>
          </h2>
          <p className="text-sm text-clay-600 mb-8">
            Detailed information on each glaze flaw — what it looks like, what causes it, how to fix it, and how to prevent it. Click any section to expand.
          </p>

          <div className="space-y-4">
            {GLAZE_FLAWS.map((flaw) => (
              <FlawSection key={flaw.id} flaw={flaw} />
            ))}
          </div>
        </div>

        {/* ─── Purchase-specific help ─── */}
        <div className="mt-16 card bg-clay-100 text-center">
          <p className="text-clay-700 text-sm">
            More specific troubleshooting guidance is included with your purchase — check your account dashboard for help tailored to your glaze and firing setup.
          </p>
        </div>
      </div>
    </div>
  );
}
