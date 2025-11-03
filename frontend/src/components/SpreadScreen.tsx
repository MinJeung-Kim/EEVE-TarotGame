import { spreadTypes } from '../utills/data';

interface SpreadScreenProps {
  question: string;
  onSpreadSelect: (spreadType: string) => void;
  onBack: () => void;
}

export default function SpreadScreen({ question, onSpreadSelect, onBack }: SpreadScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 py-12"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div className="max-w-4xl mx-auto" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '3rem',
      }}>
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-4">
          스프레드를 선택하세요
        </h2>
        <p className="text-center text-purple-200 mb-12">
          "{question}"
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {spreadTypes.map(spread => (
            <button
              key={spread.id}
              onClick={() => onSpreadSelect(spread.id)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 hover:scale-105 transform transition"
              style={{
                padding: '1rem', cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div className="text-5xl mb-4">
                {spread.id === 'one' ? '🃏' : '🎴'}
              </div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                {spread.name}
              </h3>
              <p className="text-purple-200 mb-4">{spread.description}</p>
              <p className="text-sm text-purple-300">
                {spread.cards}장의 카드
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="w-full bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30"
          style={{ cursor: 'pointer', padding: '1rem' }}
        >
          이전
        </button>
      </div>
    </div>
  );
}
