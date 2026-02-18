'use client';

import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { buildModification } from '@/lib/tweak-engine';
import type { GlazeModification } from '@/lib/tweak-engine';
import { CheckCircle } from 'lucide-react';

interface TemperaturePathProps {
  originalColorHex: string;
  originalGlazeId?: string;
  onModification: (mod: GlazeModification) => void;
}

type Step = 'lower_cone' | 'thinner_app' | 'result' | 'done_suggestion' | 'done_fixed';

export default function TemperaturePath({
  originalColorHex,
  originalGlazeId,
  onModification,
}: TemperaturePathProps) {
  const [currentStep, setCurrentStep] = useState<Step>('lower_cone');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestion, setSuggestion] = useState('');

  const recordAnswer = (step: Step, value: string) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
  };

  const handleLowerCone = (value: string) => {
    recordAnswer('lower_cone', value);
    if (value === 'no') {
      setSuggestion('Try firing to one cone lower than your current schedule. This is the most common fix for running glazes — a lower peak temperature gives the glaze less time to flow.');
      setCurrentStep('done_suggestion');
    } else {
      setCurrentStep('thinner_app');
    }
  };

  const handleThinnerApp = (value: string) => {
    recordAnswer('thinner_app', value);
    if (value === 'no') {
      setSuggestion('Try applying one coat instead of two, or reduce your dip time. Thinner application means less material to move, which can dramatically reduce running.');
      setCurrentStep('done_suggestion');
    } else {
      setCurrentStep('result');
    }
  };

  const handleResult = (value: string) => {
    recordAnswer('result', value);
    if (value === 'fixed') {
      setCurrentStep('done_fixed');
    } else {
      const intensity = value === 'better' ? 'slight' : 'moderate';
      const mod = buildModification({
        type: 'reduce_boron',
        intensity,
        source_path: 'temperature',
        original_color_hex: originalColorHex,
        original_glaze_id: originalGlazeId,
      });
      onModification(mod);
    }
  };

  const stepNumber = (step: Step): number => {
    const order: Step[] = ['lower_cone', 'thinner_app', 'result'];
    return order.indexOf(step) + 1;
  };

  return (
    <div className="space-y-3">
      {/* Step 1: Lower cone */}
      <QuestionCard
        stepNumber={1}
        question="Have you tried firing to a lower cone?"
        explanation="Dropping one cone can significantly reduce how much the glaze moves during firing."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleLowerCone}
        isActive={currentStep === 'lower_cone'}
        answeredValue={answers['lower_cone'] === 'yes' ? 'Yes' : answers['lower_cone'] === 'no' ? 'No' : undefined}
      />

      {/* Step 2: Thinner application */}
      <QuestionCard
        stepNumber={2}
        question="Have you tried a thinner application?"
        explanation="More material = more flow. Reducing thickness is often the simplest fix."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleThinnerApp}
        isActive={currentStep === 'thinner_app'}
        answeredValue={answers['thinner_app'] === 'yes' ? 'Yes' : answers['thinner_app'] === 'no' ? 'No' : undefined}
      />

      {/* Step 3: Result after trying both */}
      <QuestionCard
        stepNumber={3}
        question="How does the glaze react with those changes?"
        explanation="You've tried the standard fixes. Let's see where you are."
        answers={[
          { label: 'Still running', value: 'still_running' },
          { label: 'Better but not perfect', value: 'better' },
          { label: 'Fixed!', value: 'fixed' },
        ]}
        onAnswer={handleResult}
        isActive={currentStep === 'result'}
        answeredValue={
          answers['result'] === 'still_running' ? 'Still running'
            : answers['result'] === 'better' ? 'Better'
            : answers['result'] === 'fixed' ? 'Fixed!'
            : undefined
        }
      />

      {/* Suggestion ending */}
      {currentStep === 'done_suggestion' && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">Suggested Next Step</h3>
          <p className="text-sm text-blue-800">{suggestion}</p>
          <p className="text-xs text-blue-600 mt-3">
            Try this first, then come back here if you're still seeing issues.
          </p>
        </div>
      )}

      {/* Fixed! ending */}
      {currentStep === 'done_fixed' && (
        <div className="card border-2 border-green-200 bg-green-50 text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-900 mb-1">Great news!</h3>
          <p className="text-sm text-green-700">
            Sounds like you've got it under control. Happy firing!
          </p>
        </div>
      )}
    </div>
  );
}
