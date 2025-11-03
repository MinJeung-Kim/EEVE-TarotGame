# 🔧 API 연결 오류 해결 가이드

## 오류: "TypeError: Failed to fetch"

이 오류는 Frontend가 Backend 서버에 연결할 수 없을 때 발생합니다.

---

## ✅ 해결 방법

### 1단계: Backend 서버 실행 확인

**새로운 터미널을 열고** 다음 명령어를 실행하세요:

```bash
cd backend
python main.py
```

다음과 같은 메시지가 표시되어야 합니다:
```
🔮 EEVE Tarot API Server Starting...
📍 Server: http://localhost:8000
📖 Docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

⚠️ **중요**: 이 터미널은 **닫지 마세요**. Backend 서버가 계속 실행되어야 합니다.

---

### 2단계: Backend 서버 테스트

**또 다른 새로운 터미널**을 열고 서버가 응답하는지 확인하세요:

```bash
# Health check
curl http://localhost:8000/health
```

**예상 응답:**
```json
{"status":"healthy"}
```

```bash
# API 테스트
curl -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{"question":"테스트","cards":["바보","마법사"]}'
```

**예상 응답:**
```json
{
  "interpretation": "...",
  "advice": "..."
}
```

---

### 3단계: Frontend 새로고침

Backend 서버가 실행되고 있으면:

1. 브라우저에서 Frontend 페이지(http://localhost:5173)를 **새로고침** (F5)
2. 다시 카드를 선택해보세요

---

## 🔍 추가 디버깅

### Frontend 콘솔 확인

브라우저에서 **F12** → **Console** 탭을 열어보세요.

다음과 같은 로그가 표시됩니다:

**Backend API가 정상 작동할 때:**
```
🔮 API 호출 시작: {API_BASE_URL: "http://localhost:8000", question: "...", cards: [...]}
📡 API 응답 상태: 200
✅ API 응답 성공: {interpretation: "...", advice: "..."}
🎴 카드 해석 요청: {question: "...", cardNames: [...]}
✅ Backend API로부터 해석을 받았습니다.
```

**Backend 서버가 실행되지 않을 때:**
```
🔮 API 호출 시작: ...
❌ 타로 해석 API 호출 중 오류: TypeError: Failed to fetch
💡 Backend 서버가 실행 중인지 확인하세요: http://localhost:8000/health
⚠️ Backend API 호출 실패, 로컬 해석을 사용합니다.
💡 Tip: Backend 서버를 실행하려면 "cd backend && python main.py" 명령어를 사용하세요.
```

---

## 🎯 Fallback 모드

**좋은 소식**: Backend가 실행되지 않아도 프론트엔드는 계속 작동합니다!

- API 호출 실패 시 자동으로 **로컬 해석 모드**로 전환됩니다
- 해석 결과 하단에 다음 메시지가 표시됩니다:
  > ⚠️ *현재 로컬 해석 모드로 실행 중입니다. Backend 서버를 실행하면 AI 기반 해석을 받을 수 있습니다.*

---

## 🛠️ 일반적인 문제 해결

### 문제 1: 포트 8000이 이미 사용 중

**증상:**
```
ERROR: [Errno 10048] error while attempting to bind on address...
```

**해결:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID번호> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### 문제 2: Python 패키지 누락

**증상:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**해결:**
```bash
cd backend
pip install fastapi uvicorn pydantic
```

### 문제 3: Frontend가 localhost:5173에서 실행되지 않음

**해결:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📋 정상 작동 체크리스트

- [ ] Backend 서버가 실행 중 (터미널에서 확인)
- [ ] http://localhost:8000/health 응답 확인
- [ ] Frontend가 http://localhost:5173에서 실행 중
- [ ] 브라우저 콘솔에 에러가 없음
- [ ] 카드 선택 후 해석 결과 표시됨

---

## 💡 개발 팁

### 권장 작업 순서

1. **터미널 1**: Backend 서버 실행
   ```bash
   cd backend
   python main.py
   ```

2. **터미널 2**: Frontend 개발 서버 실행
   ```bash
   cd frontend
   npm run dev
   ```

3. **브라우저**: http://localhost:5173 접속

4. **브라우저 개발자 도구**: F12로 Console 탭 열어두기

### VS Code에서 동시 실행

VS Code의 **Split Terminal** 기능 사용:
- `Ctrl + Shift + 5` (터미널 분할)
- 왼쪽: Backend 실행
- 오른쪽: Frontend 실행

---

## 🎉 모든 것이 정상이면

카드를 선택했을 때:
1. 로딩 애니메이션 표시
2. Backend API에서 해석 받아옴
3. 해석 결과 표시 (로컬 해석 경고 메시지 **없음**)
4. Console에 "✅ Backend API로부터 해석을 받았습니다." 표시

---

## 📞 추가 도움이 필요하면

1. 브라우저 Console 로그 스크린샷
2. Backend 터미널 출력 스크린샷
3. 오류 메시지 전체 내용

위 정보와 함께 문의하세요!
