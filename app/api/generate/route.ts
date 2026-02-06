import { NextRequest, NextResponse } from 'next/server';

type Provider = 'openai' | 'anthropic';

function buildSystemPrompt(mindsetName: string): string {
  return `You are GeniusEngine, an expert prompt optimizer. The user has selected the "${mindsetName}" mindset.

Your task: Turn the user's raw idea into a single, polished, expert-level prompt they can copy and use (e.g. in ChatGPT, Claude, or an image generator).

Rules:
- Output ONE optimized prompt. Use clear structure: Role, Context, Task, and any domain-specific sections.
- Use professional terminology appropriate for ${mindsetName}. Be specific and actionable.
- End with a single line: "**Quality Score: XX/100**" where XX is 75-98. Add one short sentence after it (e.g. "Strong specificity; consider adding X for an even higher score.").
- Do not add meta-commentary like "Here's your prompt" before the prompt. Output the prompt content only.
- Use markdown: **bold** for headings, - for lists, --- for dividers if needed.`;
}

async function callOpenAI(input: string, mindsetName: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const systemPrompt = buildSystemPrompt(mindsetName);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || res.statusText);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from OpenAI');
  return content;
}

async function callAnthropic(input: string, mindsetName: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const systemPrompt = buildSystemPrompt(mindsetName);
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
        model: 'claude-3-5-haiku-20241022',
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
    const { input, mindset, provider } = body as { input?: string; mindset?: string | null; provider?: string };

    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json({ error: 'Missing or invalid input' }, { status: 400 });
    }

    const validProviders: Provider[] = ['openai', 'anthropic'];
    const selectedProvider = validProviders.includes(provider as Provider) ? (provider as Provider) : 'openai';
    const mindsetName = mindset && typeof mindset === 'string' ? mindset : 'general';
    const displayName = mindsetName.charAt(0).toUpperCase() + mindsetName.slice(1).replace(/_/g, ' ');

    let content: string;
    switch (selectedProvider) {
      case 'openai':
        content = await callOpenAI(input.trim(), displayName);
        break;
      case 'anthropic':
        content = await callAnthropic(input.trim(), displayName);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
