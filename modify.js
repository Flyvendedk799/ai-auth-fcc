const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', 'utf8');

let translateContent = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');
translateContent = translateContent.replace(
  `export function geminiUrl(provider: ResolvedProvider, model: string): string {`,
  `export function geminiUrl(provider: ResolvedProvider, model: string, stream: boolean = false): string {`
);
translateContent = translateContent.replace(
  `return \`\${base}:generateContent\`;`,
  `return \`\${base}:\${stream ? 'streamGenerateContent?alt=sse' : 'generateContent'}\`;`
);
translateContent = translateContent.replace(
  `return \`\${base}/models/\${model}:generateContent\`;`,
  `return \`\${base}/models/\${model}:\${stream ? 'streamGenerateContent?alt=sse' : 'generateContent'}\`;`
);
fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', translateContent);

const oldFetch = `    const res = await fetch(upstreamUrl, {
      method: 'POST',
      headers: provider.headers,
      body: upstreamBody,
    });

    const parsed = await res.json() as any;`;

const newFetch = `    const res = await fetch(upstreamUrl, {
      method: 'POST',
      headers: provider.headers,
      body: upstreamBody,
    });

    if (body.stream) {
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      reply.hijack();
      
      if (provider.wire === 'gemini') {
        let buffer = '';
        if (res.body) {
          for await (const chunk of (res.body as any)) {
            buffer += chunk.toString();
            let lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (let line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const openAiRes = geminiResponseToOpenAi(data, actualModelName, requestId);
                  const chunkStr = JSON.stringify({
                    id: requestId,
                    object: 'chat.completion.chunk',
                    created: openAiRes.created,
                    model: openAiRes.model,
                    choices: [{
                      index: 0,
                      delta: { content: openAiRes.choices[0]?.message.content ?? '' },
                      finish_reason: openAiRes.choices[0]?.finish_reason === 'stop' ? null : (openAiRes.choices[0]?.finish_reason?.toLowerCase() ?? null)
                    }]
                  });
                  reply.raw.write(\`data: \${chunkStr}\n\n\`);
                } catch (e) {}
              }
            }
          }
        }
        reply.raw.write(\`data: \${JSON.stringify({
          id: requestId,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: actualModelName,
          choices: [{ index: 0, delta: {}, finish_reason: 'stop' }]
        })}\n\n\`);
        reply.raw.write('data: [DONE]\n\n');
        reply.raw.end();
        return;
      }
    }

    const parsed = await res.json() as any;`;

content = content.replace(oldFetch, newFetch);

const oldUpstreamUrl = `    if (provider.wire === 'gemini') {
      upstreamUrl = geminiUrl(provider, actualModelName);`;
const newUpstreamUrl = `    if (provider.wire === 'gemini') {
      upstreamUrl = geminiUrl(provider, actualModelName, body.stream || false);`;

content = content.replace(oldUpstreamUrl, newUpstreamUrl);

const oldFakeStream = `    if (body.stream) {
      const chunk = {
        id: requestId,
        object: 'chat.completion.chunk',
        created: formattedResponse.created,
        model: formattedResponse.model,
        choices: [{
          index: 0,
          delta: {
            role: 'assistant',
            content: formattedResponse.choices[0]?.message.content ?? '',
          },
          finish_reason: null
        }]
      };

      const finalChunk = {
        id: requestId,
        object: 'chat.completion.chunk',
        created: formattedResponse.created,
        model: formattedResponse.model,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: formattedResponse.choices[0]?.finish_reason ?? 'stop'
        }]
      };

      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      reply.raw.write(\`data: \${JSON.stringify(chunk)}\n\n\`);
      reply.raw.write(\`data: \${JSON.stringify(finalChunk)}\n\n\`);
      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
      
      // Tell fastify we handled the response natively
      reply.hijack();
      return;
    }`;

content = content.replace(oldFakeStream, `    if (body.stream) {
      const chunkStr = JSON.stringify({
        id: requestId, object: 'chat.completion.chunk', created: formattedResponse.created, model: formattedResponse.model,
        choices: [{ index: 0, delta: { role: 'assistant', content: formattedResponse.choices[0]?.message.content ?? '' }, finish_reason: null }]
      });
      reply.raw.write(\`data: \${chunkStr}\n\n\`);
      reply.raw.write(\`data: \${JSON.stringify({
        id: requestId, object: 'chat.completion.chunk', created: formattedResponse.created, model: formattedResponse.model,
        choices: [{ index: 0, delta: {}, finish_reason: formattedResponse.choices[0]?.finish_reason ?? 'stop' }]
      })}\n\n\`);
      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
      return;
    }`);

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', content);
