# MLB Voice Dashboard Backend

This backend uses Gemini 2.0 Flash for real-time voice interactions through the Multimodal Live API.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
Create a `.env` file with:
```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
```

3. Make sure you have authenticated with Google Cloud:
```bash
gcloud auth application-default login
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`.
