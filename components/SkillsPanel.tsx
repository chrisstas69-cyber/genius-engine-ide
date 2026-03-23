'use client';

import { useState } from 'react';
import { X, Plus, Search, Check, Sparkles } from 'lucide-react';
import type { Skill, SkillCategory } from '@/lib/types';
import { SKILL_CATEGORIES, SKILL_CATEGORY_COLORS, BUILTIN_SKILLS } from '@/lib/skills';

interface SkillsPanelProps {
  open: boolean;
  onClose: () => void;
  selectedSkills: Skill[];
  customSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
  onCreateSkill: (skill: Omit<Skill, 'id' | 'isCustom'>) => void;
}

export default function SkillsPanel({ open, onClose, selectedSkills, customSkills, onToggleSkill, onCreateSkill }: SkillsPanelProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<SkillCategory | 'All'>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Reasoning' as SkillCategory, description: '', instruction: '', icon: '🛠️' });

  if (!open) return null;

  const allSkills = [...BUILTIN_SKILLS, ...customSkills];
  const filtered = allSkills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const isSelected = (id: string) => selectedSkills.some(s => s.id === id);

  const handleCreate = () => {
    if (!newSkill.name.trim() || !newSkill.instruction.trim()) return;
    onCreateSkill(newSkill);
    setNewSkill({ name: '', category: 'Reasoning', description: '', instruction: '', icon: '🛠️' });
    setShowCreateForm(false);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 999, backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#111218', borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 200ms ease',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} color="#818CF8" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Skills</h2>
            {selectedSkills.length > 0 && (
              <span style={{
                background: 'rgba(129, 140, 248, 0.2)', color: '#818CF8',
                padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
              }}>{selectedSkills.length} active</span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b6f80', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6f80' }} />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#FFFFFF', fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div style={{ padding: '14px 24px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterCategory('All')}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: filterCategory === 'All' ? '1px solid rgba(129, 140, 248, 0.5)' : '1px solid rgba(255,255,255,0.08)',
              background: filterCategory === 'All' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
              color: filterCategory === 'All' ? '#818CF8' : '#a0a4b8',
              cursor: 'pointer', transition: 'all 150ms',
            }}
          >All</button>
          {SKILL_CATEGORIES.map(cat => {
            const color = SKILL_CATEGORY_COLORS[cat];
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${isActive ? color + '80' : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? color + '20' : 'transparent',
                  color: isActive ? color : '#a0a4b8',
                  cursor: 'pointer', transition: 'all 150ms',
                }}
              >{cat}</button>
            );
          })}
        </div>

        {/* Skills list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(skill => {
            const selected = isSelected(skill.id);
            const catColor = SKILL_CATEGORY_COLORS[skill.category];
            return (
              <button
                key={skill.id}
                onClick={() => onToggleSkill(skill)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: selected ? catColor + '10' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected ? catColor + '40' : 'rgba(255,255,255,0.06)'}`,
                  textAlign: 'left', transition: 'all 150ms',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{skill.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>{skill.name}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 600,
                      background: catColor + '20', color: catColor,
                    }}>{skill.category}</span>
                    {skill.isCustom && (
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#6b6f80' }}>Custom</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#a0a4b8', margin: 0, lineHeight: 1.4 }}>{skill.description}</p>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                  border: `2px solid ${selected ? catColor : 'rgba(255,255,255,0.15)'}`,
                  background: selected ? catColor : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms',
                }}>
                  {selected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b6f80', padding: 32, fontSize: 14 }}>No skills match your search.</p>
          )}
        </div>

        {/* Footer — Create Custom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
          {showCreateForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={e => setNewSkill(p => ({ ...p, name: e.target.value }))}
                  style={{
                    flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                    color: '#FFFFFF', fontSize: 13,
                  }}
                />
                <select
                  value={newSkill.category}
                  onChange={e => setNewSkill(p => ({ ...p, category: e.target.value as SkillCategory }))}
                  style={{
                    padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                    color: '#FFFFFF', fontSize: 13, minWidth: 130,
                  }}
                >
                  {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input
                placeholder="Short description"
                value={newSkill.description}
                onChange={e => setNewSkill(p => ({ ...p, description: e.target.value }))}
                style={{
                  padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                  color: '#FFFFFF', fontSize: 13,
                }}
              />
              <textarea
                placeholder="Instruction (how should the AI behave?)"
                value={newSkill.instruction}
                onChange={e => setNewSkill(p => ({ ...p, instruction: e.target.value }))}
                rows={3}
                style={{
                  padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                  color: '#FFFFFF', fontSize: 13, resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleCreate}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #818CF8, #EC4899)',
                    color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >Create Skill</button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '10px 16px', borderRadius: 10,
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#a0a4b8', fontSize: 13, cursor: 'pointer',
                  }}
                >Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#a0a4b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 150ms',
              }}
            >
              <Plus size={16} /> Create Custom Skill
            </button>
          )}
        </div>
      </div>
    </>
  );
}
