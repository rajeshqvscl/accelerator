# QVSCL Accelerator Website Blueprint

A zero-install full-stack prototype for **QVSCL Accelerator & Venture Studio**.

## Stack

- Frontend: React 18 loaded as browser modules
- Backend: Python standard-library HTTP server
- Data: in-memory site content plus local JSONL captures for forms
- Assets: local QVSCL favicon and generated blueprint-desk hero image

## Run

```bash
python3 backend/server.py --port 4173
```

Open:

```text
http://127.0.0.1:4173
```

## API

- `GET /api/site-data` returns navigation/content data for the React app.
- `POST /api/apply` stores founder, studio, or partner inquiries in `data/inquiries.jsonl`.
- `POST /api/newsletter` stores newsletter emails in `data/newsletter.jsonl`.

The frontend imports React from `https://esm.sh`, so the first browser load needs internet access.
