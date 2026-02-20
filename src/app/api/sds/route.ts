/**
 * SDS Generator API Route
 *
 * Next.js API Route that generates GHS-compliant Safety Data Sheet PDFs
 * by calling the Python SDS generator CLI tool.
 *
 * POST /api/sds
 * Body: { product_name, batch_number, recipe: {...}, form, batch_size_grams }
 * Returns: PDF file as download
 */

import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

// ── Material Name → SDS Generator Key Mapping ──

const MATERIAL_NAME_MAP: Record<string, string> = {
  // Base materials (case-insensitive lookup happens below)
  'nepheline syenite': 'nepheline_syenite',
  'neph sy': 'nepheline_syenite',
  'feldspar': 'nepheline_syenite',
  'whiting': 'whiting',
  'calcium carbonate': 'whiting',
  'limestone': 'whiting',
  'kaolin': 'kaolin',
  'epk': 'kaolin',
  'silica': 'silica',
  'quartz': 'silica',
  'flint': 'silica',
  'ferro frit 3195': 'frit_3195',
  'frit 3195': 'frit_3195',
  'f-3195': 'frit_3195',
  '3195': 'frit_3195',
  'bentonite': 'bentonite',
  // Mason stains — match by code number
  'mason 6026': 'mason_6026',
  'lobster': 'mason_6026',
  '6026': 'mason_6026',
  'mason 6300': 'mason_6300',
  'mazzerine': 'mason_6300',
  '6300': 'mason_6300',
  'mason 6388': 'mason_6388',
  '6388': 'mason_6388',
  'mason 6450': 'mason_6450',
  'praseodymium': 'mason_6450',
  '6450': 'mason_6450',
  'mason 6600': 'mason_6600',
  '6600': 'mason_6600',
  'mason 6790': 'mason_6790',
  'matting white': 'mason_6790',
  'zircopax': 'mason_6790',
  'ultrox': 'mason_6790',
  '6790': 'mason_6790',
};

function mapMaterialName(name: string): string | null {
  const lower = name.toLowerCase().trim();

  // Direct lookup
  if (MATERIAL_NAME_MAP[lower]) {
    return MATERIAL_NAME_MAP[lower];
  }

  // Partial match — check if any key is contained in the name
  for (const [alias, key] of Object.entries(MATERIAL_NAME_MAP)) {
    if (lower.includes(alias) || alias.includes(lower)) {
      return key;
    }
  }

  // Try to extract Mason stain code from string like "Mason Stain 6026" or "MS-6026"
  const stainMatch = lower.match(/(?:mason|ms|stain)[^\d]*(\d{4})/);
  if (stainMatch) {
    const code = stainMatch[1];
    const key = `mason_${code}`;
    if (Object.values(MATERIAL_NAME_MAP).includes(key)) {
      return key;
    }
  }

  return null;
}

// ── SDS Generator Path ──

// Resolve path relative to the project root (ware/frontend/../sds_generator)
function getSdsGeneratorDir(): string {
  // Try relative to the frontend project first
  const fromFrontend = path.resolve(process.cwd(), '..', 'sds_generator');
  if (existsSync(path.join(fromFrontend, 'generate_sds.py'))) {
    return fromFrontend;
  }

  // Fallback to absolute path
  const absolute = 'C:\\Users\\katze\\Calude\\ware\\sds_generator';
  if (existsSync(path.join(absolute, 'generate_sds.py'))) {
    return absolute;
  }

  throw new Error('SDS generator not found. Expected at: ' + fromFrontend);
}

// ── Route Handler ──

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_name = 'Custom Glaze',
      batch_number = '0000',
      ingredients,   // Array of { material_name, target_weight_g }
      form = 'dry',
      batch_size_grams,
    } = body;

    // Validate required fields
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty ingredients array' },
        { status: 400 }
      );
    }

    if (!['dry', 'liquid'].includes(form)) {
      return NextResponse.json(
        { error: 'form must be "dry" or "liquid"' },
        { status: 400 }
      );
    }

    // Map ingredient names to SDS keys and convert weights to percentages
    const totalWeight = ingredients.reduce(
      (sum: number, ing: { target_weight_g: number }) => sum + ing.target_weight_g,
      0
    );

    if (totalWeight <= 0) {
      return NextResponse.json(
        { error: 'Total ingredient weight must be > 0' },
        { status: 400 }
      );
    }

    const recipe: Record<string, number> = {};
    const unmapped: string[] = [];

    for (const ing of ingredients) {
      // Skip water — SDS generator handles water internally for liquid form
      if (ing.category === 'water' || ing.material_name.toLowerCase() === 'water') {
        continue;
      }

      const key = mapMaterialName(ing.material_name);
      if (!key) {
        unmapped.push(ing.material_name);
        continue;
      }

      // Convert absolute weight to percentage of dry materials
      const pct = (ing.target_weight_g / totalWeight) * 100;
      recipe[key] = Math.round(pct * 100) / 100; // 2 decimal places
    }

    if (unmapped.length > 0) {
      return NextResponse.json(
        {
          error: `Could not map these ingredient names to SDS material keys: ${unmapped.join(', ')}`,
          hint: 'Valid names include: Nepheline Syenite, Whiting, Kaolin, Silica, Ferro Frit 3195, Bentonite, Mason 6026/6300/6388/6450/6600/6790',
        },
        { status: 400 }
      );
    }

    if (Object.keys(recipe).length === 0) {
      return NextResponse.json(
        { error: 'No valid dry ingredients found after mapping' },
        { status: 400 }
      );
    }

    // Build recipe JSON for the SDS generator
    const recipeJson = {
      product_name,
      batch_number,
      recipe,
      form,
      batch_size_grams: batch_size_grams || undefined,
      date: new Date().toISOString().split('T')[0],
    };

    // Write temp recipe file
    const tmpDir = os.tmpdir();
    const tmpRecipePath = path.join(tmpDir, `sds_recipe_${Date.now()}.json`);
    const safeName = product_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const outputFilename = `CMW_SDS_${safeName}_${batch_number}.pdf`;
    const tmpOutputPath = path.join(tmpDir, outputFilename);

    writeFileSync(tmpRecipePath, JSON.stringify(recipeJson, null, 2));

    try {
      // Call the Python SDS generator
      const sdsDir = getSdsGeneratorDir();
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

      execSync(
        `${pythonCmd} generate_sds.py --recipe "${tmpRecipePath}" --output "${tmpOutputPath}"`,
        {
          cwd: sdsDir,
          timeout: 30000, // 30 second timeout
          stdio: 'pipe',
        }
      );

      // Read the generated PDF
      if (!existsSync(tmpOutputPath)) {
        throw new Error('SDS generator did not produce output PDF');
      }

      const pdfBuffer = readFileSync(tmpOutputPath);

      // Clean up temp files
      try { unlinkSync(tmpRecipePath); } catch { /* ignore */ }
      try { unlinkSync(tmpOutputPath); } catch { /* ignore */ }

      // Return PDF as download
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${outputFilename}"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    } catch (execError: any) {
      // Clean up temp files on error
      try { unlinkSync(tmpRecipePath); } catch { /* ignore */ }
      try { unlinkSync(tmpOutputPath); } catch { /* ignore */ }

      console.error('SDS generation error:', execError.stderr?.toString() || execError.message);
      return NextResponse.json(
        {
          error: 'SDS generation failed',
          details: execError.stderr?.toString() || execError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('SDS route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
