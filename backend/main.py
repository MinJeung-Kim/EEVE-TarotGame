from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import os

from dotenv import load_dotenv 
from openai import OpenAI

load_dotenv() 

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    타로 카드 해석 API - OpenAI GPT 모델 사용
    """
    try:
        # 카드 정보 포맷팅
        cards_str = ", ".join(request.cards)
        
        # 타로 카드별 키워드 매핑 (간단한 버전)
        card_meanings = {
            "바보": ["새로운 시작", "순수함", "모험"],
            "마법사": ["창조", "의지", "기술"],
            "여사제": ["직관", "신비", "무의식"],
            "여황제": ["풍요", "양육", "창조성"],
            "황제": ["권위", "구조", "안정"],
            "교황": ["전통", "지혜", "영적 지도"],
            "연인": ["사랑", "선택", "조화"],
            "전차": ["승리", "의지", "전진"],
            "힘": ["용기", "인내", "자제력"],
            "은둔자": ["성찰", "고독", "내면의 지혜"],
            "운명의 수레바퀴": ["변화", "운명", "순환"],
            "정의": ["공정", "진실", "균형"],
            "매달린 사람": ["희생", "새로운 관점", "정체"],
            "죽음": ["변화", "종결", "재탄생"],
            "절제": ["균형", "조화", "인내"],
            "악마": ["속박", "유혹", "물질"],
            "탑": ["파괴", "계시", "해방"],
            "별": ["희망", "영감", "치유"],
            "달": ["환상", "불안", "무의식"],
            "태양": ["성공", "기쁨", "긍정"],
            "심판": ["깨달음", "재생", "결정"],
            "세계": ["완성", "성취", "통합"]
        }
        
        # 선택된 카드의 키워드 추출
        card_context = []
        for card_name in request.cards:
            if card_name in card_meanings:
                keywords = ", ".join(card_meanings[card_name])
                card_context.append(f"{card_name}: {keywords}")
        
        card_info = "\n".join(card_context)
        
        # 카드 개수에 따른 스프레드 타입 결정
        spread_type = "원 카드 리딩" if len(request.cards) == 1 else "쓰리 카드 리딩 (과거-현재-미래)"
        
        # OpenAI API 프롬프트 생성
        system_prompt = """당신은 경험 많은 타로 리더입니다. 
타로 카드의 의미를 깊이 이해하고, 상담자의 질문에 대해 영적이고 공감적인 해석을 제공합니다.
해석은 한국어로 작성하며, 신비롭고 따뜻한 어조를 유지합니다.
구체적이고 실용적인 조언을 포함하되, 희망적인 메시지를 전달합니다."""

        user_prompt = f"""다음 타로 리딩을 해석해주세요:

스프레드 타입: {spread_type}
질문: {request.question}

선택된 카드:
{card_info}

다음 형식으로 답변해주세요:

1. 카드 해석 (200-300자):
   - 각 카드의 의미와 질문과의 연관성
   - 카드들이 함께 전달하는 메시지
   - 현재 상황에 대한 통찰

2. 실천 조언 (100-150자):
   - 구체적이고 실천 가능한 조언
   - 긍정적이고 희망적인 메시지"""

        # OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # 또는 "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,  # 창의성을 위해 약간 높게 설정
            max_tokens=800
        )
        
        # 응답 파싱
        full_response = response.choices[0].message.content.strip()
        
        # 해석과 조언 분리 시도
        parts = full_response.split("2. 실천 조언")
        if len(parts) == 2:
            interpretation = parts[0].replace("1. 카드 해석", "").strip()
            interpretation = interpretation.replace("(200-300자):", "").strip()
            interpretation = interpretation.strip(":")
            advice = parts[1].strip()
            advice = advice.replace("(100-150자):", "").strip()
            advice = advice.strip(":")
        else:
            # 분리 실패 시 전체를 해석으로, 간단한 조언 생성
            interpretation = full_response
            advice = "카드가 전하는 메시지를 마음 깊이 받아들이시고, 긍정적인 마음으로 한 걸음씩 나아가세요. 🌟"
        
        return TarotResponse(
            interpretation=interpretation.strip(),
            advice=advice.strip()
        )
        
    except Exception as e:
        # 에러 발생 시 로그 출력 및 기본 응답 반환
        print(f"Error in interpret_tarot: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"타로 해석 중 오류가 발생했습니다: {str(e)}"
        )

class FollowUpRequest(BaseModel):
    question: str
    cards: List[str]

class FollowUpResponse(BaseModel):
    response: str

@app.post("/api/followup", response_model=FollowUpResponse)
async def followup_question(request: FollowUpRequest):
    """
    추가 질문에 대한 AI 응답 생성
    """
    try:
        cards_str = ", ".join(request.cards)
        
        # OpenAI API 프롬프트 생성
        system_prompt = """당신은 경험 많은 타로 리더입니다. 
이미 타로 카드를 뽑은 상담자가 추가적인 질문을 하고 있습니다.
이전에 뽑은 카드들의 의미를 바탕으로 상담자의 추가 질문에 대해 
구체적이고 공감적인 답변을 제공하세요.
답변은 한국어로 작성하며, 따뜻하고 지지적인 어조를 유지합니다."""

        user_prompt = f"""상담자가 이전에 다음 카드들을 뽑았습니다: {cards_str}

상담자의 추가 질문: {request.question}

이 질문에 대해 이미 뽑은 카드들의 의미를 바탕으로 150-250자 정도로 답변해주세요.
카드들이 전하는 메시지와 연결하여 구체적이고 실천 가능한 조언을 제공하세요."""

        # OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            max_tokens=400
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        return FollowUpResponse(response=ai_response)
        
    except Exception as e:
        print(f"Error in followup_question: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"추가 질문 처리 중 오류가 발생했습니다: {str(e)}"
        )

if __name__ == "__main__":
    print("🔮 EEVE Tarot API Server Starting...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)