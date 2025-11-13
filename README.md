# EcoBarter

> A voice-enabled, waste-for-tree exchange platform connecting rural farmers with collection agents. Farmers report waste (text or future voice), earn rewards (tree seedlings, compost credits) and schedule collection via a simple frontend backed by an Express + MongoDB API.

This repository contains two main parts:

- `backend/` — Express.js REST API, MongoDB models, authentication (JWT), and routes for farmers, waste reports, and rewards.
- `frontend/` — React + Vite TypeScript app (Tailwind), the UI used by farmers and agents.

---

## Table of contents

- Project overview
- Tech stack
- Repo layout
- Prerequisites
- Local setup (backend and frontend)
- Environment variables
- Running (dev / prod)
- Common issues & troubleshooting
- Next steps and contribution

---

## Project overview

EcoBarter aims to make it easy for farmers to report recyclable waste in their communities and exchange it for environmental rewards. The backend exposes REST endpoints; the frontend calls those endpoints to sign up users, submit waste reports, and view history and rewards.

Key flows:

- Sign up / login (JWT-based)
- Report waste (POST /api/waste-reports)
- Farmer dashboard: view stats and recent waste reports

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), dotenv, cors, bcrypt, jsonwebtoken
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Dev tooling: nodemon (backend), vite (frontend)

## Repo layout

Top-level folders:

- `backend/` — API server

  - `src/app.js` — Express app setup (CORS, middleware, routes)
  - `src/server.js` — starts the server
  - `src/config/db.js` — MongoDB connection logic
  - `src/routes/` — API routes (auth, farmers, wasteReports, rewards)
  - `src/models/` — Mongoose models (User, WasteReport, Reward)

- `frontend/` — UI code
  - `src/main.tsx`, `src/App.tsx` etc.
  - `src/components/` — UI components and dashboard screens
  - `src/lib/api.js` — shared axios instance (VITE_API_BASE aware)

## Prerequisites

- Node.js (v18+ recommended)
- npm (or pnpm/yarn)
- MongoDB access: Atlas connection string or a local MongoDB instance (Docker recommended for local)

Optional:

- Docker (to run Mongo locally)

## Environment variables

Backend (`backend/.env`) — create this file (example below):

```
FRONTEND_URL=http://localhost:8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/ecobarterDb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

Notes:

- `MONGO_URI`: required for production. When developing, you can run without a DB but many endpoints will return `503` or fail. Use a valid Atlas URI (replace `<password>`), or run Mongo locally via Docker:

```powershell
docker run -d -p 27017:27017 --name ecobarter-mongo mongo:6
# then use: MONGO_URI=mongodb://localhost:27017/ecobarterDb
```

- `JWT_SECRET`: 64-char random string recommended. This is used to sign tokens returned at login/signup.
- `FRONTEND_URL`: used by CORS in production. In development the server allows `localhost:*` origins.

Frontend (`frontend/.env`) — optional local vars (Vite):

```
VITE_API_BASE=http://localhost:5000/api
```

This ensures frontend axios instance uses your local backend.

## Local development — Backend

1. Install dependencies

```powershell
cd backend
npm install
```

2. Create `.env` (see examples above). Make sure `MONGO_URI` and `JWT_SECRET` are set.

3. Start the server (dev)

```powershell
npm run dev
# or
node src/server.js
```

Server listens by default on port `5000`. You should see a log like:

```
✅ EcoBarter backend running on port 5000
```

If the DB connection fails you will see an error in the console (e.g. `bad auth : authentication failed`). Verify your `MONGO_URI` and credentials.

## Local development — Frontend

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Run dev server

```powershell
# Optional (for this session) set API base so app points to local backend
$env:VITE_API_BASE='http://localhost:5000/api'
npm run dev
```

Vite commonly runs on port 8080. If port 8080 is used it will pick another port (e.g., 8081). The backend CORS configuration allows `localhost` origins during development so this is supported.

## Quick smoke tests (PowerShell)

Backend root:

```powershell
Invoke-RestMethod -Uri http://localhost:5000 -UseBasicParsing
```

Signup (example):

```powershell
$body = @{ fullName='Test User'; email='test@example.com'; password='password123'; role='farmer' } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/auth/signup' -ContentType 'application/json' -Body $body
```

Submit a waste report (example):

```powershell
$body = @{ farmer_id='testUserId'; waste_type='plastic_bottles'; quantity=3; description='test'; location='farm'; status='pending' } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/waste-reports' -ContentType 'application/json' -Body $body
```

## Common issues & troubleshooting

- Network / CORS errors in browser:

  - Verify backend is running and reachable from the browser (open `http://localhost:5000` in browser or use `curl`/Invoke-RestMethod).
  - Ensure `FRONTEND_URL` in `backend/.env` matches your front-end origin in production. In development the backend allows localhost origins.

- `bad auth : authentication failed` when connecting to MongoDB:

  - The Atlas connection string in `MONGO_URI` contains invalid credentials or an un-permitted IP. Replace `<password>` with the correct password. If using Atlas, ensure your IP whitelist or Network Access allows your client.

- `axios is not defined` or other runtime errors in frontend:

  - Ensure all files import `axios` where used, or use the shared axios instance `frontend/src/lib/api.js` which reads `VITE_API_BASE`.

- TypeScript/Tailwind config require() error (dev):
  - If `frontend/tailwind.config.ts` uses `require('...')`, install `@types_node` or convert to ES imports.
    ```powershell
    cd frontend
    npm i -D @types/node
    ```

## Developer notes

- Field naming: backend uses snake_case (e.g., `farmer_id`, `created_at`) in the DB model. The frontend maps these fields to camelCase where necessary. If you prefer consistency, update the backend responses (or use a serialization layer) to return camelCase.
- CORS: backend allows all `localhost` origins in development. In production set `FRONTEND_URL` and the backend will only allow that origin.

## Next steps / recommended improvements

- Centralize API base usage in the frontend by using `src/lib/api.js` everywhere instead of hardcoded `http://localhost:5000` strings.
- Add tests for backend routes (auth, wasteReports) and E2E tests covering signup → submit report flows.
- Add automatic migrations / seed data for development.

## Contribution

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Open a PR with a clear description and tests if applicable

## License

This project doesn't have a license file in the repo. Add `LICENSE` if you plan to open source it.

---

If you'd like, I can also:

- Add `backend/.env.example` and `frontend/.env.example` files.
- Replace all hardcoded `http://localhost:5000` calls in the frontend with the axios wrapper that reads `VITE_API_BASE`.
- Add troubleshooting steps specific to any error you still observe.

If you want any of those follow-ups implemented, tell me which and I'll add them next.
