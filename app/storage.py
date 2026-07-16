import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "faq_data.json")


def load_faqs():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_faq(question, answer):
    faqs = load_faqs()
    faqs[question.lower().strip()] = answer
    with open(DATA_FILE, "w") as f:
        json.dump(faqs, f, indent=2)


def save_all(faqs):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(faqs, f, indent=2)
