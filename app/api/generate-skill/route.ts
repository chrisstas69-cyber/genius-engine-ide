import { NextRequest, NextResponse } from 'next/server';
import { callAI, detectProvider } from '@/lib/aiCall';

const SYSTEM_PROMPT = `You are a prompt engineering expert. Your job is to write a concise, powerful "skill instruction" — a system-level directive that tells an AI exactly how to behave when this skill is active.

Rules for a good skill instruction:
- 3-6 sentences. Dense, not wordy.
- Written in imperative voice ("Apply...", "Structure...", "Focus on...").
- Specific and actionable — tells the AI exactly what to do, not just the goal.
- No meta-commentary like "This skill will..." — just the instruction itself.
- Should work as a standalone system prompt dropped into any LLM (Claude, ChatGPT, Cursor, etc.).`;

export async function POST(request: NextRequest) {
  try {
    const { name, category, goal } = await request.json() as {
      name?: string;
      category?: string;
      goal?: string;
    };

    if (!goal?.trim()) {
      return NextResponse.json({ error: 'Describe what you want the skill to do.' }, { status: 400 });
    }

    if (!detectProvider()) {
      return NextResponse.json(
        { error: 'No API key configured. Add ANTHROPIC_API_KEY, GOOGLE_AI_API_KEY, or PERPLEXITY_API_KEY to .env.local' },
        { status: 503 }
      );
    }

    const userMessage = `Write a skill instruction for:
Skill name: ${name?.trim() || 'Custom Skill'}
Category: ${category || 'Coding'}
Goal: ${goal.trim()}

Return ONLY the instruction text. No labels, no preamble, no surrounding quotes.`;

    const instruction = await callAI(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], 300);
    return NextResponse.json({ instruction });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
