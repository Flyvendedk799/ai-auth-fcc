const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-fcc/src/free_claude_code/providers/openai_chat/transport.py', 'utf8');

const old_stream = `                stream = OpenAIStreamAdapter(
                    await client.chat.completions.create(
                        **create_body,
                        stream=True,
                    )
                )`;

const new_stream = `                is_ai_auth = getattr(self._profile.request_policy, "provider_name", "") == "AI_AUTH"
                if is_ai_auth:
                    res = await client.chat.completions.create(
                        **create_body,
                        stream=False,
                    )
                    
                    async def fake_stream():
                        yield res.choices[0].message.content or ""
                        
                    stream = fake_stream()
                else:
                    stream = OpenAIStreamAdapter(
                        await client.chat.completions.create(
                            **create_body,
                            stream=True,
                        )
                    )`;

content = content.replace(old_stream, new_stream);
fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-fcc/src/free_claude_code/providers/openai_chat/transport.py', content);
