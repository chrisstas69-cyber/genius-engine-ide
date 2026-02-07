'use client';

import Link from 'next/link';

const COLOR_SWATCHES = [
<<<<<<< HEAD
  { name: 'Background', hex: '#0F172A', var: '--ge-bg-page' },
  { name: 'Sidebar', hex: '#1E293B', var: '--ge-bg-sidebar' },
  { name: 'Card', hex: '#1E293B', var: '--ge-bg-card' },
  { name: 'Elevated', hex: '#334155', var: '--ge-bg-elevated' },
  { name: 'Border subtle', hex: 'rgba(148,163,184,0.08)', var: '--ge-border' },
  { name: 'Accent indigo', hex: '#818CF8', var: '--ge-accent-primary' },
  { name: 'Accent pink', hex: '#EC4899', var: '--ge-accent-cta' },
  { name: 'Success', hex: '#10B981', var: '--ge-success-green' },
  { name: 'Text primary', hex: '#F1F5F9', var: '--ge-text-primary' },
  { name: 'Text secondary', hex: '#94A3B8', var: '--ge-text-secondary' },
  { name: 'Text muted', hex: '#64748B', var: '--ge-text-muted' },
=======
  { name: 'Background', hex: '#0D0D0D', var: '--ge-bg-main' },
  { name: 'Sidebar', hex: '#141414', var: '--ge-bg-sidebar' },
  { name: 'Card', hex: '#1A1A1A', var: '--ge-bg-card' },
  { name: 'Elevated', hex: '#242424', var: '--ge-bg-elevated' },
  { name: 'Border', hex: '#2A2A2A', var: '' },
  { name: 'Border hover', hex: '#3A3A3A', var: '' },
  { name: 'Accent orange', hex: '#D97757', var: '--ge-accent-orange' },
  { name: 'Success green', hex: '#4ADE80', var: '--ge-success-green' },
  { name: 'Text primary', hex: '#ECECEC', var: '--ge-text-primary' },
  { name: 'Text secondary', hex: '#A0A0A0', var: '' },
  { name: 'Text muted', hex: '#5C5C5C', var: '--ge-text-muted' },
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
];

export default function StyleguidePage() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#0F172A', color: '#F1F5F9' }}>
      <header style={{
        padding: '16px 32px', borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      }}>
        <Link href="/" style={{
          textDecoration: 'none', fontWeight: 700, fontSize: 18,
          background: 'linear-gradient(135deg, #818CF8, #C084FC, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>GeniusEngine</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14 }}>App</Link>
          <Link href="/library" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14 }}>Library</Link>
          <Link href="/" style={{
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #818CF8, #EC4899)',
            color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
            boxShadow: '0 2px 12px rgba(129, 140, 248, 0.25)',
          }}>Open IDE</Link>
        </nav>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
        <h1 style={{
          fontSize: 36, fontWeight: 900, marginBottom: 8,
          background: 'linear-gradient(135deg, #818CF8, #C084FC, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Design System</h1>
        <p style={{ color: '#94A3B8', marginBottom: 40 }}>Design tokens and components for GeniusEngine IDE.</p>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 20 }}>
            {COLOR_SWATCHES.map((c) => (
              <div key={c.name}>
                <div style={{
                  width: '100%', height: 56,
                  background: c.hex,
                  border: c.hex.startsWith('rgba') ? `1px solid ${c.hex}` : (c.hex === '#0F172A' || c.hex === '#1E293B' ? '1px solid rgba(148,163,184,0.1)' : 'none'),
                  borderRadius: 10, marginBottom: 8,
                }} />
                <div style={{ fontSize: 12, color: '#F1F5F9', fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.hex}</div>
                {c.var && <div style={{ fontSize: 10, color: '#64748B' }}>{c.var}</div>}
=======
    <div className="min-h-screen bg-[#0D0D0D] text-[#ECECEC]" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <header style={{ padding: '20px 32px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Link href="/" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600 }}>GeniusEngine</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/app" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>App</Link>
          <Link href="/library" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>Library</Link>
          <Link href="/app" style={{ padding: '10px 20px', borderRadius: 8, background: '#D97757', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Open IDE</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 860, margin: '0 auto', padding: 48 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Design System</h1>
        <p style={{ color: '#A0A0A0', marginBottom: 40 }}>Figma-aligned design tokens and components for GeniusEngine IDE.</p>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 20 }}>
            {COLOR_SWATCHES.map((c) => (
              <div key={c.hex}>
                <div style={{ width: '100%', height: 56, background: c.hex, border: c.hex === '#0D0D0D' || c.hex === '#141414' ? '1px solid #2A2A2A' : 'none', borderRadius: 8, marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: '#ECECEC', fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#A0A0A0' }}>{c.hex}</div>
                {c.var && <div style={{ fontSize: 10, color: '#5C5C5C' }}>{c.var}</div>}
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Typography</h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16 }}>Font: Inter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><span style={{ fontSize: 56, fontWeight: 900, background: 'linear-gradient(135deg, #818CF8, #C084FC, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Display</span> <span style={{ fontSize: 12, color: '#64748B' }}>— 3.5rem / 900 / gradient</span></div>
            <div><span style={{ fontSize: 28, fontWeight: 700 }}>Heading 1</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 28px / 700</span></div>
            <div><span style={{ fontSize: 24, fontWeight: 700 }}>Heading 2</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 24px / 700</span></div>
            <div><span style={{ fontSize: 20, fontWeight: 700 }}>Heading 3</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 20px / 700</span></div>
            <div><span style={{ fontSize: 18, fontWeight: 600 }}>Heading 4</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 18px / 600</span></div>
            <div><span style={{ fontSize: 16 }}>Body</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 16px / 400</span></div>
            <div><span style={{ fontSize: 14, color: '#94A3B8' }}>Secondary</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 14px</span></div>
            <div><span style={{ fontSize: 12, color: '#64748B' }}>Caption / Muted</span> <span style={{ fontSize: 12, color: '#94A3B8' }}>— 12px</span></div>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Typography</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#A0A0A0', marginBottom: 16 }}>Font: Inter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><span style={{ fontSize: 28, fontWeight: 600 }}>Heading 1</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 28px / 600</span></div>
            <div><span style={{ fontSize: 24, fontWeight: 600 }}>Heading 2</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 24px / 600</span></div>
            <div><span style={{ fontSize: 20, fontWeight: 600 }}>Heading 3</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 20px / 600</span></div>
            <div><span style={{ fontSize: 18, fontWeight: 600 }}>Heading 4</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 18px / 600</span></div>
            <div><span style={{ fontSize: 16 }}>Body</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 16px / 400</span></div>
            <div><span style={{ fontSize: 14, color: '#A0A0A0' }}>Secondary</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 14px</span></div>
            <div><span style={{ fontSize: 12, color: '#5C5C5C' }}>Caption / Muted</span> <span style={{ fontSize: 12, color: '#A0A0A0' }}>— 12px</span></div>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Spacing (8px base)</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            {[8, 16, 24, 32, 48, 64].map((n) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: n, height: n, background: 'rgba(129, 140, 248, 0.15)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: 4, margin: '0 auto 8px' }} />
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{n}px</span>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Spacing (8px base)</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            {[8, 16, 24, 32, 48, 64].map((n) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: n, height: n, background: '#2A2A2A', borderRadius: 4, margin: '0 auto 8px' }} />
                <span style={{ fontSize: 12, color: '#A0A0A0' }}>{n}px</span>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Border radius</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 8 }} />
            <span style={{ fontSize: 14, color: '#94A3B8' }}>8px (sm)</span>
            <div style={{ width: 64, height: 64, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12 }} />
            <span style={{ fontSize: 14, color: '#94A3B8' }}>12px (md)</span>
            <div style={{ width: 64, height: 64, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 16 }} />
            <span style={{ fontSize: 14, color: '#94A3B8' }}>16px (lg)</span>
            <div style={{ width: 64, height: 64, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 20 }} />
            <span style={{ fontSize: 14, color: '#94A3B8' }}>20px (xl)</span>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Border radius</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8 }} />
            <span style={{ fontSize: 14, color: '#A0A0A0' }}>8px (sm) — buttons, inputs</span>
            <div style={{ width: 64, height: 64, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12 }} />
            <span style={{ fontSize: 14, color: '#A0A0A0' }}>12px (md) — cards, panels</span>
            <div style={{ width: 64, height: 64, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16 }} />
            <span style={{ fontSize: 14, color: '#A0A0A0' }}>16px (lg) — pills, badges</span>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Buttons</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="button" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #818CF8, #EC4899)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(129, 140, 248, 0.2)' }}>Primary</button>
            <button type="button" style={{ padding: '10px 20px', background: 'rgba(30, 41, 59, 0.6)', color: '#F1F5F9', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Secondary</button>
            <button type="button" style={{ padding: '10px 20px', background: 'transparent', color: '#818CF8', border: '1px solid #818CF8', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Outline</button>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Buttons</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="button" style={{ padding: '10px 20px', background: '#D97757', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Primary</button>
            <button type="button" style={{ padding: '10px 20px', background: '#2A2A2A', color: '#fff', border: '1px solid #3A3A3A', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>Secondary</button>
            <button type="button" style={{ padding: '10px 20px', background: 'transparent', color: '#D97757', border: '1px solid #D97757', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>Outline</button>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Badges & pills</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '6px 14px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: 20, fontSize: 13, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>87/100</span>
            <span style={{ padding: '6px 14px', background: 'rgba(129, 140, 248, 0.15)', color: '#818CF8', borderRadius: 20, fontSize: 13, fontWeight: 700, border: '1px solid rgba(129, 140, 248, 0.3)' }}>Score</span>
            <span style={{ padding: '8px 16px', background: 'rgba(30, 41, 59, 0.6)', color: '#F1F5F9', borderRadius: 20, fontSize: 13, border: '1px solid rgba(148, 163, 184, 0.1)' }}>Suggestion pill</span>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Badges & pills</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '6px 12px', background: 'rgba(217,119,87,0.15)', color: '#D97757', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>87/100</span>
            <span style={{ padding: '6px 12px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>Score</span>
            <span style={{ padding: '6px 12px', background: '#2A2A2A', color: '#A0A0A0', borderRadius: 8, fontSize: 13 }}>Suggestion pill</span>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: 16, padding: 24, backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Card title</h3>
              <p style={{ color: '#94A3B8', fontSize: 14 }}>Frosted glass card.</p>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: 16, padding: 24, boxShadow: '0 0 24px rgba(129, 140, 248, 0.12)', backdropFilter: 'blur(16px)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✨</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Hover glow</h3>
              <p style={{ color: '#94A3B8', fontSize: 14 }}>Accent glow on hover.</p>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎯</div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Card title</h3>
              <p style={{ color: '#A0A0A0', fontSize: 14 }}>Supporting text.</p>
            </div>
            <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 24, boxShadow: '0 0 20px rgba(217, 119, 87, 0.12)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Hover glow</h3>
              <p style={{ color: '#A0A0A0', fontSize: 14 }}>Accent glow on hover.</p>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Form inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            <input type="text" placeholder="Placeholder text" style={{ padding: '14px 18px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12, color: '#F1F5F9', fontSize: 14 }} readOnly />
            <textarea placeholder="Textarea placeholder" rows={3} style={{ padding: '14px 18px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12, color: '#F1F5F9', fontSize: 14, resize: 'vertical' }} readOnly />
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Form inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <input type="text" placeholder="Placeholder text" style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14 }} readOnly />
            <textarea placeholder="Textarea placeholder" rows={3} style={{ padding: '12px 16px', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#ECECEC', fontSize: 14, resize: 'vertical' }} readOnly />
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
<<<<<<< HEAD
          <h2 style={{ fontSize: 20, color: '#818CF8', marginBottom: 20, fontWeight: 700 }}>Links</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 600 }}>Accent link</Link>
            <Link href="/library" style={{ color: '#94A3B8', textDecoration: 'none' }}>Secondary link</Link>
=======
          <h2 style={{ fontSize: 20, color: '#D97757', marginBottom: 20 }}>Links</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/app" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600 }}>Accent link</Link>
            <Link href="/library" style={{ color: '#A0A0A0', textDecoration: 'none' }}>Secondary link</Link>
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
          </div>
        </section>
      </main>
    </div>
  );
}
