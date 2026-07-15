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
