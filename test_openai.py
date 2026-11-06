from openai import OpenAI

client = OpenAI(
    api_key="ai-auth",
    base_url="http://127.0.0.1:4141/v1"
)

response = client.chat.completions.create(
    model="gemini-3.8-flash",
    messages=[{"role": "user", "content": "Write a short poem."}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")
print()
