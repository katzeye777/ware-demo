'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface QuestionCardProps {
  /** The question text displayed prominently. */
  question: string;
  /** Optional explanation or context shown below the question. */
  explanation?: string;
  /** Answer button options. Each has a label and a callback. */
  answers?: { label: string; value: string }[];
  /** Called when an answer button is clicked. */
  onAnswer?: (value: string) => void;
  /** If true, the card is the active step and shown in full. */
  isActive: boolean;
  /** If answered, show the compact summary instead of the full card. */
  answeredValue?: string;
  /** Step number for display (1-indexed). */
  stepNumber: number;
  /** Optional custom content slot (e.g., photo uploader, clay body selector). */
  children?: ReactNode;
}

export default function QuestionCard({
  question,
  explanation,
  answers,
  onAnswer,
  isActive,
  answeredValue,
  stepNumber,
  children,
}: QuestionCardProps) {
  // ── Collapsed summary for completed steps ──
  if (!isActive && answeredValue) {
    return (
      <div className="flex items-center space-x-3 py-3 px-4 bg-clay-50 rounded-lg border border-clay-200">
        <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {stepNumber}
        </div>
        <span className="text-sm text-clay-600 flex-1">{question}</span>
        <span className="text-sm font-medium text-clay-900 bg-white px-3 py-1 rounded-full border border-clay-200">
          {answeredValue}
        </span>
      </div>
    );
  }

  // ── Not yet reached ──
  if (!isActive && !answeredValue) {
    return null;
  }

  // ── Active step — full card ──
  return (
    <div className="card border-2 border-brand-200 bg-white animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-clay-900">{question}</h3>
          {explanation && (
            <p className="text-sm text-clay-500 mt-1">{explanation}</p>
          )}
        </div>
      </div>

      {/* Custom content (photo uploader, selector, etc.) */}
      {children && <div className="mb-4">{children}</div>}

      {/* Answer buttons */}
      {answers && answers.length > 0 && onAnswer && (
        <div className="flex flex-wrap gap-3">
          {answers.map((answer) => (
            <button
              key={answer.value}
              onClick={() => onAnswer(answer.value)}
              className="px-5 py-2.5 rounded-lg border-2 border-clay-200 bg-white text-clay-700 font-medium text-sm hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-all"
            >
              {answer.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
