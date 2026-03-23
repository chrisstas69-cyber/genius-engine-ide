import type { Skill, SkillCategory } from './types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Reasoning',
  'Output Format',
  'Tone & Style',
  'Analysis',
  'Creative',
  'Optimization',
];

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  'Reasoning': '#10B981',
  'Output Format': '#3B82F6',
  'Tone & Style': '#F59E0B',
  'Analysis': '#8B5CF6',
  'Creative': '#EC4899',
  'Optimization': '#F97316',
};

export const BUILTIN_SKILLS: Skill[] = [
  // Reasoning
  {
    id: 'cot',
    name: 'Chain of Thought',
    icon: '🧠',
    category: 'Reasoning',
    description: 'Step-by-step logical reasoning before conclusions',
    instruction: 'Think through the problem step by step, showing your reasoning process. Break complex ideas into logical steps before arriving at conclusions.',
  },
  {
    id: 'step-by-step',
    name: 'Step by Step',
    icon: '📋',
    category: 'Reasoning',
    description: 'Numbered sequential instructions',
    instruction: 'Present the response as a clear numbered sequence of steps. Each step should be actionable and build on the previous one.',
  },
  {
    id: 'devils-advocate',
    name: "Devil's Advocate",
    icon: '😈',
    category: 'Reasoning',
    description: 'Challenge assumptions and find counterarguments',
    instruction: 'After presenting the main argument, actively challenge it. Identify weaknesses, counterarguments, and potential blind spots. Present both sides fairly.',
  },
  {
    id: 'first-principles',
    name: 'First Principles',
    icon: '🔬',
    category: 'Reasoning',
    description: 'Break problems down to fundamental truths',
    instruction: 'Reason from first principles. Strip away assumptions, identify the fundamental truths, and rebuild the solution from the ground up.',
  },

  // Output Format
  {
    id: 'json',
    name: 'JSON Output',
    icon: '{ }',
    category: 'Output Format',
    description: 'Structure response as valid JSON',
    instruction: 'Format the output as clean, valid JSON with descriptive key names. Use nested objects and arrays where appropriate for clarity.',
  },
  {
    id: 'markdown-table',
    name: 'Markdown Table',
    icon: '📊',
    category: 'Output Format',
    description: 'Organize data in formatted tables',
    instruction: 'Present key information in well-formatted markdown tables with clear headers. Use tables for comparisons, data summaries, and structured lists.',
  },
  {
    id: 'bullet-points',
    name: 'Bullet Points',
    icon: '•',
    category: 'Output Format',
    description: 'Concise bulleted lists for clarity',
    instruction: 'Structure the response using bullet points and sub-bullets. Keep each point concise and scannable. Group related points under clear headings.',
  },
  {
    id: 'code-block',
    name: 'Code Block',
    icon: '< >',
    category: 'Output Format',
    description: 'Include code examples with syntax highlighting',
    instruction: 'Include practical code examples in fenced code blocks with language tags. Add inline comments explaining key logic. Show both the code and expected output.',
  },

  // Tone & Style
  {
    id: 'professional',
    name: 'Professional',
    icon: '👔',
    category: 'Tone & Style',
    description: 'Formal business-appropriate language',
    instruction: 'Use professional, business-appropriate language. Maintain a formal tone with precise vocabulary. Structure ideas clearly and concisely for executive audiences.',
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: '😎',
    category: 'Tone & Style',
    description: 'Friendly conversational tone',
    instruction: 'Write in a casual, conversational tone. Use everyday language, contractions, and relatable examples. Keep it friendly and approachable.',
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    icon: '🎯',
    category: 'Tone & Style',
    description: 'Compelling language that drives action',
    instruction: 'Use persuasive language with strong calls to action. Employ emotional appeals, social proof, urgency, and benefit-focused framing to convince the reader.',
  },
  {
    id: 'academic',
    name: 'Academic',
    icon: '🎓',
    category: 'Tone & Style',
    description: 'Scholarly tone with citations and rigor',
    instruction: 'Write in an academic style with formal structure. Use precise terminology, cite sources where possible, present evidence-based arguments, and maintain scholarly objectivity.',
  },

  // Analysis
  {
    id: 'swot',
    name: 'SWOT Analysis',
    icon: '📐',
    category: 'Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats',
    instruction: 'Structure the analysis using a SWOT framework: Strengths, Weaknesses, Opportunities, and Threats. Present findings in clearly labeled sections with specific, actionable insights.',
  },
  {
    id: 'pros-cons',
    name: 'Pros & Cons',
    icon: '⚖️',
    category: 'Analysis',
    description: 'Balanced evaluation of advantages and disadvantages',
    instruction: 'Present a balanced evaluation with clearly separated Pros and Cons sections. Weight each point by importance and provide a final recommendation.',
  },
  {
    id: 'compare-contrast',
    name: 'Compare & Contrast',
    icon: '🔄',
    category: 'Analysis',
    description: 'Side-by-side comparison of options',
    instruction: 'Create a detailed side-by-side comparison. Evaluate each option against the same criteria. Highlight key differences and similarities, then recommend the best fit.',
  },
  {
    id: 'root-cause',
    name: 'Root Cause',
    icon: '🔍',
    category: 'Analysis',
    description: '5 Whys and root cause analysis',
    instruction: 'Apply root cause analysis techniques like the 5 Whys. Dig past surface symptoms to find the underlying cause, then propose solutions that address the root issue.',
  },

  // Creative
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    icon: '💡',
    category: 'Creative',
    description: 'Generate many diverse ideas rapidly',
    instruction: 'Generate a large quantity of diverse ideas without filtering. Include conventional and unconventional approaches. Aim for at least 10-15 ideas spanning different angles.',
  },
  {
    id: 'mind-map',
    name: 'Mind Map',
    icon: '🗺️',
    category: 'Creative',
    description: 'Radial exploration of connected ideas',
    instruction: 'Organize ideas in a mind map structure. Start with the central concept, branch out to main themes, then explore sub-branches. Show connections between related ideas.',
  },
  {
    id: 'analogy-builder',
    name: 'Analogy Builder',
    icon: '🪞',
    category: 'Creative',
    description: 'Explain concepts through analogies and metaphors',
    instruction: 'Explain complex concepts using vivid analogies and metaphors. Draw parallels to everyday experiences the audience already understands. Layer multiple analogies for depth.',
  },
  {
    id: 'story-framework',
    name: 'Story Framework',
    icon: '📖',
    category: 'Creative',
    description: 'Structure content as a compelling narrative',
    instruction: 'Frame the content as a narrative with a clear arc: setup (context), conflict (challenge/problem), rising action (exploration), climax (key insight), and resolution (solution/takeaway).',
  },

  // Optimization
  {
    id: 'concise',
    name: 'Concise',
    icon: '✂️',
    category: 'Optimization',
    description: 'Maximum information, minimum words',
    instruction: 'Be extremely concise. Every sentence must earn its place. Cut filler words, redundancy, and unnecessary preamble. Deliver maximum value in minimum words.',
  },
  {
    id: 'ultra-detailed',
    name: 'Ultra-Detailed',
    icon: '🔎',
    category: 'Optimization',
    description: 'Comprehensive deep-dive with full context',
    instruction: 'Provide an exhaustive, deeply detailed response. Cover edge cases, exceptions, nuances, and advanced considerations. Include examples, data points, and implementation details.',
  },
  {
    id: 'seo-optimized',
    name: 'SEO-Optimized',
    icon: '🔍',
    category: 'Optimization',
    description: 'Content optimized for search engines',
    instruction: 'Optimize content for SEO. Include relevant keywords naturally, use proper heading hierarchy (H1/H2/H3), write compelling meta descriptions, and structure for featured snippets.',
  },
  {
    id: 'conversion-focused',
    name: 'Conversion-Focused',
    icon: '💰',
    category: 'Optimization',
    description: 'Copy that drives clicks, signups, and sales',
    instruction: 'Write conversion-focused copy. Lead with benefits not features, use power words, create urgency, include social proof elements, and end with a clear compelling call to action.',
  },
];

export function composeSkillInstructions(skills: Skill[]): string {
  if (skills.length === 0) return '';
  const lines = skills.map(s => `- **${s.name}:** ${s.instruction}`);
  return `\n\nActive Skills (apply these techniques to your response):\n${lines.join('\n')}`;
}

export function getAllSkills(customSkills: Skill[] = []): Skill[] {
  return [...BUILTIN_SKILLS, ...customSkills];
}
