
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface LoveLetterConfig {
  name: string;
  tone: 'sweet' | 'funny' | 'poetic' | 'sincere';
  relationship: string;
}
