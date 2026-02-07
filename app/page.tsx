'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSavedPrompts, addSavedPrompt } from '@/lib/savedPrompts';
import { PROMPT_TEMPLATES } from '@/lib/templates';
import type { PromptTemplate } from '@/lib/types';
import { LayoutTemplate, X, Search } from 'lucide-react';

const PENDING_PROMPT_KEY = 'genius-engine-use-prompt';
const USER_TEMPLATES_KEY = 'genius-engine-user-templates';
const MODEL_STATUS_KEY = 'genius-engine-model-status';
const MODEL_SELECTED_KEY = 'genius-engine-selected-model';

function getUserTemplates(): PromptTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptTemplate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUserTemplate(template: PromptTemplate): PromptTemplate[] {
  const existing = getUserTemplates();
  const next = [template, ...existing];
  try {
    localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

function getModelStatusMap(): Partial<Record<ChatModel, boolean>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MODEL_STATUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Record<ChatModel, boolean>>;
    return parsed || {};
  } catch {
    return {};
  }
}

function setModelStatusMap(next: Partial<Record<ChatModel, boolean>>) {
  try {
    localStorage.setItem(MODEL_STATUS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

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

const MODEL_CONFIG: Record<ChatModel, { label: string; icon: string; color: string; desc: string }> = {
  claude: { label: 'Claude Sonnet 4', icon: '🟣', color: '#818CF8', desc: 'Anthropic — creative & nuanced' },
  gpt4: { label: 'GPT-4', icon: '🟢', color: '#10B981', desc: 'OpenAI — versatile powerhouse' },
  gemini: { label: 'Gemini Pro', icon: '🔵', color: '#3B82F6', desc: 'Google — fast & multilingual' },
  perplexity: { label: 'Perplexity', icon: '🔷', color: '#06B6D4', desc: 'Research-backed answers' },
};

const MODEL_LABELS: Record<ChatModel, string> = {
  claude: 'Claude Sonnet 4',
  gpt4: 'GPT-4',
  gemini: 'Gemini Pro',
  perplexity: 'Perplexity',
};

type ConversationMessage = { role: 'user' | 'assistant'; content: string; model?: ChatModel };

type GoalKey = 'content' | 'data' | 'code' | 'business' | 'learn';

const GOAL_OPTIONS: { key: GoalKey; label: string; icon: string }[] = [
  { key: 'content', label: 'Create Content', icon: '✍️' },
  { key: 'data', label: 'Analyze Data', icon: '📊' },
  { key: 'code', label: 'Code / Technical', icon: '💻' },
  { key: 'business', label: 'Business Strategy', icon: '📈' },
  { key: 'learn', label: 'Learn Something', icon: '📚' },
];

const GOAL_MINDSETS: Record<GoalKey, { list: string[]; recommended: string[] }> = {
  content: { list: ['content', 'seo', 'social', 'email', 'marketing', 'design', 'video', 'photo'], recommended: ['content', 'marketing', 'social'] },
  data: { list: ['data', 'ai', 'developer', 'business', 'startup'], recommended: ['data', 'ai'] },
  code: { list: ['developer', 'ai', 'security'], recommended: ['developer', 'ai'] },
  business: { list: ['marketing', 'sales', 'startup', 'ecommerce'], recommended: ['marketing', 'startup'] },
  learn: { list: ['scientific', 'medical', 'legal', 'hr', 'education'], recommended: ['scientific', 'education'] },
};

const MINDSET_PLACEHOLDERS: Record<string, { context: string; task: string; hints: string[]; examples: string[] }> = {
  marketing: {
    context: 'We are launching a new product aimed at SMBs in the US market...',
    task: 'Create a launch email sequence with strong CTAs and urgency.',
    hints: ['Audience and industry', 'Offer or value prop', 'Channels and tone'],
    examples: ['Write a product launch email sequence', 'Create ad copy for social ads'],
  },
  developer: {
    context: 'We have a React + Node app with a REST API and a PostgreSQL database...',
    task: 'Design an API structure with endpoints and error handling.',
    hints: ['Tech stack', 'Constraints', 'Performance requirements'],
    examples: ['Write a code review checklist', 'Design an API spec'],
  },
  data: {
    context: 'We track user behavior across signup, activation, and retention...',
    task: 'Analyze drop-off and propose improvements.',
    hints: ['Metrics to analyze', 'Time window', 'Success definition'],
    examples: ['Design an A/B test', 'Build a KPI dashboard spec'],
  },
  content: {
    context: 'We are a B2B SaaS brand targeting growth marketers...',
    task: 'Create a 90-day content plan with themes and formats.',
    hints: ['Target persona', 'Primary goal', 'Distribution channels'],
    examples: ['Write a blog outline', 'Create a content strategy brief'],
  },
  security: {
    context: 'We are preparing for a security audit before launch...',
    task: 'Create a checklist to assess application security.',
    hints: ['System type', 'Compliance requirements', 'Risk areas'],
    examples: ['Security audit checklist', 'Incident response plan'],
  },
};

const MODEL_UI: Record<ChatModel, { company: string; short: string }> = {
  claude: { company: 'Anthropic', short: 'C' },
  gpt4: { company: 'OpenAI', short: 'G' },
  gemini: { company: 'Google', short: 'Gem' },
  perplexity: { company: 'Perplexity', short: 'P' },
};

/* ── Custom Model Selector ── */
function ModelSelector({
  value,
  onChange,
  compact,
  statusMap,
}: {
  value: ChatModel;
  onChange: (m: ChatModel) => void;
  compact?: boolean;
  statusMap: Partial<Record<ChatModel, boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = MODEL_CONFIG[value];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: compact ? '8px 12px' : '10px 14px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: `1px solid ${open ? 'rgba(129, 140, 248, 0.4)' : 'rgba(148, 163, 184, 0.1)'}`,
          borderRadius: 12, cursor: 'pointer',
          color: '#F1F5F9', fontSize: compact ? 13 : 14, fontWeight: 500,
          transition: 'all 200ms ease',
          minWidth: compact ? 150 : 170,
        }}
      >
        <span style={{
          width: compact ? 20 : 22,
          height: compact ? 20 : 22,
          borderRadius: '50%',
          background: current.color,
          color: '#0F172A',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? 10 : 11,
          fontWeight: 700,
        }}>{MODEL_UI[value].short}</span>
        <span style={{ flex: 1, textAlign: 'left' }}>{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5, transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="model-dropdown" style={{
          position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
          background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: 14,
          padding: 6, minWidth: 240, zIndex: 100,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(148,163,184,0.06)',
        }}>
          {(Object.keys(MODEL_CONFIG) as ChatModel[]).map(key => {
            const m = MODEL_CONFIG[key];
            const ui = MODEL_UI[key];
            const isActive = key === value;
            const available = statusMap[key] !== false;
            const statusText = available ? 'Available' : 'Configure API';
            return (
              <button
                key={key}
                type="button"
                onClick={() => { if (!available) return; onChange(key); setOpen(false); }}
                title={m.desc}
                className={`model-option ${isActive ? 'selected' : ''} ${available ? '' : 'disabled'}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', border: 'none', borderRadius: 10, cursor: available ? 'pointer' : 'not-allowed',
                  background: isActive ? 'rgba(129, 140, 248, 0.12)' : 'transparent',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                  opacity: available ? 1 : 0.6,
                  boxShadow: isActive ? `0 0 0 1px ${m.color}55` : 'none',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(148, 163, 184, 0.06)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: m.color,
                  color: '#0F172A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}>{ui.short}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: isActive ? m.color : '#F1F5F9', fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                  <div style={{ color: '#64748B', fontSize: 12, marginTop: 1 }}>{ui.company}</div>
                  <div style={{ color: available ? '#10B981' : '#94A3B8', fontSize: 11, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: available ? '#10B981' : '#64748B' }} />
                    {statusText}
                    {!available && <span style={{ color: '#818CF8', textDecoration: 'underline' }}>Configure</span>}
                  </div>
                </div>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke={m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {key === 'claude' && (
                  <span className="model-recommended">(Recommended)</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Bounce Dots ── */
function BounceDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', animation: 'bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

/* ── Skeleton Loader ── */
function SkeletonLoader() {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 20px', borderRadius: 14, background: 'rgba(30, 41, 59, 0.3)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(129, 140, 248, 0.2)', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontSize: 14, marginBottom: 4 }}>
          <BounceDots />
          <span style={{ marginLeft: 4 }}>Generating...</span>
        </div>
        <div style={{ height: 14, width: '85%', borderRadius: 8, background: 'rgba(30, 41, 59, 0.6)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: 14, width: '70%', borderRadius: 8, background: 'rgba(30, 41, 59, 0.6)', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.15s' }} />
        <div style={{ height: 14, width: '92%', borderRadius: 8, background: 'rgba(30, 41, 59, 0.6)', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.3s' }} />
        <div style={{ height: 14, width: '60%', borderRadius: 8, background: 'rgba(30, 41, 59, 0.6)', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.45s' }} />
      </div>
    </div>
  );
}

/* ── Templates Panel ── */
function TemplatesPanel({ open, onClose, onUse, currentMindset, templates }: {
  open: boolean;
  onClose: () => void;
  onUse: (template: PromptTemplate) => void;
  currentMindset: string | null;
  templates: PromptTemplate[];
}) {
  const [search, setSearch] = useState('');
  const [filterMindset, setFilterMindset] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentMindset) setFilterMindset(currentMindset);
  }, [open, currentMindset]);

  const filtered = templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchMindset = !filterMindset || t.mindset === filterMindset;
    return matchSearch && matchMindset;
  });

  const mindsetKeys = [...new Set(templates.map(t => t.mindset))];

  return (
    <>
      <div className={`vault-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`templates-panel ${open ? 'open' : ''}`}>
        <div className="templates-panel-header">
          <h2><LayoutTemplate size={18} /> Templates</h2>
          <button type="button" className="templates-panel-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="templates-search">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input type="text" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="templates-filter-row">
          <button type="button" className={`templates-filter-btn ${!filterMindset ? 'active' : ''}`} onClick={() => setFilterMindset(null)}>All</button>
          {mindsetKeys.map(key => {
            const m = mindsets[key];
            return <button key={key} type="button" className={`templates-filter-btn ${filterMindset === key ? 'active' : ''}`} onClick={() => setFilterMindset(filterMindset === key ? null : key)}>{m?.icon} {m?.name}</button>;
          })}
        </div>
        <div className="templates-body">
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748B' }}>
              <LayoutTemplate size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p>No templates match your search.</p>
            </div>
          )}
          {filtered.map(t => {
            const m = mindsets[t.mindset];
            return (
              <div key={t.id} className="template-card">
                <div className="template-card-header">
                  <span className="template-icon">{m?.icon || '📄'}</span>
                  <h3>{t.name}</h3>
                  <span className="template-mindset-tag">{m?.name || t.mindset}</span>
                </div>
                <p>{t.description}</p>
                <button type="button" className="template-use-btn" onClick={() => onUse(t)}>Use Template</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Guided Builder Wizard ── */
function GuidedBuilder({ open, onClose, onGenerate }: {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, mindset: string | null) => void;
}) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<GoalKey | null>(null);
  const [mindsetKey, setMindsetKey] = useState<string | null>(null);
  const [contextText, setContextText] = useState('');
  const [taskText, setTaskText] = useState('');
  const [formatOptions, setFormatOptions] = useState<string[]>([]);
  const [lengthChoice, setLengthChoice] = useState<'short' | 'medium' | 'long'>('medium');

  useEffect(() => {
    if (open) {
      setStep(1);
      setGoal(null);
      setMindsetKey(null);
      setContextText('');
      setTaskText('');
      setFormatOptions([]);
      setLengthChoice('medium');
    }
  }, [open]);

  if (!open) return null;

  const goalMindsets = goal ? GOAL_MINDSETS[goal]?.list ?? [] : [];
  const recommended = goal ? new Set(GOAL_MINDSETS[goal]?.recommended ?? []) : new Set<string>();
  const currentMindset = mindsetKey ? mindsets[mindsetKey] : null;
  const meta = mindsetKey ? (MINDSET_PLACEHOLDERS[mindsetKey] ?? null) : null;

  const toggleFormat = (value: string) => {
    setFormatOptions(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const buildPrompt = () => {
    const goalLabel = goal ? GOAL_OPTIONS.find(g => g.key === goal)?.label : 'General';
    const mindsetLabel = currentMindset?.name ?? 'General';
    const formatLine = formatOptions.length > 0 ? formatOptions.join(', ') : 'Any clear format';
    const lengthLine = lengthChoice === 'short' ? 'Short (1-2 paragraphs)' : lengthChoice === 'long' ? 'Long (detailed)' : 'Medium (3-5 paragraphs)';
    return [
      `You are an expert in ${mindsetLabel}.`,
      `Goal: ${goalLabel}.`,
      contextText ? `Context: ${contextText}` : 'Context: (none provided).',
      taskText ? `Task: ${taskText}` : 'Task: (none provided).',
      `Output format: ${formatLine}.`,
      `Length: ${lengthLine}.`,
    ].join('\n');
  };

  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));
  const canNext = step === 1 ? !!goal : step === 2 ? !!mindsetKey : true;

  return (
    <div className="builder-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="builder-modal">
        <div className="builder-header">
          <div className="builder-title">
            <span className="builder-title-icon">✨</span>
            <div>
              <div className="builder-title-text">Guided Builder</div>
              <div className="builder-step-text">Step {step} of 5</div>
            </div>
          </div>
          <button type="button" className="builder-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="builder-progress">
          <div className="builder-progress-bar" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        <div className="builder-body">
          {step === 1 && (
            <>
              <h3>Choose Your Goal</h3>
              <p className="builder-desc">Pick the kind of outcome you want to create.</p>
              <div className="builder-goal-grid">
                {GOAL_OPTIONS.map(opt => (
                  <button key={opt.key} type="button" className={`builder-goal-card ${goal === opt.key ? 'selected' : ''}`} onClick={() => setGoal(opt.key)}>
                    <span className="builder-goal-icon">{opt.icon}</span>
                    <span className="builder-goal-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Select Mindset</h3>
              <p className="builder-desc">Relevant mindsets based on your goal.</p>
              <div className="builder-mindset-grid">
                {goalMindsets.map(key => {
                  const m = mindsets[key];
                  if (!m) return null;
                  const desc = m.suggestions?.[0]?.desc ?? `${m.name} guidance`;
                  return (
                    <button key={key} type="button" className={`builder-mindset-card ${mindsetKey === key ? 'selected' : ''}`} onClick={() => setMindsetKey(key)}>
                      <div className="builder-mindset-top">
                        <span className="bmc-icon">{m.icon}</span>
                        {recommended.has(key) && <span className="builder-badge">Recommended</span>}
                      </div>
                      <div className="bmc-name">{m.name}</div>
                      <div className="bmc-desc">{desc}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Add Context</h3>
              <p className="builder-desc">What does the AI need to know?</p>
              <textarea
                className="builder-textarea"
                placeholder={meta?.context ?? 'Share any important background, constraints, or details...'}
                value={contextText}
                onChange={e => setContextText(e.target.value)}
              />
              {meta?.hints && (
                <ul className="builder-hints">
                  {meta.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h3>Define Task</h3>
              <p className="builder-desc">Be explicit about what you want.</p>
              <textarea
                className="builder-textarea"
                placeholder={meta?.task ?? 'Describe exactly what you want the AI to produce...'}
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
              />
              {meta?.examples && (
                <div className="builder-examples">
                  {meta.examples.map((ex, i) => (
                    <button key={i} type="button" onClick={() => setTaskText(ex)}>{ex}</button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h3>Specify Output Format</h3>
              <p className="builder-desc">Choose how you want the results delivered.</p>
              <div className="builder-format-grid">
                {['Bullet points', 'Detailed paragraphs', 'Step-by-step guide', 'Table / structured data', 'Code with comments'].map(opt => (
                  <label key={opt} className={`builder-format-card ${formatOptions.includes(opt) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={formatOptions.includes(opt)} onChange={() => toggleFormat(opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <div className="builder-length">
                <div className="builder-length-label">Length</div>
                <div className="builder-length-options">
                  {(['short', 'medium', 'long'] as const).map(opt => (
                    <button key={opt} type="button" className={lengthChoice === opt ? 'selected' : ''} onClick={() => setLengthChoice(opt)}>
                      {opt === 'short' ? 'Short' : opt === 'long' ? 'Long' : 'Medium'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="builder-footer">
          <button type="button" className="builder-btn secondary" onClick={step === 1 ? onClose : handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 5 ? (
            <button type="button" className="builder-btn primary" onClick={handleNext} disabled={!canNext}>
              Next
            </button>
          ) : (
            <button type="button" className="builder-btn primary" onClick={() => { onGenerate(buildPrompt(), mindsetKey); onClose(); }}>
              Generate Prompt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Library Vault Panel ── */
function VaultPanel({ open, onClose, items, onUse }: {
  open: boolean;
  onClose: () => void;
  items: { id: number; name: string; mindset: string; score: number; date: string; content?: string }[];
  onUse: (item: { content?: string; mindset: string; name: string }) => void;
}) {
  return (
    <>
      <div className={`vault-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`library-vault-panel ${open ? 'open' : ''}`}>
        <div className="library-vault-panel-header">
          <h2>Library Vault</h2>
          <button type="button" className="library-vault-panel-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="library-vault-panel-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748B' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
              <p>No saved prompts yet.</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Generate a prompt and save it to see it here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => {
                const m = mindsets[item.mindset];
                return (
                  <div key={item.id} style={{
                    background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(148, 163, 184, 0.06)',
                    borderRadius: 12, padding: 16, transition: 'all 200ms ease', cursor: 'default',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{m?.icon || '📄'}</span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 8 }}>{item.score}/100</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{item.date}</span>
                      <button type="button" onClick={() => onUse({ content: item.content, mindset: item.mindset, name: item.name })} style={{
                        padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #818CF8, #EC4899)', color: '#fff',
                        transition: 'all 200ms ease',
                      }}>Use</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/library" style={{
            display: 'block', textAlign: 'center', marginTop: 20, padding: '12px 0',
            color: '#818CF8', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            borderTop: '1px solid rgba(148, 163, 184, 0.06)', paddingTop: 20,
          }}>View all in Library →</Link>
        </div>
      </div>
    </>
  );
}

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
  const [modelStatus, setModelStatus] = useState<Partial<Record<ChatModel, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultItems, setVaultItems] = useState<{ id: number; name: string; mindset: string; score: number; date: string; content?: string }[]>([]);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [userTemplates, setUserTemplates] = useState<PromptTemplate[]>([]);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const exportFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentMindset = selectedMindset ? mindsets[selectedMindset] : null;

  useEffect(() => {
    const saved = getSavedPrompts();
    setSavedPromptCount(saved.length);
    setVaultItems(saved);
  }, []);

  useEffect(() => {
    setUserTemplates(getUserTemplates());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedModel = localStorage.getItem(MODEL_SELECTED_KEY) as ChatModel | null;
    if (savedModel && MODEL_CONFIG[savedModel]) setModel(savedModel);
    setModelStatus(getModelStatusMap());
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
    const updated = getSavedPrompts();
    setSavedPromptCount(updated.length);
    setVaultItems(updated);
    setSavedToLibrary(true);
    setTimeout(() => setSavedToLibrary(false), 2500);
  };

  const refreshVault = useCallback(() => {
    const updated = getSavedPrompts();
    setSavedPromptCount(updated.length);
    setVaultItems(updated);
  }, []);

  const showExportFeedback = useCallback((message: string) => {
    setExportFeedback(message);
    if (exportFeedbackTimeoutRef.current) clearTimeout(exportFeedbackTimeoutRef.current);
    exportFeedbackTimeoutRef.current = setTimeout(() => setExportFeedback(null), 2000);
  }, []);

  const handleModelChange = (nextModel: ChatModel) => {
    setModel(nextModel);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MODEL_SELECTED_KEY, nextModel);
      } catch {
        // ignore
      }
    }
  };

  const updateModelStatus = (nextModel: ChatModel, available: boolean) => {
    const next = { ...modelStatus, [nextModel]: available };
    setModelStatus(next);
    setModelStatusMap(next);
  };

  /* ── Template use handler ── */
  const handleUseTemplate = useCallback((template: PromptTemplate) => {
    setInputText(template.prompt);
    if (template.mindset && mindsets[template.mindset]) setSelectedMindset(template.mindset);
    setTemplatesOpen(false);
    setActiveTab('prompt');
    textareaRef.current?.focus();
  }, []);

  const getLastAssistantContent = () => [...conversation].reverse().find(m => m.role === 'assistant')?.content ?? '';
  const getLastUserTitle = () => [...conversation].reverse().find(m => m.role === 'user')?.content?.split('\n')[0]?.slice(0, 60) ?? 'Saved Template';

  const handleExportCopy = () => {
    const content = getLastAssistantContent();
    if (!content) return;
    navigator.clipboard.writeText(content);
    showExportFeedback('✓ Copied!');
  };

  const handleExportDownload = () => {
    const content = getLastAssistantContent();
    if (!content) return;
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const filename = `genius-prompt-${yyyy}-${mm}-${dd}.md`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showExportFeedback('✓ Downloaded!');
  };

  const handleExportSaveTemplate = () => {
    const content = getLastAssistantContent();
    if (!content) return;
    const template: PromptTemplate = {
      id: `user-${Date.now()}`,
      name: getLastUserTitle(),
      description: 'Saved from output',
      mindset: selectedMindset || 'content',
      prompt: content,
    };
    const next = saveUserTemplate(template);
    setUserTemplates(next);
    showExportFeedback('✓ Saved!');
  };

  const handleBuilderGenerate = (prompt: string, mindsetKey: string | null) => {
    setInputText(prompt);
    if (mindsetKey && mindsets[mindsetKey]) setSelectedMindset(mindsetKey);
    setActiveTab('prompt');
    setTimeout(() => textareaRef.current?.focus(), 50);
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
        updateModelStatus(model, false);
        throw new Error(isConfig ? `Configure API Key: ${errMsg}` : errMsg);
      }
      updateModelStatus(model, true);
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
                  updateModelStatus(parsed.model, true);
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
      updateModelStatus(returnedModel, true);
      setConversation(prev => [...prev, { role: 'assistant', content, model: returnedModel }]);
    } catch (err) {
      clearTimeout(timeoutId);
      if (streamNoDataTimeoutId) clearTimeout(streamNoDataTimeoutId);
      updateModelStatus(model, false);
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
      if (line.startsWith('*') && line.endsWith('*')) return <p key={j} style={{ fontStyle: 'italic', color: '#94A3B8', marginTop: 16 }}>{line.replace(/\*/g, '')}</p>;
      if (line === '---') return <hr key={j} style={{ border: 'none', borderTop: '1px solid rgba(148, 163, 184, 0.08)', margin: '16px 0' }} />;
      if (line.trim() === '') return <br key={j} />;
      return <p key={j}>{line}</p>;
    });
  }

  return (
    <div className="app-container" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Mobile hamburger button */}
      <button type="button" className="mobile-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {sidebarOpen ? <><path d="M5 5l10 10" /><path d="M15 5L5 15" /></> : <><path d="M3 6h14" /><path d="M3 10h14" /><path d="M3 14h14" /></>}
        </svg>
      </button>

      {/* Mobile sidebar backdrop */}
      <div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="logo-icon">G</span>
            <span className="logo-text">GeniusEngine</span>
            <svg className="sparkle-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: -4 }}>
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="url(#sparkleGrad)" />
              <defs><linearGradient id="sparkleGrad" x1="0" y1="0" x2="16" y2="16"><stop stopColor="#818CF8" /><stop offset="1" stopColor="#EC4899" /></linearGradient></defs>
            </svg>
          </Link>
          <button type="button" className="btn-new-prompt" onClick={() => { startNew(); setSidebarOpen(false); }}>
            <span>+</span> New prompt
          </button>
          <button type="button" className="btn-guided-builder" onClick={() => { setBuilderOpen(true); setSidebarOpen(false); }}>
            ✨ Guided Builder
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
                  <button key={key} type="button" className={`mindset-item ${selectedMindset === key ? 'active' : ''}`} data-mindset={key} onClick={() => { setSelectedMindset(key); setActiveTab('prompt'); setSidebarOpen(false); }}>
                    <span className="icon">{m.icon}</span>{m.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button type="button" className="library-vault-btn" onClick={() => { setTemplatesOpen(true); setSidebarOpen(false); }}>
            <span className="icon"><LayoutTemplate size={16} /></span>
            <span className="label">Templates</span>
            <span className="badge">{PROMPT_TEMPLATES.length}</span>
          </button>
          <button type="button" className="library-vault-btn" onClick={() => { refreshVault(); setVaultOpen(true); setSidebarOpen(false); }}>
            <span className="icon">📚</span>
            <span className="label">Library Vault</span>
            <span className="badge">{savedPromptCount}</span>
          </button>
          <button type="button" className="library-vault-btn" style={{ marginTop: 4 }} onClick={() => { setActiveTab(activeTab === 'info' ? 'prompt' : 'info'); setSidebarOpen(false); }}>
            <span className="icon">📖</span>
            <span className="label">{activeTab === 'info' ? 'Back to Prompt' : 'Information & Guide'}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'info' ? (
          <div className="content-body" style={{ padding: 32, maxWidth: 960, margin: '0 auto', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: 28, marginBottom: 24 }}>Information & Guide</h1>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#818CF8' }}>How to use GeniusEngine</h2>
              <ol style={{ paddingLeft: 24, lineHeight: 1.8, color: '#94A3B8' }}>
                <li><strong style={{ color: '#F1F5F9' }}>Select a mindset</strong> from the sidebar (e.g. Photo, Marketing, Developer).</li>
                <li><strong style={{ color: '#F1F5F9' }}>Enter your prompt</strong> in the text area — describe what you want to create.</li>
                <li><strong style={{ color: '#F1F5F9' }}>Generate</strong> to get an optimized, expert-level prompt.</li>
                <li><strong style={{ color: '#F1F5F9' }}>Save to Library</strong> to keep prompts for later, or copy/export.</li>
              </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#818CF8' }}>Terminology dictionary</h2>
              <p style={{ color: '#94A3B8', marginBottom: 12 }}>All expert terms and their meanings by mindset. Go to:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20, alignItems: 'center' }}>
                {Object.entries(mindsets).map(([key, m], i) => (
                  <React.Fragment key={key}>
                    {i > 0 && <span style={{ color: '#64748B', margin: '0 2px' }}>|</span>}
                    <button type="button" onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); }} style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: 13, cursor: 'pointer', padding: 0 }}>{m.icon} {m.name}</button>
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
                    <div key={key} id={`info-${key}`} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: 16, padding: 24, scrollMarginTop: 24, backdropFilter: 'blur(16px)' }}>
                      <button type="button" onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); }} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 18, marginBottom: 12, cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}>{m.icon} {m.name}</button>
                      {hasGroups ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {Object.entries(byGroup).map(([groupName, items]) => (
                            <div key={groupName}>
                              <h4 style={{ fontSize: 14, color: '#94A3B8', marginBottom: 8, fontWeight: 600 }}>{groupName}</h4>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {items.map((s, i) => (
                                  <button key={i} type="button" title={s.desc} onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); addTerm(s.term); }} style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '6px 12px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(148, 163, 184, 0.08)', color: '#F1F5F9', cursor: 'pointer', transition: 'all 200ms ease' }}>{s.term}: {s.desc}</button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {m.suggestions.map((s, i) => (
                            <button key={i} type="button" title={s.desc} onClick={() => { setActiveTab('prompt'); setSelectedMindset(key); addTerm(s.term); }} style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '6px 12px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(148, 163, 184, 0.08)', color: '#F1F5F9', cursor: 'pointer', transition: 'all 200ms ease' }}>{s.term}: {s.desc}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: '#818CF8' }}>Examples</h2>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: 16, padding: 24, marginBottom: 16, backdropFilter: 'blur(16px)' }}>
                <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>Photo mindset — input:</p>
                <p style={{ color: '#F1F5F9', marginBottom: 12 }}>Product shots for a skincare brand, natural light, minimal shadows.</p>
                <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>You’ll get:</p>
                <p style={{ color: '#F1F5F9' }}>An optimized prompt with role, context, technical specs (e.g. aspect ratio, depth of field), composition notes, and a quality score.</p>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: 16, padding: 24, backdropFilter: 'blur(16px)' }}>
                <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>Marketing mindset — input:</p>
                <p style={{ color: '#F1F5F9', marginBottom: 12 }}>Email sequence for a product launch.</p>
                <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>You’ll get:</p>
                <p style={{ color: '#F1F5F9' }}>Strategic overview, AIDA-style structure, CTAs, and implementation steps with best practices.</p>
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="main-content-inner">
              {conversation.length === 0 && !isGenerating ? (
                <>
                  <div className="content-header">
                    <div style={{ fontSize: 56, marginBottom: 20, filter: 'drop-shadow(0 4px 12px rgba(129, 140, 248, 0.25))' }}>{currentMindset ? currentMindset.icon : '✨'}</div>
                    <h1>What do you want to create?</h1>
                    <p className="subtitle">
                      {currentMindset
                        ? <>Using <span style={{ color: '#818CF8', fontWeight: 600 }}>{currentMindset.name}</span> mindset</>
                        : 'Select a mindset from the sidebar for smart suggestions'
                      }
                    </p>
                  </div>
                  {currentMindset && (
                    <div>
                      <div className="suggestions-container">
                        {currentMindset.suggestions.slice(0, 12).map((s, i) => (
                          <button key={i} type="button" className="suggestion-pill" onClick={() => addTerm(s.term)} title={s.desc}>{s.term}</button>
                        ))}
                      </div>
                      <button type="button" onClick={() => setActiveTab('info')} style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: 12, cursor: 'pointer', padding: '4px 0', marginTop: 12, display: 'block', margin: '12px auto 0', width: 'fit-content', transition: 'color 200ms ease' }} onMouseEnter={e => (e.currentTarget.style.color = '#818CF8')} onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>View all terms in Information &amp; Guide →</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="content-body" style={{ paddingTop: 24 }}>
                  {conversation.length > 0 && (
                    <>
                      {conversation.slice(0, conversation[conversation.length - 1]?.role === 'assistant' ? conversation.length - 1 : conversation.length).map((msg, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28, padding: '16px 20px', borderRadius: 14, background: msg.role === 'user' ? 'transparent' : 'rgba(30, 41, 59, 0.3)', transition: 'background 200ms ease' }}>
                          <div style={{ width: 34, height: 34, borderRadius: msg.role === 'user' ? '50%' : 10, background: msg.role === 'user' ? 'linear-gradient(135deg, #818CF8, #EC4899)' : '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0, boxShadow: msg.role === 'user' ? '0 2px 8px rgba(129,140,248,0.3)' : '0 2px 8px rgba(16,185,129,0.3)' }}>{msg.role === 'user' ? 'U' : 'G'}</div>
                          <div style={{ flex: 1, minWidth: 0, fontSize: 15, lineHeight: 1.7 }}>
                            {msg.role === 'user' ? (
                              <p style={{ color: '#F1F5F9', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontWeight: 500 }}>{msg.content}</p>
                            ) : (
                              <>
                                <div style={{ color: '#F1F5F9', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formatOutputContent(msg.content)}</div>
                                {msg.model != null && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 11, color: MODEL_CONFIG[msg.model].color, background: `${MODEL_CONFIG[msg.model].color}15`, padding: '3px 10px', borderRadius: 8, fontWeight: 600 }}>
                                    <span style={{ fontSize: 12 }}>{MODEL_CONFIG[msg.model].icon}</span>
                                    {MODEL_LABELS[msg.model]}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      {isGenerating && <SkeletonLoader />}
                      <div ref={messagesEndRef} />
                    </>
                  )}

                  {lastAssistantMessage && (
                    <div className="output-section" style={{ marginTop: 8 }}>
                      <div className="output-container">
                        <div className="quality-score">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.8 4.6L13 5.2L10 8.1L10.6 13L7 11L3.4 13L4 8.1L1 5.2L5.2 4.6L7 1Z" fill="#10B981"/></svg>
                          {qualityScore ? `${qualityScore}/100` : '—'}
                        </div>
                        <div className="output-box">{formatOutputContent(lastAssistantMessage.content)}</div>
                        <div className="export-row">
                          <div className="export-buttons">
                            <button type="button" className="export-btn" onClick={handleExportCopy}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              Copy to Clipboard
                            </button>
                            <button type="button" className="export-btn" onClick={handleExportDownload}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <path d="M7 10l5 5 5-5" />
                                <path d="M12 15V3" />
                              </svg>
                              Download as Markdown
                            </button>
                            <button type="button" className="export-btn" onClick={handleExportSaveTemplate}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                              </svg>
                              Save to Templates
                            </button>
                          </div>
                          {exportFeedback && <div className="export-feedback">{exportFeedback}</div>}
                        </div>
                        <div className="action-buttons">
                          <div className="action-buttons-left">
                            <button type="button" className="btn-action btn-secondary" onClick={handleCopyOutput}>{copied ? 'Copied!' : 'Copy'}</button>
                            <button type="button" className="btn-action btn-secondary" onClick={handleSaveToLibrary}>{savedToLibrary ? 'Saved to Library!' : 'Save to Library'}</button>
                            <button type="button" className="btn-action btn-primary" onClick={() => { setConversation(prev => prev.slice(0, -1)); setInputText(conversation[conversation.length - 2]?.content ?? ''); }}>Regenerate</button>
                          </div>
                          <div className="action-buttons-right">
                            <ModelSelector value={model} onChange={handleModelChange} compact statusMap={modelStatus} />
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
                  <ModelSelector value={model} onChange={handleModelChange} statusMap={modelStatus} />
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

      <VaultPanel
        open={vaultOpen}
        onClose={() => setVaultOpen(false)}
        items={vaultItems}
        onUse={(item) => {
          setConversation([{ role: 'assistant', content: item.content || '' }]);
          if (item.mindset && mindsets[item.mindset]) setSelectedMindset(item.mindset);
          setVaultOpen(false);
        }}
      />

      <TemplatesPanel
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onUse={handleUseTemplate}
        currentMindset={selectedMindset}
        templates={[...userTemplates, ...PROMPT_TEMPLATES]}
      />

      <GuidedBuilder
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onGenerate={handleBuilderGenerate}
      />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>Loading...</div>}>
      <GeniusEngineApp />
    </Suspense>
  );
}
