from pydantic import BaseModel


class FAQItem(BaseModel):
    id: int
    question: str
    answer: str
    tags: list[str] = []


class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


class MatchResult(BaseModel):
    id: int
    question: str
    answer: str
    score: float


class QueryResponse(BaseModel):
    query: str
    results: list[MatchResult]
