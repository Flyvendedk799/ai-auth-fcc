const fs = require('fs');
let content = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', 'utf8');

const oldFetch = `    if (provider.wire === 'gemini') {
      upstreamUrl = geminiUrl(provider, actualModelName);
      upstreamBody = JSON.stringify(provider.isSubscription 
        ? buildGeminiSubscriptionRequest(actualModelName, body.messages, undefined, body.tools)
        : buildGeminiKeyRequest(actualModelName, body.messages, body.tools)
      );
    } else if (provider.wire === 'anthropic') {
      upstreamUrl = anthropicUrl(provider);
      upstreamBody = JSON.stringify(buildAnthropicRequest(actualModelName, body.messages, body.max_tokens ?? 4096, provider.isSubscription));
    } else {
      upstreamUrl = openAiUrl(provider);
      upstreamBody = JSON.stringify({ ...body, model: actualModelName, stream: false });
    }

    console.log(\`Routing \${actualModelName} via \${provider.source}\`);
    console.log('Sending body:', upstreamBody);

    const res = await fetch(upstreamUrl, {
      method: 'POST',
      headers: provider.headers,
      body: upstreamBody,
    });

    const parsed = await res.json() as any;`;

const newFetch = `    if (provider.wire === 'gemini') {
      upstreamUrl = geminiUrl(provider, actualModelName, body.stream || false);
      upstreamBody = JSON.stringify(provider.isSubscription 
        ? buildGeminiSubscriptionRequest(actualModelName, body.messages, undefined, body.tools)
        : buildGeminiKeyRequest(actualModelName, body.messages, body.tools)
      );
    } else if (provider.wire === 'anthropic') {
      upstreamUrl = anthropicUrl(provider);
      upstreamBody = JSON.stringify(buildAnthropicRequest(actualModelName, body.messages, body.max_tokens ?? 4096, provider.isSubscription));
    } else {
      upstreamUrl = openAiUrl(provider);
      upstreamBody = JSON.stringify({ ...body, model: actualModelName, stream: false });
    }

    console.log(\`Routing \${actualModelName} via \${provider.source}\`);
    console.log('Sending body:', upstreamBody);

    const res = await fetch(upstreamUrl, {
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
        return reply;
      } else {
        const parsed = await res.json() as any;
        const formattedResponse = provider.wire === 'anthropic' ? anthropicResponseToOpenAi(parsed, actualModelName, requestId) : openAiResponsePassthrough(parsed, requestId);
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
        return reply;
      }
    }

    const parsed = await res.json() as any;`;

content = content.replace(oldFetch, newFetch);

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
      
      return reply;
    }`;

content = content.replace(oldFakeStream, ``);

fs.writeFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/server.ts', content);

let translateContent = fs.readFileSync('C:/Users/tobia/.gemini/antigravity/worktrees/ai-auth-proxy/server/src/translate.ts', 'utf8');
if (!translateContent.includes('stream: boolean = false')) {
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
}

