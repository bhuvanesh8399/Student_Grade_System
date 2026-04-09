python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
