# Frontend-Backend 통신 구조도

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│                     http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App.tsx                                                  │  │
│  │    └── Tarot.tsx (Main Component)                        │  │
│  │         ├── WelcomeScreen                                │  │
│  │         ├── QuestionScreen                               │  │
│  │         ├── SpreadScreen                                 │  │
│  │         ├── ShuffleScreen                                │  │
│  │         └── ResultScreen                                 │  │
│  │                                                           │  │
│  │         [generateInterpretation() 호출]                  │  │
│  │                    ↓                                      │  │
│  │         const cardNames = selectedCards.map(c => c.name) │  │
│  │                    ↓                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                      ↓                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  api.ts (API Service Layer)                              │  │
│  │                                                           │  │
│  │  fetchTarotInterpretation(question, cards)               │  │
│  │    ↓                                                      │  │
│  │  fetch(`${API_BASE_URL}/api/interpret`, {                │  │
│  │    method: 'POST',                                        │  │
│  │    body: JSON.stringify({ question, cards })             │  │
│  │  })                                                       │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                      ↓                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       │ HTTP POST /api/interpret
                       │ Content-Type: application/json
                       │ Body: { question, cards: [...] }
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                           │
│                   http://localhost:8000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  main.py                                                  │  │
│  │                                                           │  │
│  │  @app.post("/api/interpret")                             │  │
│  │  async def interpret_tarot(request: TarotRequest):       │  │
│  │      ├── request.question (str)                          │  │
│  │      └── request.cards (List[str])                       │  │
│  │                                                           │  │
│  │      [TODO: EEVE 모델 / OpenAI API 연동]                │  │
│  │                                                           │  │
│  │      return TarotResponse(                               │  │
│  │          interpretation: str,                            │  │
│  │          advice: str                                     │  │
│  │      )                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                      ↓                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       │ HTTP Response 200 OK
                       │ { interpretation, advice }
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tarot.tsx                                                │  │
│  │                                                           │  │
│  │  const result = await fetchTarotInterpretation(...)      │  │
│  │  setInterpretation(result.interpretation + advice)       │  │
│  │                                                           │  │
│  │  [에러 발생 시]                                          │  │
│  │  catch (error) {                                         │  │
│  │    // Fallback: 로컬 해석 사용                          │  │
│  │    const interp = generateCardInterpretation(...)        │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                      ↓                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ResultScreen.tsx                                         │  │
│  │                                                           │  │
│  │  [해석 결과 표시]                                        │  │
│  │  - 선택된 카드들                                         │  │
│  │  - AI 해석 내용                                          │  │
│  │  - 조언                                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 환경 설정

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Vite Proxy (vite.config.ts)
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

### Backend (main.py)
```python
# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 데이터 흐름 예시

### Request Example
```json
POST /api/interpret

{
  "question": "이직을 해야 할까요?",
  "cards": ["바보", "마법사", "여사제"]
}
```

### Response Example
```json
{
  "interpretation": "당신의 질문: \"이직을 해야 할까요?\"\n\n선택하신 카드는 바보, 마법사, 여사제입니다.\n\n...",
  "advice": "긍정적인 마음가짐을 유지하시고, 현재 상황을 차근차근 해결해 나가시길 바랍니다."
}
```

## 에러 처리 흐름

```
API 호출 시도
    ↓
[성공] → 결과 표시
    ↓
[실패] → catch (error)
    ↓
로컬 해석 함수 실행 (Fallback)
    ↓
결과 표시 (사용자는 에러를 인지하지 못함)
```
