import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.matcher import find_best_match
from app.storage import load_faqs, save_all, save_faq

# BR-05: only an authorized user (content owner) may teach/remove answers.
# Simple shared-secret header for this trainee-scale project; move to a
# proper auth system if this ever goes beyond a single internal team.
TEACH_API_KEY = os.environ.get("TEACH_API_KEY", "trainee-secret-key")

DONT_KNOW_MESSAGE = "I don't know the answer to that yet. You can teach me one!"


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.faqs = load_faqs()
    yield


app = FastAPI(title="FAQ Assistant Bot", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


class FaqRequest(BaseModel):
    question: str
    answer: str


def require_api_key(x_api_key: str = Header(default=None)):
    """BR-05 gate: only requests with the correct key can teach/delete."""
    if x_api_key != TEACH_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


@app.get("/faqs")
def list_faqs():
    return app.state.faqs


@app.post("/faqs", status_code=201, dependencies=[Depends(require_api_key)])
def create_faq(req: FaqRequest):
    key = req.question.lower().strip()
    app.state.faqs[key] = req.answer
    save_faq(req.question, req.answer)
    return {"question": req.question, "answer": req.answer}


@app.delete("/faqs/{question:path}", dependencies=[Depends(require_api_key)])
def delete_faq(question: str):
    key = question.lower().strip()
    if key not in app.state.faqs:
        raise HTTPException(status_code=404, detail="FAQ not found")
    del app.state.faqs[key]
    save_all(app.state.faqs)
    return {"status": "deleted", "question": question}


@app.post("/query")
def query_faqs(req: QueryRequest):
    matched_question, answer = find_best_match(req.question, app.state.faqs)
    if matched_question:
        return {"question": req.question, "matched_question": matched_question, "answer": answer}
    # BR-04: be transparent when the assistant doesn't know, instead of a bare null.
    return {"question": req.question, "matched_question": None, "answer": None, "message": DONT_KNOW_MESSAGE}


@app.get("/health")
def health():
    return {"status": "ok"}
