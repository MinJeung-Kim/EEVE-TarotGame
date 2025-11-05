from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from controller import TarotController, TarotRequest, TarotResponse, FollowUpRequest, FollowUpResponse

app = FastAPI(title="EEVE Tarot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

controller = TarotController()


@app.get("/")
async def root():
    return {"message": "EEVE Tarot API", "version": "1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

 
@app.post("/api/interpret", response_model=TarotResponse)
async def interpret_tarot(request: TarotRequest):
    return await controller.interpret_tarot(request)


@app.post("/api/followup", response_model=FollowUpResponse)
async def followup_question(request: FollowUpRequest):
    return await controller.followup_question(request)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
