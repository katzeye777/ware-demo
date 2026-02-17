/**
 * Demo API Layer — Now powered by the real color engine.
 *
 * Runs entirely in the browser using real fired test data points.
 * The color engine does k-NN + IDW interpolation to generate new recipes
 * and predict their fired colors.
 *
 * Models are separated by cone temperature and atmosphere:
 *   - Cone 6 oxidation (default) — 774 data points
 *   - Cone 10 oxidation — 40 data points
 *   - Reduction data will be added when available
 * Cone 6 and cone 10 are never mixed — they are separate firing environments.
 */

import type {
  GlazeDesignRequest,
  GlazeDesignResponse,
  ColorMatch as APIColorMatch,
  PublicGlaze,
} from './api';
import { colorEngine, stainDisplayName } from './color-engine';
import type { ColorMatch as EngineColorMatch } from './color-engine';
import { COLOR_TEST_DATA } from './color-data';

// ── Initialize color engine on first import ──
// Defaults to cone 6 oxidation. Re-loads when user changes cone or atmosphere.

let loadedCone: number = 0;
let loadedAtmosphere: string = '';

function ensureEngineLoaded(cone: number = 6, atmosphere: string = 'ox') {
  if (loadedCone !== cone || loadedAtmosphere !== atmosphere) {
    colorEngine.loadDataset(COLOR_TEST_DATA, cone, atmosphere);
    loadedCone = cone;
    loadedAtmosphere = atmosphere;
  }
}

/**
 * Change the active firing model. Call this when the user selects
 * a different cone or atmosphere. The engine will reload with only
 * the matching data — no cross-pollination.
 */
export function setFiringModel(cone: number = 6, atmosphere: string = 'ox') {
  ensureEngineLoaded(cone, atmosphere);
}

/** Get the current firing model info. */
export function getFiringModel(): { cone: number; atmosphere: string; dataPoints: number } {
  ensureEngineLoaded(); // ensure loaded with at least defaults
  return {
    cone: colorEngine.cone,
    atmosphere: colorEngine.atmosphere,
    dataPoints: colorEngine.dataPointCount,
  };
}

// ── Shade-aware glaze name generator ──
// Names are organized by color family AND brightness tier (deep/mid/light).
// A dark navy gets "deep" names, a sky blue gets "light" names.

type ColorFamily = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink' | 'brown' | 'neutral' | 'dark' | 'light';
type ShadeTier = 'deep' | 'mid' | 'pale';

const SHADE_NAMES: Record<ColorFamily, Record<ShadeTier, string[]>> = {
  red: {
    deep: [
      'Dragon\'s Breath', 'Red October', 'Crimson Tide', 'Garnet Glow', 'Cardinal Sin',
      'Brick by Brick', 'Mars Attacks', 'Iron Oxide Vibes', 'Ember Island', 'Volcano Season',
      'The Red Wedding (Glaze)', 'Vermillion Thriller', 'Lava Lamp Love', 'Cranberry Courage', 'Red Velvet Revenge',
    ],
    mid: [
      'Hot Take', 'Netflix & Kiln', 'Cherry on Top', 'Red Alert', 'Fired Up',
      'Seeing Red', 'Cayenne Pepper', 'Sriracha Sunrise', 'Cherry Bomb', 'Red Rover',
      'Lobster Thermidor', 'Flame On', 'Firecracker Finish', 'Stop Sign Chic', 'Candy Apple Chaos',
    ],
    pale: [
      'Rose Thorn', 'Siren Song Scarlet', 'Poppy Seed Punk', 'Red Carpet Treatment', 'Crimson & Clover',
      'Tomato Tornado', 'Lady in Red Stoneware', 'Scarlet Fever Dream', 'Ruby Slippers', 'Hot Tamale',
      'Code Red Couture', 'Rage Against the Glaze', 'Red Planet', 'Boldly Going Red', 'Devilish Charm',
    ],
  },
  orange: {
    deep: [
      'Burnt Offering', 'Rust Never Sleeps', 'Terracotta Warrior', 'Copper Top', 'Adobe Illustrator',
      'Ember Glow', 'Bonfire Night', 'Flame Broiled', 'Copper Penny Lane', 'Mars Rover',
      'Tobacco Road Trip', 'Cider House Rules', 'Salamander Style', 'Fox in the Henhouse', 'Harvest Moon Rising',
    ],
    mid: [
      'Sunset Boulevard', 'Pumpkin Spice & Everything Nice', 'Tangerine Dream Machine', 'Clementine Dream', 'Orange Is the New Glaze',
      'Campfire Stories', 'Mango Unchained', 'Marigold Standard', 'Tiger Lily Pad', 'Nectarine Machine',
      'Persimmon Says', 'Mandarin Collar', 'Satsuma Sumo', 'Tang Dynasty', 'Pumpkin Patch Adams',
    ],
    pale: [
      'Peach Please', 'Apricot Situation', 'Golden Hour', 'Marmalade Sky', 'Cantaloupe Elope',
      'Butterscotch Bandit', 'Sweet Potato Pie', 'Papaya Don\'t Preach', 'Daybreak', 'Candlelight Vigil',
      'Ginger Snap Decision', 'Kumquat Kudos', 'Cheddar Days', 'Caution Tape Couture', 'Nacho Average Glaze',
    ],
  },
  yellow: {
    deep: [
      'Goldfinger', 'Saffron So Good', 'Mustard Seed of Doubt', 'Curry Favor', 'King Midas Mix',
      'Harvest Gold Standard', 'Amber Waves', 'Dijon Vu', 'Turmeric & Turmoil', 'Topaz Tango',
      'Gilded Age', 'Gold Rush Hour', 'Fields of Gold', 'Fool\'s Gold Rush', 'Citrine Scene',
    ],
    mid: [
      'Mellow Yellow', 'Sunshine State of Mind', 'Sunflower Power', 'Bee\'s Knees', 'Solar Flair',
      'Yolk\'s on You', 'Yellow Brick Road', 'Corn Star', 'Pineapple Express', 'Yellow Submarine',
      'Mac & Cheese Louise', 'Bananas Foster', 'Buttercup Bravado', 'Maize Runner', 'Electric Slide (Gold)',
    ],
    pale: [
      'Liquid Sunshine', 'Honey I\'m Home', 'Golden Child', 'Butter Me Up', 'Lemon Drop It Like It\'s Hot',
      'Dandelion Wishes', 'Lemon Zest for Life', 'Daffodil Delight', 'Champagne Problems', 'Daisy Chain',
      'Lemonade Stand', 'Egg Yolk of Dawn', 'Flax to the Max', 'Straw Poll', 'Beeswax Poetic',
    ],
  },
  green: {
    deep: [
      'Forest Bathing', 'Emerald City Limits', 'Ivy League', 'Pine Sol Brother', 'Spruce Willis',
      'Malachite Manifest', 'Serpentine Surprise', 'Verdigris Verdict', 'Moss Def', 'Moss Angeles',
      'Fern Gully', 'Greenhouse Effect', 'Juniper Breeze', 'Patina Party', 'Verde Verdict',
    ],
    mid: [
      'Kermit\'s Envy', 'Mean, Green, Ceramic Machine', 'Jade Roller Coaster', 'Kelly Green Jelly Bean', 'Shamrock Shake Down',
      'The Grass Is Glazer', 'Clover Field', 'Pickle Rick', 'Frog Prince', 'Leaf Me Alone',
      'Green Day Dream', 'Artichoke Heart', 'Broccoli Rob', 'Pea Coat', 'Chloro-filled With Joy',
    ],
    pale: [
      'Sage Advice', 'Matcha Made in Heaven', 'Mint Condition', 'Pistachio Finish', 'Celadon My Wayward Son',
      'Aloe There', 'Chartreuse the Day', 'Avocado Toast of the Town', 'Succulent Success', 'Lichen Subscribe',
      'Thyme After Thyme', 'Eucalyptus Epiphany', 'Garden Variety Gorgeous', 'Basil Fawlty', 'Green With Envases',
    ],
  },
  teal: {
    deep: [
      'Deep End of the Pool', 'Atlantis Found', 'Neptune\'s Throne', 'Abyss-mal Beauty', 'Deep Sea Disco',
      'Bermuda Triangle', 'Caspian Casanova', 'Maelstrom Mellow', 'Sargasso Sass', 'Fjord Explorer',
      'Kelp Me Rhonda', 'Reef Madness', 'Monsoon Mood', 'Blue Lagoon Platoon', 'Pacific Standard Teal',
    ],
    mid: [
      'Teal the End of Time', 'Ocean Motion', 'Mermaid Money', 'Turquoise & Calamity', 'Teal We Meet Again',
      'Tidal Wave Hello', 'Under the Sea-ramic', 'Calypso Breeze', 'Nautical Nonsense', 'Corsica Crush',
      'Teal Deal', 'Lagoon Tunes', 'Marina Del Glaze', 'Pelago Panache', 'Shoal Business',
    ],
    pale: [
      'Aqua Velvet', 'Sea You Later', 'Surf\'s Up Buttercup', 'Seafoam & Circumstance', 'Seaside Serenade',
      'Current Mood: Teal', 'Seaglass Serenade', 'Harbor Lights', 'Atoll of Surprises', 'Estuary Elegance',
      'Scuba Doo', 'Wave Goodbye', 'Aqua-ward Silence', 'Oyster Bay Area', 'Whale Hello There',
    ],
  },
  blue: {
    deep: [
      'Mood Indigo', 'Midnight Snack', 'Navy SEAL of Approval', 'Deep Blue Something', 'Prussian Roulette',
      'Ultramarine Corps', 'Starry Night Shift', 'Twilight Zone Blue', 'Mazzerine Canteen', 'Blue Ridge Mountain',
      'Cobalt Intentions', 'Lapis Lazuli Dazuli', 'Once in a Blue Kiln', 'Royal Flush of Blue', 'The Blues Brothers',
    ],
    mid: [
      'Feelin\' Blue-tiful', 'Blue Steel', 'True Blue Brew', 'Blueprint', 'Sapphire So Good',
      'Denim & Diamonds', 'Cerulean & Certain', 'Ocean\'s Eleven Blue', 'Ol\' Blue Eyes', 'Jazz in Blue',
      'Bluetiful Day', 'Da Ba Dee Da Ba Die', 'Blue\'s Clues & Glazes', 'Fjord Focus', 'Steel Town Blue',
    ],
    pale: [
      'Sky\'s the Limit', 'Azure You Sure?', 'Baby Blue Bayou', 'Beyond the Pale Blue', 'Ice Ice Baby Blue',
      'Periwinkle Twinkle', 'Cornflower Power Hour', 'Powder Room', 'Catalina Sky', 'Yonder Blue',
      'Cold Shoulder Blue', 'Stratosphere', 'Cyan Later', 'Bluebell Bottom', 'Delphi Blue Oracle',
    ],
  },
  purple: {
    deep: [
      'Purple Reign', 'Thanos Approved', 'Eggplant Emoji Energy', 'Aubergine Dream', 'Tyrian Try-hard',
      'Byzantium & Bass', 'Blackberry Cobbler', 'Indigo Montoya', 'Elderberry Statement', 'Wine Not',
      'Concord Grape Escape', 'Fig Newton\'s Law', 'Damson in Distress', 'Prune Tune', 'Sangria Sunset',
    ],
    mid: [
      'Grape Expectations', 'Violet Femmes', 'Amethyst of Time', 'Prince of Tiles', 'Plum Crazy',
      'Imperial Decree', 'Jam Session', 'Purple Haze Craze', 'Violet Hour', 'His Royal Glazeness',
      'Royal Jelly Roll', 'Boysenberry Binge', 'Hibiscus Ruckus', 'Radicchio Radical', 'Plum Line',
    ],
    pale: [
      'Lavender Haze (It\'s Me, Hi)', 'Your Royal Glaze-ness', 'Orchid You Not', 'Wisteria Lane', 'Iris I May',
      'Mauve-rick', 'Lilac Attack', 'Heliotrope It Up', 'Thistle While You Work', 'Crocus Pocus',
      'Twilight Sparkle', 'Magenta-l Breakdown', 'Plum\'s the Word', 'Purple Prose', 'Mulberry Bush League',
    ],
  },
  pink: {
    deep: [
      'Hot Pink Panther', 'Fuchsia Is Futile', 'Magenta Agenda', 'Beet Drop', 'Dragonfruit Drama',
      'Rhubarb Crumble', 'Berry Interesting', 'Cosmopolitan', 'Passionfruit Punch', 'Watermelon Sugar',
      'Hibiscus Kiss', 'Prima Donna Pink', 'Strawberry Fields Forever', 'Sakura Storm', 'Begonia Bonanza',
    ],
    mid: [
      'Think Pink', 'Flamingo Dancer', 'Rose All Day', 'Pink Floyd', 'Tickled Pink',
      'Coral Story, Bro', 'Carnation Street', 'Pink Cadillac', 'Flamingo Road', 'Guava La Vista',
      'Tulip Fever', 'Prom Night Pink', 'Azalea A-List', 'Pink Lemonade Stand', 'Camellia Court',
    ],
    pale: [
      'Blush Hour', 'Millennial Pink (Still Relevant)', 'Salmon Rushdie', 'Cotton Candy Crush', 'Bubblegum Pop',
      'La Vie en Rose', 'Peach Pit', 'Petal Pusher', 'Ballet Slipper', 'Rose Quartz Quest',
      'Blush Fund', 'Conch Shell Game', 'Pink Slip (the Good Kind)', 'Lychee Liberty', 'Candy Floss Boss',
    ],
  },
  brown: {
    deep: [
      'Espresso Yourself', 'Chocolate Thunder', 'Fifty Shades of Clay', 'Walnut Whip', 'Cocoa Loco',
      'Truffle Shuffle', 'Dark Roast Coast', 'Ganache Panache', 'Pumpernickel Pickle', 'Burnt Toast of the Town',
      'Grounds for Divorce', 'Leather Bound & Down', 'Bark Worse Than Bite', 'Tobacco Road Trip', 'Saddle Up',
    ],
    mid: [
      'Mocha Lotta Love', 'Cinnamon Toast Kiln', 'Coffee First', 'Hazelnut Hustle', 'Toffee Nose',
      'Caramel Macchi-pot-o', 'Sienna Miller Time', 'Chestnut Roasting', 'Brownie Points', 'Nutmeg Nerd',
      'Terracotta Warrior', 'Gingerbread Architect', 'Tamarind Tango', 'Allspice Advice', 'Timber Tantrum',
    ],
    pale: [
      'Latte Art School', 'Almond Joy Division', 'Pecan Pie Chart', 'S\'mores the Merrier', 'Bean There Done That',
      'Mushroom Cloud Nine', 'Driftwood Daydream', 'Cork Board Meeting', 'Biscotti Bandito', 'Peanut Butter Jelly Time',
      'Khaki Wacky', 'Maple Story', 'Teak Peek', 'Sepia Tone Poem', 'Coconut Husk Musk',
    ],
  },
  neutral: {
    deep: [
      'Graphite Attitude', 'Steel Yourself', 'Iron Maiden (Glaze Edition)', 'Battleship Potemkin', 'Slate of the Art',
      'Titanium Cranium', 'Cobblestone Throne', 'Iron Will Power', 'Chrome Dome Home', 'Meteorite Delight',
      'Cement Your Legacy', 'Grayscale of Justice', 'Shale Mail', 'Cinder-ella', 'Iron Curtain Call',
    ],
    mid: [
      'Fifty Shades of Grey', 'Concrete Jungle', 'Stone Cold Stunner', 'Pewter Pan', 'Smoke & Mirrors',
      'Elephant in the Room', 'Pebble Beach Body', 'Gravel Travel', 'Chinchilla Thriller', 'Zinc About It',
      'Flannel Feelings', 'Nickel & Dime Store', 'Monochrome Syndrome', 'Steel Magnolia', 'Zinc Sync',
    ],
    pale: [
      'Silver Lining', 'Fog Machine', 'Cloudy With a Chance', 'Dove Bar None', 'Mercury Rising',
      'Overcast & Overjoyed', 'Haze Days', 'Frost Advisory', 'Moonstone Cold', 'Quicksilver Lining',
      'Drizzle Sizzle', 'Platinum Blonde Ambition', 'Pumice Party', 'Rainy Day Fund', 'Dusty Springfield',
    ],
  },
  dark: {
    deep: [
      'Dark Side of the Kiln', 'Void Where Prohibited', 'Into the Abyss', 'Shadow Realm', 'Event Horizon',
      'Vantablack Tie', 'None More Black', 'Total Eclipse', 'Black Mirror Finish', 'Obsidian Flow',
      'Abyss Gazes Back', 'Dark Matter of Fact', 'Velvet Underground', 'Tar Pit Grit', 'Black Mamba',
    ],
    mid: [
      'Dark Mode', 'Midnight Express', 'Onyx & On', 'Pitch Perfect', 'Coal Comfort',
      'Inkwell Done', 'Raven Mad', 'The Darkest Timeline', 'Black Gold Texas Tea', 'Gotham After Dark',
      'Dark Roast Coast', 'Charcoal Sketch Comedy', 'Noir Narrative', 'Nighthawk Diner', 'Shadow Puppet Show',
    ],
    pale: [
      'Black Sheep Chic', 'Dark Horse Race', 'Carbon Copy Cat', 'Sable Fable', 'Black Tie Optional',
      'After Midnight Mint', 'Panther Paw', 'Darkroom Bloom', 'Graphene Scene', 'New Moon Mood',
      'Blackout Curtain Call', 'Raven\'s Caw-fee', 'Licorice Twist', 'Deep Space Nine Glaze', 'Batman\'s Cape',
    ],
  },
  light: {
    deep: [
      'Bone Dry Wit', 'Porcelain Throne', 'Pearl Clutcher', 'Ivory Tower Power', 'Eggshell Game',
      'Opal Optimism', 'Alabaster Disaster (Not)', 'Bone China Syndrome', 'Seashell Sell', 'Dove Tail Cocktail',
      'Talcum Calm', 'Paper Moon', 'Arctic Fox Trot', 'Milk & Honey Do', 'Feather Duster Buster',
    ],
    mid: [
      'Cloud Nine', 'Vanilla Sky-high', 'Linen & Things', 'Cream of the Crop', 'Clean Slate',
      'Blank Canvas Energy', 'Off-White Album', 'Marshmallow Pillow', 'Coconut Milk Run', 'Rice Paper Trail',
      'Meringue Wave', 'Cotton Ball Drop', 'Angel Food Cake Walk', 'Daisy Fresh Prince', 'Starlight Express',
    ],
    pale: [
      'Snow Problem', 'Pale Ale-baster', 'Whiteout Conditions', 'Ghost Protocol', 'Wedding Dress Rehearsal',
      'Sugar Coat of Arms', 'Chalk Talk', 'Snowflake Unique', 'Milk Glass Act', 'Cauliflower Power',
      'Frosted Flake', 'Birch Please', 'Moonbeam Team', 'Cumulus Hummus', 'Powder Puff Stuff',
    ],
  },
};

function classifyColor(hex: string): { family: ColorFamily; tier: ShadeTier } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;

  // Determine shade tier based on brightness
  const tier: ShadeTier = brightness < 90 ? 'deep' : brightness > 180 ? 'pale' : 'mid';

  // Very dark
  if (brightness < 40) return { family: 'dark', tier };
  // Very light
  if (brightness > 220 && sat < 40) return { family: 'light', tier };
  // Low saturation = neutral
  if (sat < 30) {
    const family = brightness > 140 ? 'light' : brightness > 60 ? 'neutral' : 'dark';
    return { family, tier };
  }

  // Hue-based classification
  const hue = (() => {
    if (max === min) return 0;
    let h = 0;
    if (max === r) h = ((g - b) / (max - min)) % 6;
    else if (max === g) h = (b - r) / (max - min) + 2;
    else h = (r - g) / (max - min) + 4;
    h *= 60;
    if (h < 0) h += 360;
    return h;
  })();

  // Brown detection: low-mid brightness, warm hue, moderate saturation
  if (hue >= 15 && hue <= 45 && brightness < 160 && sat < 150) return { family: 'brown', tier };
  if (hue >= 0 && hue <= 30 && brightness < 120 && sat < 120) return { family: 'brown', tier };

  // Pink detection: high red, moderate blue, low green
  if (r > 180 && b > 100 && g < b && g < r) return { family: 'pink', tier };
  if (hue >= 300 && hue <= 360 && brightness > 120) return { family: 'pink', tier };

  let family: ColorFamily;
  if (hue >= 0 && hue < 15) family = 'red';
  else if (hue >= 15 && hue < 45) family = 'orange';
  else if (hue >= 45 && hue < 70) family = 'yellow';
  else if (hue >= 70 && hue < 160) family = 'green';
  else if (hue >= 160 && hue < 200) family = 'teal';
  else if (hue >= 200 && hue < 270) family = 'blue';
  else if (hue >= 270 && hue < 330) family = 'purple';
  else if (hue >= 330) family = 'red';
  else family = 'neutral';

  return { family, tier };
}

// Track used names within a single findGlaze call to prevent duplicates
let usedNamesThisRound: Set<string> = new Set();

function generateGlazeName(hex: string, index: number): string {
  const { family, tier } = classifyColor(hex);
  const pool = SHADE_NAMES[family][tier];

  // Start at a deterministic offset based on the hex for variety
  const hexOffset = parseInt(hex.slice(1, 4), 16) % pool.length;
  const baseIndex = (hexOffset + index) % pool.length;

  // Find the first unused name starting from baseIndex
  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[(baseIndex + i) % pool.length];
    if (!usedNamesThisRound.has(candidate)) {
      usedNamesThisRound.add(candidate);
      return candidate;
    }
  }

  // Fallback: try other tiers in the same family
  const allTiers: ShadeTier[] = ['deep', 'mid', 'pale'];
  for (const t of allTiers) {
    if (t === tier) continue;
    const fallbackPool = SHADE_NAMES[family][t];
    for (let i = 0; i < fallbackPool.length; i++) {
      if (!usedNamesThisRound.has(fallbackPool[i])) {
        usedNamesThisRound.add(fallbackPool[i]);
        return fallbackPool[i];
      }
    }
  }

  return `${family.charAt(0).toUpperCase() + family.slice(1)} #${index + 1}`;
}

// ── Pricing logic ──

function estimatePrice(batchSizeGrams: number, isPrivate: boolean, format: 'dry' | 'wet' = 'dry'): number {
  let base = (batchSizeGrams / 350) * 15;
  if (format === 'wet') base *= 1.30; // 30% surcharge for pre-mixed
  const privateSurcharge = isPrivate ? 4.99 : 0;
  return Math.round((base + privateSurcharge) * 100) / 100;
}

// ── Transform engine match → API match ──

function engineToApiMatch(match: EngineColorMatch, index: number): APIColorMatch {
  return {
    glaze_id: `match-${index}-${Date.now()}`,
    glaze_name: generateGlazeName(match.predicted_hex, index),
    color_hex: match.predicted_hex,
    delta_e: match.delta_e,
    confidence: match.confidence,
    preview_image_url: undefined,
  };
}

// ── Main API functions ──

export async function findGlaze(
  data: GlazeDesignRequest
): Promise<GlazeDesignResponse> {
  // Use cone from request if provided, otherwise default to cone 6 oxidation
  const cone = data.firing_temp_cone ? Number(data.firing_temp_cone) : 6;
  ensureEngineLoaded(cone, loadedAtmosphere || 'ox');

  const result = colorEngine.matchFromHex(data.target_color_hex);

  // Reset used names for this round of results
  usedNamesThisRound = new Set();

  const primaryMatch = engineToApiMatch(result.primary_match, 0);
  const alternatives = result.alternatives.map((alt, i) => engineToApiMatch(alt, i + 1));

  return {
    primary_match: primaryMatch,
    alternatives,
    out_of_gamut: result.is_out_of_gamut,
    out_of_gamut_reason: result.gamut_explanation || undefined,
    estimated_price: estimatePrice(data.batch_size_grams, false, data.format || 'dry'),
  };
}

export async function generatePreview(
  colorHex: string,
  finish: string = 'glossy'
): Promise<{ image_url: string; prompt_used: string }> {
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color_hex: colorHex, finish }),
    });

    if (!response.ok) {
      throw new Error(`Preview API error: ${response.status}`);
    }

    return await response.json();
  } catch {
    const hex = colorHex.replace('#', '');
    return {
      image_url: `https://placehold.co/512x512/${hex}/white?text=Preview`,
      prompt_used: 'Placeholder (API unavailable)',
    };
  }
}

// ── Stub functions for UI compatibility ──

export async function saveGlaze(data: {
  name: string;
  target_color_hex: string;
  finish: string;
  batch_size_grams: number;
  selected_match_id: string;
  is_private: boolean;
}) {
  const saved = {
    id: `saved-${Date.now()}`,
    user_id: 'demo-user',
    ...data,
    created_at: new Date().toISOString(),
    preview_image_url: undefined,
  };

  const existing = JSON.parse(localStorage.getItem('ware_saved_glazes') || '[]');
  existing.push(saved);
  localStorage.setItem('ware_saved_glazes', JSON.stringify(existing));

  return saved;
}

export function getUserGlazes() {
  return JSON.parse(localStorage.getItem('ware_saved_glazes') || '[]');
}

export function getPublicGlazes(): PublicGlaze[] {
  return [];
}

// ── Demo API singleton ──

export const demoApi = {
  findGlaze,
  generatePreview,
  saveGlaze,
  getUserGlazes,
  getPublicGlazes,
};
