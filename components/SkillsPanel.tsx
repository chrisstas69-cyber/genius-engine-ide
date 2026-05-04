'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Search, Check, Sparkles, Copy, Trash2, Download, Send, RotateCcw } from 'lucide-react';
import type { Skill, SkillCategory } from '@/lib/types';
import { SKILL_CATEGORIES, SKILL_CATEGORY_COLORS, BUILTIN_SKILLS } from '@/lib/skills';
import { exportSkillAsMd } from '@/lib/exportSkill';

interface SkillsPanelProps {
  open: boolean;
  onClose: () => void;
  selectedSkills: Skill[];
  customSkills: Skill[];
  onToggleSkill: (skill: Skill) => void;
  onCreateSkill: (skill: Omit<Skill, 'id' | 'isCustom'>) => void;
  onDeleteSkill: (id: string) => void;
}

type FilterCategory = SkillCategory | 'All' | 'My Skills';
type CreateMode = 'idle' | 'chat' | 'preview';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeneratedSkill {
  name: string;
  category: SkillCategory;
  icon: string;
  description: string;
  instruction: string;
}

const VALID_CATEGORIES = new Set<string>(SKILL_CATEGORIES);

function sanitizeCategory(cat: string | undefined): SkillCategory {
  if (cat && VALID_CATEGORIES.has(cat)) return cat as SkillCategory;
  return 'Coding';
}

export default function SkillsPanel({
  open, onClose, selectedSkills, customSkills,
  onToggleSkill, onCreateSkill, onDeleteSkill,
}: SkillsPanelProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create flow
  const [createMode, setCreateMode] = useState<CreateMode>('idle');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [pendingSkill, setPendingSkill] = useState<GeneratedSkill | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [chatMessages, createMode]);

  if (!open) return null;

  const allSkills = [...BUILTIN_SKILLS, ...customSkills];
  const filtered = allSkills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    if (filterCategory === 'My Skills') return matchSearch && s.isCustom;
    const matchCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const isSelected = (id: string) => selectedSkills.some(s => s.id === id);

  const handleCopy = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(skill.instruction).then(() => {
      setCopiedId(skill.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleExport = (skill: Skill | GeneratedSkill, e?: React.MouseEvent) => {
    e?.stopPropagation();
    exportSkillAsMd(skill);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSkill(id);
  };

  const resetCreate = () => {
    setCreateMode('idle');
    setChatMessages([]);
    setChatInput('');
    setChatError('');
    setPendingSkill(null);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatLoading) return;

    const next: ChatMessage[] = [...chatMessages, { role: 'user', content: trimmed }];
    setChatMessages(next);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const res = await fetch('/api/skill-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json() as {
        type?: string;
        message?: string;
        name?: string;
        category?: string;
        icon?: string;
        description?: string;
        instruction?: string;
        error?: string;
      };

      if (!res.ok || data.error) throw new Error(data.error || 'Generation failed');

      if (data.type === 'questions') {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message || '' }]);
      } else if (data.type === 'skill') {
        const skill: GeneratedSkill = {
          name: data.name || 'Custom Skill',
          category: sanitizeCategory(data.category),
          icon: data.icon || '🛠️',
          description: data.description || '',
          instruction: data.instruction || '',
        };
        setPendingSkill(skill);
        setCreateMode('preview');
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setChatLoading(false);
    }
  };

  const saveSkill = () => {
    if (!pendingSkill) return;
    onCreateSkill(pendingSkill);
    resetCreate();
    setFilterCategory('My Skills');
  };

  const inputStyle = {
    padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
    color: '#FFFFFF', fontSize: 13,
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, backdropFilter: 'blur(4px)' }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#111218', borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 200ms ease', boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} color="#818CF8" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Skills</h2>
            {selectedSkills.length > 0 && (
              <span style={{
                background: 'rgba(129,140,248,0.2)', color: '#818CF8',
                padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
              }}>{selectedSkills.length} active</span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b6f80', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {createMode === 'idle' && (
          <>
            {/* Search */}
            <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6f80' }} />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, width: '100%', paddingLeft: 36 }}
                />
              </div>
            </div>

            {/* Category pills */}
            <div style={{ padding: '14px 24px 0', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
              {(['All', 'My Skills', ...SKILL_CATEGORIES] as FilterCategory[]).map(cat => {
                const isActive = filterCategory === cat;
                const color = (cat === 'All' || cat === 'My Skills') ? '#818CF8' : SKILL_CATEGORY_COLORS[cat as SkillCategory];
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: isActive ? `1px solid ${color}80` : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? `${color}20` : 'transparent',
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
                const isCopied = copiedId === skill.id;
                return (
                  <div
                    key={skill.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '14px 16px', borderRadius: 12,
                      background: selected ? `${catColor}10` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selected ? `${catColor}40` : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 150ms',
                    }}
                  >
                    <button
                      onClick={() => onToggleSkill(skill)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, minWidth: 0 }}
                    >
                      <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{skill.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>{skill.name}</span>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 600, background: `${catColor}20`, color: catColor }}>{skill.category}</span>
                          {skill.isCustom && (
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#6b6f80' }}>Custom</span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: '#a0a4b8', margin: 0, lineHeight: 1.4 }}>{skill.description}</p>
                      </div>
                    </button>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginTop: 2 }}>
                      <button
                        onClick={(e) => handleCopy(skill, e)}
                        title="Copy instruction"
                        style={{
                          background: isCopied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isCopied ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
                          color: isCopied ? '#10B981' : '#6b6f80',
                          fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4, transition: 'all 150ms',
                        }}
                      >
                        <Copy size={11} />
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>

                      <button
                        onClick={(e) => handleExport(skill, e)}
                        title="Export as .md for Claude Code"
                        style={{
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
                          color: '#6b6f80', display: 'flex', alignItems: 'center', transition: 'all 150ms',
                        }}
                      >
                        <Download size={11} />
                      </button>

                      {skill.isCustom && (
                        <button
                          onClick={(e) => handleDelete(skill.id, e)}
                          title="Delete custom skill"
                          style={{
                            background: 'transparent', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
                            color: 'rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', transition: 'all 150ms',
                          }}
                        >
                          <Trash2 size={11} />
                        </button>
                      )}

                      <button
                        onClick={() => onToggleSkill(skill)}
                        style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          border: `2px solid ${selected ? catColor : 'rgba(255,255,255,0.15)'}`,
                          background: selected ? catColor : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 150ms', cursor: 'pointer',
                        }}
                      >
                        {selected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b6f80', padding: 32, fontSize: 14 }}>
                  {filterCategory === 'My Skills' ? 'No custom skills yet. Create one below.' : 'No skills match your search.'}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', flexShrink: 0 }}>
              <button
                onClick={() => setCreateMode('chat')}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(236,72,153,0.1))',
                  border: '1px solid rgba(129,140,248,0.25)',
                  color: '#818CF8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 150ms',
                }}
              >
                <Sparkles size={15} /> Create Skill with AI
              </button>
            </div>
          </>
        )}

        {/* ── Chat mode ── */}
        {(createMode === 'chat') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Subheader */}
            <div style={{
              padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: '#a0a4b8' }}>
                Describe the skill you want — I&apos;ll ask questions if I need more detail.
              </p>
              <button onClick={resetCreate} title="Cancel" style={{ background: 'none', border: 'none', color: '#6b6f80', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
                  <p style={{ color: '#6b6f80', fontSize: 13, margin: 0 }}>
                    What kind of skill do you need?<br />
                    <span style={{ color: '#4b4f60', fontSize: 12 }}>e.g. &quot;something to review my React code&quot; or &quot;a skill for writing tests&quot;</span>
                  </p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #818CF8, #6366F1)' : 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF', fontSize: 13, lineHeight: 1.5,
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                    background: 'rgba(255,255,255,0.06)', display: 'flex', gap: 4, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#818CF8',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        display: 'inline-block',
                      }} />
                    ))}
                  </div>
                </div>
              )}
              {chatError && (
                <p style={{ fontSize: 12, color: '#EF4444', textAlign: 'center', margin: 0 }}>{chatError}</p>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={inputRef}
                  placeholder="Type your answer or describe what you need…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(chatInput); }}
                  disabled={chatLoading}
                  style={{
                    ...inputStyle, flex: 1,
                    opacity: chatLoading ? 0.5 : 1,
                  }}
                />
                <button
                  onClick={() => sendMessage(chatInput)}
                  disabled={chatLoading || !chatInput.trim()}
                  style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none',
                    background: chatLoading || !chatInput.trim() ? 'rgba(129,140,248,0.2)' : 'linear-gradient(135deg, #818CF8, #EC4899)',
                    color: chatLoading || !chatInput.trim() ? '#818CF8' : '#fff',
                    cursor: chatLoading || !chatInput.trim() ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Preview mode ── */}
        {createMode === 'preview' && pendingSkill && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} /> Skill generated
              </span>
              <button onClick={resetCreate} title="Start over" style={{ background: 'none', border: 'none', color: '#6b6f80', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <RotateCcw size={13} /> Start over
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {/* Skill preview card */}
              <div style={{
                padding: '20px', borderRadius: 14,
                background: `${SKILL_CATEGORY_COLORS[pendingSkill.category]}08`,
                border: `1px solid ${SKILL_CATEGORY_COLORS[pendingSkill.category]}30`,
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{pendingSkill.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>{pendingSkill.name}</div>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 8, fontWeight: 600,
                      background: `${SKILL_CATEGORY_COLORS[pendingSkill.category]}20`,
                      color: SKILL_CATEGORY_COLORS[pendingSkill.category],
                    }}>{pendingSkill.category}</span>
                  </div>
                </div>
                {pendingSkill.description && (
                  <p style={{ fontSize: 12, color: '#a0a4b8', margin: '0 0 12px', lineHeight: 1.4 }}>{pendingSkill.description}</p>
                )}
                <div style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: 12, color: '#d0d4e8', margin: 0, lineHeight: 1.6 }}>{pendingSkill.instruction}</p>
                </div>
              </div>

              <p style={{ fontSize: 11, color: '#4b4f60', textAlign: 'center', margin: '0 0 16px' }}>
                Export as .md to use as a <code style={{ color: '#818CF8' }}>/skill-name</code> command in Claude Code — save to <code style={{ color: '#818CF8' }}>~/.claude/skills/</code>
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={saveSkill}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #818CF8, #EC4899)',
                    color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >Save Skill</button>
                <button
                  onClick={() => handleExport(pendingSkill)}
                  title="Download as .md for Claude Code"
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
                    color: '#06B6D4', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Download size={14} /> Export .md
                </button>
              </div>
              <button
                onClick={() => { setPendingSkill(null); setCreateMode('chat'); }}
                style={{
                  width: '100%', marginTop: 8, padding: '10px', borderRadius: 10,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#6b6f80', fontSize: 13, cursor: 'pointer',
                }}
              >Regenerate</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}
