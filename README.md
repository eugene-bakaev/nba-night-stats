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

## Deployment to Render (Recommended)

This project includes a `render.yaml` Blueprint, which automates the setup of both services.

1.  Log in to [Render](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will automatically detect the `render.yaml` and configure:
    *   **Backend:** A Python Web Service.
    *   **Frontend:** A Static Site with the `VITE_API_URL` pre-linked to the backend.
5.  Click **Apply**.

### Manual Deployment (Alternative)
If you prefer to set them up manually:
... (rest of the existing content)
