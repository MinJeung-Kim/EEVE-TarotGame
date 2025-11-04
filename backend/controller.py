"""
타로 카드 해석 API 컨트롤러
요청/응답 처리 및 라우팅을 담당
"""
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List

from service import TarotService


class TarotRequest(BaseModel):
    """타로 해석 요청 모델"""
    question: str
    cards: List[str]


class TarotResponse(BaseModel):
    """타로 해석 응답 모델"""
    interpretation: str
    advice: str


class FollowUpRequest(BaseModel):
    """추가 질문 요청 모델"""
    question: str
    cards: List[str]


class FollowUpResponse(BaseModel):
    """추가 질문 응답 모델"""
    response: str


class TarotController:
    """타로 카드 API 컨트롤러"""
    
    def __init__(self):
        """컨트롤러 초기화 - 서비스 인스턴스 생성"""
        self.service = TarotService()
    
    async def interpret_tarot(self, request: TarotRequest) -> TarotResponse:
        """
        타로 카드 해석 API 엔드포인트
        
        Args:
            request: 타로 해석 요청 (질문, 카드 리스트)
            
        Returns:
            TarotResponse: 해석과 조언
            
        Raises:
            HTTPException: 처리 중 오류 발생 시
        """
        try:
            # 서비스 레이어 호출
            result = self.service.interpret_tarot(
                question=request.question,
                cards=request.cards
            )
            
            # 응답 모델로 변환
            return TarotResponse(
                interpretation=result["interpretation"],
                advice=result["advice"]
            )
            
        except Exception as e:
            # 에러 로깅 및 HTTP 예외 발생
            print(f"Error in interpret_tarot: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"타로 해석 중 오류가 발생했습니다: {str(e)}"
            )
    
    async def followup_question(self, request: FollowUpRequest) -> FollowUpResponse:
        """
        추가 질문 처리 API 엔드포인트
        
        Args:
            request: 추가 질문 요청 (질문, 카드 리스트)
            
        Returns:
            FollowUpResponse: AI 답변
            
        Raises:
            HTTPException: 처리 중 오류 발생 시
        """
        try:
            # 서비스 레이어 호출
            response = self.service.answer_followup_question(
                question=request.question,
                cards=request.cards
            )
            
            # 응답 모델로 변환
            return FollowUpResponse(response=response)
            
        except Exception as e:
            # 에러 로깅 및 HTTP 예외 발생
            print(f"Error in followup_question: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"추가 질문 처리 중 오류가 발생했습니다: {str(e)}"
            )
