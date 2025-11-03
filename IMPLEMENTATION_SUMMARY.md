# 🔗 Frontend-Backend API 연동 완료

## ✅ 구현 완료 항목

### 1. **API 서비스 파일 생성** (`frontend/src/utills/api.ts`)
- `fetchTarotInterpretation()`: Backend `/api/interpret` 엔드포인트 호출
- `checkServerHealth()`: Backend 서버 상태 확인
- TypeScript 타입 정의 포함
- 에러 처리 로직 구현

### 2. **Tarot 컴포넌트 수정** (`frontend/src/components/Tarot.tsx`)
- `generateInterpretation()` 함수를 async/await로 변경
- API 호출 후 응답을 상태에 저장
- **Fallback 메커니즘**: API 실패 시 로컬 해석 함수 사용
- 선택된 카드 이름을 배열로 변환하여 전송

### 3. **환경 변수 설정**
- `.env` 파일: `VITE_API_BASE_URL=http://localhost:8000`
- `.env.example` 파일: 템플릿 제공
- Vite 환경변수 규칙 준수 (`VITE_` 접두사)

### 4. **Vite 프록시 설정** (`vite.config.ts`)
- `/api` 경로를 `http://localhost:8000`으로 프록시
- CORS 문제 해결
- 개발 환경에서 편리한 API 호출

### 5. **문서화**
- `API_INTEGRATION.md`: 상세한 연동 가이드
- `test_api.sh`: API 테스트 스크립트

## 📡 API 호출 흐름

```
사용자 카드 선택
      ↓
Tarot.tsx: generateInterpretation()
      ↓
api.ts: fetchTarotInterpretation()
      ↓
POST /api/interpret
{
  question: "이직을 해야 할까요?",
  cards: ["바보", "마법사", "여사제"]
}
      ↓
Backend FastAPI 처리
      ↓
Response
{
  interpretation: "카드 해석...",
  advice: "조언..."
}
      ↓
Frontend 상태 업데이트 & 화면 표시
```

## 🔑 핵심 코드

### API 호출 함수
```typescript
// frontend/src/utills/api.ts
export const fetchTarotInterpretation = async (
  question: string,
  cards: string[]
): Promise<TarotApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, cards }),
  });
  return await response.json();
};
```

### 컴포넌트에서 사용
```typescript
// frontend/src/components/Tarot.tsx
const generateInterpretation = async () => {
  try {
    const cardNames = selectedCards.map(card => card.name);
    const result = await fetchTarotInterpretation(question, cardNames);
    setInterpretation(`${result.interpretation}\n\n💫 **조언**\n${result.advice}`);
  } catch (error) {
    // Fallback to local interpretation
    const interp = generateCardInterpretation(selectedCards, spreadType, question);
    setInterpretation(interp);
  }
};
```

## 🚀 실행 방법

### 1. Backend 서버 실행
```bash
cd backend
python main.py
# 서버: http://localhost:8000
```

### 2. Frontend 개발 서버 실행
```bash
cd frontend
npm run dev
# 클라이언트: http://localhost:5173
```

### 3. 테스트
```bash
# API 직접 테스트
bash test_api.sh

# 또는 curl로 직접
curl -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{"question": "테스트", "cards": ["바보", "마법사"]}'
```

## 🎯 특징

### ✨ Fallback 메커니즘
API 호출 실패 시 자동으로 로컬 해석 함수(`generateCardInterpretation`)로 전환되어 사용자 경험이 중단되지 않습니다.

### 🔒 타입 안정성
TypeScript를 사용하여 API 요청/응답 타입을 명확히 정의했습니다.

### 🛠️ 개발 편의성
Vite 프록시를 통해 CORS 없이 개발 가능하며, 환경변수로 쉽게 API URL 변경 가능합니다.

### 📊 에러 처리
- 네트워크 오류 처리
- HTTP 상태 코드 확인
- 콘솔 로그를 통한 디버깅
- 사용자에게 자연스러운 fallback 제공

## 📝 다음 단계

- [ ] Backend에 실제 EEVE 모델 또는 OpenAI API 연동
- [ ] 로딩 상태 UI 개선 (스켈레톤, 프로그레스 바)
- [ ] 에러 메시지를 사용자에게 친화적으로 표시
- [ ] API 응답 캐싱 구현
- [ ] 타임아웃 및 재시도 로직 추가
- [ ] 성능 모니터링 및 로깅

## 📂 생성/수정된 파일

```
frontend/
  ├── src/
  │   ├── utills/
  │   │   └── api.ts                    ✨ 신규
  │   └── components/
  │       └── Tarot.tsx                 🔄 수정
  ├── .env                              ✨ 신규
  ├── .env.example                      ✨ 신규
  ├── vite.config.ts                    🔄 수정
  └── API_INTEGRATION.md                ✨ 신규

test_api.sh                             ✨ 신규
```

## 🎉 완료!

Frontend에서 Backend API를 성공적으로 호출하는 구조가 완성되었습니다.
이제 Backend에 실제 AI 모델을 연동하면 완전한 AI 타로 서비스가 완성됩니다.
