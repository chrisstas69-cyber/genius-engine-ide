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
<<<<<<< HEAD
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
=======
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
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
<<<<<<< HEAD
            style={{
              flex: '1 1 200px', padding: '12px 18px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14,
              transition: 'border-color 200ms ease',
            }}
=======
            style={{ flex: '1 1 200px', padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14 }}
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          />
          <select
            value={filterMindset}
            onChange={(e) => setFilterMindset(e.target.value)}
<<<<<<< HEAD
            style={{
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14, minWidth: 180,
              cursor: 'pointer',
            }}
=======
            style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14, minWidth: 180 }}
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
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
<<<<<<< HEAD
            style={{
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 12, color: '#F1F5F9', fontSize: 14, minWidth: 160,
              cursor: 'pointer',
            }}
=======
            style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14, minWidth: 160 }}
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

<<<<<<< HEAD
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
=======
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          {sortedFiltered.map((item) => {
            const mindset = mindsets[item.mindset];
            const displayName = mindset?.name?.replace(' Mindset', '') || item.mindset;
            return (
              <div
                key={item.id}
<<<<<<< HEAD
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
=======
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
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
                </div>
              </div>
            );
          })}
<<<<<<< HEAD
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
=======
          <Link href="/app" style={{ background: '#1A1A1A', border: '2px dashed #2A2A2A', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, textDecoration: 'none', color: '#A0A0A0', transition: 'border-color 0.2s' }} className="library-card">
            <span style={{ fontSize: 32, marginBottom: 8 }}>+</span>
            <span style={{ color: '#ECECEC', fontWeight: 500 }}>Create new prompt</span>
            <span style={{ fontSize: 12, marginTop: 4 }}>Open IDE</span>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </Link>
        </div>

        {sortedFiltered.length === 0 && (
<<<<<<< HEAD
          <p style={{ textAlign: 'center', color: '#94A3B8', padding: 64, fontSize: 15 }}>
            {search || filterMindset ? 'No prompts match your filters.' : 'No saved prompts yet. Save from the IDE to see them here.'}
          </p>
=======
          <p style={{ textAlign: 'center', color: '#A0A0A0', padding: 48 }}>{search || filterMindset ? 'No prompts match your filters.' : 'No saved prompts yet. Save from the IDE to see them here.'}</p>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
        )}
      </main>
    </div>
  );
}
