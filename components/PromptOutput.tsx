'use client';

import { useState } from 'react';
import { Copy, Check, Download, ChevronDown, ChevronUp, RefreshCw, RotateCcw, Save } from 'lucide-react';
import { mindsets } from '@/lib/mindsets';

interface PromptOutputProps {
  generatedPrompt: string;
  inputText: string;
  mindsetKey: string | null;
  onCopy: () => void;
  onStartOver: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  copied: boolean;
}

export default function PromptOutput({
  generatedPrompt,
  inputText,
  mindsetKey,
  onCopy,
  onStartOver,
  onRegenerate,
  onSave,
  copied,
}: PromptOutputProps) {
  const [showDetails, setShowDetails] = useState(false);
  const mindset = mindsetKey ? mindsets[mindsetKey] : null;
  const score = 87;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text-primary text-xl font-semibold mb-1">Your prompt is ready</h2>
          <p className="text-text-secondary text-sm">Your optimized prompt is ready to use</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success-muted">
          <span className="text-success text-lg font-semibold">{score}</span>
          <span className="text-success text-xs">/100</span>
        </div>
      </div>

      {/* Mindset Badge */}
      {mindset && (
        <div className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-border-subtle rounded-full w-fit">
          <span className="text-lg">{mindset.icon}</span>
          <span className="text-text-secondary text-sm">{mindset.name}</span>
        </div>
      )}

      {/* Main Output Card */}
      <div className="bg-dark-card border border-border-subtle rounded-xl overflow-hidden glow-hover">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-dark-elevated border-b border-border-subtle">
          <span className="text-text-primary text-sm font-medium">Generated Prompt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-4 py-2 bg-dark-hover text-text-secondary hover:text-text-primary rounded-lg transition-colors text-xs font-medium"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-dark-hover text-text-secondary hover:text-text-primary rounded-lg transition-colors text-xs font-medium">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-80 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed">
            {generatedPrompt}
          </pre>
        </div>
      </div>

      {/* Collapsible Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-dark-card border border-border-subtle rounded-lg text-text-secondary hover:text-text-primary transition-colors text-sm"
      >
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{showDetails ? 'Hide' : 'Show'} prompt breakdown</span>
      </button>

      {/* Score Breakdown */}
      {showDetails && (
        <div className="bg-dark-card border border-border-subtle rounded-xl p-5 space-y-4">
          {/* Original Input */}
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wider">Original Input</span>
            <p className="text-text-secondary text-sm mt-2">{inputText}</p>
          </div>

          {/* Applied Mindset */}
          {mindset && (
            <div>
              <span className="text-text-muted text-xs uppercase tracking-wider">Applied Mindset</span>
              <p className="text-text-secondary text-sm mt-2">
                {mindset.icon} {mindset.name} - {mindset.description}
              </p>
            </div>
          )}

          {/* Quality Score Breakdown */}
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wider">Quality Score Breakdown</span>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Clarity</span>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2 bg-dark-hover rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '90%' }} />
                  </div>
                  <span className="text-success text-xs font-medium w-8">90%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Specificity</span>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2 bg-dark-hover rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-success text-xs font-medium w-8">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Context</span>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2 bg-dark-hover rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-accent text-xs font-medium w-8">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-4 py-2.5 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <RotateCcw size={16} />
          Start Over
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-5 py-2.5 bg-dark-card border border-border-subtle rounded-lg text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors text-sm"
          >
            <RefreshCw size={16} />
            Regenerate
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium glow-hover"
          >
            <Save size={16} />
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
