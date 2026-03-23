from google import genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def call_gemini_json(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=prompt,
        config={"response_mime_type": "application/json"}
    )

    try:
        return json.loads(response.text)
    except:
        return {"error": "Invalid JSON", "raw": response.text}
