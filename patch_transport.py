import os
path = "C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-fcc/src/free_claude_code/providers/openai_chat/transport.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_stream = """                stream = OpenAIStreamAdapter(
                    await client.chat.completions.create(
                        **create_body,
                        stream=True,
                    )
                )"""

new_stream = """                # For AI_AUTH, stream=False to avoid hanging UI while the proxy fakes the stream
                is_ai_auth = self._profile.request_policy.provider_name == "AI_AUTH"
                if is_ai_auth:
                    res = await client.chat.completions.create(
                        **create_body,
                        stream=False,
                    )
                    # Create a dummy async generator to yield the single response
                    async def fake_stream():
                        yield res.choices[0].message.content or ""
                    stream = fake_stream()
                else:
                    stream = OpenAIStreamAdapter(
                        await client.chat.completions.create(
                            **create_body,
                            stream=True,
                        )
                    )"""

content = content.replace(old_stream, new_stream)
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
