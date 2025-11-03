import { Sparkles } from 'lucide-react';
import type { TarotCard } from '../utills/types';

interface ShuffleScreenProps {
  spreadType: string;
  selectedCards: TarotCard[];
  shuffledDeck: TarotCard[];
  onCardSelect: (card: TarotCard) => void;
}

export default function ShuffleScreen({
  spreadType,
  selectedCards,
  shuffledDeck,
  onCardSelect
}: ShuffleScreenProps) {
  const requiredCards = spreadType === 'one' ? 1 : 3;
  const positions = spreadType === 'three' ? ['과거', '현재', '미래'] : ['오늘의 카드'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 py-12">
      <div className="max-w-6xl mx-auto" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-4">
          카드를 선택하세요
        </h2>
        <p className="text-center text-purple-200 mb-8">
          {selectedCards.length}/{requiredCards} - {positions[selectedCards.length] || '완료'}
        </p>

        {/* 선택된 카드 표시 */}
        {selectedCards.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {selectedCards.map((card, idx) => (
              <div key={idx} className="bg-gradient-to-br from-yellow-400 to-pink-500 rounded-xl p-4 w-32 text-center" style={
                {
                  padding: '1rem'
                }
              }>
                <div className="text-4xl mb-2">{card.emoji}</div>
                <div className="text-white font-bold text-sm">{card.name}</div>
                <div className="text-white/80 text-xs">{positions[idx]}</div>
              </div>
            ))}
          </div>
        )}

        {/* 카드 덱 */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
          {shuffledDeck.slice(0, 21).map((card, idx) => (
            <button
              key={idx}
              onClick={() => onCardSelect(card)}
              disabled={selectedCards.length >= requiredCards}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 hover:scale-110 hover:rotate-3 transform transition disabled:opacity-50 disabled:cursor-not-allowed aspect-[2/3] flex items-center justify-center"
              style={{ cursor: 'pointer', padding: '1rem' }}>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
