from dotenv import load_dotenv
import os
import google.generativeai as genai
from google.cloud import aiplatform

# Load environment variables
load_dotenv()

# Initialize Vertex AI
aiplatform.init(
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_REGION"),
)

# Try a simple test
try:
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    response = model.generate_content("Say 'Hello! Authentication successful!' if you can read this.")
    print("Test result:", response.text)
    print("\nAuthentication successful! Your service account key is working.")
except Exception as e:
    print("Error occurred:", str(e))
