from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="EEVE Tarot API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TarotRequest(BaseModel):
    question: str
    cards: List[str]

class TarotResponse(BaseModel):
    interpretation: str
    advice: str

@app.get("/")
async def root():
    return {"message": "EEVE Tarot API Server is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/interpret", response_model=TarotResponse)
async def interpret_tarot(request: TarotRequest):
    """
    타로 카드 해석 API
    TODO: 실제 EEVE 모델 또는 OpenAI API 연동 필요
    """
    # 임시 응답 (실제 AI 모델 연동 전)
    cards_str = ", ".join(request.cards)
    
    interpretation = f"""
    당신의 질문: "{request.question}"
    
    선택하신 카드는 {cards_str}입니다.
    
    [임시 해석]
    현재는 테스트 모드입니다. 실제 AI 모델 연동이 필요합니다.
    선택하신 카드들은 당신의 현재 상황과 미래에 대한 메시지를 담고 있습니다.
    """
    
    advice = "긍정적인 마음가짐을 유지하시고, 현재 상황을 차근차근 해결해 나가시길 바랍니다."
    
    return TarotResponse(
        interpretation=interpretation.strip(),
        advice=advice
    )

if __name__ == "__main__":
    print("🔮 EEVE Tarot API Server Starting...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)