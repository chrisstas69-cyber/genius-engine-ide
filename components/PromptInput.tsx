'use client';

import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  placeholder?: string;
  isExpanded?: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onGenerate,
  placeholder = 'Describe what you want to create...',
  isExpanded = false,
}: PromptInputProps) {
  const characterCount = value.length;
  const canGenerate = value.trim().length > 0;

  return (
    <div className="bg-dark-card border border-border-subtle rounded-xl overflow-hidden glow-focus">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent p-5 text-text-primary placeholder:text-text-muted resize-none outline-none text-base leading-relaxed ${
          isExpanded ? 'min-h-[220px]' : 'min-h-[160px]'
        }`}
      />
      <div className="flex items-center justify-between px-5 py-4 bg-dark-elevated border-t border-border-subtle">
        <span className="text-text-muted text-sm">{characterCount} characters</span>
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            canGenerate
              ? 'bg-accent text-white hover:bg-accent/90 glow-hover'
              : 'bg-dark-hover text-text-muted cursor-not-allowed'
          }`}
        >
          <Sparkles size={16} />
          Generate
        </button>
      </div>
    </div>
  );
}
