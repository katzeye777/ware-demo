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

// ── Cheeky glaze name generator ──
// Each color family has a pool of fun, unique names.
// The index ensures no two alternatives get the same name.

type ColorFamily = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink' | 'brown' | 'neutral' | 'dark' | 'light';

const NAME_POOLS: Record<ColorFamily, string[]> = {
  red: [
    'Dragon\'s Breath', 'Hot Take', 'Netflix & Kiln', 'Seeing Red', 'Cherry on Top',
    'Not a Phase, Mom', 'Red Alert', 'Cayenne Pepper', 'The Redder the Better', 'Fired Up',
    'Like a Boss Sauce', 'Devilish Charm', 'Crimson Tide', 'Boldly Going Red', 'This Is Fine (It\'s Fire)',
    'Red Carpet Treatment', 'Stop Sign Chic', 'Sriracha Sunrise', 'Code Red Couture', 'Rage Against the Glaze',
    'Brick by Brick', 'Ruby Slippers', 'Scarlet Fever Dream', 'Lady in Red Stoneware', 'Tomato Tornado',
    'Mars Attacks', 'Red October', 'Cardinal Sin', 'The Red Wedding (Glaze)', 'Vermillion Thriller',
    'Cherry Bomb', 'Red Rover', 'Candy Apple Chaos', 'Garnet Glow', 'Flame On',
    'Poppy Seed Punk', 'Lobster Thermidor', 'Blood Orange Theory', 'Siren Song Scarlet', 'Ember Island',
    'Red Velvet Revenge', 'Hot Tamale', 'Firecracker Finish', 'Iron Oxide Vibes', 'Crimson & Clover',
    'Lava Lamp Love', 'Red Planet', 'Rose Thorn', 'Cranberry Courage', 'Volcano Season',
  ],
  orange: [
    'Agent Orange You Glad', 'Clementine Dream', 'Sunset Boulevard', 'Burnt Offering', 'Pumpkin Spice & Everything Nice',
    'Orange You Beautiful', 'Autumn Calling', 'Marmalade Sky', 'Golden Hour', 'Tang Dynasty',
    'Campfire Stories', 'Peach Please', 'Apricot Situation', 'Copper Top', 'Ember Glow',
    'Nacho Average Glaze', 'Tangerine Dream Machine', 'Rust Never Sleeps', 'Carrot Top Secret', 'Mango Unchained',
    'Orange Is the New Glaze', 'Sweet Potato Pie', 'Amber Alert (Relax, It\'s Pretty)', 'Papaya Don\'t Preach', 'Butterscotch Bandit',
    'Ginger Snap Decision', 'Harvest Moon Rising', 'Persimmon Says', 'Cantaloupe Elope', 'Marigold Standard',
    'Turmeric Turnout', 'Pumpkin Patch Adams', 'Kumquat Kudos', 'Mandarin Collar', 'Fox in the Henhouse',
    'Cheddar Days', 'Flame Broiled', 'Tiger Lily Pad', 'Nectarine Machine', 'Adobe Illustrator',
    'Terracotta Warrior', 'Cider House Rules', 'Satsuma Sumo', 'Copper Penny Lane', 'Candlelight Vigil',
    'Caution Tape Couture', 'Daybreak', 'Mars Rover', 'Salamander Style', 'Bonfire Night',
  ],
  yellow: [
    'Mellow Yellow', 'Liquid Sunshine', 'Honey I\'m Home', 'Golden Child', 'Butter Me Up',
    'Sunshine State of Mind', 'Lemon Drop It Like It\'s Hot', 'Fields of Gold', 'Dandelion Wishes', 'Yellow Brick Road',
    'Corn Star', 'Main Character Energy (Gold)', 'Goldfinger', 'Sunflower Power', 'Saffron So Good',
    'Taxi Cab Confession', 'Bee\'s Knees', 'Mustard Seed of Doubt', 'Yolk\'s on You', 'Gilded Age',
    'Goldilocks Zone', 'Blonde Ambition', 'Canary in a Coal Mine', 'Straw Poll', 'Dijon Vu',
    'Beeswax Poetic', 'Gold Rush Hour', 'Lemon Zest for Life', 'Daffodil Delight', 'Bananas Foster',
    'Curry Favor', 'Daisy Chain', 'Electric Slide (Gold)', 'Pineapple Express', 'Buttercup Bravado',
    'Harvest Gold Standard', 'Champagne Problems', 'Amber Waves', 'Solar Flair', 'Mac & Cheese Louise',
    'King Midas Mix', 'Maize Runner', 'Citrine Scene', 'Flax to the Max', 'Turmeric & Turmoil',
    'Yellow Submarine', 'Fool\'s Gold Rush', 'Egg Yolk of Dawn', 'Topaz Tango', 'Lemonade Stand',
  ],
  green: [
    'Kermit\'s Envy', 'It\'s Not Easy Being Green', 'Mean, Green, Ceramic Machine', 'Sage Advice', 'Forest Bathing',
    'Jade Roller Coaster', 'Moss Def', 'Olive Garden (No Breadsticks)', 'Emerald City Limits', 'Matcha Made in Heaven',
    'Mint Condition', 'Green With Envases', 'Fern Gully', 'Pistachio Finish', 'Celadon My Wayward Son',
    'Soylent Green Screen', 'Avocado Toast of the Town', 'Chloro-filled With Joy', 'The Grass Is Glazer', 'Shamrock Shake Down',
    'Basil Fawlty', 'Green Day Dream', 'Money Talks Green', 'Pine Sol Brother', 'Spruce Willis',
    'Juniper Breeze', 'Lime in the Coconut', 'Pickle Rick', 'Ivy League', 'Leaf Me Alone',
    'Patina Party', 'Verde Verdict', 'Garden Variety Gorgeous', 'Thyme After Thyme', 'Eucalyptus Epiphany',
    'Malachite Manifest', 'Clover Field', 'Pea Coat', 'Chartreuse the Day', 'Aloe There',
    'Greenhouse Effect', 'Kelly Green Jelly Bean', 'Serpentine Surprise', 'Broccoli Rob', 'Moss Angeles',
    'Frog Prince', 'Artichoke Heart', 'Succulent Success', 'Verdigris Verdict', 'Lichen Subscribe',
  ],
  teal: [
    'Teal the End of Time', 'Teal Deal', 'Deep End of the Pool', 'Aqua Velvet', 'Ocean Motion',
    'Lagoon Tunes', 'Tropical Depression (Pretty One)', 'Mermaid Money', 'Sea You Later', 'Surf\'s Up Buttercup',
    'Coral Reef Belief', 'Wave Goodbye', 'Under the Sea-ramic', 'Turquoise & Calamity', 'Seaside Serenade',
    'Atlantis Found', 'Teal We Meet Again', 'Poseidon Adventure', 'Seafoam & Circumstance', 'Current Mood: Teal',
    'Aqua-ward Silence', 'Tide Pod (Don\'t Eat It)', 'Marina Del Glaze', 'Reef Madness', 'Calypso Breeze',
    'Blue Lagoon Platoon', 'Deep Sea Disco', 'Oyster Bay Area', 'Brackish Bliss', 'Whale Hello There',
    'Neptune\'s Throne', 'Bermuda Triangle', 'Caspian Casanova', 'Abyss-mal Beauty', 'Kelp Me Rhonda',
    'Maelstrom Mellow', 'Tidal Wave Hello', 'Sargasso Sass', 'Nautical Nonsense', 'Seaglass Serenade',
    'Fjord Explorer', 'Shoal Business', 'Pelago Panache', 'Atoll of Surprises', 'Corsica Crush',
    'Scuba Doo', 'Estuary Elegance', 'Monsoon Mood', 'Pacific Standard Teal', 'Harbor Lights',
  ],
  blue: [
    'Feelin\' Blue-tiful', 'Kind of a Big Teal', 'Mood Indigo', 'Blue Steel', 'Midnight Snack',
    'Sky\'s the Limit', 'Navy SEAL of Approval', 'Cobalt Intentions', 'Berry Blue-tiful', 'Da Ba Dee Da Ba Die',
    'Blueprint', 'Azure You Sure?', 'Sapphire So Good', 'True Blue Brew', 'Deep Blue Something',
    'Bluetiful Day', 'Out of the Blue Print', 'Blue\'s Clues & Glazes', 'Denim & Diamonds', 'Lapis Lazuli Dazuli',
    'Cerulean & Certain', 'Periwinkle Twinkle', 'Blueberry Muffin Top', 'Cornflower Power Hour', 'Prussian Roulette',
    'Once in a Blue Kiln', 'Ol\' Blue Eyes', 'Royal Flush of Blue', 'Baby Blue Bayou', 'Beyond the Pale Blue',
    'Ultramarine Corps', 'Fjord Focus', 'Delphi Blue Oracle', 'Stratosphere', 'Ice Ice Baby Blue',
    'Jazz in Blue', 'Mazzerine Canteen', 'Steel Town Blue', 'Cornflake Blue', 'Bluebell Bottom',
    'Ocean\'s Eleven Blue', 'Blue Ridge Mountain', 'Starry Night Shift', 'Cyan Later', 'Powder Room',
    'Cold Shoulder Blue', 'Catalina Sky', 'The Blues Brothers', 'Yonder Blue', 'Twilight Zone Blue',
  ],
  purple: [
    'Purple Reign', 'Your Royal Glaze-ness', 'Grape Expectations', 'Lavender Haze (It\'s Me, Hi)', 'Thanos Approved',
    'Plum\'s the Word', 'Violet Femmes', 'Eggplant Emoji Energy', 'Amethyst of Time', 'Majestic AF',
    'The Purple People Eater', 'Orchid You Not', 'Wisteria Lane', 'Iris I May', 'Aubergine Dream',
    'Prince of Tiles', 'Ultraviolet Tendencies', 'Barney\'s Revenge', 'Plum Crazy', 'Tyrian Try-hard',
    'Mauve-rick', 'Imperial Decree', 'Boysenberry Binge', 'His Royal Glazeness', 'Purple Prose',
    'The Color Purple Rain', 'Byzantium & Bass', 'Mulberry Bush League', 'Heliotrope It Up', 'Concord Grape Escape',
    'Lilac Attack', 'Fig Newton\'s Law', 'Magenta-l Breakdown', 'Damson in Distress', 'Prune Tune',
    'Hibiscus Ruckus', 'Jam Session', 'Elderberry Statement', 'Wine Not', 'Thistle While You Work',
    'Blackberry Cobbler', 'Violet Hour', 'Royal Jelly Roll', 'Indigo Montoya', 'Crocus Pocus',
    'Sangria Sunset', 'Radicchio Radical', 'Plum Line', 'Twilight Sparkle', 'Purple Haze Craze',
  ],
  pink: [
    'On Wednesdays We Wear Pink', 'Think Pink', 'Flamingo Dancer', 'Blush Hour', 'Rose All Day',
    'Pink Floyd', 'Tickled Pink', 'Millennial Pink (Still Relevant)', 'Salmon Rushdie', 'Coral Story, Bro',
    'Peach Pit', 'Cotton Candy Crush', 'Bubblegum Pop', 'La Vie en Rose', 'Carnation Street',
    'Hot Pink Panther', 'Fuchsia Is Futile', 'Pink Cadillac', 'Berry Interesting', 'Rosé All Day Every Day',
    'Pink-credible', 'Candy Floss Boss', 'Tutu Much', 'Petal Pusher', 'Magenta Agenda',
    'Blush Fund', 'Shrimp Cocktail Hour', 'Flamingo Road', 'Guava La Vista', 'Beet Drop',
    'Rhubarb Crumble', 'Dragonfruit Drama', 'Tulip Fever', 'Pink Slip (the Good Kind)', 'Lychee Liberty',
    'Conch Shell Game', 'Ballet Slipper', 'Prom Night Pink', 'Hibiscus Kiss', 'Watermelon Sugar',
    'Cosmopolitan', 'Camellia Court', 'Passionfruit Punch', 'Prima Donna Pink', 'Rose Quartz Quest',
    'Sakura Storm', 'Begonia Bonanza', 'Pink Lemonade Stand', 'Azalea A-List', 'Strawberry Fields Forever',
  ],
  brown: [
    'Espresso Yourself', 'Mocha Lotta Love', 'Fifty Shades of Clay', 'Chocolate Thunder', 'Hazelnut Hustle',
    'Cinnamon Toast Kiln', 'Coffee First', 'Leather Bound & Down', 'Walnut Whip', 'Mud Season Chic',
    'Chestnut Roasting', 'Toffee Nose', 'Caramel Macchi-pot-o', 'Umber-lievable', 'Sienna Miller Time',
    'Grounds for Divorce', 'Cocoa Loco', 'Truffle Shuffle', 'Nutmeg Nerd', 'Brownie Points',
    'Latte Art School', 'Almond Joy Division', 'Pecan Pie Chart', 'S\'mores the Merrier', 'Bean There Done That',
    'Acorn Squash Goals', 'Bark Worse Than Bite', 'Maple Story', 'Cork Board Meeting', 'Tobacco Road Trip',
    'Mushroom Cloud Nine', 'Driftwood Daydream', 'Praline Praxis', 'Cardboard Box Office', 'Gingerbread Architect',
    'Teddy Bear Necessities', 'Earthworm Jim Bean', 'Biscotti Bandito', 'Peanut Butter Jelly Time', 'Khaki Wacky',
    'Saddle Up', 'Tamarind Tango', 'Sepia Tone Poem', 'Pumpernickel Pickle', 'Coconut Husk Musk',
    'Burnt Toast of the Town', 'Teak Peek', 'Ganache Panache', 'Allspice Advice', 'Timber Tantrum',
  ],
  neutral: [
    'Fifty Shades of Grey', 'Concrete Jungle', 'Silver Lining', 'Stone Cold Stunner', 'Ashen Faced',
    'Pewter Pan', 'Fog Machine', 'Smoke & Mirrors', 'Elephant in the Room', 'Graphite Attitude',
    'Steel Yourself', 'Cloudy With a Chance', 'Dove Bar None', 'Iron Maiden (Glaze Edition)', 'Cement Your Legacy',
    'Grayscale of Justice', 'Battleship Potemkin', 'Silver Screen Dream', 'Pebble Beach Body', 'Mercury Rising',
    'Aluminum Foiled Again', 'Overcast & Overjoyed', 'Pumice Party', 'Nickel & Dime Store', 'Drizzle Sizzle',
    'Greyhound Bus Stop', 'Tin Foil Hat', 'Platinum Blonde Ambition', 'Gravel Travel', 'Haze Days',
    'Meteorite Delight', 'Chinchilla Thriller', 'Zinc About It', 'Flannel Feelings', 'Chrome Dome Home',
    'Moonstone Cold', 'Shale Mail', 'Frost Advisory', 'Slate of the Art', 'Dusty Springfield',
    'Titanium Cranium', 'Cobblestone Throne', 'Nimbus Cumulus Fuss', 'Cinder-ella', 'Quicksilver Lining',
    'Steel Magnolia', 'Rainy Day Fund', 'Zinc Sync', 'Iron Will Power', 'Monochrome Syndrome',
  ],
  dark: [
    'Dark Side of the Kiln', 'Void Where Prohibited', 'Into the Abyss', 'Midnight Express', 'Shadow Realm',
    'Dark Mode', 'Black Sheep Chic', 'Onyx & On', 'Pitch Perfect', 'Coal Comfort',
    'Inkwell Done', 'Raven Mad', 'The Darkest Timeline', 'Obsidian Flow', 'Black Mirror Finish',
    'Event Horizon', 'Vantablack Tie', 'None More Black', 'Black Gold Texas Tea', 'Total Eclipse',
    'Gotham After Dark', 'Black Panther Prowl', 'Dark Roast Coast', 'Licorice Twist', 'Deep Space Nine Glaze',
    'Batman\'s Cape', 'Charcoal Sketch Comedy', 'Noir Narrative', 'Dark Chocolate Decadence', 'Espresso Lane',
    'Panther Paw', 'Carbon Copy Cat', 'Sable Fable', 'After Midnight Mint', 'Black Tie Optional',
    'Dark Horse Race', 'Velvet Underground', 'Tar Pit Grit', 'Nighthawk Diner', 'Blackout Curtain Call',
    'Darkroom Bloom', 'Graphene Scene', 'Iron Curtain Call', 'Black Mamba', 'Shadow Puppet Show',
    'Dark Matter of Fact', 'Abyss Gazes Back', 'New Moon Mood', 'Raven\'s Caw-fee', 'Black Sabbath Bath',
  ],
  light: [
    'Cloud Nine', 'Snow Problem', 'Pale Ale-baster', 'Bone Dry Wit', 'Porcelain Throne',
    'Pearl Clutcher', 'Ivory Tower Power', 'Vanilla Sky-high', 'Eggshell Game', 'Linen & Things',
    'Cream of the Crop', 'Whiteout Conditions', 'Clean Slate', 'Blank Canvas Energy', 'Off-White Album',
    'Ghost Protocol', 'Wedding Dress Rehearsal', 'Sugar Coat of Arms', 'Marshmallow Pillow', 'Coconut Milk Run',
    'Rice Paper Trail', 'Chalk Talk', 'Snowflake Unique', 'Milk Glass Act', 'Meringue Wave',
    'Cauliflower Power', 'Cotton Ball Drop', 'Tofu Can Do', 'Angel Food Cake Walk', 'Daisy Fresh Prince',
    'Opal Optimism', 'Alabaster Disaster (Not)', 'White Noise Reduction', 'Mozzarella Fella', 'Frosted Flake',
    'Birch Please', 'Starlight Express', 'Moonbeam Team', 'Cumulus Hummus', 'Powder Puff Stuff',
    'Talcum Calm', 'Seashell Sell', 'Whipped Cream Scene', 'Paper Moon', 'Dove Tail Cocktail',
    'Arctic Fox Trot', 'Bone China Syndrome', 'Milk & Honey Do', 'Feather Duster Buster', 'White Russian Standard',
  ],
};

function classifyColor(hex: string): ColorFamily {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;

  // Very dark
  if (brightness < 40) return 'dark';
  // Very light
  if (brightness > 220 && sat < 40) return 'light';
  // Low saturation = neutral
  if (sat < 30) return brightness > 140 ? 'light' : brightness > 60 ? 'neutral' : 'dark';

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
  if (hue >= 15 && hue <= 45 && brightness < 160 && sat < 150) return 'brown';
  if (hue >= 0 && hue <= 30 && brightness < 120 && sat < 120) return 'brown';

  // Pink detection: high red, moderate blue, low green
  if (r > 180 && b > 100 && g < b && g < r) return 'pink';
  if (hue >= 300 && hue <= 360 && brightness > 120) return 'pink';

  if (hue >= 0 && hue < 15) return 'red';
  if (hue >= 15 && hue < 45) return 'orange';
  if (hue >= 45 && hue < 70) return 'yellow';
  if (hue >= 70 && hue < 160) return 'green';
  if (hue >= 160 && hue < 200) return 'teal';
  if (hue >= 200 && hue < 270) return 'blue';
  if (hue >= 270 && hue < 330) return 'purple';
  if (hue >= 330) return 'red';

  return 'neutral';
}

// Track used names within a single findGlaze call to prevent duplicates
let usedNamesThisRound: Set<string> = new Set();

function generateGlazeName(hex: string, index: number): string {
  const family = classifyColor(hex);
  const pool = NAME_POOLS[family];

  // Use index to pick from the pool, wrapping around if needed
  // Start at a deterministic offset based on the hex to add variety across queries
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

  // Fallback: all names used (shouldn't happen with 15 per pool)
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
