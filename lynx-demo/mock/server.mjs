/**
 * Local debug proxy for travel-data HTTP traffic.
 *
 * - Logs every incoming request (method, path+query, headers, raw body).
 * - Forwards it verbatim to the real upstream (default https://ts-api.ourtour.com).
 * - Relays the upstream status/headers/body back untouched, so the app sees
 *   the real server response (including real error messages).
 *
 * Usage:
 *   node mock/server.mjs
 *   PORT=5000 UPSTREAM=https://example.com node mock/server.mjs
 */

import Koa from 'koa'
import Router from '@koa/router'

const PORT = Number(process.env.PORT || 4000)
const UPSTREAM = (process.env.UPSTREAM || 'https://ts-api.ourtour.com').replace(/\/$/, '')

/** Hop-by-hop headers that must not be forwarded/relayed. */
const SKIP_REQUEST_HEADERS = new Set(['host', 'content-length', 'connection'])
const SKIP_RESPONSE_HEADERS = new Set([
  'connection',
  'transfer-encoding',
  'content-encoding', // we re-serialize after reading the body buffer
  'content-length',   // recomputed by Koa
])

function ts() {
  return new Date().toISOString()
}

const app = new Koa()
const router = new Router()

// Global error handler: never let one bad request kill the process.
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    console.error(`[${ts()}] !! handler error:`, e)
    ctx.status = ctx.status && ctx.status >= 400 ? ctx.status : 500
    ctx.body = { success: false, message: `mock proxy error: ${e.message}` }
  }
})

// Buffer the raw request body ourselves (no parsing — we only log/forward it).
app.use(async (ctx, next) => {
  const chunks = []
  for await (const chunk of ctx.req) {
    chunks.push(chunk)
  }
  ctx.state.rawBody = Buffer.concat(chunks).toString('utf8')
  await next()
})

router.all('(.*)', async (ctx) => {
  const rawBody = ctx.state.rawBody
  const url = `${UPSTREAM}${ctx.originalUrl}`

  console.log(`\n[${ts()}] --> ${ctx.method} ${ctx.originalUrl}`)
  console.log('    headers:', JSON.stringify(ctx.headers, null, 2))
  console.log(`    raw body (${rawBody.length} bytes):`, rawBody || '(empty)')

  // Build forward headers (skip hop-by-hop).
  const forwardHeaders = {}
  for (const [key, value] of Object.entries(ctx.headers)) {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value
    }
  }

  let upstreamRes
  try {
    upstreamRes = await fetch(url, {
      method: ctx.method,
      headers: forwardHeaders,
      // GET/HEAD must not carry a body
      body: ['GET', 'HEAD'].includes(ctx.method) || !rawBody ? undefined : rawBody,
    })
  } catch (e) {
    console.error(`[${ts()}] !! upstream fetch failed:`, e)
    ctx.status = 502
    ctx.body = { success: false, message: `mock proxy upstream error: ${e.message}` }
    return
  }

  const resBuffer = Buffer.from(await upstreamRes.arrayBuffer())
  const resText = resBuffer.toString('utf8')

  console.log(`[${ts()}] <-- ${upstreamRes.status} ${upstreamRes.statusText} from upstream`)
  console.log('    response headers:', JSON.stringify(Object.fromEntries(upstreamRes.headers.entries()), null, 2))
  console.log(`    response body (${resBuffer.length} bytes):`, resText || '(empty)')

  // Relay upstream response verbatim.
  ctx.status = upstreamRes.status
  upstreamRes.headers.forEach((value, key) => {
    if (!SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      ctx.set(key, value)
    }
  })
  ctx.body = resBuffer
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[mock] listening on http://0.0.0.0:${PORT}, proxying to ${UPSTREAM}`)
})
