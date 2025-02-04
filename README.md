# MLB Brain

**Real-time MLB game insights powered by AI.**

## Overview
MLB Brain provides intelligent, real-time commentary and insights for MLB games, leveraging AI to analyze game situations and historical context.

## Features
- Real-time game analysis and commentary
- AI-powered game insights using Google Gemini
- Integrated ElevenLabs voice synthesis widget
- UI built with React and Tailwind CSS

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
```bash
# Navigate to backend directory
cd mlb-voice-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scriptsctivate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

## Environment Setup:

### Backend Environment Variables
Create a `.env` file in the `mlb-voice-backend` directory with:
```bash
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=config/keys/your-credentials.json
GOOGLE_API_KEY=your-api-key
```

### Frontend Environment Variables
Create a `.env` file in the root directory with:
```bash
VITE_GEMINI_API_KEY=your-api-key
```

### Google Cloud Setup
1. Create a Google Cloud project and enable the Gemini API
2. Download your service account credentials JSON file
3. Place the credentials file in `mlb-voice-backend/config/keys/`
4. Update the `GOOGLE_APPLICATION_CREDENTIALS` path accordingly

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

## License
This project is MIT licensed. See [LICENSE](LICENSE) file.

