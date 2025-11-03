#!/bin/bash

# Backend API 테스트 스크립트

echo "🔮 EEVE Tarot API 테스트"
echo "================================"

# 1. 서버 상태 확인
echo ""
echo "1️⃣ 서버 상태 확인 (Health Check)"
curl -s http://localhost:8000/health | jq .
echo ""

# 2. Root 엔드포인트 확인
echo "2️⃣ Root 엔드포인트"
curl -s http://localhost:8000/ | jq .
echo ""

# 3. 타로 해석 API 테스트
echo "3️⃣ 타로 해석 API (/api/interpret)"
curl -s -X POST http://localhost:8000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "question": "이직을 해야 할까요?",
    "cards": ["바보", "마법사", "여사제"]
  }' | jq .
echo ""

echo "================================"
echo "✅ 테스트 완료"
