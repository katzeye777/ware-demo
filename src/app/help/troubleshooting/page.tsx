'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, BookOpen, Search } from 'lucide-react';

/* ─────────────────────────────────────────────
   Flaw Data — 12 common glaze flaws
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
    shortDesc: 'Glaze pulls away from the surface into thick beads, leaving bare clay exposed.',
    looksLike:
      'The glaze has pulled back from the clay surface, forming thick ridges or beaded islands with bare, unglazed areas between them. It often looks like the glaze tried to ball up on itself. Crawling can be localized (a few bare patches) or severe (most of the surface is exposed).',
    causes: [
      'Dusty or oily bisqueware — any contamination prevents the glaze from gripping the surface.',
      'Glaze applied too thick — excessively thick coats shrink more as they dry and can crack and pull away during firing.',
      'High-shrinkage raw materials in the glaze, especially large amounts of ball clay or bentonite, which shrink significantly as moisture leaves.',
      'Under-fired bisque — if the bisque is too porous or soft, the glaze may dry too quickly and crack before it can melt and bond.',
      'Touching or rubbing the glazed surface before firing, disrupting the dried glaze layer.',
      'Re-wetting an already dried glaze coat — the second layer of water causes the dry glaze to crack and lift.',
    ],
    fixes: [
      'Clean your bisqueware thoroughly before glazing — a quick rinse under water and full drying removes dust and loose particles.',
      'Apply glaze more thinly. For dipping, aim for a 2–3 second dip. If spraying, build up thin even coats rather than one heavy pass.',
      'Reduce the amount of ball clay or bentonite in the recipe. If you need a suspending agent, try adding a small amount of CMC gum or Veegum instead.',
      'If your bisque is very porous (low-fired), lightly sponge-dampen the surface before glazing so the glaze doesn\'t dry too fast.',
      'Avoid touching glazed surfaces. Use tongs or handle only unglazed areas.',
    ],
    prevention: [
      'Always handle bisqueware with clean hands or gloves.',
      'Store bisque in a clean, covered area to keep dust off.',
      'Test your application thickness on a scrap piece before glazing your best work.',
      'Avoid double-dipping or re-wetting unless the first coat is still wet.',
    ],
  },
  {
    id: 'crazing',
    name: 'Crazing',
    emoji: '🕸️',
    shortDesc: 'Fine network of cracks in the glaze surface, like a cracked eggshell.',
    looksLike:
      'A web of fine hairline cracks covering the glaze surface. The cracks may be visible immediately after the kiln cools or may develop over hours, days, or even weeks. Sometimes you can hear the crazing happening — tiny pinging or ticking sounds from the kiln as it cools. The cracks are only in the glaze, not through the clay body.',
    causes: [
      'The glaze has a higher thermal expansion than the clay body. As the piece cools, the glaze wants to shrink more than the clay underneath, so it cracks under tension.',
      'Too much sodium or potassium (high-expansion fluxes) in the glaze recipe.',
      'Too little silica (SiO₂) or alumina (Al₂O₃) in the glaze — these form the glass network and reduce expansion.',
      'Cooling the kiln too quickly, especially through the quartz inversion range (around 573°C / 1063°F).',
      'Opening the kiln too early while it\'s still hot.',
      'Thin clay walls — thinner pieces are more susceptible because the clay body can\'t resist the glaze tension as well.',
    ],
    fixes: [
      'Add more silica (SiO₂) to the glaze. Silica lowers thermal expansion and strengthens the glass network. Start by adding 5% and testing.',
      'Reduce high-expansion fluxes: sodium (Na₂O) and potassium (K₂O). Replace some of the soda feldspar with a lithium- or calcium-based flux.',
      'Add more alumina (Al₂O₃) through kaolin or alumina hydrate. This stiffens the glaze and reduces expansion.',
      'Slow down the cooling in your kiln, especially between 600°C and 500°C (1112°F–932°F). A controlled cool through this range helps both glaze and clay body adjust together.',
      'Don\'t open the kiln until it\'s below 100°C (212°F).',
    ],
    prevention: [
      'Test new glazes on small tiles before using them on finished work.',
      'Use a clay body and glaze pair that are designed to fit each other. Ask your clay and glaze suppliers for compatibility data.',
      'Always slow-cool through quartz inversion — many kiln controllers have a "slow cool" setting for this.',
      'If a glaze consistently crazes, it may never fit your clay body. Consider switching the glaze recipe rather than trying to patch it.',
    ],
  },
  {
    id: 'shivering',
    name: 'Shivering',
    emoji: '💥',
    shortDesc: 'Glaze chips or flakes off the surface, sometimes in sharp curls.',
    looksLike:
      'Chips, flakes, or curled shards of glaze lifting away from the clay body. Unlike crazing (which is cracks in the glaze), shivering means the glaze is physically separating and peeling off. The flakes can be razor-sharp. Shivering is the opposite problem of crazing — here the glaze is under compression rather than tension.',
    causes: [
      'The glaze has a lower thermal expansion than the clay body. As the piece cools, the clay shrinks more than the glaze, putting the glaze under compression until it buckles and pops off.',
      'Too much silica or lithium in the glaze — these reduce thermal expansion to the point where the glaze doesn\'t expand enough to match the clay.',
      'Glaze applied too thick on rims and edges, where compression forces are concentrated.',
      'Incompatible clay body and glaze combination.',
    ],
    fixes: [
      'Increase the thermal expansion of the glaze by adding more sodium or potassium flux (soda feldspar, nepheline syenite).',
      'Reduce the amount of silica or lithium-based materials in the glaze.',
      'Apply the glaze more thinly, especially on rims and sharp edges where shivering tends to start.',
      'If adjusting the glaze doesn\'t work, try a different clay body with a lower thermal expansion.',
    ],
    prevention: [
      'Always test new glaze and clay body combinations on test tiles before production.',
      'Pay attention to edges and rims — if shivering starts there, it\'s a glaze-fit issue.',
      'Be aware that shivering can be delayed — a piece might look fine out of the kiln and start flaking weeks later.',
      'Shivering produces sharp edges. Any piece that shows shivering should not be used as functional ware.',
    ],
  },
  {
    id: 'pinholing',
    name: 'Pinholing',
    emoji: '📌',
    shortDesc: 'Tiny holes in the glaze surface, like pinholes poked with a needle.',
    looksLike:
      'Small, round holes dotting the glaze surface. They look like someone poked the glaze with a pin or needle while it was molten. The holes may be isolated or clustered. The glaze surface around each pinhole is usually smooth — the glaze melted properly but didn\'t fill in where gas escaped.',
    causes: [
      'Gases escaping from the clay body during firing — organic matter, carbonates, and sulfates in the clay decompose and release gas. If the glaze has already sealed over the surface, the gas bubbles poke through and don\'t heal.',
      'Glaze not reaching full maturity — the kiln didn\'t get hot enough or didn\'t hold at peak temperature long enough for the glaze to smooth over.',
      'Firing too fast — rushing through the middle temperatures (700°C–1000°C / 1292°F–1832°F) doesn\'t allow enough time for gases to burn out before the glaze seals.',
      'Under-fired bisque — if the bisque firing didn\'t burn out all the organics, they\'ll off-gas during the glaze firing instead.',
      'Contamination in the glaze — bits of calcium carbonate (whiting) that didn\'t fully decompose can release CO₂ at the wrong time.',
    ],
    fixes: [
      'Add a 15–30 minute hold (soak) at peak temperature to give the glaze time to heal over pinholes.',
      'Slow down the firing, especially through the "burn-out" zone (700°C–1000°C / 1292°F–1832°F) to let gases escape before the glaze seals.',
      'Fire your bisque higher — take it to at least cone 04 to ensure all organics and carbonates have been burned out.',
      'Make sure your glaze materials are well-ground and thoroughly mixed. Coarse particles of whiting or dolomite can cause localized off-gassing.',
      'Try a slow cool from peak — sometimes dropping 50°C (90°F) and re-soaking helps the glaze smooth over.',
    ],
    prevention: [
      'Bisque fire high enough to burn out all organic matter (cone 04 minimum for most clay bodies).',
      'Don\'t rush the firing. Give the kiln time in the mid-range temperatures.',
      'Hold at peak temperature for at least 10–15 minutes, even if your cone is down.',
      'If using a clay with a lot of organic content (like some red or dark clays), consider a longer bisque hold around 900°C (1652°F).',
    ],
  },
  {
    id: 'blistering',
    name: 'Blistering / Bloating',
    emoji: '🫧',
    shortDesc: 'Large bubbles, craters, or swollen areas in the glaze or clay body.',
    looksLike:
      'Large bubbles, raised blisters, or open craters on the glaze surface. Blisters may be intact (a smooth dome of glaze over a trapped air pocket) or broken (a ragged-edged crater where the bubble popped). Bloating is a related issue where the clay body itself swells and becomes spongy. Severe bloating makes the piece feel lightweight and the clay looks bubbly or foamy inside.',
    causes: [
      'Over-firing — the kiln went too hot, causing materials in the clay or glaze to over-decompose and release excessive gas.',
      'Firing too fast at high temperatures — gases generated too quickly for the molten glaze to release them.',
      'Reduction atmosphere too heavy — strong reduction can generate carbon monoxide trapped in the glaze.',
      'Thick glaze application — thick coats are more likely to trap gas because the molten glaze layer is deeper and gas takes longer to reach the surface.',
      'High-calcium or high-zinc glazes are more prone to blistering because they can generate gas from carbonate decomposition at high temperatures.',
      'Clay body over-fired to the point of bloating — the body itself has started to melt and generate gas internally.',
    ],
    fixes: [
      'Reduce peak temperature or soak time — even 1/2 cone lower can make a significant difference.',
      'Slow down the firing rate in the last 100°C (180°F) before peak.',
      'Lighten reduction if firing in a gas kiln. Let the atmosphere clear before the glaze seals.',
      'Apply glaze more thinly.',
      'For calcium-carbonate-heavy glazes, consider replacing some whiting with wollastonite (calcium silicate), which doesn\'t release CO₂.',
    ],
    prevention: [
      'Use witness cones to verify your actual kiln temperature — digital controllers can be off.',
      'Don\'t over-fire. If cones are bending past their target, your kiln is too hot.',
      'Test glazes at multiple thicknesses to find the sweet spot.',
      'If using a gas kiln, be deliberate about when you introduce and clear reduction.',
    ],
  },
  {
    id: 'running',
    name: 'Running / Dripping',
    emoji: '💧',
    shortDesc: 'Glaze has flowed down the piece and pooled at the bottom or fused to the shelf.',
    looksLike:
      'Thick drips, runs, or curtains of glaze flowing down the surface of the piece. The glaze may pool heavily at the base, fuse the piece to the kiln shelf, or drip off the piece entirely. The top of the piece may look thin or bare where the glaze flowed away.',
    causes: [
      'Glaze applied too thick, especially on vertical surfaces.',
      'Over-firing — the kiln went too hot and the glaze became too fluid.',
      'Too much flux in the glaze recipe — an over-fluxed glaze melts too aggressively and loses viscosity.',
      'Glaze not suitable for vertical surfaces — some glazes are formulated for flat tiles and will run on pots.',
      'Pieces loaded too close to the kiln shelf without enough clearance for drips.',
    ],
    fixes: [
      'Apply glaze more thinly, especially on the lower half of the piece. Many potters glaze the top 2/3 of the piece and let the glaze flow down during firing.',
      'Leave the bottom 1/4 inch of the piece unglazed to create a buffer zone.',
      'Reduce peak temperature.',
      'Add alumina (Al₂O₃) to the glaze — alumina increases viscosity and helps the glaze stay put. Kaolin is the easiest source.',
      'Place pieces on kiln cookies (small discs of kiln shelf) so if the glaze runs, it ruins the cookie instead of your shelf.',
    ],
    prevention: [
      'Always wax or leave the bottom of your pots unglazed.',
      'Test new glazes on a vertical test tile before using them on finished work.',
      'Keep a kiln cookie under any piece glazed with a runny or unknown glaze.',
      'If a glaze is known to run, thin your application on the lower half of the piece.',
    ],
  },
  {
    id: 'color-shift',
    name: 'Color Shift',
    emoji: '🎨',
    shortDesc: 'The fired color looks different from what you expected.',
    looksLike:
      'The glaze color out of the kiln doesn\'t match your preview or what you intended. It may be duller, more muted, a different hue entirely, or unevenly colored. Common shifts include blues turning green, reds turning brown or pink, and colors looking washed out.',
    causes: [
      'Kiln atmosphere — oxidation vs. reduction dramatically changes how colorant oxides develop. A glaze designed for oxidation will look very different in reduction, and vice versa.',
      'Firing temperature off — even 1/2 cone difference can shift color. Under-firing may leave colors underdeveloped; over-firing can burn them out.',
      'Clay body influence — dark or iron-bearing clay bodies can shift glaze colors, especially with thin applications or translucent glazes.',
      'Application thickness — many colorants are thickness-sensitive. Thin areas may look different from thick areas on the same piece.',
      'Colorant interaction — some stains are not stable in certain chemistries. For example, chrome-tin pinks can turn brown or green if there\'s too much zinc in the glaze.',
      'Cooling rate — some colors (especially iron reds and certain crystalline effects) are sensitive to how fast the kiln cools.',
    ],
    fixes: [
      'Verify your firing schedule — use witness cones to confirm actual temperature.',
      'If firing in a gas kiln, check your atmosphere. Consistent light reduction is usually better than heavy or uneven reduction.',
      'Try the glaze on a lighter clay body to see the true color.',
      'Adjust application thickness — make test tiles at thin, medium, and thick to find the best result.',
      'Check stain compatibility with your glaze chemistry. Stain manufacturers publish compatibility charts.',
      'For cooling-sensitive glazes, try a slow cool from peak temperature.',
    ],
    prevention: [
      'Always make test tiles on the same clay body you\'ll use for your finished work.',
      'Fire test tiles in the same kiln and same location where you plan to fire the final piece.',
      'Keep a firing log so you can reproduce successful results.',
      'When using a new stain, check the manufacturer\'s compatibility chart for your glaze chemistry.',
    ],
  },
  {
    id: 'matte-surface',
    name: 'Matte Where Glossy Expected',
    emoji: '🪨',
    shortDesc: 'Glaze should be glossy but came out matte or satin.',
    looksLike:
      'The glaze has a flat, non-reflective surface where you expected a smooth, glossy finish. It may look chalky, dry, or rough to the touch. The color may also appear duller or more muted than expected.',
    causes: [
      'Under-firing — the glaze didn\'t reach full maturity. It may need more heat or a longer soak at peak temperature.',
      'Kiln cooling too slowly through the devitrification range — some glazes can crystallize on a slow cool, turning a glossy surface matte.',
      'Not enough flux in the recipe — the glaze didn\'t fully melt.',
      'Too much alumina — excess alumina stiffens the melt and can prevent a glossy surface from forming.',
      'Glaze contamination — if materials are old, wet, or contaminated, the chemistry may have shifted.',
    ],
    fixes: [
      'Fire higher or add a soak at peak temperature (15–30 minutes).',
      'If slow cooling caused devitrification, try a faster cool after peak. Some potters crash-cool from peak to about 1050°C (1922°F) before slowing down.',
      'Increase the flux in the recipe — add more frit, feldspar, or whiting.',
      'Reduce alumina (kaolin) slightly if the glaze is too stiff.',
      'Mix a fresh batch with new materials to rule out contamination.',
    ],
    prevention: [
      'Always use witness cones to verify temperature — a kiln controller isn\'t always accurate.',
      'Keep glaze materials stored in sealed, dry containers.',
      'Test any recipe changes on tiles before applying to finished work.',
    ],
  },
  {
    id: 'bare-spots',
    name: 'Bare Spots / Crawl-Back',
    emoji: '⭕',
    shortDesc: 'Areas where glaze pulled away, leaving exposed clay patches.',
    looksLike:
      'Isolated bare patches where the glaze has retreated from the clay surface. Different from full crawling — crawl-back is usually localized to specific spots rather than covering the whole surface. The edges of the bare spots may show a thickened rim of glaze that pulled back.',
    causes: [
      'Grease, oil, or wax contamination on the bisqueware surface — even fingerprints can cause localized repelling.',
      'Dust, loose particles, or kiln wash flakes on the surface before glazing.',
      'Glaze applied over a previously waxed area (wax resist that wasn\'t fully removed).',
      'Surface of the bisque is too smooth or vitrified for the glaze to grip — can happen with over-fired bisque.',
      'Water repelling — if the bisqueware was stored in a humid or contaminated environment.',
    ],
    fixes: [
      'Clean bisqueware thoroughly before glazing — rinse under running water and let it dry completely.',
      'Lightly sand any slick or vitrified areas to give the glaze some tooth to grip.',
      'If wax resist is the culprit, burn it off in a low bisque firing before re-glazing.',
      'Apply a thin wash of the same glaze over bare spots and re-fire. This only works if the spots aren\'t caused by contamination that\'s still present.',
    ],
    prevention: [
      'Handle bisqueware with clean hands. Wear nitrile gloves if you\'ve been using lotions, oils, or wax.',
      'Store bisque in a clean, covered area away from dust and kiln wash debris.',
      'Don\'t apply wax resist to areas you intend to glaze (seems obvious, but mistakes happen).',
      'If your bisque has been sitting for a while, rinse it before glazing.',
    ],
  },
  {
    id: 'rough-texture',
    name: 'Rough / Dry Texture',
    emoji: '🧱',
    shortDesc: 'Glaze surface feels rough, gritty, or sandpaper-like instead of smooth.',
    looksLike:
      'The glaze surface feels rough, gritty, or abrasive to the touch. It may look textured or granular rather than smooth. The glaze may have partially melted but doesn\'t have a continuous, smooth surface. In severe cases, it can feel like sandpaper.',
    causes: [
      'Under-firing — the glaze didn\'t get hot enough to fully melt and smooth out.',
      'Glaze applied too thin — not enough material to form a continuous glassy layer.',
      'Refractory materials in the glaze — too much alumina, silica, or other high-melting-point materials that resist melting.',
      'Contamination with kiln shelf grit, dust, or loose kiln brick particles that fell on the piece during firing.',
      'Poor glaze mixing — undissolved clumps or poorly dispersed materials create an uneven melt.',
    ],
    fixes: [
      'Fire higher or add a soak at peak temperature.',
      'Apply glaze thicker — aim for a smooth, even coat that covers the bisque color completely.',
      'Re-fire the piece at the correct cone with a hold at peak.',
      'Sieve your glaze through an 80-mesh screen to remove clumps and ensure even particle size.',
      'If kiln debris is falling on pieces, clean the kiln ceiling and check for loose bricks or deteriorating elements.',
    ],
    prevention: [
      'Mix and sieve glaze thoroughly before every use.',
      'Check specific gravity with a hydrometer to ensure consistent thickness.',
      'Use witness cones to verify temperature.',
      'Clean the inside of your kiln regularly, especially the ceiling and shelf undersides.',
    ],
  },
  {
    id: 'dunting',
    name: 'Dunting (Cracking)',
    emoji: '💔',
    shortDesc: 'Cracks through the entire piece — clay body and glaze — usually during cooling.',
    looksLike:
      'Clean, sharp cracks running through both the glaze and the clay body. Unlike crazing (which is only in the glaze), dunting cracks go all the way through the wall of the piece. The cracks are usually straight or gently curved. A dunted piece may crack into two or more pieces. Dunting most often happens during cooling, but can also occur during heating.',
    causes: [
      'Cooling too fast through the quartz inversion at 573°C (1063°F) — cristobalite and quartz undergo a rapid volume change at this temperature. If the kiln cools too quickly, the sudden contraction cracks the piece.',
      'Cooling too fast through the cristobalite inversion at 226°C (439°F) — pieces with high cristobalite content (from high bisque temperatures or high-silica bodies) are especially vulnerable here.',
      'Uneven thickness in the piece — thin sections cool faster than thick sections, creating stress that leads to cracking.',
      'Opening the kiln too early while it\'s still hot.',
      'Large or flat pieces are more susceptible because they have more surface area under stress.',
    ],
    fixes: [
      'Slow the cooling rate through the danger zones: 600°C–500°C (1112°F–932°F) for quartz inversion, and 250°C–200°C (482°F–392°F) for cristobalite.',
      'Don\'t open the kiln until it\'s completely cool — below 100°C (212°F).',
      'If you can\'t program a slow cool, simply turn the kiln off and leave it closed. Don\'t prop the lid or open peepholes until the kiln is at room temperature.',
      'Dunted pieces cannot be repaired. If a piece cracked into clean halves, some potters use kintsugi (gold repair) as an aesthetic choice.',
    ],
    prevention: [
      'Program a controlled slow cool in your kiln controller, especially through the inversion temperatures.',
      'Design pieces with even wall thickness — avoid dramatic thin-to-thick transitions.',
      'Be especially careful with large flat pieces (platters, tiles) — they are most vulnerable to dunting.',
      'Never open the kiln to peek while it\'s cooling above 200°C.',
    ],
  },
  {
    id: 'sulfur-scumming',
    name: 'Sulfur Scumming',
    emoji: '🟡',
    shortDesc: 'White or yellowish crusty deposits on the clay surface, often under the glaze.',
    looksLike:
      'A white, yellowish, or tan crusty film on the surface of the clay body, sometimes under the glaze. It may look like a powder, a rough crust, or a discolored patch. Sulfur scum is most visible on unglazed areas but can also affect glaze adhesion, causing bare spots or crawling where the scum prevents the glaze from bonding.',
    causes: [
      'Soluble sulfates in the clay body — many natural clays contain calcium sulfate, sodium sulfate, or other soluble salts that migrate to the surface as the piece dries.',
      'High-sulfur water used for mixing clay or glaze.',
      'Under-fired bisque — sulfur compounds may not have fully burned out.',
      'Sulfur from the kiln atmosphere — can happen in gas kilns burning sulfur-containing fuels.',
    ],
    fixes: [
      'Add 1–2% barium carbonate to the clay body. Barium carbonate reacts with soluble sulfates and converts them to insoluble barium sulfate, which stays trapped inside the clay instead of migrating to the surface. (Note: barium carbonate is toxic — handle with care and follow proper safety protocols.)',
      'Fire the bisque higher to burn out more sulfur compounds.',
      'Wash the bisqueware surface with clean water before glazing to remove surface deposits.',
      'If using a gas kiln, check your fuel for sulfur content.',
    ],
    prevention: [
      'Test your clay body for soluble salts before committing to production.',
      'Use clean, low-mineral water for mixing clay and glazes.',
      'Don\'t let bisqueware sit for extended periods in humid conditions, which encourages salt migration.',
      'If your clay is known to scum, incorporate barium carbonate at the clay-mixing stage.',
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

        {/* ─── Still stuck? ─── */}
        <div className="mt-16 card bg-gradient-to-r from-brand-500 to-brand-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            Still Stuck?
          </h2>
          <p className="text-brand-100 mb-6">
            If your glaze issue doesn&apos;t match anything here, or the fixes aren&apos;t working, we&apos;re happy to take a look. Send us a photo and your firing details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/help/contact"
              className="inline-flex items-center justify-center bg-white text-brand-600 hover:bg-clay-50 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Send Us a Message
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Open a Support Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
