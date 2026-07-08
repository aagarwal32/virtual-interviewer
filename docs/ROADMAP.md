# Virtual Interviewer — Build Roadmap

A step-by-step plan for growing this from a tic-tac-toe learning project into a
full-stack Virtual Interviewer app. Check items off as you go.

## Architecture at a glance

Two decoupled halves that talk over HTTP with JSON:

```
frontend/  React + TypeScript (Vite)   → the UI, runs on :5173
backend/   FastAPI + SQLModel          → the JSON API, runs on :8000
```

Unlike Django (one app renders HTML *and* owns the DB), the backend here never
renders HTML — it returns JSON, and React renders everything.

## Django → FastAPI cheat sheet

| Django | Here |
| --- | --- |
| Django ORM (`models.py`) | SQLModel (`app/models.py`) |
| `makemigrations` / `migrate` | Alembic |
| `urls.py` + `include()` | `APIRouter` + `app.include_router()` |
| Views | Path operation functions (`@router.get(...)`) |
| DRF serializers / forms | Pydantic schemas (`app/schemas.py`) |
| Templates (Jinja/Ninja) | ❌ gone — return JSON, React renders |
| Plain JS + AJAX | React + `fetch` |
| `settings.py` | pydantic-settings (`app/config.py`) + `.env` |
| `django.contrib.auth` | JWT (python-jose + passlib) |

## Current backend layout

```
backend/
  app/
    __init__.py
    main.py            # FastAPI app, CORS, includes routers
    config.py          # typed settings (env vars / .env)
    database.py        # engine + session + init_db()
    models.py          # SQLModel tables (the ORM)
    schemas.py         # request/response shapes
    routers/
      __init__.py
      interviews.py    # CRUD for Interview
  requirements.txt
  .venv/
```

## Running it (two terminals)

```bash
# backend
cd backend && source .venv/bin/activate && fastapi dev app/main.py   # :8000, docs at /docs

# frontend
cd frontend && npm run dev                                            # :5173
```

---

## Phase 1 — Backend foundation

- [x] Restructure into an `app/` package
- [x] Add SQLModel + SQLite
- [x] First model (`Interview`) + schemas
- [x] CRUD routes for `Interview`, testable in `/docs`
- [] **Verify in `/docs`**: create, list, get, delete an interview
- [ ] Add **Alembic** for real migrations (replaces `init_db()` in `main.py`)
- [ ] Expand the data model (e.g. `Question`, `Answer`, relationships)

## Phase 2 — Connect React

- [x] CORS middleware already wired for `http://localhost:5173`
- [ ] From React, `fetch("http://localhost:8000/interviews/")` and render the JSON
- [ ] (Optional) Add a Vite dev **proxy** so the frontend can call `/api/...`
- [ ] Build one feature end-to-end (a "vertical slice"), then repeat per feature

## Phase 3 — Make it a real Virtual Interviewer

- [ ] **Auth** — users, registration/login, JWT, protected routes
- [ ] **The AI interviewer** — generate questions & evaluate answers with an LLM.
      Use the **Claude API** (Anthropic Python SDK) with a current model. This is
      the "interviewer brain."
- [ ] Persist interview sessions / transcripts
- [ ] Scoring & feedback, polished React UI

## Phase 4 — Production polish (later)

- [ ] Move SQLite → Postgres (only the `database_url` changes)
- [ ] Environment config via `.env` (never commit secrets)
- [ ] Tests (pytest for backend, Vitest/RTL for frontend)
- [ ] Deploy (containerize; host API + static frontend build)

---

## Notes

- **CORS** is the #1 first-time gotcha: without the middleware in `main.py`, the
  browser silently blocks React → API calls. Already handled.
- Keep routers thin; put real logic in a `services/` module as it grows.
- `init_db()` auto-creates tables for now. Once Alembic is in, delete that call
  and manage schema changes through migrations instead.
