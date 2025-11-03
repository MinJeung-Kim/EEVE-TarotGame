# ⚠️ "Failed to fetch" 오류 해결 완료!

## 📌 문제 원인

`TypeError: Failed to fetch` 오류는 **Backend 서버가 실행되지 않아서** 발생합니다.

Frontend는 `http://localhost:8000/api/interpret`로 요청을 보내는데, Backend 서버가 없으면 연결할 수 없습니다.

---

## ✅ 해결 방법 (간단함!)

### 방법 1: 배치 파일 사용 (추천 - Windows)

프로젝트 루트 폴더에서:

1. **Backend 실행**: `start-backend.bat` 더블클릭
2. **Frontend 실행**: `start-frontend.bat` 더블클릭

두 개의 터미널 창이 열리고 각각 서버가 실행됩니다.

---

### 방법 2: 수동 실행

#### 터미널 1 - Backend 실행
```bash
cd backend
python main.py
```

**이 터미널은 닫지 마세요!**

#### 터미널 2 - Frontend 실행
```bash
cd frontend
npm run dev
```

---

## 🎯 개선 사항

코드에 다음 기능들이 추가되었습니다:

### 1. **자세한 로그 출력** (`api.ts`)
```typescript
console.log('🔮 API 호출 시작:', { API_BASE_URL, question, cards });
console.log('📡 API 응답 상태:', response.status);
console.log('✅ API 응답 성공:', data);
```

브라우저 콘솔(F12)에서 API 호출 상태를 실시간으로 확인할 수 있습니다.

### 2. **친절한 Fallback 메시지** (`Tarot.tsx`)
Backend 서버가 없어도 앱이 작동하며, 결과 화면에 다음 안내가 표시됩니다:

> ⚠️ *현재 로컬 해석 모드로 실행 중입니다. Backend 서버를 실행하면 AI 기반 해석을 받을 수 있습니다.*

### 3. **실행 스크립트** 
- `start-backend.bat`: Backend 서버 실행 (Windows)
- `start-frontend.bat`: Frontend 서버 실행 (Windows)

---

## 🧪 테스트 방법

### 1. Backend 서버 확인
```bash
curl http://localhost:8000/health
```
**예상 결과**: `{"status":"healthy"}`

### 2. API 테스트
```bash
curl -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"테스트\",\"cards\":[\"바보\",\"마법사\"]}"
```

### 3. 브라우저에서 테스트
1. http://localhost:5173 접속
2. F12 → Console 탭 열기
3. 카드 선택
4. Console에서 로그 확인:
   - Backend 정상: `✅ Backend API로부터 해석을 받았습니다.`
   - Backend 없음: `⚠️ Backend API 호출 실패, 로컬 해석을 사용합니다.`

---

## 📊 정상 작동 시나리오

```
1. Backend 서버 실행 (포트 8000)
   ↓
2. Frontend 서버 실행 (포트 5173)
   ↓
3. 브라우저에서 http://localhost:5173 접속
   ↓
4. 카드 선택
   ↓
5. Frontend → Backend API 호출
   ↓
6. Backend → 해석 결과 반환
   ↓
7. Frontend → 결과 화면에 표시 ✅
```

---

## 🔍 디버깅 팁

### Console 로그 확인

**브라우저 콘솔 (F12 → Console)**에서 다음을 확인하세요:

#### Backend 정상 작동:
```
🔮 API 호출 시작: {API_BASE_URL: "http://localhost:8000", ...}
📡 API 응답 상태: 200
✅ API 응답 성공: {interpretation: "...", advice: "..."}
✅ Backend API로부터 해석을 받았습니다.
```

#### Backend 미실행:
```
🔮 API 호출 시작: ...
❌ 타로 해석 API 호출 중 오류: TypeError: Failed to fetch
💡 Backend 서버가 실행 중인지 확인하세요: http://localhost:8000/health
⚠️ Backend API 호출 실패, 로컬 해석을 사용합니다.
💡 Tip: Backend 서버를 실행하려면 "cd backend && python main.py" 명령어를 사용하세요.
```

---

## 📝 체크리스트

실행 전 확인사항:

- [ ] Python 설치됨 (`python --version`)
- [ ] Node.js 설치됨 (`node --version`)
- [ ] Backend 패키지 설치됨 (`cd backend && pip install fastapi uvicorn pydantic`)
- [ ] Frontend 패키지 설치됨 (`cd frontend && npm install`)

실행 시 확인사항:

- [ ] Backend 서버 실행 중 (터미널 확인)
- [ ] Frontend 서버 실행 중 (터미널 확인)
- [ ] http://localhost:8000/health 응답 확인
- [ ] http://localhost:5173 페이지 열림
- [ ] 브라우저 Console에 에러 없음

---

## 🎉 해결 완료!

이제 다음과 같이 작동합니다:

1. **Backend가 실행 중**: Backend API의 해석 사용 ✅
2. **Backend가 없음**: 자동으로 로컬 해석 사용 (Fallback) ✅

두 경우 모두 앱이 정상 작동하며, 사용자에게 명확한 피드백을 제공합니다!

---

## 📚 관련 문서

- [상세 트러블슈팅 가이드](TROUBLESHOOTING.md)
- [빠른 시작 가이드](QUICK_START.md)
- [API 연동 가이드](frontend/API_INTEGRATION.md)
- [아키텍처 구조도](ARCHITECTURE.md)
