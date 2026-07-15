from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_faqs():
    resp = client.get("/faqs")
    assert resp.status_code == 200
    assert isinstance(resp.json(), dict)


def test_query_returns_match():
    resp = client.post("/query", json={"question": "password reset"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["question"] == "password reset"
    assert body["matched_question"] is not None
    assert body["answer"] is not None


def test_query_no_match():
    resp = client.post("/query", json={"question": "random nonsense xyz"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["matched_question"] is None


def test_create_and_delete_faq():
    resp = client.post("/faqs", json={"question": "Test q?", "answer": "Test a."})
    assert resp.status_code == 201

    resp = client.delete("/faqs/Test q?")
    assert resp.status_code == 200


def test_delete_nonexistent_faq():
    resp = client.delete("/faqs/this does not exist")
    assert resp.status_code == 404
