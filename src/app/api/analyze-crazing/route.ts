/**
 * Crazing Analysis API Route
 *
 * POST /api/analyze-crazing
 * Body: { image_data: "data:image/jpeg;base64,..." }
 * Returns: { severity: "mild"|"moderate"|"severe", description: string }
 *
 * With OPENAI_API_KEY: sends photo to GPT-4o Vision for analysis.
 * Without: returns a simulated result based on image data length
 * (deterministic hash so same photo always gives same result).
 *
 * IMPORTANT: Never say "AI" in any response text. Use "analysis",
 * "diagnostic tool", "our system" etc.
 */

import { NextRequest, NextResponse } from 'next/server';

type CrazingSeverity = 'mild' | 'moderate' | 'severe';

interface AnalysisResult {
  severity: CrazingSeverity;
  description: string;
}

const SEVERITY_DESCRIPTIONS: Record<CrazingSeverity, string> = {
  mild: 'Light crazing detected — fine hairline cracks visible mainly under close inspection. This is often manageable with minor recipe adjustments.',
  moderate: 'Noticeable crazing pattern — a network of cracks is visible across the surface. This typically indicates a meaningful mismatch between glaze and clay body expansion.',
  severe: 'Significant crazing throughout — dense crack network with potential for glaze flaking. This suggests a substantial thermal expansion mismatch that needs addressing.',
};

/**
 * Simulated analysis — deterministic based on image data length.
 */
function simulateAnalysis(imageDataLength: number): AnalysisResult {
  const hash = ((imageDataLength * 2654435761) >>> 0) % 3;
  const severities: CrazingSeverity[] = ['mild', 'moderate', 'severe'];
  const severity = severities[hash];
  return { severity, description: SEVERITY_DESCRIPTIONS[severity] };
}

/**
 * Real analysis via GPT-4o Vision.
 */
async function analyzeWithVision(imageData: string, apiKey: string): Promise<AnalysisResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a ceramic glaze analysis tool. Analyze the uploaded photo of a glazed ceramic piece for crazing (a network of fine cracks in the glaze surface).

Respond with ONLY valid JSON in this exact format:
{"severity": "mild"|"moderate"|"severe", "description": "one sentence description of what you observe"}

Severity guide:
- mild: sparse, fine hairline cracks, mainly visible under close inspection
- moderate: clear network of cracks visible at normal viewing distance
- severe: dense crack network, potential for glaze lifting or flaking

If the image does not show ceramics or crazing, default to "moderate" with a note that the image was unclear.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this ceramic piece for crazing severity.',
            },
            {
              type: 'image_url',
              image_url: { url: imageData },
            },
          ],
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vision API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonStr = content.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    const severity: CrazingSeverity =
      ['mild', 'moderate', 'severe'].includes(parsed.severity)
        ? parsed.severity
        : 'moderate';
    return {
      severity,
      description: parsed.description || SEVERITY_DESCRIPTIONS[severity],
    };
  } catch {
    // If parsing fails, fall back to moderate
    return {
      severity: 'moderate',
      description: SEVERITY_DESCRIPTIONS['moderate'],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_data } = body;

    if (!image_data || typeof image_data !== 'string') {
      return NextResponse.json(
        { error: 'Missing image_data field' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    let result: AnalysisResult;

    if (apiKey) {
      try {
        result = await analyzeWithVision(image_data, apiKey);
      } catch (err) {
        console.error('Vision analysis failed, falling back to simulation:', err);
        result = simulateAnalysis(image_data.length);
      }
    } else {
      result = simulateAnalysis(image_data.length);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Crazing analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
