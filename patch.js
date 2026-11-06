const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', 'utf8');

const oldDelta = `delta: { content: openAiRes.choices[0]?.message.content ?? '' }`;
const newDelta = `delta: { 
                        content: openAiRes.choices[0]?.message?.content ?? '',
                        ...(openAiRes.choices[0]?.message?.tool_calls ? { tool_calls: openAiRes.choices[0]?.message?.tool_calls } : {})
                      }`;

content = content.replace(oldDelta, newDelta);
fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', content);
