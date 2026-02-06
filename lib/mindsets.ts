import { Mindsets, SavedItem, QuickTemplate } from './types';

export const mindsets: Mindsets = {
  // =====================
  // CREATIVE CATEGORY (5)
  // =====================
  photo: {
    name: 'Photo Mindset',
    icon: '📷',
    category: 'Creative',
    description: 'Professional photography terminology and techniques',
    suggestions: [
      { term: 'Cinematic', desc: 'Film-like quality with dramatic lighting' },
      { term: '35mm film', desc: 'Classic analog camera look with grain' },
      { term: 'Golden hour', desc: 'Warm light during sunrise/sunset' },
      { term: 'Bokeh', desc: 'Blurred background sharp subject' },
      { term: 'High key', desc: 'Bright minimal shadows' },
      { term: 'Low key', desc: 'Dark dramatic shadows' },
      { term: 'Editorial', desc: 'Magazine-style professional shots' },
      { term: 'Portrait', desc: 'Focus on person/face' },
      { term: 'Macro', desc: 'Extreme close-up detail shots' },
      { term: 'Wide angle', desc: 'Expansive field of view' },
      { term: 'Rule of thirds', desc: 'Composition grid technique' },
      { term: 'Natural light', desc: 'No artificial lighting' },
    ],
  },
  video: {
    name: 'Video Mindset',
    icon: '🎬',
    category: 'Creative',
    description: 'Professional videography and filmmaking terms',
    suggestions: [
      { term: 'Dolly shot', desc: 'Smooth camera movement on track' },
      { term: 'Crane shot', desc: 'Sweeping overhead movement' },
      { term: 'Handheld', desc: 'Raw documentary-style shake' },
      { term: 'Slow motion', desc: 'Time-stretched dramatic effect' },
      { term: 'Time-lapse', desc: 'Compressed time fast motion' },
      { term: 'B-roll', desc: 'Supplementary footage' },
      { term: 'Jump cut', desc: 'Quick jarring transitions' },
      { term: 'Match cut', desc: 'Seamless scene transitions' },
      { term: 'Tracking shot', desc: 'Camera follows subject' },
      { term: 'Establishing shot', desc: 'Sets the scene/location' },
      { term: '4K/8K', desc: 'Ultra high resolution' },
      { term: 'Color grading', desc: 'Post-production color styling' },
    ],
  },
  design: {
    name: 'Design Mindset',
    icon: '🎨',
    category: 'Creative',
    description: 'UI/UX and graphic design principles',
    suggestions: [
      { term: 'Minimalist', desc: 'Clean essential elements only' },
      { term: 'Maximalist', desc: 'Bold layered complex' },
      { term: 'Brutalist', desc: 'Raw unpolished aesthetic' },
      { term: 'Flat design', desc: 'No shadows or gradients' },
      { term: 'Skeuomorphic', desc: 'Realistic tactile appearance' },
      { term: 'Glassmorphism', desc: 'Frosted glass effect' },
      { term: 'Neumorphism', desc: 'Soft extruded appearance' },
      { term: 'Grid system', desc: 'Structured layout alignment' },
      { term: 'White space', desc: 'Strategic empty areas' },
      { term: 'Visual hierarchy', desc: 'Importance through size/color' },
      { term: 'Color theory', desc: 'Complementary/analogous palettes' },
      { term: 'Typography pairing', desc: 'Font combinations' },
    ],
  },
  illustration: {
    name: 'Illustration Mindset',
    icon: '✏️',
    category: 'Creative',
    description: 'Digital and traditional illustration styles',
    suggestions: [
      { term: 'Vector art', desc: 'Clean scalable graphics' },
      { term: 'Hand-drawn', desc: 'Organic imperfect lines' },
      { term: 'Isometric', desc: '3D without perspective' },
      { term: 'Flat illustration', desc: 'Simple shapes no depth' },
      { term: 'Line art', desc: 'Outline-only drawings' },
      { term: 'Watercolor', desc: 'Soft flowing paint effect' },
      { term: 'Geometric', desc: 'Shape-based compositions' },
      { term: 'Character design', desc: 'Creating personas/mascots' },
      { term: 'Infographic', desc: 'Data visualization art' },
      { term: 'Spot illustration', desc: 'Small supporting visuals' },
    ],
  },
  music: {
    name: 'Music Mindset',
    icon: '🎵',
    category: 'Creative',
    description: 'Music production and audio engineering',
    suggestions: [
      { term: 'Lo-fi', desc: 'Intentionally imperfect warm' },
      { term: 'Ambient', desc: 'Atmospheric background texture' },
      { term: 'Crescendo', desc: 'Gradual volume increase' },
      { term: 'Reverb', desc: 'Echo/space simulation' },
      { term: 'BPM', desc: 'Beats per minute tempo' },
      { term: 'Mastering', desc: 'Final audio polish' },
      { term: 'Layering', desc: 'Multiple tracks combined' },
      { term: 'Drop', desc: 'Climactic beat release' },
      { term: 'Stems', desc: 'Separated track elements' },
      { term: 'Compression', desc: 'Dynamic range control' },
      { term: 'EQ', desc: 'Frequency balancing' },
      { term: 'Foley', desc: 'Sound effects recording' },
    ],
  },

  // =====================
  // BUSINESS CATEGORY (4)
  // =====================
  marketing: {
    name: 'Marketing Mindset',
    icon: '📈',
    category: 'Business',
    description: 'Digital marketing and growth strategies',
    suggestions: [
      { term: 'CTA', desc: 'Call-to-action button/text' },
      { term: 'Above the fold', desc: 'Visible without scrolling' },
      { term: 'Social proof', desc: 'Testimonials reviews' },
      { term: 'AIDA', desc: 'Attention Interest Desire Action' },
      { term: 'Pain point', desc: 'Customer problem to solve' },
      { term: 'Value proposition', desc: 'Unique benefit statement' },
      { term: 'Conversion', desc: 'User completing action' },
      { term: 'A/B testing', desc: 'Comparing two variations' },
      { term: 'Funnel', desc: 'Customer journey stages' },
      { term: 'Lead magnet', desc: 'Free offer for emails' },
      { term: 'Retargeting', desc: 'Re-engaging past visitors' },
      { term: 'USP', desc: 'Unique Selling Proposition' },
    ],
  },
  sales: {
    name: 'Sales Mindset',
    icon: '💰',
    category: 'Business',
    description: 'Sales techniques and methodologies',
    suggestions: [
      { term: 'Discovery call', desc: 'Initial needs assessment' },
      { term: 'Objection handling', desc: 'Addressing concerns' },
      { term: 'SPIN selling', desc: 'Situation Problem Implication Need' },
      { term: 'Challenger sale', desc: 'Teaching-based approach' },
      { term: 'Pipeline', desc: 'Sales opportunity tracking' },
      { term: 'Qualified lead', desc: 'Verified potential customer' },
      { term: 'Close rate', desc: 'Conversion percentage' },
      { term: 'Upsell', desc: 'Higher-value alternative' },
      { term: 'Cross-sell', desc: 'Complementary products' },
      { term: 'ROI', desc: 'Return on Investment' },
    ],
  },
  startup: {
    name: 'Startup Mindset',
    icon: '🚀',
    category: 'Business',
    description: 'Startup and venture terminology',
    suggestions: [
      { term: 'MVP', desc: 'Minimum Viable Product' },
      { term: 'Product-market fit', desc: 'Solution matches demand' },
      { term: 'Pivot', desc: 'Strategic direction change' },
      { term: 'Runway', desc: 'Months of cash remaining' },
      { term: 'Burn rate', desc: 'Monthly spending rate' },
      { term: 'Series A/B/C', desc: 'Funding round stages' },
      { term: 'Bootstrapped', desc: 'Self-funded growth' },
      { term: 'Traction', desc: 'Measurable progress' },
      { term: 'Scalable', desc: 'Grows without proportional cost' },
      { term: 'Moat', desc: 'Competitive advantage' },
      { term: 'CAC', desc: 'Customer Acquisition Cost' },
      { term: 'LTV', desc: 'Lifetime Value' },
    ],
  },
  ecommerce: {
    name: 'E-commerce Mindset',
    icon: '🛒',
    category: 'Business',
    description: 'Online retail and marketplace operations',
    suggestions: [
      { term: 'Cart abandonment', desc: 'Left without purchasing' },
      { term: 'Product page', desc: 'Item detail view' },
      { term: 'SKU', desc: 'Stock Keeping Unit identifier' },
      { term: 'Dropshipping', desc: 'Third-party fulfillment' },
      { term: 'AOV', desc: 'Average Order Value' },
      { term: 'Checkout flow', desc: 'Purchase process steps' },
      { term: 'Bundle', desc: 'Multiple items packaged' },
      { term: 'Flash sale', desc: 'Limited-time discount' },
      { term: 'Inventory management', desc: 'Stock tracking' },
      { term: 'Fulfillment', desc: 'Order processing/shipping' },
    ],
  },

  // =====================
  // TECHNICAL CATEGORY (4)
  // =====================
  developer: {
    name: 'Developer Mindset',
    icon: '💻',
    category: 'Technical',
    description: 'Software development and engineering',
    suggestions: [
      { term: 'RESTful API', desc: 'Standard web service design' },
      { term: 'GraphQL', desc: 'Flexible query language' },
      { term: 'Microservices', desc: 'Distributed architecture' },
      { term: 'SOLID principles', desc: 'Clean code fundamentals' },
      { term: 'DRY', desc: "Don't Repeat Yourself" },
      { term: 'TDD', desc: 'Test-Driven Development' },
      { term: 'CI/CD', desc: 'Continuous integration/deployment' },
      { term: 'Serverless', desc: 'Cloud functions' },
      { term: 'Type-safe', desc: 'Strong typing' },
      { term: 'Async/await', desc: 'Asynchronous programming' },
      { term: 'Caching', desc: 'Performance optimization' },
      { term: 'Webhook', desc: 'Event-driven callbacks' },
    ],
  },
  data: {
    name: 'Data Mindset',
    icon: '📊',
    category: 'Technical',
    description: 'Data science and analytics',
    suggestions: [
      { term: 'ETL', desc: 'Extract Transform Load' },
      { term: 'Data pipeline', desc: 'Automated data flow' },
      { term: 'Normalization', desc: 'Database optimization' },
      { term: 'Aggregation', desc: 'Summarizing data points' },
      { term: 'Visualization', desc: 'Charts and graphs' },
      { term: 'Regression', desc: 'Predictive modeling' },
      { term: 'Clustering', desc: 'Grouping similar data' },
      { term: 'A/B test', desc: 'Controlled experiment' },
      { term: 'KPI', desc: 'Key Performance Indicator' },
      { term: 'Dashboard', desc: 'Metrics display' },
    ],
  },
  ai: {
    name: 'AI/ML Mindset',
    icon: '🤖',
    category: 'Technical',
    description: 'Artificial intelligence and machine learning',
    suggestions: [
      { term: 'Prompt engineering', desc: 'Optimizing AI inputs' },
      { term: 'Fine-tuning', desc: 'Custom model training' },
      { term: 'RAG', desc: 'Retrieval-Augmented Generation' },
      { term: 'Embeddings', desc: 'Vector representations' },
      { term: 'Token', desc: 'Text unit for processing' },
      { term: 'Temperature', desc: 'Output randomness control' },
      { term: 'Context window', desc: 'Input size limit' },
      { term: 'Hallucination', desc: 'Incorrect AI outputs' },
      { term: 'Chain of thought', desc: 'Step-by-step reasoning' },
      { term: 'Zero-shot', desc: 'No examples needed' },
      { term: 'Few-shot', desc: 'Learning from examples' },
      { term: 'Inference', desc: 'Model prediction' },
    ],
  },
  cybersecurity: {
    name: 'Security Mindset',
    icon: '🔒',
    category: 'Technical',
    description: 'Cybersecurity and information protection',
    suggestions: [
      { term: 'Encryption', desc: 'Data scrambling protection' },
      { term: 'Authentication', desc: 'Identity verification' },
      { term: 'Authorization', desc: 'Permission control' },
      { term: 'Penetration testing', desc: 'Security vulnerability check' },
      { term: 'Firewall', desc: 'Network access control' },
      { term: 'Zero trust', desc: 'Verify everything approach' },
      { term: 'OWASP', desc: 'Security best practices' },
      { term: 'SSL/TLS', desc: 'Secure communication' },
      { term: 'MFA', desc: 'Multi-factor authentication' },
      { term: 'Audit trail', desc: 'Activity logging' },
    ],
  },

  // ========================
  // PROFESSIONAL CATEGORY (4)
  // ========================
  legal: {
    name: 'Legal Mindset',
    icon: '⚖️',
    category: 'Professional',
    description: 'Legal writing and contract terminology',
    suggestions: [
      { term: 'Whereas clause', desc: 'Background facts recital' },
      { term: 'Indemnification', desc: 'Protection against losses' },
      { term: 'Force majeure', desc: 'Unforeseeable circumstances' },
      { term: 'Boilerplate', desc: 'Standard contract language' },
      { term: 'Plain language', desc: 'Clear accessible writing' },
      { term: 'Severability', desc: 'Invalid clause protection' },
      { term: 'Governing law', desc: 'Jurisdiction specification' },
      { term: 'Non-disclosure', desc: 'Confidentiality requirements' },
      { term: 'Liability', desc: 'Legal responsibility' },
      { term: 'Arbitration', desc: 'Dispute resolution method' },
    ],
  },
  scientific: {
    name: 'Scientific Mindset',
    icon: '🔬',
    category: 'Professional',
    description: 'Scientific research and methodology',
    suggestions: [
      { term: 'Hypothesis', desc: 'Testable prediction' },
      { term: 'Methodology', desc: 'Research approach' },
      { term: 'Peer-reviewed', desc: 'Expert-validated' },
      { term: 'Abstract', desc: 'Concise summary' },
      { term: 'Literature review', desc: 'Existing research survey' },
      { term: 'Control group', desc: 'Baseline comparison' },
      { term: 'Statistical significance', desc: 'Results validity' },
      { term: 'Reproducible', desc: 'Can be replicated' },
      { term: 'Citation', desc: 'Source reference' },
      { term: 'Empirical', desc: 'Based on observation' },
    ],
  },
  medical: {
    name: 'Medical Mindset',
    icon: '🏥',
    category: 'Professional',
    description: 'Healthcare and medical terminology',
    suggestions: [
      { term: 'Diagnosis', desc: 'Condition identification' },
      { term: 'Prognosis', desc: 'Expected outcome' },
      { term: 'Contraindication', desc: 'Reason to avoid treatment' },
      { term: 'Dosage', desc: 'Medication amount' },
      { term: 'Side effects', desc: 'Unintended reactions' },
      { term: 'Clinical trial', desc: 'Treatment testing' },
      { term: 'Patient history', desc: 'Medical background' },
      { term: 'Symptom', desc: 'Condition indicator' },
      { term: 'Treatment plan', desc: 'Care strategy' },
      { term: 'HIPAA compliant', desc: 'Privacy standards' },
    ],
  },
  hr: {
    name: 'HR Mindset',
    icon: '👥',
    category: 'Professional',
    description: 'Human resources and talent management',
    suggestions: [
      { term: 'Job description', desc: 'Role requirements' },
      { term: 'Onboarding', desc: 'New hire integration' },
      { term: 'Performance review', desc: 'Employee evaluation' },
      { term: 'Compensation package', desc: 'Salary + benefits' },
      { term: 'Culture fit', desc: 'Values alignment' },
      { term: 'Retention', desc: 'Keeping employees' },
      { term: 'Exit interview', desc: 'Departure feedback' },
      { term: 'PTO', desc: 'Paid Time Off' },
      { term: 'Remote/hybrid', desc: 'Work arrangement' },
      { term: 'DEI', desc: 'Diversity Equity Inclusion' },
    ],
  },

  // =====================
  // CONTENT CATEGORY (4)
  // =====================
  content: {
    name: 'Content Mindset',
    icon: '📝',
    category: 'Content',
    description: 'Content strategy and creation',
    suggestions: [
      { term: 'Evergreen', desc: 'Always relevant content' },
      { term: 'Pillar content', desc: 'Comprehensive cornerstone' },
      { term: 'Long-form', desc: '2000+ word articles' },
      { term: 'Listicle', desc: 'List-based article' },
      { term: 'How-to guide', desc: 'Step-by-step tutorial' },
      { term: 'Case study', desc: 'Success story analysis' },
      { term: 'Thought leadership', desc: 'Expert perspective' },
      { term: 'User-generated', desc: 'Audience-created content' },
      { term: 'Content calendar', desc: 'Publishing schedule' },
      { term: 'Repurposing', desc: 'Adapting for channels' },
    ],
  },
  seo: {
    name: 'SEO Mindset',
    icon: '🔍',
    category: 'Content',
    description: 'Search engine optimization',
    suggestions: [
      { term: 'Keywords', desc: 'Search terms to target' },
      { term: 'Meta description', desc: 'Search result preview' },
      { term: 'Backlinks', desc: 'Incoming links from other sites' },
      { term: 'Domain authority', desc: 'Site credibility score' },
      { term: 'SERP', desc: 'Search Engine Results Page' },
      { term: 'On-page SEO', desc: 'Content optimization' },
      { term: 'Technical SEO', desc: 'Site structure optimization' },
      { term: 'Alt text', desc: 'Image descriptions' },
      { term: 'Internal linking', desc: 'Links within your site' },
      { term: 'Featured snippet', desc: 'Position zero result' },
    ],
  },
  social: {
    name: 'Social Media Mindset',
    icon: '📱',
    category: 'Content',
    description: 'Social media marketing and management',
    suggestions: [
      { term: 'Engagement rate', desc: 'Interaction percentage' },
      { term: 'Reach', desc: 'Unique viewers' },
      { term: 'Impressions', desc: 'Total views' },
      { term: 'Viral', desc: 'Rapidly spreading content' },
      { term: 'Hashtag strategy', desc: 'Discoverability tags' },
      { term: 'Influencer', desc: 'Social media personality' },
      { term: 'UGC', desc: 'User-Generated Content' },
      { term: 'Algorithm', desc: 'Content distribution logic' },
      { term: 'Story/Reel', desc: 'Short-form vertical video' },
      { term: 'Community management', desc: 'Audience interaction' },
    ],
  },
  email: {
    name: 'Email Mindset',
    icon: '📧',
    category: 'Content',
    description: 'Email marketing and automation',
    suggestions: [
      { term: 'Subject line', desc: 'Email title/hook' },
      { term: 'Open rate', desc: 'Percentage who opened' },
      { term: 'Click-through rate', desc: 'Link click percentage' },
      { term: 'Drip campaign', desc: 'Automated email sequence' },
      { term: 'Segmentation', desc: 'Audience grouping' },
      { term: 'Personalization', desc: 'Customized content' },
      { term: 'Unsubscribe rate', desc: 'Opt-out percentage' },
      { term: 'Deliverability', desc: 'Inbox placement rate' },
      { term: 'Welcome series', desc: 'New subscriber emails' },
      { term: 'Re-engagement', desc: 'Win-back campaign' },
    ],
  },

  // ========================
  // SPECIALIZED CATEGORY (4)
  // ========================
  realestate: {
    name: 'Real Estate Mindset',
    icon: '🏠',
    category: 'Specialized',
    description: 'Real estate and property marketing',
    suggestions: [
      { term: 'Listing', desc: 'Property for sale/rent' },
      { term: 'Comparable sales', desc: 'Similar property prices' },
      { term: 'Curb appeal', desc: 'Exterior attractiveness' },
      { term: 'Staging', desc: 'Property presentation' },
      { term: 'Open house', desc: 'Public showing event' },
      { term: 'Pre-approval', desc: 'Loan qualification' },
      { term: 'Closing costs', desc: 'Transaction fees' },
      { term: 'MLS', desc: 'Multiple Listing Service' },
      { term: 'ROI', desc: 'Investment return' },
      { term: 'Cap rate', desc: 'Capitalization rate' },
    ],
  },
  fitness: {
    name: 'Fitness Mindset',
    icon: '💪',
    category: 'Specialized',
    description: 'Fitness and wellness content',
    suggestions: [
      { term: 'HIIT', desc: 'High-Intensity Interval Training' },
      { term: 'Rep/Set', desc: 'Repetition and grouping' },
      { term: 'Progressive overload', desc: 'Gradual intensity increase' },
      { term: 'Macros', desc: 'Protein/carbs/fat ratios' },
      { term: 'Recovery', desc: 'Rest and repair' },
      { term: 'Compound exercise', desc: 'Multi-muscle movements' },
      { term: 'Form', desc: 'Proper technique' },
      { term: 'Mind-muscle connection', desc: 'Focus on target muscle' },
      { term: 'Warm-up/cool-down', desc: 'Pre/post workout' },
      { term: 'Personal record', desc: 'Best performance' },
    ],
  },
  food: {
    name: 'Food & Recipe Mindset',
    icon: '🍳',
    category: 'Specialized',
    description: 'Food content and recipe writing',
    suggestions: [
      { term: 'Prep time', desc: 'Preparation duration' },
      { term: 'Cook time', desc: 'Cooking duration' },
      { term: 'Servings', desc: 'Portion quantity' },
      { term: 'Mise en place', desc: 'Ingredient preparation' },
      { term: 'Sauté', desc: 'Quick pan frying' },
      { term: 'Simmer', desc: 'Low heat cooking' },
      { term: 'Season to taste', desc: 'Adjust salt/spices' },
      { term: 'Garnish', desc: 'Decorative topping' },
      { term: 'Dietary restrictions', desc: 'Food limitations' },
      { term: 'Meal prep', desc: 'Batch cooking' },
    ],
  },
  education: {
    name: 'Education Mindset',
    icon: '📚',
    category: 'Specialized',
    description: 'Educational content and curriculum design',
    suggestions: [
      { term: 'Learning objective', desc: 'Goal statement' },
      { term: 'Curriculum', desc: 'Course structure' },
      { term: 'Assessment', desc: 'Knowledge evaluation' },
      { term: 'Rubric', desc: 'Grading criteria' },
      { term: 'Differentiation', desc: 'Varied instruction' },
      { term: 'Scaffolding', desc: 'Gradual skill building' },
      { term: 'Formative', desc: 'Ongoing assessment' },
      { term: 'Summative', desc: 'Final evaluation' },
      { term: 'Engagement', desc: 'Student participation' },
      { term: "Bloom's taxonomy", desc: 'Cognitive levels' },
    ],
  },
};

export const savedLibrary: SavedItem[] = [
  { id: 1, name: 'Product Launch Email Sequence', mindset: 'marketing', date: 'Jan 28', score: 92 },
  { id: 2, name: 'Cinematic Product Shots', mindset: 'photo', date: 'Jan 25', score: 88 },
  { id: 3, name: 'API Documentation Template', mindset: 'developer', date: 'Jan 22', score: 95 },
  { id: 4, name: 'NDA Agreement Draft', mindset: 'legal', date: 'Jan 20', score: 91 },
  { id: 5, name: 'Lo-fi Background Music Brief', mindset: 'music', date: 'Jan 18', score: 85 },
  { id: 6, name: 'Brand Video Storyboard', mindset: 'video', date: 'Jan 15', score: 89 },
  { id: 7, name: 'Photorealistic Portrait with Rim Lighting', mindset: 'photo', date: 'Jan 12', score: 90 },
  { id: 8, name: 'Cinematic Shot List with Dutch Angle', mindset: 'video', date: 'Jan 10', score: 87 },
  { id: 9, name: 'Deep House Track with Sidechain', mindset: 'music', date: 'Jan 8', score: 86 },
  { id: 10, name: 'Few-Shot Prompt Recipe for Music AI', mindset: 'ai', date: 'Jan 5', score: 93 },
];

export const quickTemplates: QuickTemplate[] = [
  { id: 1, name: 'Marketing Strategy', category: 'Marketing' },
  { id: 2, name: 'Product Email', category: 'Marketing' },
  { id: 3, name: 'Landing Page', category: 'Marketing' },
  { id: 4, name: 'React Component', category: 'Development' },
  { id: 5, name: 'API Docs', category: 'Development' },
];

export const categoryOrder: Array<{ name: string; category: string }> = [
  { name: 'Creative', category: 'Creative' },
  { name: 'Business', category: 'Business' },
  { name: 'Technical', category: 'Technical' },
  { name: 'Professional', category: 'Professional' },
  { name: 'Content', category: 'Content' },
  { name: 'Specialized', category: 'Specialized' },
];

export function generatePrompt(inputText: string, mindsetKey: string | null): string {
  if (mindsetKey === 'photo') {
    return `You are an expert photography director with 20+ years of experience in commercial and editorial photography.

**Visual Style:**
Cinematic quality with intentional lighting. Think 35mm film aesthetic with natural grain. Golden hour warmth preferred.

**Technical Specifications:**
- Aspect Ratio: 16:9 or 4:5 for social
- Depth of Field: Shallow (f/1.8-2.8) for bokeh
- Lighting: Soft, directional, motivated
- Color Grade: Warm tones, lifted shadows

**Composition Guidelines:**
- Rule of thirds with intentional breaking
- Leading lines toward subject
- Negative space for text overlay areas
- Editorial feel, not stock photography

**Context:**
${inputText}

**Output:**
Provide 3 distinct shot concepts with specific camera settings, lighting setups, and mood references.`;
  }

  const mindset = mindsetKey ? mindsets[mindsetKey] : null;
  const mindsetName = mindset ? mindset.name.replace(' Mindset', '').toLowerCase() : 'domain';

  return `You are a senior ${mindsetName} expert with deep domain knowledge.

**Context:**
${inputText}

**Your Task:**
Create a comprehensive, professional response that includes:

1. Strategic Overview
   - Key objectives and goals
   - Target audience analysis
   - Success metrics

2. Detailed Recommendations
   - Actionable steps
   - Best practices
   - Potential pitfalls to avoid

3. Implementation Plan
   - Timeline and milestones
   - Resource requirements
   - Priority order

**Output Format:**
Structured document with clear sections and specific, actionable recommendations.

**Tone:**
Professional yet approachable. Expert-level but accessible.`;
}
