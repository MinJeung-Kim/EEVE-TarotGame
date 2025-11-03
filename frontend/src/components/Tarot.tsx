import { useState, useEffect } from 'react';
import type { TarotCard, ChatMessage, Stage } from '../utills/types';
import { tarotCards } from '../utills/data';
import { generateCardInterpretation, generateFollowUpResponse } from '../utills/interpretations';
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

  // AI 해석 생성
  const generateInterpretation = () => {
    setIsGenerating(true);
    setStage('result');

    setTimeout(() => {
      const interp = generateCardInterpretation(selectedCards, spreadType, question);
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
      const response = generateFollowUpResponse(followUpQuestion, selectedCards);

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