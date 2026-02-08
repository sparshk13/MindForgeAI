import os
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("CHATGPT_KEY")
print("CHATGPT_KEY Loaded:", api_key is not None)

client = OpenAI(api_key=api_key)

# Test API by listing models
try:
    res = client.models.list()
    print("✅ OpenAI API Models:", res)
except Exception as e:
    print("❌ Error while calling OpenAI API:", e)
