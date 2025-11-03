import { Sparkles, RotateCcw, Save, MessageCircle } from 'lucide-react';
import type { TarotCard, ChatMessage } from '../utills/types';

interface ResultScreenProps {
  spreadType: string;
  selectedCards: TarotCard[];
  interpretation: string;
  isGenerating: boolean;
  followUpQuestion: string;
  chatHistory: ChatMessage[];
  onFollowUpQuestionChange: (question: string) => void;
  onFollowUpSubmit: () => void;
  onReset: () => void;
  onSave: () => void;
}

export default function ResultScreen({
  spreadType,
  selectedCards,
  interpretation,
  isGenerating,
  followUpQuestion,
  chatHistory,
  onFollowUpQuestionChange,
  onFollowUpSubmit,
  onReset,
  onSave
}: ResultScreenProps) {
  const positions = spreadType === 'three' ? ['과거', '현재', '미래'] : ['오늘의 카드'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 py-12"
      style={{
        display: 'flex',
        justifyContent: 'center', padding: '1rem'
      }}>
      <div className="max-w-4xl mx-auto" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-8">
          카드 해석
        </h2>

        {/* 선택된 카드들 */}
        <div className="flex justify-center gap-4 mb-8" style={{ padding: '1rem' }}>
          {selectedCards.map((card, idx) => (
            <div key={idx}
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  padding: '1rem',
                }
              }
              className="bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl p-6 w-40 text-center transform hover:scale-105 transition">
              <div className="text-6xl mb-3">{card.emoji}</div>
              <div className="text-white font-bold mb-1">{card.name}</div>
              <div className="text-white/90 text-sm mb-2">{card.nameEn}</div>
              <div className="text-white/80 text-xs font-semibold">{positions[idx]}</div>
            </div>
          ))}
        </div>

        {/* AI 해석 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8" style={{ padding: '1rem' }}>
          {isGenerating ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto text-yellow-300 animate-spin mb-4" />
              <p className="text-purple-200">AI가 카드를 해석하고 있습니다...</p>
            </div>
          ) : (
            <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">
              {interpretation}
            </div>
          )}
        </div>

        {/* 추가 질문 섹션 */}
        {!isGenerating && (
          <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
            }}>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-yellow-300" />
                <h3 className="text-xl font-bold text-yellow-300">추가 질문하기</h3>
              </div>

              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`mb-4 ${chat.type === 'user' ? 'text-right' : 'text-left'}`}
                  style={{
                    background: 'none',
                    textAlign: 'left',
                    width: '100%',
                  }}>
                  <div className={`inline-block px-4 py-2 rounded-2xl 
                    ${chat.type === 'user' ? 'bg-purple-500 text-white' : 'bg-white/20 text-purple-100'}`}
                    style={{
                      padding: '1rem'

                    }}>
                    {chat.content}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={followUpQuestion}
                  onChange={(e) => onFollowUpQuestionChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onFollowUpSubmit()}
                  placeholder="더 궁금한 게 있으신가요?"
                  className="flex-1 bg-white/20 text-white placeholder-purple-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={isGenerating}
                  style={{ padding: '1rem' }}
                />
                <button
                  onClick={onFollowUpSubmit}
                  disabled={isGenerating || !followUpQuestion.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:scale-105 transform transition disabled:opacity-50"
                  style={{ cursor: "pointer", padding: '1rem' }}>
                  전송
                </button>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30"
                style={{ cursor: "pointer", padding: '1rem' }}
              >
                <RotateCcw className="w-5 h-5" />
                새로운 리딩
              </button>
              <button
                onClick={onSave}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full hover:scale-105 transform transition"
                style={{ cursor: "pointer", padding: '1rem' }}>
                <Save className="w-5 h-5" />
                결과 저장
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
