export type MindsetCategory = 'Creative' | 'Business' | 'Technical' | 'Professional' | 'Content' | 'Specialized';

export interface Suggestion {
  term: string;
  desc: string;
}

export interface Mindset {
  name: string;
  icon: string;
  category: MindsetCategory;
  description: string;
  suggestions: Suggestion[];
}

export interface Mindsets {
  [key: string]: Mindset;
}

export interface SavedItem {
  id: number;
  name: string;
  mindset: string;
  date: string;
  score: number;
  content?: string;
  createdAt?: number;
}

export interface QuickTemplate {
  id: number;
  name: string;
  category: string;
}

export type AppView = 'home' | 'input' | 'loading' | 'output' | 'library';

export interface AppState {
  view: AppView;
  inputText: string;
  selectedMindset: string | null;
  showMindsetDropdown: boolean;
  showInstructions: boolean;
  sidebarCollapsed: boolean;
  copied: boolean;
  showDetails: boolean;
  generatedPrompt: string;
}
