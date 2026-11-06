const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-fcc/src/free_claude_code/ai_auth_proxy.cjs', 'utf8');

const regex = /const wireModel = normalizeAntigravityModelId\(model\);/g;
content = content.replace(regex, 'const wireModel = model;');

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-fcc/src/free_claude_code/ai_auth_proxy.cjs', content);
