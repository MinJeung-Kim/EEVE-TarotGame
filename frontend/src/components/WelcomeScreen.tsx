import { Sparkles, Moon, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div className="text-center max-w-2xl" style={{
        display: "flex", flexDirection: "column", gap: "2rem", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"
      }}>
        <div className="mb-8 relative" style={{ width: "50%" }}>
          <Sparkles className="w-20 h-20 mx-auto text-yellow-300 animate-pulse" />
          <Moon className="w-12 h-12 absolute top-0 right-1/3 text-purple-300 animate-bounce" />
          <Star className="w-8 h-8 absolute bottom-0 left-1/3 text-blue-300 animate-pulse" />
        </div>

        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4">
          EEVE Tarot
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          AI가 전하는 우주의 메시지
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <p className="text-purple-100 text-lg leading-relaxed" style={{
            padding: "1rem"
          }}>
            타로는 우주의 에너지를 읽어내는 신비로운 도구입니다.<br />
            마음을 열고 질문을 던져보세요.<br />
            카드가 당신에게 필요한 답을 전해줄 것입니다. 🔮
          </p>
        </div>

        <button
          onClick={onStart}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition shadow-lg hover:shadow-pink-500/50"
          style={{
            padding: "1rem", cursor: "pointer"
          }}>
          시작하기 ✨
        </button>
      </div>
    </div>
  );
}
