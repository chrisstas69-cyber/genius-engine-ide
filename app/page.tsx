'use client';

import Link from 'next/link';

const MINDSETS_LANDING = [
  { key: 'photo', name: 'Photo', icon: '📷' }, { key: 'video', name: 'Video', icon: '🎬' }, { key: 'design', name: 'Design', icon: '🎨' }, { key: 'music', name: 'Music', icon: '🎵' },
  { key: 'marketing', name: 'Marketing', icon: '📈' }, { key: 'sales', name: 'Sales', icon: '💰' }, { key: 'startup', name: 'Startup', icon: '🚀' }, { key: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { key: 'developer', name: 'Developer', icon: '💻' }, { key: 'data', name: 'Data', icon: '📊' }, { key: 'ai', name: 'AI', icon: '🤖' }, { key: 'security', name: 'Security', icon: '🔒' },
  { key: 'legal', name: 'Legal', icon: '⚖️' }, { key: 'scientific', name: 'Scientific', icon: '🔬' }, { key: 'medical', name: 'Medical', icon: '🏥' }, { key: 'hr', name: 'HR', icon: '👥' },
  { key: 'content', name: 'Content', icon: '📝' }, { key: 'seo', name: 'SEO', icon: '🔍' }, { key: 'social', name: 'Social', icon: '📱' }, { key: 'email', name: 'Email', icon: '📧' },
];

const FEATURES = [
  { title: 'Expert mindsets', desc: '20 professional domains from Photo to Legal', icon: '🎯' },
  { title: 'Smart suggestions', desc: 'Terminology pills that enhance your prompts', icon: '✨' },
  { title: 'Quality scoring', desc: 'Clarity, specificity, and context metrics', icon: '📊' },
  { title: 'Library vault', desc: 'Save and reuse your best prompts', icon: '📚' },
  { title: 'One-click generate', desc: 'Optimized output in seconds', icon: '⚡' },
  { title: 'Copy & export', desc: 'Use prompts anywhere you work', icon: '📋' },
];

const STEPS = [
  { n: 1, title: 'Select', desc: 'Choose an expert mindset from the sidebar' },
  { n: 2, title: 'Enter', desc: 'Describe what you want to create' },
  { n: 3, title: 'Generate', desc: 'Get an optimized, professional prompt' },
  { n: 4, title: 'Save', desc: 'Copy, export, or save to your library' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#ECECEC]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '20px 32px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600, fontSize: 18 }}>GeniusEngine</Link>
        <Link href="/app" style={{ padding: '10px 20px', background: '#D97757', color: '#fff', borderRadius: 8, fontWeight: 500, textDecoration: 'none', fontSize: 14 }}>Get Started</Link>
      </header>

      {/* Hero */}
      <section style={{ padding: '60px 32px 60px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 42, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Turn ideas into <span style={{ color: '#D97757' }}>expert-level prompts</span>
        </h1>
        <p style={{ fontSize: 18, color: '#A0A0A0', marginBottom: 32, lineHeight: 1.6 }}>
          GeniusEngine uses 20 professional mindsets and smart terminology to optimize your prompts in one click.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/app" style={{ padding: '14px 28px', background: '#D97757', color: '#fff', borderRadius: 8, fontWeight: 500, textDecoration: 'none' }}>Get Started</Link>
          <Link href="/library" style={{ padding: '14px 28px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, textDecoration: 'none' }}>View Library</Link>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', color: '#A0A0A0', fontSize: 14 }}>
          <span><strong style={{ color: '#ECECEC' }}>20+</strong> mindsets</span>
          <span style={{ color: '#5C5C5C' }}>•</span>
          <span><strong style={{ color: '#ECECEC' }}>95%</strong> optimization</span>
          <span style={{ color: '#5C5C5C' }}>•</span>
          <span><strong style={{ color: '#ECECEC' }}>Instant</strong> generation</span>
        </div>

        {/* Static app mockup */}
        <div style={{ marginTop: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', minHeight: 320 }}>
            <div style={{ width: 180, background: '#2F2F2F', padding: '16px 12px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, background: '#D97757', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>G</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>GeniusEngine</span>
              </div>
              <div style={{ fontSize: 10, color: '#8E8EA0', marginBottom: 8 }}>CREATIVE</div>
              <div style={{ padding: '6px 10px', background: 'rgba(217,119,87,0.15)', borderRadius: 6, borderLeft: '3px solid #D97757', marginBottom: 4, fontSize: 12, color: '#D97757' }}>📷 Photo</div>
              <div style={{ padding: '6px 10px', color: '#8E8EA0', fontSize: 12 }}>🎬 Video</div>
              <div style={{ padding: '6px 10px', color: '#8E8EA0', fontSize: 12 }}>🎨 Design</div>
              <div style={{ marginTop: 16, padding: '8px 10px', color: '#8E8EA0', fontSize: 11 }}>📚 Library Vault</div>
            </div>
            <div style={{ flex: 1, background: '#343541', padding: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {['Cinematic', 'Golden hour', 'Bokeh', 'Rim light', 'Portrait'].map((t, i) => (
                  <span key={i} style={{ padding: '6px 12px', background: '#40414F', borderRadius: 12, fontSize: 12, color: '#ECECEC' }}>{t}</span>
                ))}
              </div>
              <div style={{ background: '#40414F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#ECECEC' }}>Product photos for artisan coffee brand</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#10A37F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>G</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(217,119,87,0.15)', borderRadius: 12, color: '#D97757', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>87/100</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#ECECEC', lineHeight: 1.5 }}><strong>Role:</strong> Senior photo expert. <strong>Context:</strong> Artisan coffee brand product shots. Optimized prompt with technical specs, composition, and quality score.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '48px 32px', background: '#0D0D0D' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 40 }}>Why GeniusEngine</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="landing-card" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 24, transition: 'box-shadow 0.2s, transform 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#A0A0A0', fontSize: 14, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 20 Expert Mindsets */}
      <section style={{ padding: '48px 32px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 40 }}>20 Expert Mindsets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {MINDSETS_LANDING.map((m) => (
            <Link key={m.key} href={`/app?mindset=${m.key}`} className="landing-card" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20, textAlign: 'center', transition: 'box-shadow 0.2s, transform 0.2s', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>{m.icon}</span>
              <span style={{ fontSize: 14 }}>{m.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '48px 32px', background: '#0D0D0D' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 40 }}>How it works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ textAlign: 'center', flex: '1 1 160px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D97757', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, margin: '0 auto 12px' }}>{s.n}</div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>{s.title}</h3>
              <p style={{ color: '#A0A0A0', fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features list + demo */}
      <section style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, marginBottom: 24 }}>What you get</h2>
          <ul style={{ paddingLeft: 24, marginBottom: 32, lineHeight: 2, color: '#A0A0A0' }}>
            <li>Structured prompts with role, context, and task</li>
            <li>Quality score (e.g. 87/100) with clarity, specificity, context</li>
            <li>Copy, export, and save to Library</li>
            <li>Regenerate and iterate in one click</li>
          </ul>
          <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(217,119,87,0.15)', borderRadius: 16, color: '#D97757', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>87/100</div>
            <p style={{ color: '#ECECEC', fontSize: 14, lineHeight: 1.6 }}>Sample optimized prompt output appears here. Your generated prompts will include role, context, task, and a quality score.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 32px', background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1514 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Ready to create better prompts?</h2>
        <p style={{ color: '#A0A0A0', marginBottom: 24 }}>Start with a mindset and describe what you need.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app" style={{ padding: '14px 28px', background: '#D97757', color: '#fff', borderRadius: 8, fontWeight: 500, textDecoration: 'none' }}>Get Started</Link>
          <Link href="/library" style={{ padding: '14px 28px', background: 'transparent', color: '#fff', border: '1px solid #3A3A3A', borderRadius: 8, textDecoration: 'none' }}>View Library</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Link href="/" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600 }}>GeniusEngine</Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/app" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>App</Link>
          <Link href="/library" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>Library</Link>
          <Link href="/styleguide" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: 14 }}>Style guide</Link>
        </div>
        <span style={{ color: '#5C5C5C', fontSize: 12 }}>© GeniusEngine — Professional Prompt Engineering</span>
      </footer>
    </div>
  );
}
