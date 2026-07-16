from urllib.parse import quote

import pytest
from fastapi.testclient import TestClient

from app.main import TEACH_API_KEY, app

AUTH_HEADERS = {"x-api-key": TEACH_API_KEY}


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_list_faqs(client):
    resp = client.get("/faqs")
    assert resp.status_code == 200
    assert isinstance(resp.json(), dict)


def test_query_returns_match(client):
    resp = client.post("/query", json={"question": "password reset"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["question"] == "password reset"
    assert body["matched_question"] is not None
    assert body["answer"] is not None


def test_query_no_match_returns_friendly_message(client):
    resp = client.post("/query", json={"question": "random nonsense xyz"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["matched_question"] is None
    assert body["answer"] is None
    assert "don't know" in body["message"].lower()


def test_create_faq_requires_api_key(client):
    resp = client.post("/faqs", json={"question": "No key q?", "answer": "Nope."})
    assert resp.status_code == 401


def test_create_faq_with_wrong_api_key(client):
    resp = client.post(
        "/faqs",
        json={"question": "Wrong key q?", "answer": "Nope."},
        headers={"x-api-key": "not-the-real-key"},
    )
    assert resp.status_code == 401


def test_create_and_delete_faq_with_valid_key(client):
    resp = client.post(
        "/faqs",
        json={"question": "Test q?", "answer": "Test a."},
        headers=AUTH_HEADERS,
    )
    assert resp.status_code == 201

    resp = client.delete(f"/faqs/{quote('Test q?', safe='')}", headers=AUTH_HEADERS)
    assert resp.status_code == 200


def test_delete_requires_api_key(client):
    resp = client.delete(f"/faqs/{quote('some question', safe='')}")
    assert resp.status_code == 401


def test_delete_nonexistent_faq(client):
    resp = client.delete(
        f"/faqs/{quote('this does not exist', safe='')}",
        headers=AUTH_HEADERS,
    )
    assert resp.status_code == 404
