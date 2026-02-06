'use client';

import { X, HelpCircle, Lightbulb, Zap, Target, Sparkles } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-border-subtle rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center">
              <HelpCircle size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-text-primary font-semibold text-lg">How GeniusEngine Works</h2>
              <p className="text-text-muted text-sm">Master prompt engineering in 3 steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-text-primary font-medium">Select Your Mindset</h3>
                <p className="text-text-secondary text-sm mt-1">
                  Choose from 20+ expert mindsets to unlock domain-specific terminology and frameworks.
                  Each mindset provides professional vocabulary that elevates your prompts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-text-primary font-medium">Describe Your Goal</h3>
                <p className="text-text-secondary text-sm mt-1">
                  Write what you want to achieve in plain language. Use the smart suggestions
                  to add professional terms that make your prompt more specific and effective.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-text-primary font-medium">Generate & Refine</h3>
                <p className="text-text-secondary text-sm mt-1">
                  Click Generate to transform your input into an optimized prompt. Review the
                  quality score, make adjustments, and save your best prompts to the Library.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
            <div className="bg-dark-hover rounded-lg p-4">
              <Lightbulb size={20} className="text-accent mb-2" />
              <h4 className="text-text-primary font-medium text-sm">Smart Suggestions</h4>
              <p className="text-text-muted text-xs mt-1">
                Domain-specific terms with explanations to help you learn while you create.
              </p>
            </div>
            <div className="bg-dark-hover rounded-lg p-4">
              <Target size={20} className="text-accent mb-2" />
              <h4 className="text-text-primary font-medium text-sm">Quality Scoring</h4>
              <p className="text-text-muted text-xs mt-1">
                Get instant feedback on clarity, specificity, and context of your prompts.
              </p>
            </div>
            <div className="bg-dark-hover rounded-lg p-4">
              <Sparkles size={20} className="text-accent mb-2" />
              <h4 className="text-text-primary font-medium text-sm">20+ Mindsets</h4>
              <p className="text-text-muted text-xs mt-1">
                From photography to legal, access expert frameworks across industries.
              </p>
            </div>
            <div className="bg-dark-hover rounded-lg p-4">
              <Zap size={20} className="text-accent mb-2" />
              <h4 className="text-text-primary font-medium text-sm">Library Vault</h4>
              <p className="text-text-muted text-xs mt-1">
                Save, organize, and reuse your best prompts for consistent results.
              </p>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-accent-muted border border-accent/30 rounded-lg p-4">
            <h4 className="text-accent font-medium text-sm mb-2">💡 Pro Tips</h4>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>• Click any smart suggestion to add it to your prompt instantly</li>
              <li>• Hover over terms to see their professional definitions</li>
              <li>• Use the prompt breakdown to understand how scoring works</li>
              <li>• Save your best prompts to build a personal library</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Got it, let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
}
