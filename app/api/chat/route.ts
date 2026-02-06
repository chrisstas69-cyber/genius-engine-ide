import { NextRequest, NextResponse } from 'next/server';

export type ChatModel = 'claude' | 'gpt4' | 'gemini' | 'perplexity';

const VALID_MODELS: ChatModel[] = ['claude', 'gpt4', 'gemini', 'perplexity'];

function buildSystemPrompt(mindsetName: string): string {
  return `You are GeniusEngine, an expert prompt optimizer. The user has selected the "${mindsetName}" mindset. You are assisting with ${mindsetName}. Use professional terminology from this domain.

Your task: Turn the user's raw idea into a single, polished, expert-level prompt they can copy and use (e.g. in ChatGPT, Claude, or an image generator).

Rules:
- Output ONE optimized prompt. Use clear structure: Role, Context, Task, and any domain-specific sections.
- Use professional terminology appropriate for ${mindsetName}. Be specific and actionable.
- End with a single line: "**Quality Score: XX/100**" where XX is 75-98. Add one short sentence after it (e.g. "Strong specificity; consider adding X for an even higher score.").
- Do not add meta-commentary like "Here's your prompt" before the prompt. Output the prompt content only.
- Use markdown: **bold** for headings, - for lists, --- for dividers if needed.`;
}

function getMindsetDisplayName(selectedMindset: string | null | undefined): string {
  if (!selectedMindset || typeof selectedMindset !== 'string') return 'General';
  const trimmed = selectedMindset.trim();
  if (!trimmed) return 'General';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/_/g, ' ');
}

function missingKeyResponse(keyName: string) {
  return NextResponse.json(
    { error: `Configure ${keyName} in .env.local` },
    { status: 503 }
  );
}

function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

function getApiKey(key: string, alt?: string): string {
  const v = (process.env[key] ?? process.env[alt ?? ''] ?? '').trim();
  return v;
}

async function callClaude(
  message: string,
  conversationHistory: { role: string; content: string }[],
  systemPrompt: string
): Promise<{ content: string }> {
  const apiKey = getApiKey('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const messages = conversationHistory
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  messages.push({ role: 'user' as const, content: message });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Try again shortly.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check ANTHROPIC_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }

  const data = (await res.json()) as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Claude');
  return { content: text };
}

async function callGpt4(
  message: string,
  conversationHistory: { role: string; content: string }[],
  systemPrompt: string
): Promise<{ content: string }> {
  const apiKey = getApiKey('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Try again shortly.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check OPENAI_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from OpenAI');
  return { content };
}

async function callGemini(
  message: string,
  conversationHistory: { role: string; content: string }[],
  systemPrompt: string
): Promise<{ content: string }> {
  const apiKey = getApiKey('GOOGLE_AI_API_KEY', 'GEMINI_API_KEY') || getApiKey('GOOGLE_API_KEY');
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY is not set');

  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const m of conversationHistory) {
    if (m.role === 'user' || m.role === 'assistant') {
      const role = m.role === 'user' ? 'user' : 'model';
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    }),
  });

  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Try again shortly.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check GOOGLE_AI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Gemini');
  return { content: text };
}

async function callPerplexity(
  message: string,
  conversationHistory: { role: string; content: string }[],
  systemPrompt: string
): Promise<{ content: string }> {
  const apiKey = getApiKey('PERPLEXITY_API_KEY');
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not set');

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (res.status === 429) {
    throw new Error('Rate limit exceeded. Try again shortly.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check PERPLEXITY_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from Perplexity');
  return { content };
}

function streamLine(obj: { text?: string; done?: boolean; model?: string }) {
  return new TextEncoder().encode(JSON.stringify(obj) + '\n');
}

async function streamOpenAI(
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  selectedModel: ChatModel
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = getApiKey('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...history.filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o', messages, temperature: 0.7, max_tokens: 1024, stream: true }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check OPENAI_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }
  if (!res.body) throw new Error(res.statusText);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = done ? '' : (lines.pop() ?? '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
            const text = parsed.choices?.[0]?.delta?.content;
            if (text) controller.enqueue(streamLine({ text }));
          } catch {
            // skip
          }
        }
      }
      if (done) {
        controller.enqueue(streamLine({ done: true, model: selectedModel }));
        controller.close();
      }
    },
  });
}

async function streamAnthropic(
  message: string,
  history: { role: string; content: string }[],
  systemPrompt: string,
  selectedModel: ChatModel
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = getApiKey('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  messages.push({ role: 'user' as const, content: message });
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system: systemPrompt, messages, stream: true }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const raw = (err as { error?: { message?: string } }).error?.message || res.statusText;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid or expired API key. Check ANTHROPIC_API_KEY in .env.local.');
    }
    throw new Error(raw);
  }
  if (!res.body) throw new Error(res.statusText);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = done ? '' : (lines.pop() ?? '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6)) as { type?: string; delta?: { type?: string; text?: string } };
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' && parsed.delta.text) {
              controller.enqueue(streamLine({ text: parsed.delta.text }));
            }
          } catch {
            // skip
          }
        }
      }
      if (done) {
        controller.enqueue(streamLine({ done: true, model: selectedModel }));
        controller.close();
      }
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      model,
      message,
      conversationHistory,
      selectedMindset,
      stream: wantStream,
    } = body as {
      model?: string;
      message?: string;
      conversationHistory?: { role: string; content: string }[];
      selectedMindset?: string | null;
      stream?: boolean;
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Missing or invalid message' }, { status: 400 });
    }

    const selectedModel = VALID_MODELS.includes(model as ChatModel) ? (model as ChatModel) : 'claude';
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];
    const mindsetName = getMindsetDisplayName(selectedMindset);
    const systemPrompt = buildSystemPrompt(mindsetName);

    if (selectedModel === 'claude') {
      if (!getApiKey('ANTHROPIC_API_KEY')) return missingKeyResponse('ANTHROPIC_API_KEY');
    } else if (selectedModel === 'gpt4') {
      if (!getApiKey('OPENAI_API_KEY')) return missingKeyResponse('OPENAI_API_KEY');
    } else if (selectedModel === 'gemini') {
      if (!getApiKey('GOOGLE_AI_API_KEY', 'GEMINI_API_KEY') && !getApiKey('GOOGLE_API_KEY')) return missingKeyResponse('GOOGLE_AI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY');
    } else if (selectedModel === 'perplexity') {
      if (!getApiKey('PERPLEXITY_API_KEY')) return missingKeyResponse('PERPLEXITY_API_KEY');
    }

    const stream = wantStream === true;
    if (stream && (selectedModel === 'gpt4' || selectedModel === 'claude')) {
      const streamBody =
        selectedModel === 'gpt4'
          ? await streamOpenAI(message.trim(), history, systemPrompt, selectedModel)
          : await streamAnthropic(message.trim(), history, systemPrompt, selectedModel);
      return new Response(streamBody, {
        headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' },
      });
    }

    let result: { content: string };
    switch (selectedModel) {
      case 'claude':
        result = await callClaude(message.trim(), history, systemPrompt);
        break;
      case 'gpt4':
        result = await callGpt4(message.trim(), history, systemPrompt);
        break;
      case 'gemini':
        result = await callGemini(message.trim(), history, systemPrompt);
        break;
      case 'perplexity':
        result = await callPerplexity(message.trim(), history, systemPrompt);
        break;
      default:
        return errorResponse('Unsupported model', 400);
    }

    return NextResponse.json({ content: result.content, model: selectedModel });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    const isRateLimit = message.toLowerCase().includes('rate limit');
    return NextResponse.json(
      { error: message },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
