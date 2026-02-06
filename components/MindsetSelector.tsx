'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { mindsets, categoryOrder } from '@/lib/mindsets';
import { MindsetCategory } from '@/lib/types';

interface MindsetSelectorProps {
  selectedMindset: string | null;
  onSelectMindset: (key: string | null) => void;
}

export default function MindsetSelector({ selectedMindset, onSelectMindset }: MindsetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMindsetData = selectedMindset ? mindsets[selectedMindset] : null;

  // Group mindsets by category
  const mindsetsByCategory = Object.entries(mindsets).reduce(
    (acc, [key, mindset]) => {
      if (!acc[mindset.category]) {
        acc[mindset.category] = [];
      }
      acc[mindset.category].push({ key, ...mindset });
      return acc;
    },
    {} as Record<MindsetCategory, Array<{ key: string; name: string; icon: string; category: MindsetCategory }>>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-dark-card border border-border-subtle rounded-lg hover:border-border-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          {selectedMindsetData ? (
            <>
              <span className="text-lg">{selectedMindsetData.icon}</span>
              <span className="text-text-primary text-sm">{selectedMindsetData.name}</span>
            </>
          ) : (
            <span className="text-text-secondary text-sm">Select Mindset</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-border-subtle rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 max-h-80 overflow-y-auto">
          {/* Clear Selection Option */}
          {selectedMindset && (
            <button
              onClick={() => {
                onSelectMindset(null);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-text-secondary hover:bg-dark-hover transition-colors border-b border-border-subtle"
            >
              <span className="text-sm">Clear selection</span>
            </button>
          )}

          {categoryOrder.map(({ category }) => {
            const categoryMindsets = mindsetsByCategory[category as MindsetCategory];
            if (!categoryMindsets?.length) return null;

            return (
              <div key={category}>
                <div className="px-3 py-2 bg-dark-elevated/50">
                  <span className="text-text-muted text-xs uppercase tracking-wider">{category}</span>
                </div>
                {categoryMindsets.map((mindset) => (
                  <button
                    key={mindset.key}
                    onClick={() => {
                      onSelectMindset(mindset.key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 hover:bg-dark-hover transition-colors ${
                      selectedMindset === mindset.key ? 'bg-accent-muted' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mindset.icon}</span>
                      <span
                        className={`text-sm ${
                          selectedMindset === mindset.key ? 'text-accent' : 'text-text-primary'
                        }`}
                      >
                        {mindset.name}
                      </span>
                    </div>
                    {selectedMindset === mindset.key && <Check size={16} className="text-accent" />}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
