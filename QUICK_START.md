# 🚀 빠른 시작 가이드

## 1. Backend 서버 실행

```bash
# Backend 폴더로 이동
cd backend

# Python 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install fastapi uvicorn pydantic

# 서버 실행
python main.py
```

**서버 주소**: http://localhost:8000  
**API 문서**: http://localhost:8000/docs

### Backend 동작 확인
```bash
# Health check
curl http://localhost:8000/health

# 응답: {"status":"healthy"}
```

---

## 2. Frontend 개발 서버 실행

```bash
# 새 터미널을 열어 Frontend 폴더로 이동
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

**클라이언트 주소**: http://localhost:5173

---

## 3. 통합 테스트

### 방법 1: 웹 브라우저에서 테스트
1. http://localhost:5173 접속
2. "시작하기" 클릭
3. 질문 입력 (예: "이직을 해야 할까요?")
4. 카테고리 선택
5. 스프레드 타입 선택 (원 카드 또는 쓰리 카드)
6. 카드 선택
7. **AI 해석 결과 확인** ← Backend API가 호출됨!

### 방법 2: API 직접 테스트
```bash
# test_api.sh 실행 (Git Bash 또는 Linux/Mac)
bash test_api.sh

# 또는 curl로 직접 테스트
curl -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "question": "이직을 해야 할까요?",
    "cards": ["바보", "마법사", "여사제"]
  }'
```

---

## 4. 개발 흐름

### Backend 수정 시
```bash
cd backend

# main.py 수정 후
# Ctrl+C로 서버 종료 후 재시작
python main.py
```

### Frontend 수정 시
```bash
cd frontend

# src/ 폴더 내 파일 수정
# Vite가 자동으로 Hot Reload 적용
# 브라우저가 자동으로 새로고침됨
```

---

## 5. 주요 파일 위치

### Backend
- `backend/main.py` - FastAPI 서버, API 엔드포인트

### Frontend
- `frontend/src/components/Tarot.tsx` - 메인 로직, API 호출
- `frontend/src/utills/api.ts` - API 통신 함수
- `frontend/.env` - 환경 변수 (API URL)

---

## 6. 트러블슈팅

### Backend 서버가 실행되지 않는 경우
```bash
# 의존성 재설치
pip install --upgrade fastapi uvicorn pydantic

# 포트가 사용 중인지 확인
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

### Frontend에서 API 연결이 안 되는 경우
1. Backend 서버가 실행 중인지 확인
2. `.env` 파일의 `VITE_API_BASE_URL` 확인
3. 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인
4. 브라우저 개발자 도구 → Network 탭에서 API 요청 확인

### CORS 에러가 발생하는 경우
`backend/main.py`에서 CORS 설정 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경에서는 "*" 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 7. 다음 단계

### ✅ 현재 완료된 기능
- Frontend UI 완성
- Backend API 구조 완성
- Frontend ↔ Backend 연동 완료
- 카드 선택 및 해석 표시

### 🔧 추가 개발 필요
- [ ] Backend에 실제 EEVE 모델 또는 OpenAI API 연동
- [ ] 사용자 인증 및 세션 관리
- [ ] 해석 결과 저장 기능
- [ ] 해석 히스토리 조회
- [ ] UI/UX 개선

---

## 8. 유용한 명령어

```bash
# Backend 로그 확인 (서버 실행 시 자동으로 표시됨)
python main.py

# Frontend 빌드 (배포용)
cd frontend
npm run build

# Frontend 빌드 미리보기
npm run preview

# 코드 린트 검사
npm run lint
```

---

## 📚 추가 문서

- [API 연동 가이드](frontend/API_INTEGRATION.md)
- [아키텍처 구조도](ARCHITECTURE.md)
- [구현 요약](IMPLEMENTATION_SUMMARY.md)
- [전체 기획서](README.md)

---

## 🎉 모든 준비 완료!

이제 Frontend에서 Backend API를 성공적으로 호출할 수 있습니다.
카드를 선택하면 Backend의 `/api/interpret` 엔드포인트가 호출되어 해석 결과를 받아옵니다.
