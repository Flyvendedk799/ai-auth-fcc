import sys
with open('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/resolve.ts', 'r') as f:
    content = f.read()

cli_start = content.find('// 2. Try CLI credential')
cli_end = content.find('// 3. API Key')
ui_start = content.find('// 1. Try UI-managed account')
ui_end = cli_start

ui_block = content[ui_start:ui_end]
cli_block = content[cli_start:cli_end]

content = content[:ui_start] + cli_block + ui_block + content[cli_end:]

with open('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/resolve.ts', 'w') as f:
    f.write(content)
