import type { Skill } from './types';

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function exportSkillAsMd(skill: Pick<Skill, 'name' | 'description' | 'instruction' | 'category'>): void {
  const filename = `${toKebabCase(skill.name)}.md`;
  const content = `---
description: ${skill.description || skill.instruction.slice(0, 80)}
---

${skill.instruction}
`;

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
