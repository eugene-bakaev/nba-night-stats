# NBA Night Stats

## Local Development

### 1. Prerequisites
- Python 3.9+
- Node.js & npm

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 5175
```
The frontend will be available at `http://localhost:5175`.

## Deployment to Render

This project is structured for easy deployment on [Render](https://render.com/).

### Backend (Web Service)
1. Create a new **Web Service**.
2. Connect your GitHub repository.
3. Root Directory: `backend`
4. Runtime: `Python 3`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Static Site)
1. Create a new **Static Site**.
2. Connect your GitHub repository.
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. **Environment Variable:** Add `VITE_API_URL` pointing to your deployed Backend URL.

> **Note:** Update `App.jsx` to use `import.meta.env.VITE_API_URL` instead of the hardcoded localhost string.
