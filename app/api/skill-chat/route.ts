import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a skill builder assistant. Your job is to create precise, powerful AI skill instructions — system-level directives that work as system prompts in any LLM (Claude, ChatGPT, Cursor, Copilot, etc.).

When a user describes what they want:
- If the description is vague or missing key details, ask 2-3 targeted clarifying questions as natural conversational text. Keep it brief and friendly.
- Once you have enough context, generate the skill immediately — don't over-question.

ALWAYS respond with valid JSON only — no markdown, no preamble, nothing outside the JSON.

If you need to ask questions first:
{"type":"questions","message":"Your conversational question text here"}

If you have enough info to generate the skill:
{"type":"skill","name":"Skill Name","category":"Coding","icon":"🛠️","description":"One sentence max","instruction":"Full instruction here"}

Rules for the instruction:
- 3-6 sentences in imperative voice ("Apply...", "Focus on...", "Structure...")
- Specific and actionable — tells the AI exactly what to do
- Works as a standalone system prompt dropped into any LLM
- No meta-commentary like "This skill will..." — start with the directive

Valid categories: Reasoning, Output Format, Tone & Style, Analysis, Creative, Optimization, Coding
Pick an icon emoji that fits the skill's domain.`;

type Message = { role: 'user' | 'assistant'; content: string };

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json() as { messages?: Message[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    const apiKey = (process.env.ANTHROPIC_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Configure ANTHROPIC_API_KEY in .env.local' }, { status: 503 });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as { error?: { message?: string } }).error?.message || res.statusText;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const data = (await res.json()) as { content?: { text?: string }[] };
    const raw = data.content?.[0]?.text?.trim();
    if (!raw) return NextResponse.json({ error: 'Empty response' }, { status: 500 });

    // Extract JSON even if the model wraps it in a code block
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'Unexpected response format', raw }, { status: 500 });

    const parsed = JSON.parse(jsonMatch[0]) as { type: string; message?: string; name?: string; category?: string; icon?: string; description?: string; instruction?: string };
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
