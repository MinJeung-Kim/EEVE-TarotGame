import { useState, useEffect } from 'react';
import { Sparkles, Moon, Star, RotateCcw, Save, MessageCircle } from 'lucide-react';
import type { TarotCard, ChatMessage, Stage } from '../utills/types';
import { categories, spreadTypes, tarotCards } from '../utills/data';
 
export default function TarotGame() {
   
  const [stage, setStage] = useState<Stage>('welcome'); // welcome, question, spread, shuffle, result
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [spreadType, setSpreadType] = useState('');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // 카드 섞기
  const shuffleDeck = () => {
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
  };

  // 카드 선택
  const selectCard = (card: TarotCard) => {
    if (selectedCards.length < (spreadType === 'one' ? 1 : 3)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  // AI 해석 생성 (시뮬레이션)
  const generateInterpretation = () => {
    setIsGenerating(true);
    setStage('result');

    setTimeout(() => {
      let interp = '';

      if (spreadType === 'one') {
        const card = selectedCards[0];
        interp = `🔮 **${card.name} (${card.nameEn})**\n\n`;
        interp += `**핵심 키워드**: ${card.keywords.join(', ')}\n\n`;
        interp += `당신의 질문 "${question}"에 대해 ${card.name} 카드가 나왔습니다.\n\n`;

        if (card.id === 0) {
          interp += `새로운 시작의 에너지가 가득합니다. 두려워하지 말고 용기있게 첫 걸음을 내디뎌보세요. 완벽하지 않아도 괜찮습니다. 지금이 바로 변화의 시점입니다.`;
        } else if (card.id === 19) {
          interp += `매우 긍정적인 신호입니다! 당신이 걱정하던 일들이 좋은 방향으로 해결될 것입니다. 자신감을 가지고 밝은 미래를 향해 나아가세요.`;
        } else if (card.id === 6) {
          interp += `중요한 선택의 순간입니다. 당신의 마음이 이끄는 방향을 따르세요. 진정한 사랑과 조화는 마음의 소리에 귀 기울일 때 찾아옵니다.`;
        } else if (card.id === 10) {
          interp += `인생의 큰 전환점이 다가오고 있습니다. 변화를 두려워하지 마세요. 우주의 흐름에 몸을 맡기면 좋은 기회가 찾아올 것입니다.`;
        } else {
          interp += `${card.keywords[0]}의 에너지가 강하게 나타나고 있습니다. 이 카드는 당신에게 ${card.keywords[1]}에 집중할 것을 권유합니다. 지금은 ${card.keywords[2]}가 필요한 시기입니다.`;
        }

        interp += `\n\n✨ **오늘의 조언**: 작은 변화라도 시작해보세요. 당신의 직관을 믿으세요.`;

      } else {
        const [past, present, future] = selectedCards;
        interp = `🔮 **쓰리 카드 리딩**\n\n`;
        interp += `**질문**: ${question}\n\n`;
        interp += `━━━━━━━━━━━━━━━━\n\n`;
        interp += `🕰️ **과거 (${past.name})**\n`;
        interp += `${past.keywords.join(', ')}\n\n`;
        interp += `과거에 ${past.keywords[0]}의 경험을 하셨군요. 이것이 현재 상황의 배경이 되고 있습니다.\n\n`;

        interp += `⏰ **현재 (${present.name})**\n`;
        interp += `${present.keywords.join(', ')}\n\n`;
        interp += `지금 당신은 ${present.keywords[0]}의 에너지 속에 있습니다. ${present.keywords[1]}이/가 중요한 시기입니다.\n\n`;

        interp += `🌅 **미래 (${future.name})**\n`;
        interp += `${future.keywords.join(', ')}\n\n`;

        if (future.id === 19 || future.id === 17 || future.id === 21) {
          interp += `매우 긍정적인 미래가 보입니다! ${future.keywords[0]}의 에너지가 당신을 기다리고 있습니다. 현재의 노력이 결실을 맺을 것입니다.`;
        } else if (future.id === 13 || future.id === 16) {
          interp += `큰 변화가 예상됩니다. 두려워 보일 수 있지만, 이는 새로운 시작을 위한 과정입니다. 변화를 받아들이는 용기가 필요합니다.`;
        } else {
          interp += `${future.keywords[0]}의 가능성이 보입니다. 지금의 선택이 미래를 결정할 것입니다.`;
        }

        interp += `\n\n━━━━━━━━━━━━━━━━\n\n`;
        interp += `💫 **종합 조언**\n\n`;
        interp += `과거의 ${past.keywords[0]}에서 벗어나, 현재 ${present.keywords[0]}에 집중하세요. 그러면 미래의 ${future.keywords[0]}이 당신을 기다리고 있을 것입니다. 우주는 항상 당신을 응원합니다.`;
      }

      setInterpretation(interp);
      setIsGenerating(false);
    }, 2000);
  };

  // 카드가 모두 선택되면 자동으로 해석 생성
  useEffect(() => {
    const requiredCards = spreadType === 'one' ? 1 : 3;
    if (selectedCards.length === requiredCards && stage === 'shuffle') {
      generateInterpretation();
    }
  }, [selectedCards, spreadType, stage]);

  // 새로운 리딩 시작
  const resetReading = () => {
    setStage('welcome');
    setQuestion('');
    setCategory('');
    setSpreadType('');
    setSelectedCards([]);
    setShuffledDeck([]);
    setInterpretation('');
    setFollowUpQuestion('');
    setChatHistory([]);
  };

  // 추가 질문 처리
  const handleFollowUp = () => {
    if (!followUpQuestion.trim()) return;

    const newChat: ChatMessage[] = [...chatHistory, {
      type: 'user' as const,
      content: followUpQuestion
    }];

    setChatHistory(newChat);
    setIsGenerating(true);

    setTimeout(() => {
      const response = `${followUpQuestion}에 대해 답변드리자면, 앞서 뽑으신 카드들이 보여주는 메시지를 좀 더 구체적으로 설명해드릴게요.\n\n선택된 카드 ${selectedCards.map(c => c.name).join(', ')}는 서로 조화를 이루며 당신의 상황을 말해주고 있습니다. 카드가 전하는 메시지를 마음 깊이 받아들이시고, 작은 실천부터 시작해보세요. 🌟`;

      setChatHistory([...newChat, {
        type: 'ai' as const,
        content: response
      }]);
      setFollowUpQuestion('');
      setIsGenerating(false);
    }, 1500);
  };

  // Welcome 화면
  if (stage === 'welcome') {
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
            onClick={() => setStage('question')}
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

  // 질문 입력 화면
  if (stage === 'question') {
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
                  onClick={() => setCategory(cat.id)}
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
              onChange={(e) => setQuestion(e.target.value)}
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
                  onClick={() => setQuestion(example)}
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
              onClick={() => setStage('welcome')}
              className="flex-1 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30" style={{ padding: '1rem', cursor: "pointer" }}
            >
              이전
            </button>
            <button
              onClick={() => {
                if (question.trim()) {
                  setStage('spread');
                }
              }}
              disabled={!question.trim()}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '1rem', cursor: "pointer" }} >
              다음
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 스프레드 선택 화면
  if (stage === 'spread') {
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
                onClick={() => {
                  setSpreadType(spread.id);
                  shuffleDeck();
                  setStage('shuffle');
                }}
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
            onClick={() => setStage('question')}
            className="w-full bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30"
            style={{ cursor: 'pointer', padding: '1rem' }}
          >
            이전
          </button>
        </div>
      </div>
    );
  }

  // 카드 선택 화면
  if (stage === 'shuffle') {
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
                onClick={() => selectCard(card)}
                disabled={selectedCards.length >= requiredCards}
                className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 hover:scale-110 hover:rotate-3 transform transition disabled:opacity-50 disabled:cursor-not-allowed aspect-[2/3] flex items-center justify-center"
                style={{ cursor: 'pointer', padding: '1rem' }} >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (stage === 'result') {
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
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFollowUp()}
                    placeholder="더 궁금한 게 있으신가요?"
                    className="flex-1 bg-white/20 text-white placeholder-purple-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    disabled={isGenerating}
                    style={{ padding: '1rem' }}
                  />
                  <button
                    onClick={handleFollowUp}
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
                  onClick={resetReading}
                  className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30"
                  style={{ cursor: "pointer", padding: '1rem' }}
                >
                  <RotateCcw className="w-5 h-5" />
                  새로운 리딩
                </button>
                <button
                  onClick={() => alert('결과가 저장되었습니다! (데모 버전)')}
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

  return null;
}; 