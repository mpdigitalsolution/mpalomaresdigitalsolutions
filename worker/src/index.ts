import { SYSTEM_PROMPT } from './system-prompt'

export interface Env {
  DEEPSEEK_API_KEY?: string
  ALLOWED_ORIGINS?: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      })
    }

    // Health check route
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'mp-digital-solutions-ai-concierge',
          hasApiKey: !!env.DEEPSEEK_API_KEY,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Chat route
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = (await request.json()) as ChatRequestBody

        if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid payload: messages array is required' }),
            {
              status: 400,
              headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            }
          )
        }

        // Keep last 10 messages to maintain tight context window
        const recentMessages = body.messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content.slice(0, 2000),
        }))

        // Prepend our grounded system prompt
        const fullMessages: ChatMessage[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
        ]

        // Check if API key is configured
        if (!env.DEEPSEEK_API_KEY) {
          // Provide an intelligent simulated stream response while key is pending
          const fallbackText =
            "Hello! I am Marlon's AI Operations Concierge. My DeepSeek connection is active on Cloudflare Edge, awaiting the DEEPSEEK_API_KEY secret. In the meantime: Marlon specializes in production n8n automations, custom AI agents, and GoHighLevel CRM architecture. Feel free to contact him directly at marlonpalomares04@gmail.com!"

          return createSimulatedSSEStream(fallbackText)
        }

        // Call DeepSeek API with streaming enabled
        const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: fullMessages,
            stream: true,
            temperature: 0.6,
            max_tokens: 1024,
          }),
        })

        if (!deepseekResponse.ok) {
          const errText = await deepseekResponse.text()
          return new Response(
            JSON.stringify({
              error: 'DeepSeek API error',
              status: deepseekResponse.status,
              details: errText,
            }),
            {
              status: deepseekResponse.status,
              headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            }
          )
        }

        // Pipe the SSE stream straight through to the browser
        return new Response(deepseekResponse.body, {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS })
  },
}

/**
 * Creates a simulated Server-Sent Event stream if the API key is not yet set.
 */
function createSimulatedSSEStream(text: string): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(' ')
      for (const word of words) {
        const chunk = {
          choices: [
            {
              delta: { content: word + ' ' },
            },
          ],
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        await new Promise((resolve) => setTimeout(resolve, 20))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
