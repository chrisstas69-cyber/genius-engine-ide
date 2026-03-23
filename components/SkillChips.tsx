'use client';

import { X, Sparkles } from 'lucide-react';
import type { Skill } from '@/lib/types';
import { SKILL_CATEGORY_COLORS } from '@/lib/skills';

interface SkillChipsProps {
  skills: Skill[];
  onRemove: (skillId: string) => void;
  onOpenPanel: () => void;
}

export default function SkillChips({ skills, onRemove, onOpenPanel }: SkillChipsProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      padding: skills.length > 0 ? '8px 0 4px' : '4px 0',
    }}>
      {skills.map(skill => {
        const color = SKILL_CATEGORY_COLORS[skill.category];
        return (
          <span
            key={skill.id}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px 4px 8px', borderRadius: 8,
              background: color + '15', border: `1px solid ${color}40`,
              fontSize: 12, fontWeight: 600, color: color,
              transition: 'all 150ms',
            }}
          >
            <span style={{ fontSize: 13 }}>{skill.icon}</span>
            {skill.name}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(skill.id); }}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: color, cursor: 'pointer', display: 'flex',
                marginLeft: 2, opacity: 0.7,
              }}
            >
              <X size={12} />
            </button>
          </span>
        );
      })}
      <button
        onClick={onOpenPanel}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(129, 140, 248, 0.08)',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          fontSize: 12, fontWeight: 600, color: '#818CF8',
          cursor: 'pointer', transition: 'all 150ms',
        }}
      >
        <Sparkles size={12} />
        {skills.length === 0 ? 'Add Skills' : '+'}
      </button>
    </div>
  );
}
