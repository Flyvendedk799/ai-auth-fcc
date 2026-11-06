const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');

const replacement = `function sanitizeSchema(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeSchema);
  const newObj: any = {};
  for (const key in obj) {
    if (key === '$schema' || key === 'additionalProperties' || key === 'default') continue;
    newObj[key] = sanitizeSchema(obj[key]);
  }
  return newObj;
}

function openAiToGeminiTools(tools?: any[]): any[] | undefined {`;

content = content.replace("function openAiToGeminiTools(tools?: any[]): any[] | undefined {", replacement);
content = content.replace(".map(t => t.function)", ".map(t => sanitizeSchema(t.function))");

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', content);
