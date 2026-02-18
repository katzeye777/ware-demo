'use client';

import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { buildModification } from '@/lib/tweak-engine';
import type { GlazeModification } from '@/lib/tweak-engine';
import { CheckCircle, Clock } from 'lucide-react';

interface TexturePathProps {
  originalColorHex: string;
  originalGlazeId?: string;
  onModification: (mod: GlazeModification) => void;
}

type Step = 'expected_finish' | 'hotter_cone' | 'thicker_app' | 'done_suggestion' | 'done_satin' | 'done_fixed';

export default function TexturePath({
  originalColorHex,
  originalGlazeId,
  onModification,
}: TexturePathProps) {
  const [currentStep, setCurrentStep] = useState<Step>('expected_finish');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestion, setSuggestion] = useState('');

  const recordAnswer = (step: Step, value: string) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
  };

  const handleExpectedFinish = (value: string) => {
    recordAnswer('expected_finish', value);
    if (value === 'satin') {
      setCurrentStep('done_satin');
    } else {
      setCurrentStep('hotter_cone');
    }
  };

  const handleHotterCone = (value: string) => {
    recordAnswer('hotter_cone', value);
    if (value === 'no') {
      setSuggestion('Try firing one cone hotter than your current schedule. A higher peak temperature gives the glaze more energy to mature and smooth out.');
      setCurrentStep('done_suggestion');
    } else {
      setCurrentStep('thicker_app');
    }
  };

  const handleThickerApp = (value: string) => {
    recordAnswer('thicker_app', value);
    if (value === 'no') {
      setSuggestion('Try a thicker application — add an extra coat, or hold your dip for a couple seconds longer. More material means the glaze has more to work with as it melts and levels.');
      setCurrentStep('done_suggestion');
    } else {
      // Tried both and still not smooth → recipe modification needed
      const mod = buildModification({
        type: 'increase_boron',
        intensity: 'moderate',
        source_path: 'texture',
        original_color_hex: originalColorHex,
        original_glaze_id: originalGlazeId,
      });
      onModification(mod);
    }
  };

  return (
    <div className="space-y-3">
      {/* Step 1: Expected finish */}
      <QuestionCard
        stepNumber={1}
        question="What finish were you expecting?"
        explanation="Let's make sure we're working toward the right surface."
        answers={[
          { label: 'Glossy', value: 'glossy' },
          { label: 'Satin', value: 'satin' },
        ]}
        onAnswer={handleExpectedFinish}
        isActive={currentStep === 'expected_finish'}
        answeredValue={
          answers['expected_finish'] === 'glossy' ? 'Glossy'
            : answers['expected_finish'] === 'satin' ? 'Satin'
            : undefined
        }
      />

      {/* Step 2: Hotter cone */}
      <QuestionCard
        stepNumber={2}
        question="Have you tried firing one cone hotter?"
        explanation="A higher temperature can help the glaze fully mature and achieve a smoother surface."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleHotterCone}
        isActive={currentStep === 'hotter_cone'}
        answeredValue={answers['hotter_cone'] === 'yes' ? 'Yes' : answers['hotter_cone'] === 'no' ? 'No' : undefined}
      />

      {/* Step 3: Thicker application */}
      <QuestionCard
        stepNumber={3}
        question="Have you tried a thicker application?"
        explanation="More material gives the glaze a better chance to flow and level during firing."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleThickerApp}
        isActive={currentStep === 'thicker_app'}
        answeredValue={answers['thicker_app'] === 'yes' ? 'Yes' : answers['thicker_app'] === 'no' ? 'No' : undefined}
      />

      {/* Satin not yet supported */}
      {currentStep === 'done_satin' && (
        <div className="card border-2 border-amber-200 bg-amber-50">
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Satin Finish — Coming Soon</h3>
              <p className="text-sm text-amber-800">
                We're actively working on satin finish recipes. Our diagnostic tool doesn't yet have
                enough data to reliably tweak satin surfaces, but this is high on our list.
              </p>
              <p className="text-xs text-amber-600 mt-2">
                In the meantime, try adjusting your alumina-to-silica ratio — higher alumina tends to
                produce a more satin surface.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion ending */}
      {currentStep === 'done_suggestion' && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">Suggested Next Step</h3>
          <p className="text-sm text-blue-800">{suggestion}</p>
          <p className="text-xs text-blue-600 mt-3">
            Try this first, then come back here if the texture still isn't where you want it.
          </p>
        </div>
      )}
    </div>
  );
}
