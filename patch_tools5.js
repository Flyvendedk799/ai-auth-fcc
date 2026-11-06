const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');

const regex = /if \(key === '\$schema' \|\| key === 'additionalProperties' \|\| key === 'default' \|\| key === 'const' \|\| key === 'exclusiveMinimum'\) continue;/g;
content = content.replace(regex, "if (key === '$schema' || key === 'additionalProperties' || key === 'default' || key === 'const' || key === 'exclusiveMinimum' || key === 'propertyNames' || key === 'anyOf' || key === 'allOf' || key === 'oneOf' || key === 'not' || key === 'patternProperties') continue;");

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', content);
