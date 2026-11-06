const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/resolve.ts', 'utf8');

const uiBlock = `    // 1. Try UI-managed account
    try {
      const status = await antigravityAccounts.status('local-user');
      if (status.connected) {
        const token = await antigravityAccounts.token('local-user');
        const opts = antigravityCliOptions({ accessToken: token, refreshToken: null, expiresAt: 0, email: status.email });
        return {
          wire: 'gemini',
          baseURL: opts.baseURL ?? CLOUD_CODE_DAILY_BASE_URL,
          headers: opts.defaultHeaders ?? {},
          isSubscription: true,
          source: \`gemini-ui (\${status.email ?? 'local'})\`,
        };
      }
    } catch { }`;

const cliBlock = `    // 2. Try CLI credential
    try {
      const identity = await antigravity.identity();
      const opts = antigravityCliOptions(identity);
      return {
        wire: 'gemini',
        baseURL: opts.baseURL ?? CLOUD_CODE_DAILY_BASE_URL,
        headers: opts.defaultHeaders ?? {},
        isSubscription: true,
        source: \`gemini-cli (\${identity.email ?? 'local'})\`,
      };
    } catch { }`;

content = content.replace(uiBlock + '\n\n' + cliBlock, cliBlock + '\n\n' + uiBlock);
fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/resolve.ts', content);
