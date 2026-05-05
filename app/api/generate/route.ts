import { NextRequest, NextResponse } from 'next/server';

function buildSystemPrompt(mindsetName: string, skills?: { name: string; instruction: string }[]): string {
  let prompt = `You are GeniusEngine, an expert prompt optimizer. The user has selected the "${mindsetName}" mindset.

Your task: Turn the user's raw idea into a single, polished, expert-level prompt they can copy and use (e.g. in ChatGPT, Claude, or an image generator).

Rules:
- Output ONE optimized prompt. Use clear structure: Role, Context, Task, and any domain-specific sections.
- Use professional terminology appropriate for ${mindsetName}. Be specific and actionable.
- End with a single line: "**Quality Score: XX/100**" where XX is 75-98. Add one short sentence after it (e.g. "Strong specificity; consider adding X for an even higher score.").
- Do not add meta-commentary like "Here's your prompt" before the prompt. Output the prompt content only.
- Use markdown: **bold** for headings, - for lists, --- for dividers if needed.`;

  if (skills && skills.length > 0) {
    const skillLines = skills.map(s => `- **${s.name}:** ${s.instruction}`).join('\n');
    prompt += `\n\nActive Skills (apply these techniques to your response):\n${skillLines}`;
  }

  return prompt;
}

async function callAnthropic(input: string, mindsetName: string, skills?: { name: string; instruction: string }[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const systemPrompt = buildSystemPrompt(mindsetName, skills);
  const res = await fetch(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: input }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || res.statusText);
  }

  const data = (await res.json()) as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Anthropic');
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, mindset, selectedSkills } = body as { input?: string; mindset?: string | null; selectedSkills?: { id: string; name: string; instruction: string }[] };

    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json({ error: 'Missing or invalid input' }, { status: 400 });
    }

    const mindsetName = mindset && typeof mindset === 'string' ? mindset : 'general';
    const displayName = mindsetName.charAt(0).toUpperCase() + mindsetName.slice(1).replace(/_/g, ' ');
    const skills = Array.isArray(selectedSkills) ? selectedSkills : undefined;

    const content = await callAnthropic(input.trim(), displayName, skills);
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
