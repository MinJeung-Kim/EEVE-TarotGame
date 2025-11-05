FROM python:3.10-slim

# ---- 기본 설정 ----
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# ---- 필수 패키지 설치 ----
RUN apt update && apt install -y git && rm -rf /var/lib/apt/lists/*

# ---- Python 라이브러리 설치 ----
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- 모델 서버 복사 ----
COPY model_server.py .

# ---- 포트 오픈 ----
EXPOSE 8000

# ---- FastAPI 서버 자동 실행 ----
CMD ["uvicorn", "model_server:app", "--host", "0.0.0.0", "--port", "8000"]
