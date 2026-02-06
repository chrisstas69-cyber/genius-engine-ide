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
    <div className="min-h-screen bg-[#0D0D0D] text-[#ECECEC]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header style={{ padding: '20px 32px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Link href="/" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600 }}>GeniusEngine</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/app" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>App</Link>
          <Link href="/styleguide" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>Style guide</Link>
          <Link href="/app" style={{ padding: '10px 20px', borderRadius: 8, background: '#D97757', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Open IDE</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 48 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Library Vault</h1>
        <p style={{ color: '#A0A0A0', marginBottom: 32 }}>Your saved prompts. Click Use to open in the IDE.</p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1 1 200px', padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14 }}
          />
          <select
            value={filterMindset}
            onChange={(e) => setFilterMindset(e.target.value)}
            style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14, minWidth: 180 }}
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
            style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14, minWidth: 160 }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {sortedFiltered.map((item) => {
            const mindset = mindsets[item.mindset];
            const displayName = mindset?.name?.replace(' Mindset', '') || item.mindset;
            return (
              <div
                key={item.id}
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20, transition: 'box-shadow 0.2s, border-color 0.2s' }}
                className="library-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{mindset?.icon || '📄'}</span>
                    <span style={{ color: '#A0A0A0', fontSize: 12 }}>{displayName}</span>
                  </div>
                  <div style={{ background: 'rgba(217,119,87,0.15)', color: '#D97757', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>{item.score}/100</div>
                </div>
                <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>{item.name}</h3>
                <p style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 16 }}>{item.date}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="button" onClick={() => handleUse(item)} style={{ padding: '8px 16px', background: '#D97757', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Use</button>
                  <button type="button" onClick={(e) => handleRemove(e, item.id)} style={{ padding: '8px 16px', background: 'transparent', color: '#A0A0A0', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            );
          })}
          <Link href="/app" style={{ background: '#1A1A1A', border: '2px dashed #2A2A2A', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, textDecoration: 'none', color: '#A0A0A0', transition: 'border-color 0.2s' }} className="library-card">
            <span style={{ fontSize: 32, marginBottom: 8 }}>+</span>
            <span style={{ color: '#ECECEC', fontWeight: 500 }}>Create new prompt</span>
            <span style={{ fontSize: 12, marginTop: 4 }}>Open IDE</span>
          </Link>
        </div>

        {sortedFiltered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#A0A0A0', padding: 48 }}>{search || filterMindset ? 'No prompts match your filters.' : 'No saved prompts yet. Save from the IDE to see them here.'}</p>
        )}
      </main>
    </div>
  );
}
