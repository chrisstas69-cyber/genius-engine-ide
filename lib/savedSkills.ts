import type { Skill } from './types';

const STORAGE_KEY = 'genius-engine-custom-skills';

export function getCustomSkills(): Skill[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCustomSkill(skill: Omit<Skill, 'id' | 'isCustom'>): Skill {
  const skills = getCustomSkills();
  const newSkill: Skill = {
    ...skill,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    isCustom: true,
  };
  skills.push(newSkill);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  return newSkill;
}

export function removeCustomSkill(id: string): void {
  const skills = getCustomSkills().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

export function updateCustomSkill(id: string, updates: Partial<Skill>): void {
  const skills = getCustomSkills().map(s => s.id === id ? { ...s, ...updates } : s);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}
