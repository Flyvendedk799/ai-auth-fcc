from openai import AsyncOpenAI
import asyncio
async def test():
    client = AsyncOpenAI(api_key='ai-auth', base_url='http://127.0.0.1:4141/v1')
    try:
        await client.models.list()
        print('SUCCESS')
    except Exception as e:
        print('ERROR:', type(e), e)
asyncio.run(test())
