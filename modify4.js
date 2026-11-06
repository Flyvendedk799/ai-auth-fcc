const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', 'utf8');

const oldGeminiModels = `'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash', 'gemini-3-pro', 'gemini-3.1-pro',`;
const newGeminiModels = `'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash', 'gemini-3-pro', 'gemini-3.1-pro', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash',`;

const oldProxyGeminiModels = `'proxy-gemini-2.5-flash', 'proxy-gemini-2.5-pro', 'proxy-gemini-3-flash', 'proxy-gemini-3-pro', 'proxy-gemini-3.1-pro'`;
const newProxyGeminiModels = `'proxy-gemini-2.5-flash', 'proxy-gemini-2.5-pro', 'proxy-gemini-3-flash', 'proxy-gemini-3-pro', 'proxy-gemini-3.1-pro', 'proxy-gemini-3.6-flash', 'proxy-gemini-3.7-flash', 'proxy-gemini-3.8-flash'`;

content = content.replace(oldGeminiModels, newGeminiModels);
content = content.replace(oldProxyGeminiModels, newProxyGeminiModels);

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', content);
