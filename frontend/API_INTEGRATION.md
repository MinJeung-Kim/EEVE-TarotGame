# Frontend - Backend API 연동 가이드

## 📌 개요

Frontend에서 Backend의 `/api/interpret` 엔드포인트를 호출하여 타로 카드 해석을 받아옵니다.

## 🔧 구현 파일

### 1. `src/utills/api.ts` (신규)
- Backend API 호출 함수 정의
- `fetchTarotInterpretation()`: 타로 해석 요청
- `checkServerHealth()`: 서버 상태 확인

### 2. `src/components/Tarot.tsx` (수정)
- `generateInterpretation()` 함수를 async/await로 변경
- API 호출 후 응답을 상태에 저장
- API 실패 시 로컬 해석으로 fallback

### 3. `.env` (신규)
- Backend API URL 설정
- `VITE_API_BASE_URL=http://localhost:8000`

### 4. `vite.config.ts` (수정)
- `/api` 경로를 Backend 서버로 프록시 설정

## 🚀 실행 방법

### 1. Backend 서버 실행
```bash
cd backend
python main.py
```
서버: http://localhost:8000

### 2. Frontend 개발 서버 실행
```bash
cd frontend
npm run dev
```
클라이언트: http://localhost:5173

## 📡 API 호출 흐름

1. 사용자가 카드 선택 완료
2. `Tarot.tsx`의 `generateInterpretation()` 호출
3. `api.ts`의 `fetchTarotInterpretation()` 실행
4. Backend `/api/interpret` POST 요청
5. 응답 받아서 화면에 표시
6. 에러 발생 시 로컬 해석 사용 (fallback)

## 🔍 API 스펙

### Request
```typescript
POST /api/interpret
Content-Type: application/json

{
  "question": "이직을 해야 할까요?",
  "cards": ["바보", "마법사", "여사제"]
}
```

### Response
```typescript
{
  "interpretation": "카드 해석 내용...",
  "advice": "조언 내용..."
}
```

## ⚙️ 환경 변수

`.env` 파일에서 Backend URL 설정:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

프로덕션 배포 시:
```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🛠️ 개발 팁

### Vite Proxy 사용
`vite.config.ts`에서 `/api` 경로를 프록시 설정했으므로:
```typescript
// 절대 경로 대신
fetch('http://localhost:8000/api/interpret')

// 상대 경로 사용 가능
fetch('/api/interpret')
```

### 에러 처리
API 호출 실패 시 자동으로 로컬 해석으로 전환됩니다.
브라우저 콘솔에서 에러 메시지 확인 가능합니다.

## 🧪 테스트

### Backend 서버 상태 확인
```bash
curl http://localhost:8000/health
```

### API 직접 테스트
```bash
curl -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "question": "테스트 질문",
    "cards": ["바보", "마법사"]
  }'
```

## 📝 다음 단계

- [ ] Backend에 실제 EEVE 모델 또는 OpenAI API 연동
- [ ] 로딩 상태 개선 (스켈레톤 UI)
- [ ] 에러 메시지 사용자에게 표시
- [ ] 타임아웃 설정 추가
- [ ] 재시도 로직 구현
