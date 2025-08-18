from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rag.models import QueryRequest, QueryResponse
from rag.qa_chain import qa_chain

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    response = qa_chain.invoke({"question": request.question})
    return {"answer": response}