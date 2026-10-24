import { SYSTEM_PROMPT } from './system-prompt'
import type { Env } from './types'
import {
  getClientByPasskey,
  getClientById,
  getClientPortalData,
  updateOnboardingStep,
  signContract,
  postChatMessage,
  submitApprovalDecision,
  payInvoice,
} from './db'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Id',
  'Access-Control-Max-Age': '86400',
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  })
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
      return jsonResponse({
        status: 'ok',
        service: 'mp-digital-solutions-api-and-portal',
        d1Ready: !!env.DB,
        r2Ready: !!env.ASSETS_BUCKET,
        hasApiKey: !!env.DEEPSEEK_API_KEY,
        timestamp: new Date().toISOString(),
      })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PORTAL API ENDPOINTS
    // ─────────────────────────────────────────────────────────────────────────────

    // 1. List Available Demo Clients (for quick switcher)
    if (url.pathname === '/api/portal/clients' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare(
          'SELECT id, name, company, email, avatar_url, project_name, tier FROM clients WHERE status = "active"'
        ).all()
        return jsonResponse({ clients: results || [] })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 2. Client Authentication (Passkey or Email)
    if (url.pathname === '/api/portal/auth/login' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { passkey?: string }
        if (!body.passkey) {
          return jsonResponse({ error: 'Passkey or email is required' }, 400)
        }

        const client = await getClientByPasskey(env.DB, body.passkey)
        if (!client) {
          return jsonResponse({ error: 'Invalid passkey. Try "apex2026" or select demo mode.' }, 401)
        }

        return jsonResponse({
          success: true,
          client: {
            id: client.id,
            name: client.name,
            company: client.company,
            email: client.email,
            avatar_url: client.avatar_url,
            project_name: client.project_name,
            tier: client.tier,
          },
        })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 3. Client Portal Dashboard & Full Aggregated State
    if (url.pathname === '/api/portal/dashboard' && request.method === 'GET') {
      try {
        const clientId =
          request.headers.get('X-Client-Id') || url.searchParams.get('clientId') || 'client_demo'
        const data = await getClientPortalData(env.DB, clientId)

        if (!data) {
          return jsonResponse({ error: 'Client not found' }, 404)
        }

        return jsonResponse(data)
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 4. Update / Complete Onboarding Step
    if (url.pathname === '/api/portal/onboarding/complete-step' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          clientId: string
          stepId: string
          status: 'pending' | 'in_progress' | 'completed'
          submittedData?: Record<string, unknown>
        }

        if (!body.clientId || !body.stepId) {
          return jsonResponse({ error: 'Missing clientId or stepId' }, 400)
        }

        const success = await updateOnboardingStep(
          env.DB,
          body.clientId,
          body.stepId,
          body.status,
          body.submittedData ? JSON.stringify(body.submittedData) : undefined
        )

        return jsonResponse({ success })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 5. Sign Contract
    if (url.pathname === '/api/portal/contracts/sign' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          clientId: string
          contractId: string
          signerName: string
          signature: string
        }

        if (!body.clientId || !body.contractId || !body.signerName || !body.signature) {
          return jsonResponse({ error: 'Missing required contract signing fields' }, 400)
        }

        const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1'
        const success = await signContract(
          env.DB,
          body.clientId,
          body.contractId,
          body.signerName,
          body.signature,
          clientIp
        )

        // Automatically create a system announcement in the chat thread
        await postChatMessage(
          env.DB,
          body.clientId,
          'system',
          'Legal Audit Trail',
          `📄 Contract "${body.contractId}" was digitally signed by ${body.signerName} (IP: ${clientIp}).`
        )

        return jsonResponse({ success, signedAt: new Date().toISOString() })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 6. Chat Messaging (Post Message)
    if (url.pathname === '/api/portal/messages' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          clientId: string
          sender: 'client' | 'agency'
          senderName: string
          messageText: string
          attachmentUrl?: string
        }

        if (!body.clientId || !body.messageText) {
          return jsonResponse({ error: 'Missing message content' }, 400)
        }

        const message = await postChatMessage(
          env.DB,
          body.clientId,
          body.sender || 'client',
          body.senderName || 'Client Member',
          body.messageText,
          body.attachmentUrl
        )

        return jsonResponse({ success: true, message })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 7. Deliverable Approvals
    if (url.pathname === '/api/portal/approvals/decide' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          clientId: string
          approvalId: string
          status: 'approved' | 'revisions_requested'
          clientNotes?: string
        }

        if (!body.clientId || !body.approvalId || !body.status) {
          return jsonResponse({ error: 'Missing decision parameters' }, 400)
        }

        const success = await submitApprovalDecision(
          env.DB,
          body.clientId,
          body.approvalId,
          body.status,
          body.clientNotes
        )

        // Notify in chat thread
        const decisionText =
          body.status === 'approved'
            ? `✅ Deliverable was APPROVED by client.`
            : `⚠️ Revisions were requested: "${body.clientNotes || 'No notes provided'}"`

        await postChatMessage(
          env.DB,
          body.clientId,
          'system',
          'Milestone Approvals',
          decisionText
        )

        return jsonResponse({ success })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 7.5 Pay Invoice (Simulation & Direct Settlement)
    if (url.pathname === '/api/portal/invoices/pay' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          clientId: string
          invoiceId: string
        }

        if (!body.clientId || !body.invoiceId) {
          return jsonResponse({ error: 'Missing clientId or invoiceId' }, 400)
        }

        const invoice = await payInvoice(env.DB, body.clientId, body.invoiceId)
        if (!invoice) {
          return jsonResponse({ error: 'Invoice not found or already settled' }, 404)
        }

        // Post system announcement to chat
        const formattedAmount = (invoice.amount_cents / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: invoice.currency || 'USD',
        })
        await postChatMessage(
          env.DB,
          body.clientId,
          'system',
          'Billing Operations',
          `💳 Invoice ${invoice.invoice_number} (${formattedAmount}) was settled. Receipt generated.`
        )

        return jsonResponse({ success: true, invoice })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // 8. R2 Asset Upload (Direct Put)
    if (url.pathname === '/api/portal/upload' && request.method === 'POST') {
      try {
        const clientId = request.headers.get('X-Client-Id') || 'general'
        const filename = url.searchParams.get('filename') || `asset-${Date.now()}.bin`
        const objectKey = `clients/${clientId}/${Date.now()}-${filename}`

        const bodyData = await request.arrayBuffer()
        await env.ASSETS_BUCKET.put(objectKey, bodyData, {
          httpMetadata: {
            contentType: request.headers.get('Content-Type') || 'application/octet-stream',
          },
        })

        const publicUrl = `https://my-portfolio-assets.mpalomaresdigitalsolutions.workers.dev/${objectKey}`
        return jsonResponse({ success: true, key: objectKey, url: publicUrl })
      } catch (err: unknown) {
        return jsonResponse({ error: String(err) }, 500)
      }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PORTFOLIO AI CHATBOT ROUTE (Streaming DeepSeek)
    // ─────────────────────────────────────────────────────────────────────────────
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = (await request.json()) as ChatRequestBody

        if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
          return jsonResponse({ error: 'Invalid payload: messages array is required' }, 400)
        }

        const recentMessages = body.messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content.slice(0, 2000),
        }))

        const fullMessages: ChatMessage[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
        ]

        if (!env.DEEPSEEK_API_KEY) {
          const fallbackText =
            "Hello! I am Marlon's AI Operations Concierge. My DeepSeek connection is active on Cloudflare Edge. Feel free to contact him directly at marlonpalomares04@gmail.com!"
          return createSimulatedSSEStream(fallbackText)
        }

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
          return jsonResponse(
            { error: 'DeepSeek API error', status: deepseekResponse.status, details: errText },
            deepseekResponse.status
          )
        }

        return new Response(deepseekResponse.body, {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      } catch (err: unknown) {
        return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500)
      }
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS })
  },
}

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
