/**
 * DALL-E Preview Image API Route
 *
 * Next.js API Route that generates ceramic glaze preview images.
 * Keeps OPENAI_API_KEY server-side (never sent to browser).
 *
 * POST /api/preview
 * Body: { color_hex: "#ff5533", finish: "glossy", vessel_type?: "bowl" }
 * Returns: { image_url: "...", prompt_used: "..." }
 *
 * Plugin interface: When Stable Diffusion pipeline is ready,
 * swap the generateImage() implementation. The rest doesn't change.
 */

import { NextRequest, NextResponse } from 'next/server';

// ── Prompt Template ──

const PROMPT_TEMPLATE = `A professional studio photograph of a handmade ceramic {vessel_type} with a smooth, {finish} glaze finish in the color {color_description} (hex: {color_hex}). The glaze has a rich, even coating with subtle depth. Shot on a clean white background with soft studio lighting. The ceramic piece shows handmade character with slight organic asymmetry. No text, no labels. Photorealistic, high quality.`;

function colorDescription(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (r > 200 && g > 200 && b > 200) return 'white/off-white';
  if (r < 50 && g < 50 && b < 50) return 'deep black';
  if (r > g && r > b) {
    if (g > 150) return 'warm orange-yellow';
    return r > 180 ? 'rich red' : 'dark burgundy';
  }
  if (g > r && g > b) {
    if (b > 150) return 'teal/cyan';
    return g > 180 ? 'vibrant green' : 'forest green';
  }
  if (b > r && b > g) {
    if (r > 150) return 'purple/violet';
    return b > 180 ? 'deep blue' : 'navy blue';
  }
  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
    return r < 180 ? 'neutral gray' : 'light gray';
  }
  return 'custom color';
}

function buildPrompt(colorHex: string, finish: string, vesselType: string = 'bowl'): string {
  return PROMPT_TEMPLATE
    .replace('{vessel_type}', vesselType)
    .replace('{finish}', finish)
    .replace('{color_description}', colorDescription(colorHex))
    .replace('{color_hex}', colorHex);
}

// ── Image Generation (Plugin Interface) ──

interface GenerateImageResult {
  image_url: string;
  prompt_used: string;
  model: string;
}

async function generateImageDallE(
  colorHex: string,
  finish: string,
  vesselType: string = 'bowl'
): Promise<GenerateImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = buildPrompt(colorHex, finish, vesselType);

  if (!apiKey) {
    // Return colored placeholder when no API key is configured
    const hex = colorHex.replace('#', '');
    const label = vesselType.charAt(0).toUpperCase() + vesselType.slice(1);
    return {
      image_url: `https://placehold.co/512x512/${hex}/white?text=${label}`,
      prompt_used: prompt,
      model: 'placeholder',
    };
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DALL-E API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return {
    image_url: data.data[0].url,
    prompt_used: prompt,
    model: 'dall-e-3',
  };
}

// ── Swap this function when Stable Diffusion is ready ──
const generateImage: typeof generateImageDallE = generateImageDallE;

// ── Route Handler ──

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { color_hex, finish = 'glossy', vessel_type = 'bowl' } = body;

    if (!color_hex || !/^#[0-9a-fA-F]{6}$/.test(color_hex)) {
      return NextResponse.json(
        { error: 'Invalid color_hex. Expected format: #RRGGBB' },
        { status: 400 }
      );
    }

    const result = await generateImage(color_hex, finish, vessel_type);

    return NextResponse.json({
      image_url: result.image_url,
      prompt_used: result.prompt_used,
    });
  } catch (error: any) {
    console.error('Preview generation error:', error);

    // Fallback to placeholder on any error
    const hex = (await request.json().catch(() => ({}))).color_hex?.replace('#', '') || '888888';
    return NextResponse.json({
      image_url: `https://placehold.co/512x512/${hex}/white?text=Preview`,
      prompt_used: 'Error fallback',
    });
  }
}
