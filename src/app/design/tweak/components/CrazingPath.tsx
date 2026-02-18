'use client';

import { useState } from 'react';
import QuestionCard from './QuestionCard';
import ClayBodySelector from './ClayBodySelector';
import CrazingPhotoUploader from './CrazingPhotoUploader';
import { buildModification, severityToIntensity } from '@/lib/tweak-engine';
import type { GlazeModification, CrazingSeverity, ModificationIntensity } from '@/lib/tweak-engine';
import { CheckCircle } from 'lucide-react';

interface CrazingPathProps {
  originalColorHex: string;
  originalGlazeId?: string;
  onModification: (mod: GlazeModification) => void;
}

type Step = 'clay_body' | 'photo' | 'colder_cone' | 'thinner_app' | 'done_suggestion';

export default function CrazingPath({
  originalColorHex,
  originalGlazeId,
  onModification,
}: CrazingPathProps) {
  const [currentStep, setCurrentStep] = useState<Step>('clay_body');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [clayBodyId, setClayBodyId] = useState('');
  const [crazingSeverity, setCrazingSeverity] = useState<CrazingSeverity | null>(null);
  const [suggestion, setSuggestion] = useState('');

  const recordAnswer = (step: Step, value: string) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
  };

  // Step 1: Clay body selected → advance to photo
  const handleClayBodyContinue = () => {
    if (!clayBodyId) return;
    recordAnswer('clay_body', clayBodyId);
    setCurrentStep('photo');
  };

  // Step 2: Photo analyzed → advance to colder_cone
  const handleAnalysisComplete = (severity: CrazingSeverity, _description: string) => {
    setCrazingSeverity(severity);
    recordAnswer('photo', severity);
    setCurrentStep('colder_cone');
  };

  // Step 3: Tried colder cone?
  const handleColderCone = (value: string) => {
    recordAnswer('colder_cone', value);
    if (value === 'no') {
      setSuggestion('Try firing one cone lower. This gives the glaze and clay body more time to equalize their shrinkage rates, which can reduce or eliminate crazing.');
      setCurrentStep('done_suggestion');
    } else {
      setCurrentStep('thinner_app');
    }
  };

  // Step 4: Tried thinner application?
  const handleThinnerApp = (value: string) => {
    recordAnswer('thinner_app', value);
    if (value === 'no') {
      setSuggestion('Try a thinner glaze application. A thinner coating is less likely to craze because the glaze layer has less volume to accumulate stress.');
      setCurrentStep('done_suggestion');
    } else {
      // Tried both, still crazing → recipe modification
      const severity = crazingSeverity || 'moderate';
      // Map severity to the reduce_expansion intensity
      const intensityMap: Record<CrazingSeverity, ModificationIntensity> = {
        mild: 'slight',
        moderate: 'moderate',
        severe: 'aggressive',
      };
      const mod = buildModification({
        type: 'reduce_expansion',
        intensity: intensityMap[severity],
        source_path: 'crazing',
        original_color_hex: originalColorHex,
        original_glaze_id: originalGlazeId,
        crazing_severity: severity,
        clay_body: clayBodyId,
      });
      onModification(mod);
    }
  };

  // Figure out which step number to show for clay_body (1) and photo (2)
  // They use custom content instead of answer buttons

  return (
    <div className="space-y-3">
      {/* Step 1: Clay body selector */}
      {currentStep === 'clay_body' ? (
        <div className="card border-2 border-brand-200 bg-white">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-clay-900">
                What clay body are you using?
              </h3>
              <p className="text-sm text-clay-500 mt-1">
                Crazing is a mismatch between glaze and clay body. Knowing your clay helps
                us understand what's going on.
              </p>
            </div>
          </div>
          <div className="mb-4">
            <ClayBodySelector value={clayBodyId} onChange={setClayBodyId} />
          </div>
          <button
            onClick={handleClayBodyContinue}
            disabled={!clayBodyId}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      ) : answers['clay_body'] ? (
        <div className="flex items-center space-x-3 py-3 px-4 bg-clay-50 rounded-lg border border-clay-200">
          <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            1
          </div>
          <span className="text-sm text-clay-600 flex-1">Clay body</span>
          <span className="text-sm font-medium text-clay-900 bg-white px-3 py-1 rounded-full border border-clay-200">
            {clayBodyId.replace(/-/g, ' ')}
          </span>
        </div>
      ) : null}

      {/* Step 2: Photo uploader */}
      {currentStep === 'photo' ? (
        <div className="card border-2 border-brand-200 bg-white">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-clay-900">
                Upload a photo of the crazing
              </h3>
              <p className="text-sm text-clay-500 mt-1">
                A close-up photo helps our diagnostic tool assess the severity of the crazing pattern.
              </p>
            </div>
          </div>
          <CrazingPhotoUploader onAnalysisComplete={handleAnalysisComplete} />
        </div>
      ) : answers['photo'] ? (
        <div className="flex items-center space-x-3 py-3 px-4 bg-clay-50 rounded-lg border border-clay-200">
          <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            2
          </div>
          <span className="text-sm text-clay-600 flex-1">Crazing analysis</span>
          <span className="text-sm font-medium text-clay-900 bg-white px-3 py-1 rounded-full border border-clay-200 capitalize">
            {answers['photo']}
          </span>
        </div>
      ) : null}

      {/* Step 3: Colder cone */}
      <QuestionCard
        stepNumber={3}
        question="Have you tried firing one cone colder?"
        explanation="Lower firing temperatures can help the glaze and clay body match up better."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleColderCone}
        isActive={currentStep === 'colder_cone'}
        answeredValue={answers['colder_cone'] === 'yes' ? 'Yes' : answers['colder_cone'] === 'no' ? 'No' : undefined}
      />

      {/* Step 4: Thinner application */}
      <QuestionCard
        stepNumber={4}
        question="Have you tried a thinner application?"
        explanation="A thinner glaze layer experiences less stress during cooling."
        answers={[
          { label: 'Yes, I have', value: 'yes' },
          { label: 'No, not yet', value: 'no' },
        ]}
        onAnswer={handleThinnerApp}
        isActive={currentStep === 'thinner_app'}
        answeredValue={answers['thinner_app'] === 'yes' ? 'Yes' : answers['thinner_app'] === 'no' ? 'No' : undefined}
      />

      {/* Suggestion ending */}
      {currentStep === 'done_suggestion' && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">Suggested Next Step</h3>
          <p className="text-sm text-blue-800">{suggestion}</p>
          <p className="text-xs text-blue-600 mt-3">
            Try this first, then come back here if the crazing persists.
          </p>
        </div>
      )}
    </div>
  );
}
