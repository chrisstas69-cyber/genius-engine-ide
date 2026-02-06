'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, FolderOpen, ChevronDown, FileText, HelpCircle } from 'lucide-react';
import { quickTemplates } from '@/lib/mindsets';
import MindsetSelector from './MindsetSelector';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedMindset: string | null;
  onSelectMindset: (key: string | null) => void;
  onOpenLibrary: () => void;
  onOpenInstructions: () => void;
  onNewPrompt: () => void;
  savedItemsCount: number;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  selectedMindset,
  onSelectMindset,
  onOpenLibrary,
  onOpenInstructions,
  onNewPrompt,
  savedItemsCount,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Marketing: true,
    Development: false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupedTemplates = quickTemplates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, typeof quickTemplates>
  );

  const sidebarWidth = collapsed ? 'w-[56px]' : 'w-[260px]';

  return (
    <aside
      className={`flex-shrink-0 h-screen bg-dark-elevated border-r border-border-subtle flex flex-col transition-all duration-300 ${sidebarWidth}`}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-text-primary font-semibold">GeniusEngine</span>
            <span className="text-text-muted text-xs">Prompt IDE</span>
          </div>
        )}
      </div>

      {/* New Prompt Button */}
      <div className={`px-5 mt-4 mb-4 ${collapsed ? 'px-3' : ''}`}>
        <button
          onClick={onNewPrompt}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-accent bg-accent-muted text-accent hover:bg-accent/20 transition-colors glow-hover ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Plus size={20} />
          {!collapsed && <span className="font-medium">New Prompt</span>}
        </button>
      </div>

      {/* Library Vault Card */}
      <div className={`mt-6 mb-4 px-5 ${collapsed ? 'px-3' : ''}`}>
        <button
          onClick={onOpenLibrary}
          className={`w-full bg-dark-card rounded-xl border border-border-subtle hover:border-border-hover p-5 transition-colors glow-hover ${
            collapsed ? 'p-3' : ''
          }`}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <FolderOpen size={20} className="text-text-secondary flex-shrink-0" />
            {!collapsed && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-text-primary font-medium">Library Vault</p>
                  <p className="text-text-muted text-xs mt-0.5">{savedItemsCount} saved prompts</p>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </>
            )}
          </div>
        </button>
      </div>

      {/* Expert Selection */}
      {!collapsed && (
        <div className="mt-10 px-5">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3 px-1 font-medium">Expert Selection</p>
          <MindsetSelector selectedMindset={selectedMindset} onSelectMindset={onSelectMindset} />
        </div>
      )}

      {/* Quick Templates */}
      {!collapsed && (
        <div className="mt-10 px-5 flex-1 overflow-y-auto">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3 px-1 font-medium">Quick Templates</p>
          <div className="space-y-1">
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-dark-hover rounded-lg transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedCategories[category] ? '' : '-rotate-90'}`}
                  />
                  <span className="text-sm font-medium">{category}</span>
                </button>
                {expandedCategories[category] && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        className="w-full flex items-center gap-2 px-3 py-2 text-text-muted hover:text-text-primary hover:bg-dark-hover rounded-lg transition-colors"
                      >
                        <FileText size={14} />
                        <span className="text-sm">{template.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacer to push bottom actions down */}
      <div className="flex-1" />

      {/* Bottom Actions */}
      <div className="border-t border-border-subtle">
        {/* Help Button */}
        <button
          onClick={onOpenInstructions}
          className={`w-full flex items-center gap-3 px-6 py-4 text-text-secondary hover:text-text-primary hover:bg-dark-hover transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <HelpCircle size={20} />
          {!collapsed && <span>How it works</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-3 px-6 py-4 text-text-muted hover:text-text-primary hover:bg-dark-hover transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
