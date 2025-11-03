import { useState, useEffect } from 'react';
import type { TarotCard, ChatMessage, Stage } from '../utills/types';
import { tarotCards } from '../utills/data';
import WelcomeScreen from './WelcomeScreen';
import QuestionScreen from './QuestionScreen';
import SpreadScreen from './SpreadScreen';
import ShuffleScreen from './ShuffleScreen';
import ResultScreen from './ResultScreen';
 
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
    return <WelcomeScreen onStart={() => setStage('question')} />;
  }

  // 질문 입력 화면
  if (stage === 'question') {
    return (
      <QuestionScreen
        question={question}
        category={category}
        onQuestionChange={setQuestion}
        onCategoryChange={setCategory}
        onBack={() => setStage('welcome')}
        onNext={() => {
          if (question.trim()) {
            setStage('spread');
          }
        }}
      />
    );
  }

  // 스프레드 선택 화면
  if (stage === 'spread') {
    return (
      <SpreadScreen
        question={question}
        onSpreadSelect={(spreadId) => {
          setSpreadType(spreadId);
          shuffleDeck();
          setStage('shuffle');
        }}
        onBack={() => setStage('question')}
      />
    );
  }

  // 카드 선택 화면
  if (stage === 'shuffle') {
    return (
      <ShuffleScreen
        spreadType={spreadType}
        selectedCards={selectedCards}
        shuffledDeck={shuffledDeck}
        onCardSelect={selectCard}
      />
    );
  }

  // 결과 화면
  if (stage === 'result') {
    return (
      <ResultScreen
        spreadType={spreadType}
        selectedCards={selectedCards}
        interpretation={interpretation}
        isGenerating={isGenerating}
        followUpQuestion={followUpQuestion}
        chatHistory={chatHistory}
        onFollowUpQuestionChange={setFollowUpQuestion}
        onFollowUpSubmit={handleFollowUp}
        onReset={resetReading}
        onSave={() => alert('결과가 저장되었습니다! (데모 버전)')}
      />
    );
  }

  return null;
}; 