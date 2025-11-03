import { categories } from '../utills/data';

interface QuestionScreenProps {
  question: string;
  category: string;
  onQuestionChange: (question: string) => void;
  onCategoryChange: (category: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionScreen({
  question,
  category,
  onQuestionChange,
  onCategoryChange,
  onBack,
  onNext
}: QuestionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 py-12"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div className="max-w-3xl mx-auto"
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
        }}>
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-8">
          무엇이 궁금하신가요?
        </h2>

        {/* 카테고리 선택 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p className="text-purple-200 mb-4 text-center">질문 카테고리를 선택하세요</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`${category === cat.id ? cat.color : 'bg-white/20'} p-4 rounded-xl hover:scale-105 transform transition`
                } style={{ padding: '1rem', cursor: "pointer" }}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-white text-sm font-medium">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 질문 입력 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6" style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <textarea
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="예: 이직을 해야 할까요? / 나의 연애운이 궁금해요"
            className="w-full bg-white/20 text-white placeholder-purple-300 rounded-xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ padding: '1rem' }} />

          <div className="mt-4 flex flex-wrap gap-2" style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <span className="text-purple-300 text-sm">예시:</span>
            {['이직을 해야 할까요?', '나의 연애운은?', '이번 달 재물운은?'].map(example => (
              <button
                key={example}
                onClick={() => onQuestionChange(example)}
                className="text-xs bg-white/20 text-purple-200 px-3 py-1 rounded-full hover:bg-white/30"
                style={{ padding: '1rem', cursor: "pointer" }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30" 
            style={{ padding: '1rem', cursor: "pointer" }}
          >
            이전
          </button>
          <button
            onClick={onNext}
            disabled={!question.trim()}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '1rem', cursor: "pointer" }}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
