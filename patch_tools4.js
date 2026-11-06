const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');

const regex = /if \(key === '\$schema' \|\| key === 'additionalProperties' \|\| key === 'default'\) continue;/;
content = content.replace(regex, "if (key === '$schema' || key === 'additionalProperties' || key === 'default' || key === 'const' || key === 'exclusiveMinimum') continue;");

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', content);
