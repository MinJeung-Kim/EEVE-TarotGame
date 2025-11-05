"""
타로 카드 해석 서비스 레이어
비즈니스 로직 및 외부 API 호출을 담당
"""
import requests
import os
from typing import List, Tuple, Dict
from dotenv import load_dotenv

from const import (
    CARD_MEANINGS,
    TAROT_READER_SYSTEM_PROMPT,
    INTERPRETATION_PROMPT_TEMPLATE,
    FOLLOWUP_SYSTEM_PROMPT,
    FOLLOWUP_PROMPT_TEMPLATE,
    SPREAD_TYPE_ONE_CARD,
    SPREAD_TYPE_THREE_CARD,
    DEFAULT_ADVICE,
    RESPONSE_PARSE_KEYWORD_ADVICE,
    RESPONSE_PARSE_KEYWORD_INTERPRETATION,
    RESPONSE_PARSE_KEYWORD_CHAR_COUNT_200_300,
    RESPONSE_PARSE_KEYWORD_CHAR_COUNT_100_150,
    DEFAULT_TEMPERATURE,
    DEFAULT_NUM_PREDICT_INTERPRETATION,
    DEFAULT_NUM_PREDICT_FOLLOWUP,
    DEFAULT_TIMEOUT
)

load_dotenv()

# Runpod EEVE 모델 설정
RUNPOD_ID = os.getenv("RUNPOD_ID")
RUNPOD_URL = os.getenv("RUNPOD_URL", f"https://{RUNPOD_ID}-8000.proxy.runpod.net")
EEVE_MODEL = os.getenv("EEVE_MODEL")


class TarotService:
    """타로 카드 해석 서비스"""
    
    def __init__(self):
        """서비스 초기화"""
        self.runpod_url = RUNPOD_URL
        self.eeve_model = EEVE_MODEL
        print(f"🔮 Using Ollama EEVE Model: {self.eeve_model}")
        print(f"📡 Runpod URL: {self.runpod_url}")
        
        # 환경 변수 검증
        if not RUNPOD_ID or RUNPOD_ID == "None":
            raise ValueError("RUNPOD_ID 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")
        if not self.eeve_model or self.eeve_model == "None":
            raise ValueError("EEVE_MODEL 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")
    
    def get_card_keywords(self, cards: List[str]) -> str:
        """
        선택된 카드들의 키워드를 추출하여 문자열로 반환
        
        Args:
            cards: 타로 카드 이름 리스트
            
        Returns:
            카드별 키워드를 포함한 문자열
        """

        card_context = []
        for card_name in cards:
            if card_name in CARD_MEANINGS:
                keywords = ", ".join(CARD_MEANINGS[card_name])
                card_context.append(f"{card_name}: {keywords}")
        
        return "\n".join(card_context)
    
    def determine_spread_type(self, cards: List[str]) -> str:
        """
        카드 개수에 따라 스프레드 타입 결정
        
        Args:
            cards: 타로 카드 이름 리스트
            
        Returns:
            스프레드 타입 문자열
        """
        return SPREAD_TYPE_ONE_CARD if len(cards) == 1 else SPREAD_TYPE_THREE_CARD
    
    def build_interpretation_prompt(
        self, 
        question: str, 
        cards: List[str]
    ) -> str:
        """
        타로 해석용 프롬프트 생성
        
        Args:
            question: 사용자 질문
            cards: 타로 카드 리스트
            
        Returns:
            완성된 프롬프트 문자열
        """
        card_info = self.get_card_keywords(cards)
        spread_type = self.determine_spread_type(cards)
        
        user_prompt = INTERPRETATION_PROMPT_TEMPLATE.format(
            spread_type=spread_type,
            question=question,
            card_info=card_info
        )

        return f"{TAROT_READER_SYSTEM_PROMPT}\n\n{user_prompt}"
    
    def call_ollama_api(
        self, 
        prompt: str, 
        model: str = None,
        temperature: float = DEFAULT_TEMPERATURE, 
        num_predict: int = DEFAULT_NUM_PREDICT_INTERPRETATION
    ) -> str:
        """
        RunPod 커스텀 EEVE 엔드포인트 호출
        
        Args:
            prompt: API에 전달할 프롬프트
            model: 사용할 모델명 (사용되지 않음, 호환성 유지용)
            temperature: 생성 온도 (0.0~1.0)
            num_predict: 생성할 최대 토큰 수
            
        Returns:
            AI 응답 문자열 (프롬프트 제거됨)
            
        Raises:
            Exception: API 호출 실패 시
        """
        api_endpoint = f"{self.runpod_url}/generate"
        
        payload = {
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": num_predict
        }
        
        print(f"🔗 Calling RunPod Endpoint: {api_endpoint}")
        print(f"📝 Prompt length: {len(prompt)} characters")
        
        try:
            response = requests.post(
                api_endpoint,
                json=payload,
                timeout=DEFAULT_TIMEOUT
            )
            
            if response.status_code != 200:
                raise Exception(
                    f"RunPod API 오류: {response.status_code} - {response.text}"
                )
            
            data = response.json()
            text = data.get("text", "").strip()
            
            if not text:
                raise Exception("RunPod로부터 응답을 받지 못했습니다.")
            
            # EEVE 모델은 프롬프트를 포함해서 반환하므로, 프롬프트 부분을 제거
            if text.startswith(prompt):
                generated_text = text[len(prompt):].strip()
                print(f"✂️ Removed prompt from response. Generated text length: {len(generated_text)}")
                return generated_text
            
            print(f"⚠️ Response doesn't start with prompt. Returning full text.")
            return text
            
        except requests.exceptions.Timeout:
            raise Exception(f"API 호출 시간 초과 ({DEFAULT_TIMEOUT}초)")
        except requests.exceptions.ConnectionError:
            raise Exception(f"RunPod 연결 실패: {self.runpod_url}")
        except Exception as e:
            raise Exception(f"API 호출 중 오류 발생: {str(e)}")

    def parse_interpretation_response(self, response: str) -> Tuple[str, str]:
        """
        AI 응답을 해석과 조언으로 분리
        
        Args:
            response: AI 모델의 전체 응답
            
        Returns:
            (해석, 조언) 튜플
        """
        parts = response.split(RESPONSE_PARSE_KEYWORD_ADVICE)
        
        if len(parts) == 2:
            interpretation = parts[0].replace(RESPONSE_PARSE_KEYWORD_INTERPRETATION, "").strip()
            interpretation = interpretation.replace(RESPONSE_PARSE_KEYWORD_CHAR_COUNT_200_300, "").strip()
            interpretation = interpretation.strip(":")
            
            advice = parts[1].strip()
            advice = advice.replace(RESPONSE_PARSE_KEYWORD_CHAR_COUNT_100_150, "").strip()
            advice = advice.strip(":")
        else:
            # 분리 실패 시 전체를 해석으로, 간단한 조언 생성
            interpretation = response
            advice = DEFAULT_ADVICE
        
        return interpretation.strip(), advice.strip()
    
    def interpret_tarot(self, question: str, cards: List[str]) -> Dict[str, str]:
        """
        타로 카드 해석 메인 로직
        
        Args:
            question: 사용자 질문
            cards: 선택된 타로 카드 리스트
            
        Returns:
            해석과 조언을 담은 딕셔너리
            
        Raises:
            Exception: 해석 과정에서 오류 발생 시
        """
        # 프롬프트 생성
        prompt = self.build_interpretation_prompt(question, cards)

        print("🔮 Interpretation Prompt:")
        print(prompt)
        
        # Ollama API 호출 (해석용 긴 응답)
        full_response = self.call_ollama_api(
            prompt,
            temperature=DEFAULT_TEMPERATURE,
            num_predict=DEFAULT_NUM_PREDICT_INTERPRETATION
        )
        
        # 응답 파싱
        interpretation, advice = self.parse_interpretation_response(full_response)
        
        return {
            "interpretation": interpretation,
            "advice": advice
        }
    
    def build_followup_prompt(self, question: str, cards: List[str]) -> str:
        """
        추가 질문용 프롬프트 생성
        
        Args:
            question: 추가 질문
            cards: 이전에 선택된 카드 리스트
            
        Returns:
            완성된 프롬프트 문자열
        """
        cards_str = ", ".join(cards)
        
        user_prompt = FOLLOWUP_PROMPT_TEMPLATE.format(
            cards_str=cards_str,
            question=question
        )

        return f"{FOLLOWUP_SYSTEM_PROMPT}\n\n{user_prompt}"
    
    def answer_followup_question(self, question: str, cards: List[str]) -> str:
        """
        추가 질문에 대한 답변 생성
        
        Args:
            question: 추가 질문
            cards: 이전에 선택된 카드 리스트
            
        Returns:
            AI 답변 문자열
            
        Raises:
            Exception: 답변 생성 중 오류 발생 시
        """
        # 프롬프트 생성
        prompt = self.build_followup_prompt(question, cards)
        
        # Ollama API 호출 (추가 질문용 짧은 응답)
        response = self.call_ollama_api(
            prompt, 
            temperature=DEFAULT_TEMPERATURE, 
            num_predict=DEFAULT_NUM_PREDICT_FOLLOWUP
        )
        
        return response
