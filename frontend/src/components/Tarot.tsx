import { useState, useEffect } from 'react';
import { tarotCards } from '../utills/data';
import type { TarotCard, ChatMessage, Stage } from '../utills/types';
import { generateCardInterpretation, generateFollowUpResponse } from '../utills/interpretations';
import { fetchTarotInterpretation } from '../utills/api';
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

  // AI 해석 생성 (Backend API 호출)
  const generateInterpretation = async () => {
    setIsGenerating(true);
    setStage('result');

    try {
      // 선택된 카드 이름 배열 생성
      const cardNames = selectedCards.map(card => card.name);
      
      console.log('🎴 카드 해석 요청:', { question, cardNames });
      
      // Backend API 호출
      const result = await fetchTarotInterpretation(question, cardNames);
      
      // API 응답을 해석 텍스트로 조합
      const fullInterpretation = `${result.interpretation}\n\n💫 **조언**\n${result.advice}`;
      setInterpretation(fullInterpretation);
      console.log('✅ Backend API로부터 해석을 받았습니다.');
    } catch (error) {
      console.warn('⚠️ Backend API 호출 실패, 로컬 해석을 사용합니다:', error);
      console.info('💡 Tip: Backend 서버를 실행하려면 "cd backend && python main.py" 명령어를 사용하세요.');
      
      // API 실패 시 로컬 해석 사용 (fallback)
      const interp = generateCardInterpretation(selectedCards, spreadType, question);
      const fallbackMessage = '\n\n---\n\n⚠️ *현재 로컬 해석 모드로 실행 중입니다. Backend 서버를 실행하면 AI 기반 해석을 받을 수 있습니다.*';
      setInterpretation(interp + fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
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
  const handleFollowUp = async () => {
    if (!followUpQuestion.trim()) return;

    const newChat: ChatMessage[] = [...chatHistory, {
      type: 'user' as const,
      content: followUpQuestion
    }];

    setChatHistory(newChat);
    setIsGenerating(true);

    try {
      const response = await generateFollowUpResponse(followUpQuestion, selectedCards);

      setChatHistory([...newChat, {
        type: 'ai' as const,
        content: response
      }]);
      setFollowUpQuestion('');
    } catch (error) {
      console.error('추가 질문 처리 중 오류:', error);
      setChatHistory([...newChat, {
        type: 'ai' as const,
        content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.'
      }]);
    } finally {
      setIsGenerating(false);
    }
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