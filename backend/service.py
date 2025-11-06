from dotenv import load_dotenv
import requests
import os
from typing import List, Tuple, Dict
from .const import *

load_dotenv()

RUNPOD_ID = os.getenv("RUNPOD_ID" , "159080sevh9u7u")
RUNPOD_URL = f"https://{RUNPOD_ID}-8000.proxy.runpod.net"
 
class TarotService:
    def __init__(self):
        self.runpod_url = RUNPOD_URL 
        
        if not RUNPOD_ID or RUNPOD_ID == "None":
            raise ValueError("RUNPOD_ID 환경 변수가 설정되지 않았습니다.") 
    
    def _get_card_keywords(self, cards: List[str]) -> str:
        """카드 키워드를 문자열로 변환"""
        return "\n".join([f"{card}: {', '.join(CARD_MEANINGS[card])}" 
                          for card in cards if card in CARD_MEANINGS])
    
    def _build_prompt(self, template: str, **kwargs) -> str:
        """프롬프트 템플릿 포맷팅"""
        return template.format(**kwargs)
    
    def _call_api(self, prompt: str, num_predict: int) -> str:
        """RunPod API 호출"""
        payload = {
            "prompt": prompt,
            "temperature": DEFAULT_TEMPERATURE,
            "max_tokens": num_predict
        }
        
        try:
            response = requests.post(
                f"{self.runpod_url}/generate",
                json=payload,
                timeout=DEFAULT_TIMEOUT
            )
            response.raise_for_status()
            
            text = response.json().get("text", "").strip()
            if not text:
                raise Exception("응답을 받지 못했습니다.")
            
            # 프롬프트 제거
            if text.startswith(prompt):
                return text[len(prompt):].strip()
            
            # 프롬프트의 마지막 줄 이후 텍스트만 추출
            last_line = prompt.split('\n')[-1]
            if last_line in text:
                return text.split(last_line)[-1].strip()
            
            return text
            
        except requests.exceptions.Timeout:
            raise Exception(f"API 호출 시간 초과 ({DEFAULT_TIMEOUT}초)")
        except requests.exceptions.RequestException as e:
            raise Exception(f"API 호출 오류: {str(e)}")

    def _parse_response(self, response: str) -> Tuple[str, str]:
        """AI 응답을 해석과 조언으로 분리"""
        parts = response.split(RESPONSE_PARSE_KEYWORD_ADVICE)
        
        if len(parts) == 2:
            interpretation = parts[0].replace(RESPONSE_PARSE_KEYWORD_INTERPRETATION, "")
            interpretation = interpretation.replace(RESPONSE_PARSE_KEYWORD_CHAR_COUNT_200_300, "").strip(": ")
            
            advice = parts[1].replace(RESPONSE_PARSE_KEYWORD_CHAR_COUNT_100_150, "").strip(": ")
            return interpretation, advice
        
        # 파싱 실패 시 길이로 분리
        if len(response) > 500:
            mid = len(response) // 2
            return response[:mid].strip(), response[mid:].strip()
        
        return response.strip(), DEFAULT_ADVICE
    
    def interpret_tarot(self, question: str, cards: List[str]) -> Dict[str, str]:
        """타로 카드 해석"""
        card_info = self._get_card_keywords(cards)
        spread_type = SPREAD_TYPE_ONE_CARD if len(cards) == 1 else SPREAD_TYPE_THREE_CARD
        
        prompt = self._build_prompt(
            INTERPRETATION_PROMPT_TEMPLATE,
            spread_type=spread_type,
            question=question,
            card_info=card_info
        )
        
        response = self._call_api(prompt, DEFAULT_NUM_PREDICT_INTERPRETATION)
        interpretation, advice = self._parse_response(response)
        
        return {"interpretation": interpretation, "advice": advice}
    
    def answer_followup_question(self, question: str, cards: List[str]) -> str:
        """추가 질문 답변"""
        prompt = self._build_prompt(
            FOLLOWUP_PROMPT_TEMPLATE,
            cards_str=", ".join(cards),
            question=question
        )
        
        return self._call_api(prompt, DEFAULT_NUM_PREDICT_FOLLOWUP)
