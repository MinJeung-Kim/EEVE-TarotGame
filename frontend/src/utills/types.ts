// 타입 정의
export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  keywords: string[];
  emoji: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SpreadType {
  id: string;
  name: string;
  description: string;
  cards: number;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

export type Stage = 'welcome' | 'question' | 'spread' | 'shuffle' | 'result';
