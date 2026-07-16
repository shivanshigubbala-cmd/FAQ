# FAQ Assistant Bot
 
A small FastAPI service that answers common questions, learns new ones when taught,
and remembers what it's taught between restarts.
 
## Requirements traceability (Business Requirements Document)
 
| BR ID | Requirement | Where it's implemented |
|---|---|---|
| BR-01 | Ask in plain language | `POST /query` accepts free-text |
| BR-02 | Match slightly-reworded questions | `app/matcher.py` — fuzzy matching (RapidFuzz) |
| BR-03 | Accessible as an online service | FastAPI app, containerized with Docker |
| BR-04 | Tells the user when it doesn't know | `POST /query` returns a `message` field when there's no match |
| BR-05 | Authorized users can teach new answers | `POST /faqs` and `DELETE /faqs/{q}` require an `x-api-key` header |
| BR-06 | Remembers answers after restart | Answers persist to `data/faq_data.json`, mounted as a Docker volume |
| BR-07 | Responds within a few seconds | In-memory fuzzy match over a small JSON store — effectively instant |
 
## Running locally
 
### Backend
```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open `http://127.0.0.1:8000/docs` for the interactive Swagger UI.
 
### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
 
**Note: Both backend and frontend must be running simultaneously for the demo.**
 
## Running with Docker
 
```bash
docker compose up --build
```
The `data/` folder is mounted as a volume, so taught answers survive container restarts.
 
## API
 
### Ask a question
```
POST /query
{ "question": "how do i reset my pwd" }
```
Returns the matched answer, or a friendly "I don't know" message if there's no good match.
 
### Teach a new answer (requires API key)
```
POST /faqs
Header: x-api-key: <your key>
{ "question": "What are your support hours?", "answer": "9 AM to 6 PM, Mon-Fri." }
```
 
### Remove a taught answer (requires API key)
```
DELETE /faqs/{question}
Header: x-api-key: <your key>
```
Note: the question must be URL-encoded (e.g. spaces, `?`, `&` need escaping).
 
### List all known questions
```
GET /faqs
```
 
### Health check
```
GET /health
```
 
## Configuration
 
Set the teaching API key via environment variable instead of the default:
```bash
export TEACH_API_KEY="your-real-secret"
```
 
## Running tests
 
```bash
pip install pytest httpx
pytest tests/ -v
```
 
## Out of scope (per BRD)
 
- Multi-turn conversations / follow-ups
- Real-time data (live pricing, inventory, etc.)
- Voice interaction
- Multiple languages
