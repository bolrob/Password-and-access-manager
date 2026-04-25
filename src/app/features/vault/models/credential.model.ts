export interface Credential {
  id: string;
  ownerId: string;
  name: string;
  login: string;
  password: string;
  url?: string;
  category: 'work' | 'personal' | 'finance' | 'social' | 'other';
  tags: string[];
  strength: number;
  lastModified: string;
  remindAfterDays?: number;
  isExpired: boolean;
  history: { date: string; passwordHash: string }[];
}