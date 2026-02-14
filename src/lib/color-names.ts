/**
 * Color Name → Hex dictionary with fuzzy matching.
 * Supports natural language descriptions like "chestnut brown", "dusty sage", etc.
 * Entirely client-side — no API calls needed.
 */

// Comprehensive color dictionary: ceramics-relevant, natural, and common descriptive colors
const COLOR_DICTIONARY: Record<string, string> = {
  // Reds & Pinks
  'red': '#cc3333',
  'scarlet': '#ff2400',
  'crimson': '#dc143c',
  'cherry': '#de3163',
  'ruby': '#e0115f',
  'garnet': '#733635',
  'cardinal': '#c41e3a',
  'fire engine': '#ce2029',
  'brick': '#cb4154',
  'brick red': '#cb4154',
  'tomato': '#ff6347',
  'poppy': '#e35335',
  'rose': '#ff007f',
  'dusty rose': '#dcae96',
  'old rose': '#c08081',
  'blush': '#de5d83',
  'blush pink': '#fe828c',
  'pink': '#ffc0cb',
  'hot pink': '#ff69b4',
  'salmon': '#fa8072',
  'coral': '#ff7f50',
  'coral pink': '#f88379',
  'peach': '#ffcba4',
  'flesh': '#ffe5b4',
  'carnation': '#ffa6c9',
  'raspberry': '#e30b5c',
  'magenta': '#ff00ff',
  'fuchsia': '#ff00ff',
  'cerise': '#de3163',
  'watermelon': '#fd4659',
  'strawberry': '#fc5a8d',
  'flamingo': '#fc8eac',
  'bubblegum': '#ffc1cc',
  'rouge': '#a94064',
  'wine': '#722f37',
  'burgundy': '#800020',
  'maroon': '#800000',
  'oxblood': '#4a0000',
  'cranberry': '#9f000f',
  'merlot': '#73343a',

  // Oranges
  'orange': '#ff8c00',
  'tangerine': '#ff9966',
  'apricot': '#fbceb1',
  'melon': '#febaad',
  'cantaloupe': '#ffa62f',
  'mango': '#ff8243',
  'persimmon': '#ec5800',
  'pumpkin': '#ff7518',
  'rust': '#b7410e',
  'cinnamon': '#d2691e',
  'copper': '#b87333',
  'amber': '#ffbf00',
  'burnt orange': '#cc5500',
  'burnt sienna': '#e97451',
  'sienna': '#a0522d',
  'terracotta': '#e2725b',
  'terra cotta': '#e2725b',
  'clay': '#b66a50',
  'adobe': '#bd6c48',
  'ginger': '#b06500',

  // Browns
  'brown': '#8b4513',
  'chocolate': '#7b3f00',
  'cocoa': '#d2691e',
  'mocha': '#967969',
  'coffee': '#6f4e37',
  'espresso': '#3c1414',
  'walnut': '#773f1a',
  'mahogany': '#c04000',
  'chestnut': '#954535',
  'chestnut brown': '#8b4513',
  'hazelnut': '#a67b5b',
  'caramel': '#ffd59a',
  'toffee': '#755139',
  'umber': '#635147',
  'raw umber': '#826644',
  'burnt umber': '#8a3324',
  'sepia': '#704214',
  'beaver': '#9f8170',
  'taupe': '#483c32',
  'tan': '#d2b48c',
  'sand': '#c2b280',
  'sandy': '#f4a460',
  'sandy brown': '#f4a460',
  'wheat': '#f5deb3',
  'khaki': '#c3b091',
  'beige': '#f5f5dc',
  'buff': '#f0dc82',
  'fawn': '#e5aa70',
  'mushroom': '#b5a196',
  'saddle': '#8b4513',
  'leather': '#906030',

  // Yellows
  'yellow': '#ffd700',
  'gold': '#ffd700',
  'golden': '#daa520',
  'goldenrod': '#daa520',
  'honey': '#eb9605',
  'sunflower': '#ffda03',
  'lemon': '#fff44f',
  'canary': '#ffef00',
  'butter': '#ffff99',
  'buttercup': '#f9e915',
  'cream': '#fffdd0',
  'ivory': '#fffff0',
  'champagne': '#f7e7ce',
  'maize': '#fbec5d',
  'saffron': '#f4c430',
  'mustard': '#ffdb58',
  'dijon': '#c49102',
  'flax': '#eedc82',
  'corn': '#fbec5d',
  'dandelion': '#f0e130',
  'banana': '#ffe135',
  'blonde': '#faf0be',

  // Greens
  'green': '#228b22',
  'forest': '#228b22',
  'forest green': '#228b22',
  'emerald': '#50c878',
  'jade': '#00a86b',
  'sage': '#bcb88a',
  'sage green': '#9caf88',
  'dusty sage': '#a3b18a',
  'olive': '#808000',
  'olive green': '#6b8e23',
  'olive drab': '#6b8e23',
  'army green': '#4b5320',
  'hunter green': '#355e3b',
  'lime': '#32cd32',
  'lime green': '#32cd32',
  'chartreuse': '#7fff00',
  'mint': '#98fb98',
  'mint green': '#98ff98',
  'seafoam': '#93e9be',
  'sea foam': '#93e9be',
  'pistachio': '#93c572',
  'avocado': '#568203',
  'fern': '#4f7942',
  'moss': '#8a9a5b',
  'moss green': '#8a9a5b',
  'grass': '#7cfc00',
  'spring green': '#00ff7f',
  'kelly green': '#4cbb17',
  'pine': '#01796f',
  'eucalyptus': '#5f8575',
  'celadon': '#ace1af',
  'juniper': '#3a5f0b',
  'basil': '#5c7a39',
  'leaf': '#71aa34',
  'spruce': '#2e473b',
  'pea green': '#8eab12',
  'pickle': '#6b7b3e',

  // Blues
  'blue': '#0066cc',
  'baby blue': '#89cff0',
  'sky blue': '#87ceeb',
  'sky': '#87ceeb',
  'powder blue': '#b0e0e6',
  'light blue': '#add8e6',
  'cornflower': '#6495ed',
  'periwinkle': '#ccccff',
  'steel blue': '#4682b4',
  'steel': '#4682b4',
  'slate blue': '#6a5acd',
  'slate': '#708090',
  'royal blue': '#4169e1',
  'cobalt': '#0047ab',
  'navy': '#000080',
  'navy blue': '#000080',
  'midnight': '#191970',
  'midnight blue': '#191970',
  'indigo': '#4b0082',
  'sapphire': '#0f52ba',
  'ocean': '#006994',
  'ocean blue': '#006994',
  'marine': '#042e60',
  'denim': '#1560bd',
  'azure': '#007fff',
  'cerulean': '#007ba7',
  'ice blue': '#d6ecef',
  'robin egg': '#00cccc',
  "robin's egg": '#00cccc',
  "robin's egg blue": '#00cccc',
  'electric blue': '#7df9ff',
  'prussian blue': '#003153',
  'ultramarine': '#3f00ff',
  'peacock': '#005f69',
  'blueberry': '#4f86f7',
  'cornflower blue': '#6495ed',

  // Teals & Cyans
  'teal': '#008080',
  'cyan': '#00ffff',
  'aqua': '#00ffff',
  'turquoise': '#40e0d0',
  'aquamarine': '#7fffd4',
  'sea green': '#2e8b57',

  // Purples & Violets
  'purple': '#800080',
  'violet': '#8b00ff',
  'lavender': '#e6e6fa',
  'lilac': '#c8a2c8',
  'plum': '#8e4585',
  'mauve': '#e0b0ff',
  'orchid': '#da70d6',
  'amethyst': '#9966cc',
  'eggplant': '#614051',
  'grape': '#6f2da8',
  'wisteria': '#c9a0dc',
  'heather': '#b7c3d0',
  'thistle': '#d8bfd8',
  'iris': '#5a4fcf',
  'mulberry': '#c54b8c',
  'boysenberry': '#873260',
  'plum wine': '#553640',
  'deep purple': '#36013f',
  'royal purple': '#7851a9',
  'aubergine': '#3d0c11',
  'fig': '#6c3461',

  // Grays & Neutrals
  'gray': '#808080',
  'grey': '#808080',
  'silver': '#c0c0c0',
  'charcoal': '#36454f',
  'smoke': '#738276',
  'ash': '#b2beb5',
  'dove': '#646e6e',
  'pewter': '#8e8e8e',
  'stone': '#928e85',
  'graphite': '#383838',
  'steel gray': '#71797e',
  'gunmetal': '#2c3539',
  'iron': '#48494b',
  'zinc': '#bac4c8',
  'fog': '#e8e8e8',
  'cement': '#8d918d',
  'concrete': '#808782',
  'mouse': '#9e9e93',

  // Whites
  'white': '#ffffff',
  'snow': '#fffafa',
  'pearl': '#eae0c8',
  'alabaster': '#f2f0eb',
  'porcelain': '#f0ebe3',
  'linen': '#faf0e6',
  'eggshell': '#f0ead6',
  'bone': '#e3dac9',
  'vanilla': '#f3e5ab',
  'oatmeal': '#d3c1a5',

  // Blacks
  'black': '#000000',
  'jet': '#343434',
  'jet black': '#0a0a0a',
  'onyx': '#353839',
  'obsidian': '#1a1a2e',
  'raven': '#0d0d0d',
  'coal': '#2d2d2d',
  'soot': '#1c1c1c',
  'ink': '#100c08',
  'ebony': '#555d50',

  // Ceramic / pottery specific
  'oribe': '#48742c',
  'shino': '#e8d5b5',
  'tenmoku': '#3c2415',
  'celadon glaze': '#ace1af',
  'ox blood': '#4a0000',
  'jun': '#3e5f8a',
  'ash glaze': '#c7c4b5',
  'iron red': '#8e3a22',
  'copper green': '#009f6b',
  'rutile blue': '#5b7fa5',
  'cobalt blue': '#0047ab',
};

// Modifier words that adjust the base color
const LIGHTNESS_MODIFIERS: Record<string, number> = {
  'very light': 0.7,
  'light': 0.4,
  'pale': 0.5,
  'pastel': 0.6,
  'soft': 0.3,
  'dusty': 0.15,
  'muted': 0.1,
  'medium': 0,
  'rich': -0.15,
  'deep': -0.3,
  'dark': -0.4,
  'very dark': -0.6,
  'bright': 0.1,
  'vivid': -0.05,
  'warm': 0,
  'cool': 0,
};

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hNorm = h / 360;

  const r = Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function applyModifier(hex: string, modifier: number): string {
  const [h, s, l] = hexToHsl(hex);
  const newL = Math.max(0.05, Math.min(0.95, l + modifier * (modifier > 0 ? (1 - l) : l)));
  // Desaturate slightly for "dusty", "muted"
  const satAdj = modifier > 0.3 ? s * 0.7 : s;
  return hslToHex(h, satAdj, newL);
}

/**
 * Parse a color description and return the best-matching hex.
 * Handles compound descriptions like "dark sage green", "dusty rose pink", etc.
 */
export function descriptionToHex(description: string): string | null {
  const input = description.toLowerCase().trim();
  if (!input) return null;

  // Direct match
  if (COLOR_DICTIONARY[input]) return COLOR_DICTIONARY[input];

  // Try with modifiers stripped
  let modifier = 0;
  let remaining = input;

  // Sort modifiers by length (longest first) to match "very light" before "light"
  const sortedMods = Object.entries(LIGHTNESS_MODIFIERS).sort((a, b) => b[0].length - a[0].length);

  for (const [mod, val] of sortedMods) {
    if (remaining.startsWith(mod + ' ')) {
      modifier = val;
      remaining = remaining.slice(mod.length).trim();
      break;
    }
  }

  // Try the remaining as a direct lookup
  if (COLOR_DICTIONARY[remaining]) {
    return modifier !== 0 ? applyModifier(COLOR_DICTIONARY[remaining], modifier) : COLOR_DICTIONARY[remaining];
  }

  // Try fuzzy: each word in the input against dictionary keys
  const words = remaining.split(/\s+/);
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [name, hex] of Object.entries(COLOR_DICTIONARY)) {
    const nameWords = name.split(/\s+/);
    let score = 0;

    for (const word of words) {
      for (const nw of nameWords) {
        if (nw === word) score += 3;
        else if (nw.startsWith(word) || word.startsWith(nw)) score += 2;
        else if (nw.includes(word) || word.includes(nw)) score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = hex;
    }
  }

  if (bestMatch && bestScore >= 1) {
    return modifier !== 0 ? applyModifier(bestMatch, modifier) : bestMatch;
  }

  return null;
}

/**
 * Get a list of color suggestions that match the description.
 * Returns up to `limit` results sorted by relevance.
 */
export function getColorSuggestions(description: string, limit: number = 8): { name: string; hex: string }[] {
  const input = description.toLowerCase().trim();
  if (!input || input.length < 2) return [];

  // Detect modifier
  let modifier = 0;
  let remaining = input;
  const sortedMods = Object.entries(LIGHTNESS_MODIFIERS).sort((a, b) => b[0].length - a[0].length);
  for (const [mod, val] of sortedMods) {
    if (remaining.startsWith(mod + ' ')) {
      modifier = val;
      remaining = remaining.slice(mod.length).trim();
      break;
    }
  }

  const words = remaining.split(/\s+/);
  const scored: { name: string; hex: string; score: number }[] = [];

  for (const [name, hex] of Object.entries(COLOR_DICTIONARY)) {
    const nameWords = name.split(/\s+/);
    let score = 0;

    for (const word of words) {
      for (const nw of nameWords) {
        if (nw === word) score += 10;
        else if (nw.startsWith(word)) score += 6;
        else if (word.startsWith(nw)) score += 4;
        else if (nw.includes(word) || word.includes(nw)) score += 2;
      }
    }

    if (score > 0) {
      const displayHex = modifier !== 0 ? applyModifier(hex, modifier) : hex;
      const displayName = modifier !== 0
        ? `${Object.entries(LIGHTNESS_MODIFIERS).find(([, v]) => v === modifier)?.[0] || ''} ${name}`.trim()
        : name;
      scored.push({ name: capitalize(displayName), hex: displayHex, score });
    }
  }

  // Sort by score descending, deduplicate by hex
  scored.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: { name: string; hex: string }[] = [];
  for (const s of scored) {
    if (seen.has(s.hex)) continue;
    seen.add(s.hex);
    results.push({ name: s.name, hex: s.hex });
    if (results.length >= limit) break;
  }

  return results;
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}
