from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.matcher import find_best_match
from app.storage import load_faqs, save_faq

app = FastAPI(title="FAQ Assistant Bot")


class QueryRequest(BaseModel):
    question: str


class FaqRequest(BaseModel):
    question: str
    answer: str


@app.on_event("startup")
def startup():
    app.state.faqs = load_faqs()


@app.get("/faqs")
def list_faqs():
    return app.state.faqs


@app.post("/faqs", status_code=201)
def create_faq(req: FaqRequest):
    key = req.question.lower().strip()
    app.state.faqs[key] = req.answer
    save_faq(req.question, req.answer)
    return {"question": req.question, "answer": req.answer}


@app.delete("/faqs/{question:path}")
def delete_faq(question: str):
    key = question.lower().strip()
    if key not in app.state.faqs:
        raise HTTPException(status_code=404, detail="FAQ not found")
    del app.state.faqs[key]
    with open("data/faq_data.json", "w") as f:
        import json
        json.dump(app.state.faqs, f, indent=2)


@app.post("/query")
def query_faqs(req: QueryRequest):
    matched_question, answer = find_best_match(req.question, app.state.faqs)
    if matched_question:
        return {"question": req.question, "matched_question": matched_question, "answer": answer}
    return {"question": req.question, "matched_question": None, "answer": None}
