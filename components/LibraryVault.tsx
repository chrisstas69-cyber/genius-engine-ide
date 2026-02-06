'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Plus, Eye, Play } from 'lucide-react';
import { mindsets, categoryOrder } from '@/lib/mindsets';
import { SavedItem } from '@/lib/types';

interface LibraryVaultProps {
  onClose: () => void;
  savedItems: SavedItem[];
  onUsePrompt: (item: SavedItem) => void;
}

export default function LibraryVault({ onClose, savedItems, onUsePrompt }: LibraryVaultProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMindset, setFilterMindset] = useState<string | null>(null);

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMindset = !filterMindset || item.mindset === filterMindset;
    return matchesSearch && matchesMindset;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-10 py-10">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Editor</span>
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">Library Vault</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-12">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-12 pr-4 py-4 bg-dark-card border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted outline-none focus:border-border-hover text-sm"
          />
        </div>
        <select
          value={filterMindset || ''}
          onChange={(e) => setFilterMindset(e.target.value || null)}
          className="px-4 py-4 bg-dark-card border border-border-subtle rounded-xl text-text-primary outline-none focus:border-border-hover text-sm appearance-none cursor-pointer min-w-[200px]"
        >
          <option value="">All Mindsets</option>
          {categoryOrder.map(({ category }) => (
            <optgroup key={category} label={category}>
              {Object.entries(mindsets)
                .filter(([, m]) => m.category === category)
                .map(([key, m]) => (
                  <option key={key} value={key}>
                    {m.icon} {m.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
        {filteredItems.map((item) => {
          const mindset = mindsets[item.mindset];
          return (
            <div
              key={item.id}
              className="bg-dark-card border border-border-subtle rounded-xl p-6 hover:border-border-hover transition-all glow-hover min-h-[210px]"
            >
              <div className="flex items-start justify-between mb-5">
                {mindset && (
                  <div className="flex flex-col">
                    <span className="text-2xl mb-1">{mindset.icon}</span>
                    <span className="text-text-muted text-xs">{mindset.name.replace(' Mindset', '')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-2.5 py-1 bg-success-muted rounded-full">
                  <span className="text-success text-sm font-semibold">{item.score}/100</span>
                </div>
              </div>
              <h3 className="text-text-primary font-medium text-base mb-2">{item.name}</h3>
              <p className="text-text-muted text-xs mb-6">{item.date}</p>
              <div className="flex items-center gap-4">
                <button className="text-text-muted hover:text-text-primary transition-colors text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Eye size={14} />
                    View
                  </span>
                </button>
                <button
                  onClick={() => onUsePrompt(item)}
                  className="ml-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-accent text-accent hover:bg-accent/10 transition-colors text-sm font-medium"
                >
                  <Play size={14} />
                  Use
                </button>
              </div>
            </div>
          );
        })}

        {/* Create New Card */}
        <button
          onClick={onClose}
          className="bg-dark-card border-2 border-dashed border-border-subtle rounded-xl p-6 hover:border-border-hover transition-all flex flex-col items-center justify-center min-h-[190px] glow-hover"
        >
          <div className="w-14 h-14 rounded-full bg-dark-hover flex items-center justify-center mb-4">
            <Plus size={28} className="text-text-muted" />
          </div>
          <span className="text-text-primary font-medium text-base">Create New Prompt</span>
          <span className="text-text-muted text-xs mt-1">Start from scratch</span>
        </button>
      </div>

      {filteredItems.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <p className="text-text-muted text-base">No prompts found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}
