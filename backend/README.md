# EEVE Tarot API Backend

## 🚀 설치 및 실행

### 1. 가상환경 활성화
```bash
# Windows (Git Bash)
source .venv/Scripts/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# Linux/Mac
source .venv/bin/activate
```

### 2. 필수 패키지 설치
```bash
pip install -r backend/requirements.txt
```

### 3. 환경 변수 설정
```bash
# .env.example 파일을 .env로 복사
cp backend/.env.example backend/.env

# .env 파일을 열어서 OpenAI API 키 입력
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

**OpenAI API 키 발급 방법:**
1. https://platform.openai.com/api-keys 접속
2. 로그인 후 "Create new secret key" 클릭
3. 생성된 키를 복사하여 `.env` 파일에 입력

### 4. 서버 실행
```bash
# 방법 1: 직접 실행
python backend/main.py

# 방법 2: 배치 파일 사용 (Windows)
./start-backend.bat

# 방법 3: uvicorn으로 실행
uvicorn backend.main:app --reload

# backend 디렉토리에서
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### 5. 서버 확인
- API 서버: http://localhost:8080
- API 문서: http://localhost:8080/docs
- 헬스 체크: http://localhost:8080/health

## 📡 API 엔드포인트

### GET /
서버 상태 확인
```bash
curl http://localhost:8080
```

### GET /health
헬스 체크
```bash
curl http://localhost:8080/health
```

### POST /api/interpret
타로 카드 해석 요청

**Request Body:**
```json
{
  "question": "오늘의 운세는 어떤가요?",
  "cards": ["바보", "마법사", "여사제"]
}
```

**Response:**
```json
{
  "interpretation": "카드 해석 내용...",
  "advice": "실천 조언..."
}
```

**cURL 예제:**
```bash
curl -X POST http://localhost:8080/api/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "question": "오늘의 운세는?",
    "cards": ["태양"]
  }'
```

## 🔧 기술 스택

- **FastAPI**: 고성능 Python 웹 프레임워크
- **OpenAI GPT-4**: AI 타로 해석 엔진
- **Uvicorn**: ASGI 서버
- **Pydantic**: 데이터 검증

## 🎯 주요 기능

- ✅ OpenAI GPT-4를 활용한 실시간 타로 해석
- ✅ 22장의 메이저 아르카나 카드 지원
- ✅ 원 카드/쓰리 카드 스프레드 지원
- ✅ 카드별 키워드 기반 맥락 제공
- ✅ 구조화된 해석 및 조언 생성
- ✅ CORS 지원으로 프론트엔드 연동
- ✅ 자동 API 문서 생성

## 🐛 트러블슈팅

### 패키지 설치 오류
```bash
# pip 업그레이드
python -m pip install --upgrade pip

# 패키지 재설치
pip install -r backend/requirements.txt --force-reinstall
```

### OpenAI API 오류
- API 키가 올바른지 확인
- API 사용량 및 결제 정보 확인
- `.env` 파일 위치 확인 (backend 폴더 내)

### 포트 충돌
```bash
# 다른 포트로 실행
uvicorn backend.main:app --host 0.0.0.0 --port 8001
```

## 📝 개발 정보

### AI 모델 설정
현재는 `gpt-4o-mini` 모델을 사용하고 있습니다. 필요에 따라 다음 모델로 변경 가능:
- `gpt-4o-mini`: 빠르고 비용 효율적
- `gpt-4`: 더 정교한 해석 가능
- `gpt-3.5-turbo`: 가장 저렴

코드에서 변경: `main.py`의 `model` 파라미터

### 프롬프트 커스터마이징
`main.py`의 `system_prompt`와 `user_prompt`를 수정하여 해석 스타일 조정 가능

