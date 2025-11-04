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

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 컨트롤러 인스턴스 생성
tarot_controller = TarotController()


@app.post("/api/interpret", response_model=TarotResponse)
async def interpret_tarot(request: TarotRequest):
    """
    타로 카드 해석 API - Ollama EEVE 모델 사용
    컨트롤러에 요청을 위임
    """
    return await tarot_controller.interpret_tarot(request)


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
