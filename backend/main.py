"""
EEVE 타로 카드 해석 API 메인 애플리케이션
FastAPI 애플리케이션 설정 및 라우트 등록
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from controller import (
    TarotController,
    TarotRequest,
    TarotResponse,
    FollowUpRequest,
    FollowUpResponse
)

# FastAPI 애플리케이션 초기화
app = FastAPI(title="EEVE Tarot API")

# CORS 설정 - 프론트엔드에서 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"  # 개발 중에는 모든 origin 허용
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 컨트롤러 인스턴스 생성
tarot_controller = TarotController()


@app.get("/")
async def root():
    """루트 엔드포인트 - 서버 상태 확인"""
    return {
        "message": "EEVE Tarot API is running",
        "version": "1.0",
        "endpoints": ["/api/interpret", "/api/followup"]
    }


@app.get("/health")
async def health():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}

 
@app.post("/api/interpret", response_model=TarotResponse)
async def interpret_tarot(request: TarotRequest):
    """
    타로 카드 해석 API - Ollama EEVE 모델 사용
    컨트롤러에 요청을 위임
    """
    print("🔮 Tarot Interpretation Result:")
    result = await tarot_controller.interpret_tarot(request)
    
    print(result)
    
    return result


@app.post("/api/followup", response_model=FollowUpResponse)
async def followup_question(request: FollowUpRequest):
    """
    추가 질문에 대한 AI 응답 생성 - Ollama EEVE 모델 사용
    컨트롤러에 요청을 위임
    """
    return await tarot_controller.followup_question(request)


if __name__ == "__main__":
    print("🔮 EEVE Tarot API Server Starting...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
