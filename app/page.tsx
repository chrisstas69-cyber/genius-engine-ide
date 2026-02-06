'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSavedPrompts, addSavedPrompt } from '@/lib/savedPrompts';

const PENDING_PROMPT_KEY = 'genius-engine-use-prompt';

// ============================================
// ALL 20 MINDSETS - EXPANDED (term, desc, optional group)
// ============================================
const mindsets: Record<string, {
  name: string;
  icon: string;
  category: string;
  suggestions: { term: string; desc: string; group?: string }[];
}> = {
  photo: { name: 'Photo', icon: '📷', category: 'Creative', suggestions: [
    { term: 'Cinematic', desc: 'Film-like quality with dramatic lighting' }, { term: '35mm film', desc: 'Classic analog camera look with grain' }, { term: 'Golden hour', desc: 'Warm light during sunrise/sunset' }, { term: 'Bokeh', desc: 'Blurred background, sharp subject' }, { term: 'High key', desc: 'Bright, minimal shadows' }, { term: 'Low key', desc: 'Dark, dramatic shadows' }, { term: 'Editorial', desc: 'Magazine-style professional shots' }, { term: 'Portrait', desc: 'Focus on person/face' }, { term: 'Macro', desc: 'Extreme close-up detail' }, { term: 'Wide angle', desc: 'Expansive field of view' },
    { term: 'Photorealistic', desc: 'Hyper-detailed, lifelike image as if shot with a DSLR', group: 'Photorealistic styles' }, { term: 'Candid', desc: 'Spontaneous, unposed moment like street photography', group: 'Photorealistic styles' }, { term: 'Documentary', desc: 'Raw, journalistic style with grit, handheld feel', group: 'Photorealistic styles' }, { term: 'Anime', desc: 'Vibrant, exaggerated features in Japanese animation style', group: 'Artistic and stylized' }, { term: 'Silhouette', desc: 'Subject as dark outline against bright background', group: 'Artistic and stylized' }, { term: 'Vintage', desc: 'Sepia-toned or faded colors like 1970s Polaroid', group: 'Artistic and stylized' }, { term: 'HDR', desc: 'High dynamic range with vivid colors, recovered highlights and shadows', group: 'Artistic and stylized' },
    { term: 'Rim light', desc: 'Subject edged with glowing backlight, ethereal separation', group: 'Lighting and composition' }, { term: 'Flat lay', desc: 'Top-down overhead view of arranged objects, even lighting', group: 'Lighting and composition' }, { term: 'Aerial/drone', desc: "Bird's-eye perspective, expansive landscapes", group: 'Lighting and composition' }, { term: 'Tilt-shift', desc: 'Miniature toy-like effect, selective focus blur', group: 'Lighting and composition' }, { term: 'Telephoto', desc: 'Compressed perspective, flattering portraits', group: 'Technical effects' }, { term: 'Shallow DOF', desc: 'Razor-thin focus plane, creamy bokeh outside subject', group: 'Technical effects' }, { term: 'Long exposure', desc: 'Silky motion blur for water or light trails, dreamy effect', group: 'Technical effects' },
    { term: 'Key light', desc: 'Primary light at 45 degrees, main shadows and highlights', group: 'Portrait lighting' }, { term: 'Fill light', desc: 'Softer light opposite key, reduces harsh shadows', group: 'Portrait lighting' }, { term: 'Rim light (hair light)', desc: 'Backlight outlining edges, separation from background', group: 'Portrait lighting' }, { term: 'Rembrandt lighting', desc: 'Key from side, triangle of light on shadowed cheek', group: 'Portrait lighting' }, { term: 'Split lighting', desc: 'Key from side bisecting face in light/shadow', group: 'Portrait lighting' }, { term: 'Loop lighting', desc: 'Key slightly above and to side, loop shadow from nose', group: 'Portrait lighting' }, { term: 'Butterfly lighting', desc: 'Key above and in front, butterfly shadow under nose', group: 'Portrait lighting' }, { term: 'Broad lighting', desc: 'Key illuminating most of face facing camera', group: 'Portrait lighting' }, { term: 'Short lighting', desc: 'Key on shadowed side, sculpting bone structure', group: 'Portrait lighting' },
    { term: 'Soft fill', desc: 'Diffused light opposite key, lifts shadows gently', group: 'Fill terms' }, { term: 'Reflector fill', desc: 'Bounced silver/gold/white as fill source', group: 'Fill terms' }, { term: 'Negative fill', desc: 'Dark absorber opposite key to deepen shadows', group: 'Fill terms' }, { term: '1:1 ratio fill', desc: 'Even exposure with key for flat, low-contrast look', group: 'Fill terms' }, { term: 'Low-ratio fill', desc: 'Minimal fill for high contrast, moody portraits', group: 'Fill terms' }, { term: 'High-key fill', desc: 'Bright fill overpowering key, shadowless glamour', group: 'Fill terms' },
    { term: 'Low angle', desc: 'Camera below eye level, subject appears powerful', group: 'Camera angles' }, { term: 'Extreme low angle', desc: 'Nearly at ground, maximizes dominance', group: 'Camera angles' }, { term: 'Knee level', desc: 'Camera at subject knees, subtle power for action', group: 'Camera angles' }, { term: 'High angle', desc: 'Camera above eye level, conveys vulnerability', group: 'Camera angles' }, { term: 'Extreme high angle', desc: 'Top-down overhead, emphasizes scale or chaos', group: 'Camera angles' }, { term: 'Hip level', desc: 'Camera at waist, casual street-style feel', group: 'Camera angles' }, { term: 'Eye level', desc: 'Direct even height, intimacy or realism', group: 'Camera angles' }, { term: 'Overhead angle', desc: 'Straight down, flat lays or surreal abstraction', group: 'Camera angles' }, { term: "Worm's eye", desc: 'Ultra-low from ground up, wonder or threat', group: 'Camera angles' },
  ]},
  video: { name: 'Video', icon: '🎬', category: 'Creative', suggestions: [
    { term: 'Dolly shot', desc: 'Smooth camera movement on track' }, { term: 'Crane shot', desc: 'Sweeping overhead movement' }, { term: 'Slow motion', desc: 'Time-stretched dramatic effect' }, { term: 'B-roll', desc: 'Supplementary footage' }, { term: 'Jump cut', desc: 'Quick jarring transitions' }, { term: 'Color grading', desc: 'Post-production color styling' }, { term: 'Tracking shot', desc: 'Camera follows subject' }, { term: 'Time-lapse', desc: 'Compressed time, fast motion' },
    { term: 'Pan shot', desc: 'Horizontal swivel left/right revealing scene', group: 'Movement' }, { term: 'Tilt shot', desc: 'Vertical pivot up/down for reveals', group: 'Movement' }, { term: 'Whip pan', desc: 'Ultra-fast pan with motion blur for transitions', group: 'Movement' }, { term: 'Handheld shot', desc: 'Shaky, documentary-style urgency', group: 'Movement' }, { term: 'Steadicam shot', desc: 'Smooth gliding through crowds or spaces', group: 'Movement' },
    { term: 'Wide shot (establishing)', desc: 'Full scene overview setting location and scale', group: 'Framing' }, { term: 'Medium shot', desc: 'Waist-up framing for dialogue or emotion', group: 'Framing' }, { term: 'Close-up (CU)', desc: 'Tight on face/eyes for intense emotion', group: 'Framing' }, { term: 'Over-the-shoulder (OTS)', desc: 'View from behind one subject at another', group: 'Framing' }, { term: 'POV', desc: "Subjective angle through character's eyes", group: 'Framing' }, { term: 'Dutch angle', desc: 'Tilted horizon for unease or tension', group: 'Framing' },
    { term: 'Match cut', desc: 'Seamless transition matching shape/motion across shots', group: 'Editing and specialty' }, { term: 'Reaction shot', desc: "Close-up of observer's face responding to action", group: 'Editing and specialty' }, { term: 'Push-in (dolly in)', desc: 'Camera glides toward subject intensifying focus', group: 'Editing and specialty' }, { term: 'Vertigo shot (dolly zoom)', desc: 'Zoom-out plus dolly-in warping background', group: 'Editing and specialty' },
  ]},
  design: { name: 'Design', icon: '🎨', category: 'Creative', suggestions: [
    { term: 'Minimalist', desc: 'Clean, essential elements only' }, { term: 'Brutalist', desc: 'Raw, unpolished aesthetic' }, { term: 'Glassmorphism', desc: 'Frosted glass effect' }, { term: 'Grid system', desc: 'Structured layout alignment' }, { term: 'White space', desc: 'Strategic empty areas' }, { term: 'Visual hierarchy', desc: 'Importance through size/color' }, { term: 'Typography pairing', desc: 'Font combinations' }, { term: 'Color theory', desc: 'Complementary palettes' },
    { term: 'Bento grid', desc: 'Modular boxes organizing content into scannable sections' }, { term: 'Split-screen', desc: 'Dual panels for comparisons or storytelling' }, { term: 'Card-based', desc: 'Rounded containers stacking info modularly' }, { term: 'Asymmetrical layout', desc: 'Intentional imbalance for dynamic flow' }, { term: 'Neumorphism', desc: 'Soft extruded shadows, embossed feel' }, { term: 'Spatial design', desc: '3D depth with layered elements and parallax' }, { term: 'Micro-animations', desc: 'Tiny motion on hover/tap for feedback' }, { term: 'Gradients (aurora/muted)', desc: 'Smooth color blends for backgrounds' }, { term: 'Massive typography', desc: 'Oversized bold fonts dominating space' }, { term: 'Variable fonts', desc: 'Single file with adjustable weights/widths' }, { term: 'AI Aqua palette', desc: 'Cool cyan-blues with vibrant accents' },
  ]},
  music: { name: 'Music', icon: '🎵', category: 'Creative', suggestions: [
    { term: 'Lo-fi', desc: 'Intentionally imperfect, warm' }, { term: 'Ambient', desc: 'Atmospheric, background texture' }, { term: 'Crescendo', desc: 'Gradual volume increase' }, { term: 'BPM', desc: 'Beats per minute tempo' }, { term: 'Mastering', desc: 'Final audio polish' }, { term: 'Layering', desc: 'Multiple tracks combined' }, { term: 'Drop', desc: 'Climactic beat release' }, { term: 'Reverb', desc: 'Echo/space simulation' },
    { term: 'Phonk', desc: 'Gritty lo-fi hip-hop with Memphis cowbells and vinyl crackle' }, { term: 'Hyperpop', desc: 'Exaggerated, glitchy maximalism with pitch-shifted vocals' }, { term: 'Afrobeats/Afro house', desc: 'Rhythmic percussion with deep bass and soulful chants' }, { term: 'PluggnB', desc: 'Dreamy trap-R&B hybrid with melodic plucks' }, { term: 'Sidechain compression', desc: 'Ducking kick against bass/synths for pumping rhythm' }, { term: 'Glitch', desc: 'Chopped, stuttering audio for transitions' }, { term: 'Decrescendo', desc: 'Gradual volume fade-out post-drop' }, { term: 'Modulation', desc: 'Cycling effects like chorus/flanger on pads' }, { term: 'Delay', desc: 'Timed echoes syncing to BPM' }, { term: 'Distortion/saturation', desc: 'Warm harmonic overdrive' }, { term: 'Autotune', desc: 'Pitch-corrected vocals with robotic sheen' }, { term: 'Bus processing', desc: 'Grouped tracks for collective EQ/compression' },
  ]},
  marketing: { name: 'Marketing', icon: '📈', category: 'Business', suggestions: [
    { term: 'CTA', desc: 'Call-to-action' }, { term: 'Above the fold', desc: 'Visible without scrolling' }, { term: 'Social proof', desc: 'Testimonials, reviews' }, { term: 'AIDA', desc: 'Attention, Interest, Desire, Action' }, { term: 'Pain point', desc: 'Customer problem to solve' }, { term: 'Value proposition', desc: 'Unique benefit statement' }, { term: 'Conversion', desc: 'User completing action' }, { term: 'A/B testing', desc: 'Comparing two variations' },
    { term: 'PAS framework', desc: 'Problem-Agitate-Solution; hooks pain then delivers offer' }, { term: 'BAB model', desc: 'Before-After-Bridge; struggle, outcome, how product bridges' }, { term: 'StoryBrand', desc: 'Customer as hero, you as guide; clarifies value prop' }, { term: 'GEO/AEO', desc: 'Generative/AI Engine Optimization for AI search' }, { term: 'Zero-click search', desc: 'Value via AI summaries without site visits' }, { term: 'Search everywhere optimization', desc: 'Discovery across TikTok, YouTube, Perplexity' }, { term: 'Social commerce', desc: 'In-app buying on Instagram/TikTok Shops' }, { term: 'UGC', desc: 'User-generated content as social proof' }, { term: 'Hyper-personalization', desc: 'AI-tailored CTAs using first-party data' }, { term: 'Multi-touch attribution', desc: 'Tracks full journey across channels' }, { term: 'CLV', desc: 'Customer lifetime value; long-term profit per user' },
  ]},
  sales: { name: 'Sales', icon: '💰', category: 'Business', suggestions: [
    { term: 'Discovery call', desc: 'Initial needs assessment' }, { term: 'Objection handling', desc: 'Addressing concerns' }, { term: 'Pipeline', desc: 'Sales opportunity tracking' }, { term: 'Qualified lead', desc: 'Verified potential customer' }, { term: 'Upsell', desc: 'Higher-value alternative' }, { term: 'Close rate', desc: 'Conversion percentage' }, { term: 'ROI', desc: 'Return on Investment' }, { term: 'SPIN selling', desc: 'Situation, Problem, Implication, Need' },
    { term: 'Lead magnet', desc: 'Free value to capture emails; funnels cold to qualified' }, { term: 'Warm outreach', desc: 'Personalized DMs referencing shared interests' }, { term: 'Inbound lead', desc: 'Traffic from content/SEO pulling prospects' }, { term: 'Challenger sale', desc: 'Teach prospects new insights on their pain' }, { term: 'Assumptive close', desc: 'Act as if sale is done; confident nudge' }, { term: 'Trial close', desc: 'Test readiness mid-call; uncovers objections' }, { term: 'Freemium upsell', desc: 'Free teaser leading to premium offer' }, { term: 'Bundle pricing', desc: 'Multiple items at discount; lifts AOV' }, { term: 'Recurring revenue', desc: 'Subscriptions for predictable income' }, { term: 'MRR', desc: 'Monthly recurring revenue' }, { term: 'CAC', desc: 'Customer acquisition cost' }, { term: 'Sales velocity', desc: 'Deals x Avg price x Win rate / Cycle time' },
  ]},
  startup: { name: 'Startup', icon: '🚀', category: 'Business', suggestions: [
    { term: 'MVP', desc: 'Minimum Viable Product' }, { term: 'Product-market fit', desc: 'Solution matches demand' }, { term: 'Pivot', desc: 'Strategic direction change' }, { term: 'Runway', desc: 'Months of cash remaining' }, { term: 'Traction', desc: 'Measurable progress' }, { term: 'Moat', desc: 'Competitive advantage' }, { term: 'CAC', desc: 'Customer Acquisition Cost' }, { term: 'LTV', desc: 'Lifetime Value' },
    { term: 'Seed funding', desc: 'Initial capital from angels/accelerators for MVP' }, { term: 'Beta launch', desc: 'Limited release to early users for feedback' }, { term: 'Churn rate', desc: 'Percentage of users canceling subs' }, { term: 'Virality coefficient', desc: 'Invites per user x conversion; >1 = organic growth' }, { term: 'Burn rate', desc: 'Monthly cash outflow vs runway' }, { term: 'Unit economics', desc: 'Revenue/profit per user; LTV > 3x CAC' }, { term: 'Scalability', desc: 'Handle 10x users without 10x costs' }, { term: 'GTM', desc: 'Go-to-market; launch plan and pricing' }, { term: 'Network effects', desc: 'Value grows with more users' }, { term: 'Bootstrapping', desc: 'Self-funding; no VC dilution' },
  ]},
  ecommerce: { name: 'E-commerce', icon: '🛒', category: 'Business', suggestions: [
    { term: 'Cart abandonment', desc: 'Left without purchasing' }, { term: 'AOV', desc: 'Average Order Value' }, { term: 'Checkout flow', desc: 'Purchase process steps' }, { term: 'Dropshipping', desc: 'Third-party fulfillment' }, { term: 'SKU', desc: 'Stock Keeping Unit' }, { term: 'Flash sale', desc: 'Limited-time discount' }, { term: 'Bundle', desc: 'Multiple items packaged' }, { term: 'Fulfillment', desc: 'Order processing/shipping' },
    { term: 'Omnichannel', desc: 'Unified experience across web, app, retail' }, { term: 'Subscription model', desc: 'Recurring delivery or access' }, { term: 'Retargeting', desc: 'Ads to users who visited but did not buy' }, { term: 'Wishlist', desc: 'Saved items for later purchase' }, { term: 'Upsell/cross-sell', desc: 'Related or premium products at checkout' }, { term: 'Inventory management', desc: 'Stock levels and reorder points' }, { term: 'Returns policy', desc: 'Refund and exchange rules' }, { term: 'Payment gateway', desc: 'Secure card/alternative payment processing' }, { term: 'Conversion rate', desc: 'Visitors who complete purchase' },
  ]},
  developer: { name: 'Developer', icon: '💻', category: 'Technical', suggestions: [
    { term: 'RESTful API', desc: 'Standard web service design' }, { term: 'GraphQL', desc: 'Flexible query language' }, { term: 'Microservices', desc: 'Distributed architecture' }, { term: 'CI/CD', desc: 'Continuous integration/deployment' }, { term: 'TDD', desc: 'Test-Driven Development' }, { term: 'Serverless', desc: 'Cloud functions' }, { term: 'Type-safe', desc: 'Strong typing' }, { term: 'Caching', desc: 'Performance optimization' },
    { term: 'Monolith', desc: 'Single codebase; simple before microservices' }, { term: 'Event-driven', desc: 'Async via queues; real-time or streaming' }, { term: 'Jamstack', desc: 'JavaScript + APIs + Markup; fast static sites' }, { term: '12-factor app', desc: 'Cloud-native; config in env, stateless processes' }, { term: 'Blue-green deployment', desc: 'Zero-downtime by swapping live environments' }, { term: 'Feature flags', desc: 'Toggle features without redeploys' }, { term: 'Webhooks', desc: 'Serverless event notifications' }, { term: 'Rate limiting', desc: 'Cap requests per second' }, { term: 'Pagination', desc: 'Chunked responses for large lists' }, { term: 'Idempotency', desc: 'Repeatable requests yield same result' }, { term: 'Edge computing', desc: 'Run near users; lower latency' }, { term: 'Circuit breaker', desc: 'Fail fast on failing dependencies' },
  ]},
  data: { name: 'Data', icon: '📊', category: 'Technical', suggestions: [
    { term: 'ETL', desc: 'Extract, Transform, Load' }, { term: 'Data pipeline', desc: 'Automated data flow' }, { term: 'Visualization', desc: 'Charts and graphs' }, { term: 'Aggregation', desc: 'Summarizing data points' }, { term: 'KPI', desc: 'Key Performance Indicator' }, { term: 'Dashboard', desc: 'Metrics display' }, { term: 'Regression', desc: 'Predictive modeling' }, { term: 'Clustering', desc: 'Grouping similar data' },
    { term: 'Data lake', desc: 'Centralized raw storage before transformation' }, { term: 'Real-time streaming', desc: 'Live data flow for instant metrics' }, { term: 'Denoising', desc: 'Cleaning noisy data (e.g. bot streams)' }, { term: 'Save rate', desc: 'Percentage of plays leading to saves' }, { term: 'Completion rate', desc: 'Fraction of tracks/content fully consumed' }, { term: 'Playlist reach', desc: 'Adds x avg playlist listeners' }, { term: 'Skip rate', desc: 'Users jumping before finish; retention signal' }, { term: 'Cohort analysis', desc: 'Users by acquisition date tracking retention' }, { term: 'Anomaly detection', desc: 'Flags unusual spikes or fraud' }, { term: 'Feature engineering', desc: 'Derived metrics for ML' }, { term: 'Heatmap', desc: 'Visual density of locations or peak times' }, { term: 'Funnel analysis', desc: 'Drop-off from step to step' },
  ]},
  ai: { name: 'AI', icon: '🤖', category: 'Technical', suggestions: [
    { term: 'Prompt engineering', desc: 'Optimizing AI inputs' }, { term: 'Fine-tuning', desc: 'Custom model training' }, { term: 'RAG', desc: 'Retrieval-Augmented Generation' }, { term: 'Embeddings', desc: 'Vector representations' }, { term: 'Temperature', desc: 'Output randomness control' }, { term: 'Chain of thought', desc: 'Step-by-step reasoning' }, { term: 'Zero-shot', desc: 'No examples needed' }, { term: 'Context window', desc: 'Input size limit' },
    { term: 'Few-shot prompting', desc: 'Include 2-5 examples for style mimicry' }, { term: 'Role-playing', desc: 'Assign AI persona (e.g. expert producer)' }, { term: 'Meta prompting', desc: 'AI generates/refines its own prompt' }, { term: 'Chain-of-Verification', desc: 'Fact-check steps post-reasoning' }, { term: 'Reasoning effort', desc: 'Dial low/med/high for CoT depth' }, { term: 'Chain-of-Symbol', desc: 'Symbols (e.g. arrows) over words for patterns' }, { term: 'DSPy', desc: 'Auto-compiles prompts from examples' }, { term: 'Metatags', desc: 'Structured tags e.g. [verse], [chorus]' }, { term: 'Negative prompts', desc: 'Exclude unwanted elements' }, { term: 'Descriptor layering', desc: 'Mood + genre + tempo + instruments' },
  ]},
  security: { name: 'Security', icon: '🔒', category: 'Technical', suggestions: [
    { term: 'Encryption', desc: 'Data scrambling protection' }, { term: 'Authentication', desc: 'Identity verification' }, { term: 'Zero trust', desc: 'Verify everything approach' }, { term: 'Penetration testing', desc: 'Security vulnerability check' }, { term: 'MFA', desc: 'Multi-factor authentication' }, { term: 'OWASP', desc: 'Security best practices' }, { term: 'Firewall', desc: 'Network access control' }, { term: 'Audit trail', desc: 'Activity logging' },
    { term: 'Zero-day', desc: 'Unpatched vulnerability unknown to vendor' }, { term: 'Phishing', desc: 'Social engineering to steal credentials' }, { term: 'SOC', desc: 'Security Operations Center; monitoring and response' }, { term: 'SIEM', desc: 'Security information and event management' }, { term: 'DDoS', desc: 'Distributed denial-of-service attack' }, { term: 'PKI', desc: 'Public key infrastructure for certificates' }, { term: 'Secrets management', desc: 'Secure storage for API keys and tokens' }, { term: 'Vulnerability scan', desc: 'Automated check for known weaknesses' },
  ]},
  legal: { name: 'Legal', icon: '⚖️', category: 'Professional', suggestions: [
    { term: 'Force majeure', desc: 'Unforeseeable circumstances' }, { term: 'Indemnification', desc: 'Protection against losses' }, { term: 'Boilerplate', desc: 'Standard contract language' }, { term: 'Severability', desc: 'Invalid clause protection' }, { term: 'Non-disclosure', desc: 'Confidentiality requirements' }, { term: 'Liability', desc: 'Legal responsibility' }, { term: 'Arbitration', desc: 'Dispute resolution method' }, { term: 'Governing law', desc: 'Jurisdiction specification' },
    { term: 'Due diligence', desc: 'Investigation before deal or hire' }, { term: 'IP', desc: 'Intellectual property; patents, trademarks, copyrights' }, { term: 'Terms of service', desc: 'User agreement for use of product' }, { term: 'Privacy policy', desc: 'How personal data is collected and used' }, { term: 'Warranty', desc: 'Promise of quality or remedy' }, { term: 'Liquidated damages', desc: 'Pre-agreed sum for breach' }, { term: 'Assignment', desc: 'Transfer of rights to another party' }, { term: 'Notice', desc: 'Formal communication requirement' },
  ]},
  scientific: { name: 'Scientific', icon: '🔬', category: 'Professional', suggestions: [
    { term: 'Hypothesis', desc: 'Testable prediction' }, { term: 'Methodology', desc: 'Research approach' }, { term: 'Peer-reviewed', desc: 'Expert-validated' }, { term: 'Control group', desc: 'Baseline comparison' }, { term: 'Literature review', desc: 'Existing research survey' }, { term: 'Reproducible', desc: 'Can be replicated' }, { term: 'Empirical', desc: 'Based on observation' }, { term: 'Statistical significance', desc: 'Results validity' },
    { term: 'Sample size', desc: 'Number of subjects; power of study' }, { term: 'Confounding variable', desc: 'Factor that distorts cause-effect' }, { term: 'Double-blind', desc: 'Neither subjects nor researchers know groups' }, { term: 'Meta-analysis', desc: 'Combining results of multiple studies' }, { term: 'Citation', desc: 'Reference to prior work' }, { term: 'Abstract', desc: 'Short summary of paper' }, { term: 'Preprint', desc: 'Paper before peer review' }, { term: 'Open access', desc: 'Free to read and reuse' },
  ]},
  medical: { name: 'Medical', icon: '🏥', category: 'Professional', suggestions: [
    { term: 'Diagnosis', desc: 'Condition identification' }, { term: 'Prognosis', desc: 'Expected outcome' }, { term: 'Contraindication', desc: 'Reason to avoid treatment' }, { term: 'Clinical trial', desc: 'Treatment testing' }, { term: 'HIPAA compliant', desc: 'Privacy standards' }, { term: 'Treatment plan', desc: 'Care strategy' }, { term: 'Side effects', desc: 'Unintended reactions' }, { term: 'Patient history', desc: 'Medical background' },
    { term: 'Informed consent', desc: 'Patient agreement after understanding risks' }, { term: 'Differential diagnosis', desc: 'List of possible conditions to rule out' }, { term: 'Vital signs', desc: 'Blood pressure, pulse, temperature, etc.' }, { term: 'Dosage', desc: 'Amount and frequency of medication' }, { term: 'Placebo', desc: 'Inactive substance in trials' }, { term: 'Comorbidity', desc: 'Co-occurring conditions' }, { term: 'Remission', desc: 'Reduction or disappearance of symptoms' }, { term: 'Referral', desc: 'Sending patient to specialist' },
  ]},
  hr: { name: 'HR', icon: '👥', category: 'Professional', suggestions: [
    { term: 'Onboarding', desc: 'New hire integration' }, { term: 'Performance review', desc: 'Employee evaluation' }, { term: 'Culture fit', desc: 'Values alignment' }, { term: 'Retention', desc: 'Keeping employees' }, { term: 'DEI', desc: 'Diversity, Equity, Inclusion' }, { term: 'Compensation package', desc: 'Salary + benefits' }, { term: 'Job description', desc: 'Role requirements' }, { term: 'Exit interview', desc: 'Departure feedback' },
    { term: 'Headcount', desc: 'Number of employees or open roles' }, { term: 'Talent pipeline', desc: 'Pool of candidates for future roles' }, { term: 'Remote-first', desc: 'Policy favoring distributed work' }, { term: '360 feedback', desc: 'Input from peers, reports, and manager' }, { term: 'Succession planning', desc: 'Identifying future leaders' }, { term: 'Benchmark', desc: 'Comparing pay or metrics to market' }, { term: 'Offer letter', desc: 'Formal employment terms' }, { term: 'Probation', desc: 'Trial period for new hires' },
  ]},
  content: { name: 'Content', icon: '📝', category: 'Content', suggestions: [
    { term: 'Evergreen', desc: 'Always relevant content' }, { term: 'Pillar content', desc: 'Comprehensive cornerstone' }, { term: 'Long-form', desc: '2000+ word articles' }, { term: 'Case study', desc: 'Success story analysis' }, { term: 'Thought leadership', desc: 'Expert perspective' }, { term: 'Listicle', desc: 'List-based article' }, { term: 'How-to guide', desc: 'Step-by-step tutorial' }, { term: 'Content calendar', desc: 'Publishing schedule' },
    { term: 'Editorial calendar', desc: 'Planned themes and deadlines' }, { term: 'Content audit', desc: 'Review of existing content for gaps' }, { term: 'Repurposing', desc: 'Turning one asset into multiple formats' }, { term: 'SEO copywriting', desc: 'Writing for search and readability' }, { term: 'Content hub', desc: 'Central resource page linking related pieces' }, { term: 'User intent', desc: 'What the reader is trying to accomplish' }, { term: 'CTA placement', desc: 'Where to put calls-to-action' }, { term: 'Content gap', desc: 'Topics competitors cover that you do not' },
  ]},
  seo: { name: 'SEO', icon: '🔍', category: 'Content', suggestions: [
    { term: 'Keywords', desc: 'Search terms to target' }, { term: 'Backlinks', desc: 'Incoming links from other sites' }, { term: 'SERP', desc: 'Search Engine Results Page' }, { term: 'Meta description', desc: 'Search result preview' }, { term: 'Domain authority', desc: 'Site credibility score' }, { term: 'Alt text', desc: 'Image descriptions' }, { term: 'Internal linking', desc: 'Links within your site' }, { term: 'Featured snippet', desc: 'Position zero result' },
    { term: 'Search intent', desc: 'Informational, navigational, or transactional' }, { term: 'Long-tail keyword', desc: 'Specific, lower-volume phrases' }, { term: 'Crawl budget', desc: 'How much of your site engines will index' }, { term: 'Canonical URL', desc: 'Preferred version of duplicate content' }, { term: 'Schema markup', desc: 'Structured data for rich results' }, { term: 'Core Web Vitals', desc: 'Speed and UX metrics for ranking' }, { term: 'Sitemap', desc: 'List of pages for crawlers' }, { term: 'Indexing', desc: 'Inclusion in search results' },
  ]},
  social: { name: 'Social', icon: '📱', category: 'Content', suggestions: [
    { term: 'Engagement rate', desc: 'Interaction percentage' }, { term: 'Viral', desc: 'Rapidly spreading content' }, { term: 'Hashtag strategy', desc: 'Discoverability tags' }, { term: 'UGC', desc: 'User-Generated Content' }, { term: 'Algorithm', desc: 'Content distribution logic' }, { term: 'Influencer', desc: 'Social media personality' }, { term: 'Reach', desc: 'Unique viewers' }, { term: 'Story/Reel', desc: 'Short-form vertical video' },
    { term: 'Impressions', desc: 'Number of times content was shown' }, { term: 'Shareability', desc: 'Likelihood content gets shared' }, { term: 'Community management', desc: 'Replying and moderating comments' }, { term: 'Paid boost', desc: 'Promoted posts to extend reach' }, { term: 'Carousel', desc: 'Multi-image or multi-slide post' }, { term: 'Live stream', desc: 'Real-time video to followers' }, { term: 'DM', desc: 'Direct message; private conversation' }, { term: 'Bio link', desc: 'Single link in profile (e.g. Linktree)' },
  ]},
  email: { name: 'Email', icon: '📧', category: 'Content', suggestions: [
    { term: 'Subject line', desc: 'Email title/hook' }, { term: 'Open rate', desc: 'Percentage who opened' }, { term: 'Drip campaign', desc: 'Automated email sequence' }, { term: 'Segmentation', desc: 'Audience grouping' }, { term: 'Personalization', desc: 'Customized content' }, { term: 'Click-through rate', desc: 'Link click percentage' }, { term: 'Welcome series', desc: 'New subscriber emails' }, { term: 'Deliverability', desc: 'Inbox placement rate' },
    { term: 'Preheader', desc: 'Preview text next to subject line' }, { term: 'A/B test', desc: 'Testing subject or copy variants' }, { term: 'Unsubscribe rate', desc: 'Percentage who opt out' }, { term: 'List hygiene', desc: 'Removing bounces and inactive addresses' }, { term: 'Transactional email', desc: 'Receipts, password reset, etc.' }, { term: 'Double opt-in', desc: 'Confirm subscription via second email' }, { term: 'Spam score', desc: 'Likelihood of being filtered' }, { term: 'Sender reputation', desc: 'Domain trust affecting deliverability' },
  ]},
};

const categories = ['Creative', 'Business', 'Technical', 'Professional', 'Content'];
const mindsetsByCategory = categories.reduce((acc, cat) => {
  acc[cat] = Object.entries(mindsets).filter(([_, m]) => m.category === cat);
  return acc;
}, {} as Record<string, [string, typeof mindsets[string]][]>);

const CATEGORY_ORDER = ['Creative', 'Business', 'Technical', 'Professional', 'Content'] as const;

type ChatModel = 'claude' | 'gpt4' | 'gemini' | 'perplexity';
const MODEL_LABELS: Record<ChatModel, string> = {
  claude: 'Claude Sonnet 4',
  gpt4: 'GPT-4',
  gemini: 'Gemini Pro',
  perplexity: 'Perplexity',
};

type ConversationMessage = { role: 'user' | 'assistant'; content: string; model?: ChatModel };

function GeniusEngineApp() {
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState('');
  const [selectedMindset, setSelectedMindset] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Creative');
  const [savedPromptCount, setSavedPromptCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'prompt' | 'info'>('prompt');
  const [copied, setCopied] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [model, setModel] = useState<ChatModel>('claude');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMindset = selectedMindset ? mindsets[selectedMindset] : null;

  useEffect(() => {
    setSavedPromptCount(getSavedPrompts().length);
  }, []);

  useEffect(() => {
    const mindsetFromUrl = searchParams.get('mindset');
    if (mindsetFromUrl && mindsets[mindsetFromUrl]) setSelectedMindset(mindsetFromUrl);
  }, [searchParams]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? sessionStorage.getItem(PENDING_PROMPT_KEY) : null;
      if (!raw) return;
      const data = JSON.parse(raw) as { content?: string; mindset?: string; name?: string };
      sessionStorage.removeItem(PENDING_PROMPT_KEY);
      if (data.content) {
        setConversation([{ role: 'assistant', content: data.content }]);
        if (data.mindset && mindsets[data.mindset]) setSelectedMindset(data.mindset);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  const handleCopyOutput = () => {
    const lastAssistant = [...conversation].reverse().find(m => m.role === 'assistant');
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToLibrary = () => {
    const lastUser = [...conversation].reverse().find(m => m.role === 'user');
    const lastAssistant = [...conversation].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return;
    const name = lastUser?.content?.split('\n')[0]?.slice(0, 60) || 'Untitled prompt';
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const scoreMatch = lastAssistant.content.match(/\*\*Quality Score:\s*(\d{2,3})\/100\*\*/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 87;
    addSavedPrompt({
      name,
      mindset: selectedMindset || 'content',
      date,
      score,
      content: lastAssistant.content,
    });
    setSavedPromptCount(getSavedPrompts().length);
    setSavedToLibrary(true);
    setTimeout(() => setSavedToLibrary(false), 2500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputText]);

  const handleSubmit = async () => {
    if (!inputText.trim() || isGenerating) return;
    const userMessage = inputText;
    setInputText('');
    setError(null);
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);
    const useStream = model === 'claude' || model === 'gpt4';
    const abortController = new AbortController();
    const timeoutMs = 90_000;
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
    let streamNoDataTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const STREAM_NO_DATA_MS = 60_000;
    try {
      const conversationHistory = conversation.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          message: userMessage,
          conversationHistory,
          selectedMindset: selectedMindset || undefined,
          stream: useStream,
        }),
        signal: abortController.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg = (data as { error?: string }).error || 'Generation failed';
        const isConfig = res.status === 503 && errMsg.includes('Configure');
        throw new Error(isConfig ? `Configure API Key: ${errMsg}` : errMsg);
      }
      if (useStream && res.body) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('ndjson') || contentType.includes('stream')) {
          setConversation(prev => [...prev, { role: 'assistant', content: '', model }]);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let fullContent = '';
          let doneModel: ChatModel | null = null;
          const resetStreamNoDataTimer = () => {
            if (streamNoDataTimeoutId) clearTimeout(streamNoDataTimeoutId);
            streamNoDataTimeoutId = setTimeout(() => abortController.abort(), STREAM_NO_DATA_MS);
          };
          resetStreamNoDataTimer();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const parsed = JSON.parse(line) as { text?: string; done?: boolean; model?: ChatModel };
                if (parsed.text) {
                  fullContent += parsed.text;
                  resetStreamNoDataTimer();
                  setConversation(prev => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: fullContent };
                    return next;
                  });
                }
                if (parsed.done && parsed.model) {
                  doneModel = parsed.model;
                  resetStreamNoDataTimer();
                }
              } catch {
                // skip
              }
            }
          }
          if (streamNoDataTimeoutId) clearTimeout(streamNoDataTimeoutId);
          setConversation(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === 'assistant' && doneModel) next[next.length - 1] = { ...last, model: doneModel };
            return next;
          });
          setIsGenerating(false);
          return;
        }
      }
      const data = await res.json();
      const content = (data as { content?: string }).content ?? '';
      const returnedModel = (data as { model?: ChatModel }).model ?? model;
      setConversation(prev => [...prev, { role: 'assistant', content, model: returnedModel }]);
    } catch (err) {
      clearTimeout(timeoutId);
      if (streamNoDataTimeoutId) clearTimeout(streamNoDataTimeoutId);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const message = isAbort ? 'Request timed out. Try again or try another model.' : (err instanceof Error ? err.message : 'Generation failed');
      setError(message);
      setConversation(prev => [...prev, { role: 'assistant', content: `**Error:** ${message}\n\nAdd the required API key to \`.env.local\` or try another model.` }]);
    } finally {
      clearTimeout(timeoutId);
      if (streamNoDataTimeoutId) clearTimeout(streamNoDataTimeoutId);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const addTerm = (term: string) => {
    setInputText(prev => prev + (prev ? ', ' : '') + term);
    textareaRef.current?.focus();
  };

  const startNew = () => {
    setConversation([]);
    setInputText('');
    setSelectedMindset(null);
    setActiveTab('prompt');
  };

  const lastAssistantMessage = [...conversation].reverse().find(m => m.role === 'assistant');
  const qualityScore = lastAssistantMessage?.content ? (() => {
    const match = lastAssistantMessage.content.match(/\*\*Quality Score:\s*(\d{2,3})\/100\*\*/i);
    return match ? match[1] : null;
  })() : null;

  function formatOutputContent(text: string) {
    return text.split('\n').map((line, j) => {
      if (line.startsWith('**') && line.endsWith('**')) return <h3 key={j}>{line.replace(/\*\*/g, '')}</h3>;
      if (line.startsWith('- ')) return <li key={j}>{line.substring(2)}</li>;
      if (line.startsWith('*') && line.endsWith('*')) return <p key={j} style={{ fontStyle: 'italic', color: '#A0A0A0', marginTop: 16 }}>{line.replace(/\*/g, '')}</p>;
      if (line === '---') return <hr key={j} style={{ border: 'none', borderTop: '1px solid #2A2A2A', margin: '16px 0' }} />;
      if (line.trim() === '') return <br key={j} />;
      return <p key={j}>{line}</p>;
    });
  }

  return (
    <div className="app-container text-[#ECECEC]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', background: '#343541' }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>

      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="logo-icon">G</span>
            <span className="logo-text">GeniusEngine</span>
          </Link>
          <button type="button" className="btn-new-prompt" onClick={startNew}>
            <span>+</span> New prompt
          </button>
        </div>

        <div className="sidebar-categories">
          {CATEGORY_ORDER.map(category => (
            <div key={category} className="category-group">
              <button type="button" className={`category-header ${expandedCategory === category ? 'expanded' : ''}`} data-category={category.toLowerCase()} onClick={() => toggleCategory(category)}>
                <span className="category-label">{category.toUpperCase()}</span>
                <svg className="chevron" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              </button>
              <div className={`category-items ${expandedCategory === category ? '' : 'collapsed'}`} data-items={category.toLowerCase()}>
                {mindsetsByCategory[category]?.map(([key, m]) => (
                  <button key={key} type="button" className={`mindset-item ${selectedMindset === key ? 'active' : ''}`} data-mindset={key} onClick={() => { setSelectedMindset(key); setActiveTab('prompt'); }}>
                    <span className="icon">{m.icon}</span>{m.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <Link href="/library" className="library-vault-btn" style={{ textDecoration: 'none' }}>
            <span className="icon">📚</span>
            <span className="label">Library Vault</span>
            <span className="badge">{savedPromptCount}</span>
          </Link>
          <button type="button" className="library-vault-btn" style={{ marginTop: 8 }} onClick={() => setActiveTab(activeTab === 'info' ? 'prompt' : 'info')}>
            <span className="icon">📖</span>
            <span className="label">{activeTab === 'info' ? 'Back to Prompt' : 'Information & Guide'}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'info' ? (
          <div className="content-body" style={{ padding: 32, maxWidth: 768, margin: '0 auto', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: 28, marginBottom: 24 }}>Information & Guide</h1>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#D97757' }}>How to use GeniusEngine</h2>
              <ol style={{ paddingLeft: 24, lineHeight: 1.8, color: '#A0A0A0' }}>
                <li><strong style={{ color: '#ECECEC' }}>Select a mindset</strong> from the sidebar (e.g. Photo, Marketing, Developer).</li>
                <li><strong style={{ color: '#ECECEC' }}>Enter your prompt</strong> in the text area — describe what you want to create.</li>
                <li><strong style={{ color: '#ECECEC' }}>Generate</strong> to get an optimized, expert-level prompt.</li>
                <li><strong style={{ color: '#ECECEC' }}>Save to Library</strong> to keep prompts for later, or copy/export.</li>
              </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#D97757' }}>Terminology dictionary</h2>
              <p style={{ color: '#A0A0A0', marginBottom: 12 }}>All expert terms and their meanings by mindset. Go to:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20, alignItems: 'center' }}>
                {Object.entries(mindsets).map(([key, m], i) => (
                  <React.Fragment key={key}>
                    {i > 0 && <span style={{ color: '#5C5C5C', margin: '0 2px' }}>|</span>}
                    <button type="button" onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); }} style={{ background: 'none', border: 'none', color: '#D97757', fontSize: 13, cursor: 'pointer', padding: 0 }}>{m.icon} {m.name}</button>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {Object.entries(mindsets).map(([key, m]) => {
                  const byGroup = (m.suggestions as { term: string; desc: string; group?: string }[]).reduce((acc, s) => {
                    const g = s.group || 'General';
                    if (!acc[g]) acc[g] = []; acc[g].push(s); return acc;
                  }, {} as Record<string, { term: string; desc: string; group?: string }[]>);
                  const hasGroups = Object.keys(byGroup).length > 1 || (Object.keys(byGroup)[0] && Object.keys(byGroup)[0] !== 'General');
                  return (
                    <div key={key} id={`info-${key}`} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20, scrollMarginTop: 24 }}>
                      <button type="button" onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); }} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 18, marginBottom: 12, cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}>{m.icon} {m.name}</button>
                      {hasGroups ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {Object.entries(byGroup).map(([groupName, items]) => (
                            <div key={groupName}>
                              <h4 style={{ fontSize: 14, color: '#A0A0A0', marginBottom: 8, fontWeight: 600 }}>{groupName}</h4>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {items.map((s, i) => (
                                  <button key={i} type="button" title={s.desc} onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); addTerm(s.term); }} style={{ background: '#2A2A2A', padding: '6px 12px', borderRadius: 8, fontSize: 13, border: 'none', color: '#ECECEC', cursor: 'pointer' }}>{s.term}: {s.desc}</button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {m.suggestions.map((s, i) => (
                            <button key={i} type="button" title={s.desc} onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); addTerm(s.term); }} style={{ background: '#2A2A2A', padding: '6px 12px', borderRadius: 8, fontSize: 13, border: 'none', color: '#ECECEC', cursor: 'pointer' }}>{s.term}: {s.desc}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#D97757' }}>Examples</h2>
              <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <p style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 8 }}>Photo mindset — input:</p>
                <p style={{ color: '#ECECEC', marginBottom: 12 }}>Product shots for a skincare brand, natural light, minimal shadows.</p>
                <p style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 8 }}>You’ll get:</p>
                <p style={{ color: '#ECECEC' }}>An optimized prompt with role, context, technical specs (e.g. aspect ratio, depth of field), composition notes, and a quality score.</p>
              </div>
              <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20 }}>
                <p style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 8 }}>Marketing mindset — input:</p>
                <p style={{ color: '#ECECEC', marginBottom: 12 }}>Email sequence for a product launch.</p>
                <p style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 8 }}>You’ll get:</p>
                <p style={{ color: '#ECECEC' }}>Strategic overview, AIDA-style structure, CTAs, and implementation steps with best practices.</p>
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="main-content-inner">
              {conversation.length === 0 && !isGenerating ? (
                <>
                  <div className="content-header">
                    <div style={{ fontSize: 48, marginBottom: 16 }}>{currentMindset ? currentMindset.icon : '✨'}</div>
                    <h1>What do you want to create?</h1>
                    <p className="subtitle">
                      {currentMindset ? `Using ${currentMindset.name} mindset` : 'Select a mindset for smart suggestions'}
                    </p>
                  </div>
                  {currentMindset && (
                    <div>
                      <div className="suggestions-container">
                        {currentMindset.suggestions.slice(0, 12).map((s, i) => (
                          <button key={i} type="button" className="suggestion-pill" onClick={() => addTerm(s.term)} title={s.desc}>{s.term}</button>
                        ))}
                      </div>
                      <button type="button" onClick={() => setActiveTab('info')} style={{ background: 'transparent', border: 'none', color: '#8E8EA0', fontSize: 12, textDecoration: 'underline', cursor: 'pointer', padding: '4px 0', marginTop: 8, display: 'block', margin: '0 auto', width: 'fit-content' }}>View all in Information &amp; Guide</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="content-body" style={{ paddingTop: 24 }}>
                  {conversation.length > 0 && (
                    <>
                      {conversation.slice(0, conversation[conversation.length - 1]?.role === 'assistant' ? conversation.length - 1 : conversation.length).map((msg, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                          <div style={{ width: 32, height: 32, borderRadius: msg.role === 'user' ? '50%' : 8, background: msg.role === 'user' ? '#D97757' : '#10A37F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{msg.role === 'user' ? 'U' : 'G'}</div>
                          <div style={{ flex: 1, minWidth: 0, fontSize: 15, lineHeight: 1.6 }}>
                            {msg.role === 'user' ? (
                              <p style={{ color: '#ECECEC', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{msg.content}</p>
                            ) : (
                              <>
                                <div style={{ color: '#ECECEC', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formatOutputContent(msg.content)}</div>
                                {msg.model != null && (
                                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, color: '#8E8EA0' }}>{MODEL_LABELS[msg.model]}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      {isGenerating && (
                        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#10A37F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>G</div>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, color: '#8E8EA0', fontSize: 15 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D97757', animation: 'pulse 1.5s infinite' }} />
                            Generating...
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}

                  {lastAssistantMessage && (
                    <div className="output-section" style={{ marginTop: 8 }}>
                      <div className="output-container">
                        <div className="quality-score">{qualityScore ? `${qualityScore}/100` : '—'}</div>
                        <div className="output-box">{formatOutputContent(lastAssistantMessage.content)}</div>
                        <div className="action-buttons">
                          <div className="action-buttons-left">
                            <button type="button" className="btn-action btn-secondary" onClick={handleCopyOutput}>{copied ? 'Copied!' : 'Copy'}</button>
                            <button type="button" className="btn-action btn-secondary" onClick={handleSaveToLibrary}>{savedToLibrary ? 'Saved to Library!' : 'Save to Library'}</button>
                            <button type="button" className="btn-action btn-primary" onClick={() => { setConversation(prev => prev.slice(0, -1)); setInputText(conversation[conversation.length - 2]?.content ?? ''); }}>Regenerate</button>
                          </div>
                          <div className="action-buttons-right">
                            <select
                              value={model}
                              onChange={e => setModel(e.target.value as ChatModel)}
                              className="model-select-compact"
                              aria-label="Model"
                            >
                              <option value="claude">Claude Sonnet 4</option>
                              <option value="gpt4">GPT-4</option>
                              <option value="gemini">Gemini Pro</option>
                              <option value="perplexity">Perplexity</option>
                            </select>
                            <button type="button" className="btn-action btn-primary" onClick={startNew}>
                              <span>+</span> New prompt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="input-bar">
              {lastAssistantMessage ? (
                <div className="input-container">
                  <div style={{ position: 'relative' }}>
                    <textarea ref={textareaRef} className="input-box" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={currentMindset ? `Describe your ${currentMindset.name.toLowerCase()} project...` : 'What do you want to create?'} rows={1} style={{ paddingRight: 52 }} />
                    <button type="button" onClick={handleSubmit} disabled={!inputText.trim() || isGenerating} className="btn-primary" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="input-bar-row">
                  <select
                    value={model}
                    onChange={e => setModel(e.target.value as ChatModel)}
                    className="model-select-inline"
                    aria-label="Model"
                  >
                    <option value="claude">Claude Sonnet 4</option>
                    <option value="gpt4">GPT-4</option>
                    <option value="gemini">Gemini Pro</option>
                    <option value="perplexity">Perplexity</option>
                  </select>
                  <div className="input-container">
                    <div style={{ position: 'relative' }}>
                      <textarea ref={textareaRef} className="input-box" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={currentMindset ? `Describe your ${currentMindset.name.toLowerCase()} project...` : 'What do you want to create?'} rows={1} style={{ paddingRight: 52 }} />
                      <button type="button" onClick={handleSubmit} disabled={!inputText.trim() || isGenerating} className="btn-primary" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#343541', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E8EA0' }}>Loading...</div>}>
      <GeniusEngineApp />
    </Suspense>
  );
}
