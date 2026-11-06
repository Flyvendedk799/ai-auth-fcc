const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', 'utf8');

const regex = /delta:\s*\{\s*role:\s*'assistant',\s*content:\s*formattedResponse\.choices\[0\]\?\.message\.content\s*\?\?\s*'',\s*\}/g;

const replacement = `delta: {
            role: 'assistant',
            content: formattedResponse.choices[0]?.message.content ?? '',
            ...(formattedResponse.choices[0]?.message.tool_calls ? { tool_calls: formattedResponse.choices[0]?.message.tool_calls } : {})
          }`;

content = content.replace(regex, replacement);

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', content);
