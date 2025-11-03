// API 설정 및 타입 정의
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface TarotApiRequest {
  question: string;
  cards: string[];
}

interface TarotApiResponse {
  interpretation: string;
  advice: string;
}

/**
 * Backend API로 타로 카드 해석 요청
 * @param question 사용자의 질문
 * @param cards 선택된 카드 이름 배열
 * @returns 해석 결과
 */
export const fetchTarotInterpretation = async (
  question: string,
  cards: string[]
): Promise<TarotApiResponse> => {
  try {
    console.log('🔮 API 호출 시작:', { API_BASE_URL, question, cards });
    
    const response = await fetch(`${API_BASE_URL}/api/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        cards,
      } as TarotApiRequest),
    });

    console.log('📡 API 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: TarotApiResponse = await response.json();
    console.log('✅ API 응답 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 타로 해석 API 호출 중 오류:', error);
    console.error('💡 Backend 서버가 실행 중인지 확인하세요: http://localhost:8000/health');
    throw error;
  }
};

/**
 * 서버 상태 확인
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('서버 연결 실패:', error);
    return false;
  }
};

/**
 * 추가 질문에 대한 AI 응답 요청
 * @param question 사용자의 추가 질문
 * @param cards 이전에 선택된 카드 이름 배열
 * @returns AI가 생성한 응답
 */
export const fetchFollowUpResponse = async (
  question: string,
  cards: string[]
): Promise<string> => {
  try {
    console.log('🔮 추가 질문 API 호출:', { question, cards });
    
    const response = await fetch(`${API_BASE_URL}/api/followup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        cards,
      }),
    });

    console.log('📡 추가 질문 API 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ 추가 질문 API 응답 성공:', data);
    return data.response;
  } catch (error) {
    console.error('❌ 추가 질문 API 호출 중 오류:', error);
    throw error;
  }
};
