const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');

const oldFunc = `function openAiToGeminiTools(tools?: any[]): any[] | undefined {
  if (!tools || tools.length === 0) return undefined;
  
  const functionDeclarations = tools
    .filter(t => t.type === 'function' && t.function)
    .map(t => t.function);
    
  if (functionDeclarations.length === 0) return undefined;
  
  return [{ functionDeclarations }];
}`;

const newFunc = `function sanitizeSchema(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeSchema);
  
  const newObj: any = {};
  for (const key in obj) {
    if (key === '$schema' || key === 'additionalProperties' || key === 'default') continue;
    newObj[key] = sanitizeSchema(obj[key]);
  }
  return newObj;
}

function openAiToGeminiTools(tools?: any[]): any[] | undefined {
  if (!tools || tools.length === 0) return undefined;
  
  const functionDeclarations = tools
    .filter(t => t.type === 'function' && t.function)
    .map(t => sanitizeSchema(t.function));
    
  if (functionDeclarations.length === 0) return undefined;
  
  return [{ functionDeclarations }];
}`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', content);
