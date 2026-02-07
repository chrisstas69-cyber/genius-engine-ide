'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSavedPrompts, removeSavedPrompt } from '@/lib/savedPrompts';
import { mindsets } from '@/lib/mindsets';
import type { SavedItem } from '@/lib/types';

const PENDING_PROMPT_KEY = 'genius-engine-use-prompt';

export default function LibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterMindset, setFilterMindset] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setItems(getSavedPrompts());
  }, []);

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchMindset = !filterMindset || item.mindset === filterMindset;
    return matchSearch && matchMindset;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    const ta = a.createdAt ?? 0;
    const tb = b.createdAt ?? 0;
    return sortOrder === 'newest' ? tb - ta : ta - tb;
  });

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeSavedPrompt(id);
    setItems(getSavedPrompts());
  };

  const handleUse = (item: SavedItem) => {
    sessionStorage.setItem(PENDING_PROMPT_KEY, JSON.stringify({
      content: item.content || '',
      mindset: item.mindset,
      name: item.name,
    }));
    router.push('/app');
  };

  const mindsetKeys = Object.keys(mindsets);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#0F172A', color: '#F1F5F9' }}>
      <header style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      }}>
        <Link href="/" style={{
          textDecoration: 'none', fontWeight: 700, fontSize: 18,
          background: 'linear-gradient(135deg, #818CF8, #C084FC, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>GeniusEngine</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, transition: 'color 200ms' }}>App</Link>
          <Link href="/" style={{
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #818CF8, #EC4899)',
            color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
            boxShadow: '0 2px 12px rgba(129, 140, 248, 0.25)',
            transition: 'all 200ms ease',
          }}>Open IDE</Link>
        </nav>
      </header>

      <main style={{ maxWidth: 1060, margin: '0 auto', padding: '48px 32px' }}>
        <h1 style={{
          fontSize: 36, fontWeight: 900, marginBottom: 8,
          background: 'linear-gradient(135deg, #818CF8, #C084FC, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Library Vault</h1>
        <p style={{ color: '#94A3B8', marginBottom: 36, fontSize: 16 }}>Your saved prompts. Click Use to open in the IDE.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1 1 200px', padding: '12px 18px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14,
              transition: 'border-color 200ms ease',
            }}
          />
          <select
            value={filterMindset}
            onChange={(e) => setFilterMindset(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14, minWidth: 180,
              cursor: 'pointer',
            }}
          >
            <option value="">All mindsets</option>
            {mindsetKeys.map((key) => {
              const m = mindsets[key];
              return <option key={key} value={key}>{m.icon} {m.name}</option>;
            })}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            style={{
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14, minWidth: 160,
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
          {sortedFiltered.map((item) => {
            const mindset = mindsets[item.mindset];
            const displayName = mindset?.name?.replace(' Mindset', '') || item.mindset;
            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: 16, padding: 24,
                  transition: 'all 200ms ease',
                  backdropFilter: 'blur(16px)',
                  cursor: 'default',
                }}
                className="library-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>{mindset?.icon || '📄'}</span>
                    <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 500 }}>{displayName}</span>
                  </div>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    padding: '5px 12px', borderRadius: 20,
                    fontSize: 12, fontWeight: 700,
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>{item.score}/100</div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, color: '#F1F5F9' }}>{item.name}</h3>
                <p style={{ color: '#64748B', fontSize: 12, marginBottom: 18 }}>{item.date}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleUse(item)}
                    style={{
                      padding: '8px 18px',
                      background: 'linear-gradient(135deg, #818CF8, #EC4899)',
                      color: '#fff', border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(129, 140, 248, 0.2)',
                      transition: 'all 200ms ease',
                    }}
                  >Use</button>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item.id)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      color: '#94A3B8',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      borderRadius: 10, fontSize: 13, cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  >Remove</button>
                </div>
              </div>
            );
          })}
          <Link href="/" style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '2px dashed rgba(148, 163, 184, 0.12)',
            borderRadius: 16, padding: 28,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 200, textDecoration: 'none', color: '#94A3B8',
            transition: 'all 200ms ease',
          }} className="library-card">
            <span style={{ fontSize: 36, marginBottom: 10, opacity: 0.7 }}>+</span>
            <span style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 15 }}>Create new prompt</span>
            <span style={{ fontSize: 12, marginTop: 6, color: '#64748B' }}>Open IDE</span>
          </Link>
        </div>

        {sortedFiltered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94A3B8', padding: 64, fontSize: 15 }}>
            {search || filterMindset ? 'No prompts match your filters.' : 'No saved prompts yet. Save from the IDE to see them here.'}
          </p>
        )}
      </main>
    </div>
  );
}
