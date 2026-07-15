from rapidfuzz import process, fuzz


def find_best_match(question, faqs, threshold=70):
    if not faqs:
        return None, None
    choices = list(faqs.keys())
    result = process.extractOne(question.lower().strip(), choices, scorer=fuzz.WRatio)
    if result and result[1] >= threshold:
        matched_question = result[0]
        return matched_question, faqs[matched_question]
    return None, None
