// Shared AI caller used by skill generation routes.
// Auto-detects which provider key is configured (Claude → Gemini → Perplexity).

type Provider = 'claude' | 'gemini' | 'perplexity';

export function detectProvider(): Provider | null {
  if ((process.env.ANTHROPIC_API_KEY ?? '').trim()) return 'claude';
  const googleKey = (process.env.GOOGLE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? '').trim();
  if (googleKey) return 'gemini';
  if ((process.env.PERPLEXITY_API_KEY ?? '').trim()) return 'perplexity';
  return null;
}

export async function callAI(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens = 600,
): Promise<string> {
  const provider = detectProvider();
  if (!provider) throw new Error('No API key configured. Add ANTHROPIC_API_KEY, GOOGLE_AI_API_KEY, or PERPLEXITY_API_KEY to .env.local');

  switch (provider) {
    case 'claude':    return callClaude(systemPrompt, messages, maxTokens);
    case 'gemini':    return callGemini(systemPrompt, messages, maxTokens);
    case 'perplexity':return callPerplexity(systemPrompt, messages, maxTokens);
  }
}

async function callClaude(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens: number,
): Promise<string> {
  const apiKey = (process.env.ANTHROPIC_API_KEY ?? '').trim();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || res.statusText);
  }
  const data = (await res.json()) as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Claude');
  return text;
}

async function callGemini(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens: number,
): Promise<string> {
  const apiKey = (
    process.env.GOOGLE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? ''
  ).trim();
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || res.statusText);
  }
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

async function callPerplexity(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens: number,
): Promise<string> {
  const apiKey = (process.env.PERPLEXITY_API_KEY ?? '').trim();
  // sonar-pro follows structured/JSON instructions more reliably than sonar
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || res.statusText);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from Perplexity');
  return text;
}
