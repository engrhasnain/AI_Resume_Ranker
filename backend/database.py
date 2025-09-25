from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()  # ensure this is at the very top

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

print("DEBUG: URL =", url)   # <-- ADD THIS
print("DEBUG: KEY =", key)   # <-- ADD THIS

supabase = create_client(url, key)

