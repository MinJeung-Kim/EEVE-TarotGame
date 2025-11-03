import type { TarotCard, Category, SpreadType } from './types';

// 타로 카드 데이터 (Major Arcana 22장)
export const tarotCards: TarotCard[] = [
  { id: 0, name: "바보", nameEn: "The Fool", keywords: ["새로운 시작", "순수함", "모험"], emoji: "🃏" },
  { id: 1, name: "마법사", nameEn: "The Magician", keywords: ["창조", "의지", "기술"], emoji: "🎩" },
  { id: 2, name: "여사제", nameEn: "The High Priestess", keywords: ["직관", "신비", "무의식"], emoji: "🔮" },
  { id: 3, name: "여황제", nameEn: "The Empress", keywords: ["풍요", "양육", "창조성"], emoji: "👑" },
  { id: 4, name: "황제", nameEn: "The Emperor", keywords: ["권위", "구조", "안정"], emoji: "⚜️" },
  { id: 5, name: "교황", nameEn: "The Hierophant", keywords: ["전통", "지혜", "영적 지도"], emoji: "📿" },
  { id: 6, name: "연인", nameEn: "The Lovers", keywords: ["사랑", "선택", "조화"], emoji: "💕" },
  { id: 7, name: "전차", nameEn: "The Chariot", keywords: ["승리", "의지", "전진"], emoji: "🏇" },
  { id: 8, name: "힘", nameEn: "Strength", keywords: ["용기", "인내", "자제력"], emoji: "🦁" },
  { id: 9, name: "은둔자", nameEn: "The Hermit", keywords: ["성찰", "고독", "내면의 지혜"], emoji: "🕯️" },
  { id: 10, name: "운명의 수레바퀴", nameEn: "Wheel of Fortune", keywords: ["변화", "운명", "순환"], emoji: "🎡" },
  { id: 11, name: "정의", nameEn: "Justice", keywords: ["공정", "진실", "균형"], emoji: "⚖️" },
  { id: 12, name: "매달린 사람", nameEn: "The Hanged Man", keywords: ["희생", "새로운 관점", "정체"], emoji: "🙃" },
  { id: 13, name: "죽음", nameEn: "Death", keywords: ["변화", "종결", "재탄생"], emoji: "💀" },
  { id: 14, name: "절제", nameEn: "Temperance", keywords: ["균형", "조화", "인내"], emoji: "🧘" },
  { id: 15, name: "악마", nameEn: "The Devil", keywords: ["속박", "유혹", "물질"], emoji: "😈" },
  { id: 16, name: "탑", nameEn: "The Tower", keywords: ["파괴", "계시", "해방"], emoji: "🗼" },
  { id: 17, name: "별", nameEn: "The Star", keywords: ["희망", "영감", "치유"], emoji: "⭐" },
  { id: 18, name: "달", nameEn: "The Moon", keywords: ["환상", "불안", "무의식"], emoji: "🌙" },
  { id: 19, name: "태양", nameEn: "The Sun", keywords: ["성공", "기쁨", "긍정"], emoji: "☀️" },
  { id: 20, name: "심판", nameEn: "Judgement", keywords: ["깨달음", "재생", "결정"], emoji: "📯" },
  { id: 21, name: "세계", nameEn: "The World", keywords: ["완성", "성취", "통합"], emoji: "🌍" }
];

// 질문 카테고리
export const categories: Category[] = [
  { id: 'love', name: '연애/관계', icon: '💕', color: 'bg-pink-500' },
  { id: 'career', name: '직업/진로', icon: '💼', color: 'bg-blue-500' },
  { id: 'money', name: '재물/금전', icon: '💰', color: 'bg-yellow-500' },
  { id: 'health', name: '건강', icon: '🏥', color: 'bg-green-500' },
  { id: 'general', name: '일반 운세', icon: '🎯', color: 'bg-purple-500' }
];

// 스프레드 타입
export const spreadTypes: SpreadType[] = [
  { id: 'one', name: '원 카드', description: '오늘의 메시지', cards: 1 },
  { id: 'three', name: '쓰리 카드', description: '과거-현재-미래', cards: 3 }
];
