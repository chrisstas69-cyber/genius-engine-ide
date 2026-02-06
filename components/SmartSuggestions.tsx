'use client';

import { useState } from 'react';
import { mindsets } from '@/lib/mindsets';

interface SmartSuggestionsProps {
  mindsetKey: string;
  onAddTerm: (term: string) => void;
}

export default function SmartSuggestions({ mindsetKey, onAddTerm }: SmartSuggestionsProps) {
  const [showAll, setShowAll] = useState(false);
  const mindset = mindsets[mindsetKey];

  if (!mindset) return null;

  const visibleSuggestions = showAll ? mindset.suggestions : mindset.suggestions.slice(0, 8);
  const remainingCount = mindset.suggestions.length - 8;

  return (
    <div className="bg-dark-card border border-border-subtle rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
        <span className="text-lg">{mindset.icon}</span>
        <span className="text-text-primary text-base font-medium">Smart Suggestions</span>
        <span className="text-text-muted text-sm ml-auto">{mindset.name}</span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {visibleSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onAddTerm(suggestion.term)}
              title={suggestion.desc}
              className="px-3.5 py-2 bg-dark-hover border border-border-subtle rounded-full text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors brightness-hover"
            >
              {suggestion.term}
            </button>
          ))}
          {!showAll && remainingCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-3.5 py-2 bg-accent-muted border border-accent/30 rounded-full text-sm text-accent hover:bg-accent/20 transition-colors"
            >
              +{remainingCount} more terms
            </button>
          )}
          {showAll && remainingCount > 0 && (
            <button
              onClick={() => setShowAll(false)}
              className="px-3.5 py-2 bg-dark-hover border border-border-subtle rounded-full text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Show less
            </button>
          )}
        </div>
        <p className="mt-4 text-text-muted text-sm">
          Click a term to add it to your prompt. Hover for definitions.
        </p>
      </div>
    </div>
  );
}
