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
