import { NextRequest, NextResponse } from 'next/server';

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

    const apiKey = (process.env.ANTHROPIC_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Configure ANTHROPIC_API_KEY in .env.local' }, { status: 503 });
    }

    const userMessage = `Write a skill instruction for:
Skill name: ${name?.trim() || 'Custom Skill'}
Category: ${category || 'Coding'}
Goal: ${goal.trim()}

Return ONLY the instruction text. No labels, no preamble, no surrounding quotes.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as { error?: { message?: string } }).error?.message || res.statusText;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const data = (await res.json()) as { content?: { text?: string }[] };
    const instruction = data.content?.[0]?.text?.trim();
    if (!instruction) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ instruction });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
