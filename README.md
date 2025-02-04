# MLB Brain

**Real-time MLB game insights powered by AI.**

## Overview
MLB Brain provides intelligent, real-time commentary and insights for MLB games, leveraging AI to analyze game situations and historical context.

## Features
- Real-time game analysis and commentary
- AI-powered game insights using Google Gemini
- Integrated ElevenLabs voice synthesis widget
- UI built with React and Tailwind CSS

## Live Demo
Frontend: [https://mlb-voice-dashboard.vercel.app](https://mlb-voice-dashboard.vercel.app)

## Quick Start

### Frontend Setup
```bash
# Clone repo
git clone https://github.com/acstener/mlb-voice-dashboard.git

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup
The backend code is maintained in a separate repository: [mlb-brain-backend](https://github.com/acstener/mlb-brain-backend)

```bash
# Clone backend repo
git clone https://github.com/acstener/mlb-brain-backend.git

# Navigate to backend directory
cd mlb-brain-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

## Environment Setup:

### Backend Environment Variables
Create a `.env` file in the backend directory with:
```bash
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=config/keys/your-credentials.json
GOOGLE_API_KEY=your-api-key
PORT=8765  # Required for deployment
```

### Frontend Environment Variables
Create a `.env` file in the root directory with:
```bash
VITE_GEMINI_API_KEY=your-api-key
VITE_BACKEND_URL=http://localhost:8765  # For local development
# For production, use your deployed backend URL:
# VITE_BACKEND_URL=https://your-backend-url.railway.app
```

### Google Cloud Setup
1. Create a Google Cloud project and enable the Gemini API
2. Download your service account credentials JSON file
3. Place the credentials file in `config/keys/` directory
4. Update the `GOOGLE_APPLICATION_CREDENTIALS` path accordingly

### Deployment
#### Backend Deployment (Railway)
1. Fork the [backend repository](https://github.com/acstener/mlb-brain-backend)
2. Create a new project on [Railway](https://railway.app)
3. Connect your forked repository
4. Add environment variables in Railway:
   - `GOOGLE_CLOUD_PROJECT`
   - `GOOGLE_CLOUD_REGION`
   - `GOOGLE_API_KEY`
   - `PORT=8765`
5. Upload your Google Cloud service account key in Railway's "Files" section
6. Set `GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/service-account-key.json`

#### Frontend Deployment (Vercel)
1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add environment variables in Vercel:
   - `VITE_GEMINI_API_KEY`
   - `VITE_BACKEND_URL` (your Railway backend URL)

## Tech Stack
### Frontend
- React + TypeScript
- Tailwind CSS
- ElevenLabs Voice Synthesis Widget
- Google Generative AI SDK

### Backend
- Python Flask
- Google Gemini Pro for game analysis
- MLB Stats API integration
- WebSocket for real-time communication

## License
This project is MIT licensed. See [LICENSE](LICENSE) file.
