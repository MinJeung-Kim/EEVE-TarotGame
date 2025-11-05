from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

app = FastAPI(title="EEVE Model API", version="1.0")

# ---- 모델 로드 ----
model_name = "yanolja/EEVE-Korean-10.8B-v1.0"
print(f"🔹 Loading model: {model_name} ...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)
model.eval()
print("✅ Model loaded successfully")

# ---- 요청/응답 모델 ----
class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 128
    temperature: float = 0.7

class GenerateResponse(BaseModel):
    text: str

# ---- API 엔드포인트 ----
@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    inputs = tokenizer(req.prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=req.max_tokens,
            temperature=req.temperature,
            do_sample=True
        )
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return GenerateResponse(text=text)


@app.get("/")
def root():
    return {"status": "ok", "message": "EEVE model API is running!"}
