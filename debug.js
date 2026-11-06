const { resolveProvider } = require('./src/free_claude_code/ai_auth_proxy.cjs');
resolveProvider('gemini-3.1-pro').then(console.log).catch(console.error);
