import requests
import sys

API_KEY = "YOUR_GCP_API_KEY_HERE"
BASE_URL = "https://stitch.googleapis.com"
PATHS = [
    "/mcp",
    "/v1/mcp",
    "/mcp/v1",
    "/stitch/mcp",
    "/api/mcp",
    "/mcp/sse",
    "/v1/project" 
]

headers = {
    "X-Goog-Api-Key": API_KEY,
    "Content-Type": "application/json"
}

print(f"Testing connectivity to {BASE_URL} with provided API Key...")

for path in PATHS:
    url = f"{BASE_URL}{path}"
    print(f"\n--- Testing {url} ---")
    
    # Try GET
    try:
        r_get = requests.get(url, headers=headers, timeout=5)
        print(f"GET: {r_get.status_code}")
        if r_get.status_code == 200:
            print("SUCCESS! Found valid GET endpoint.")
            print(r_get.text[:200])
    except Exception as e:
        print(f"GET Failed: {e}")

    # Try POST
    try:
        r_post = requests.post(url, headers=headers, json={"jsonrpc": "2.0", "method": "ping", "id": 1}, timeout=5)
        print(f"POST: {r_post.status_code}")
        if r_post.status_code == 200:
            print("SUCCESS! Found valid POST endpoint.")
            print(r_post.text[:200])
    except Exception as e:
        print(f"POST Failed: {e}")
