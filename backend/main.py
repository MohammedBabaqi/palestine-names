"""
Palestinian Names Archive — FastAPI Backend
Serves real search, sort, and statistics operations on the dataset.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import records, agent

app = FastAPI(title="أسماء لا تُنسى — API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(records.router, prefix="/api")
app.include_router(agent.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "أسماء لا تُنسى — Archive API", "status": "running"}
