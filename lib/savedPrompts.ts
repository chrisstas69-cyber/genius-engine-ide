import { SavedItem } from './types';
import { savedLibrary } from './mindsets';

const STORAGE_KEY = 'genius-engine-saved-prompts';

function getStored(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Returns saved prompts from localStorage, or seed data if empty. */
export function getSavedPrompts(): SavedItem[] {
  const stored = getStored();
  if (stored.length > 0) return stored;
  return savedLibrary;
}

/** Appends a prompt and persists to localStorage. */
export function addSavedPrompt(item: Omit<SavedItem, 'id'>): void {
  const list = getStored();
  const seed = list.length === 0 ? savedLibrary : list;
  const nextId = Math.max(0, ...seed.map((s) => s.id)) + 1;
  const withId: SavedItem = { ...item, id: nextId, createdAt: Date.now() };
  const next = list.length === 0 ? [...list, ...seed, withId] : [...list, withId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/** Remove a saved prompt by id. */
export function removeSavedPrompt(id: number): void {
  const list = getStored().filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Update a saved prompt by id. */
export function updateSavedPrompt(id: number, updates: Partial<Omit<SavedItem, 'id'>>): void {
  const list = getStored();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Duplicate a saved prompt, returning the new id. */
export function duplicateSavedPrompt(id: number): number | null {
  const list = getStored();
  const source = list.find((s) => s.id === id);
  if (!source) return null;
  const nextId = Math.max(0, ...list.map((s) => s.id)) + 1;
  const dup: SavedItem = {
    ...source,
    id: nextId,
    name: `${source.name} (copy)`,
    createdAt: Date.now(),
  };
  list.push(dup);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  return nextId;
}

/** Toggle starred status on a saved prompt. */
export function toggleStarredPrompt(id: number): void {
  const list = getStored();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], starred: !list[idx].starred };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Export a saved prompt as markdown text. */
export function exportPromptAsMarkdown(item: SavedItem): string {
  const lines = [
    `# ${item.name}`,
    '',
    `**Mindset:** ${item.mindset}`,
    `**Score:** ${item.score}/100`,
    `**Date:** ${item.date}`,
    '',
    '---',
    '',
    item.content || '_No content_',
  ];
  return lines.join('\n');
}
