from fastapi import HTTPException
from pydantic import BaseModel
from typing import List
from service import TarotService


class TarotRequest(BaseModel):
    question: str
    cards: List[str]


class TarotResponse(BaseModel):
    interpretation: str
    advice: str


class FollowUpRequest(BaseModel):
    question: str
    cards: List[str]


class FollowUpResponse(BaseModel):
    response: str


class TarotController:
    def __init__(self):
        self.service = TarotService()
    
    async def interpret_tarot(self, request: TarotRequest) -> TarotResponse:
        """타로 카드 해석"""
        try:
            result = self.service.interpret_tarot(request.question, request.cards)
            return TarotResponse(**result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"타로 해석 오류: {str(e)}")
    
    async def followup_question(self, request: FollowUpRequest) -> FollowUpResponse:
        """추가 질문 처리"""
        try:
            response = self.service.answer_followup_question(request.question, request.cards)
            return FollowUpResponse(response=response)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"추가 질문 처리 오류: {str(e)}")
