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
<<<<<<< HEAD
  tags?: string[];
  starred?: boolean;
=======
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
}

export interface QuickTemplate {
  id: number;
  name: string;
  category: string;
}

<<<<<<< HEAD
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  mindset: string;
  prompt: string;
}

=======
>>>>>>> bd96a7fcc085d5571fb240769e6fb0a4c515ea7d
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
