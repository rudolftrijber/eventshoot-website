import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import { loadEnv } from 'vite'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type RouteMatch = {
  modulePath: string
  query: Record<string, string | string[]>
}

function matchApiRoute(pathname: string): RouteMatch | null {
  const routes: Array<{ re: RegExp; modulePath: string; params?: string[] }> = [
    { re: /^\/api\/interview-login$/, modulePath: '/api/interview-login.ts' },
    { re: /^\/api\/interview\/sync$/, modulePath: '/api/interview/sync.ts' },
    { re: /^\/api\/interview\/seed-demo$/, modulePath: '/api/interview/seed-demo.ts' },
    { re: /^\/api\/interview\/settings$/, modulePath: '/api/interview/settings.ts' },
    { re: /^\/api\/interview\/guests$/, modulePath: '/api/interview/guests.ts' },
    { re: /^\/api\/interview\/guests\/([^/]+)$/, modulePath: '/api/interview/guests/[id].ts', params: ['id'] },
    { re: /^\/api\/interview\/productions$/, modulePath: '/api/interview/productions.ts' },
    { re: /^\/api\/interview\/productions\/([^/]+)$/, modulePath: '/api/interview/productions/[id].ts', params: ['id'] },
  ]

  for (const route of routes) {
    const match = pathname.match(route.re)
    if (!match) continue
    const query: Record<string, string | string[]> = {}
    route.params?.forEach((name, i) => {
      query[name] = match[i + 1]
    })
    return { modulePath: route.modulePath, query }
  }
  return null
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const raw = Buffer.concat(chunks).toString()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function createVercelResponse(res: ServerResponse): VercelResponse {
  const vercelRes = res as VercelResponse
  const nativeSetHeader = res.setHeader.bind(res)
  vercelRes.status = (code: number) => {
    res.statusCode = code
    return vercelRes
  }
  vercelRes.json = (body: unknown) => {
    if (!res.headersSent) {
      nativeSetHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify(body))
    return vercelRes
  }
  vercelRes.send = (body: unknown) => {
    res.end(typeof body === 'string' ? body : JSON.stringify(body))
    return vercelRes
  }
  vercelRes.setHeader = (name: string, value: string | string[]) => {
    nativeSetHeader(name, value)
    return vercelRes
  }
  return vercelRes
}

function createVercelRequest(
  req: IncomingMessage,
  url: URL,
  body: unknown,
  query: Record<string, string | string[]>,
): VercelRequest {
  const vercelReq = req as VercelRequest
  vercelReq.query = { ...Object.fromEntries(url.searchParams.entries()), ...query }
  vercelReq.body = body
  vercelReq.cookies = {}
  const cookieHeader = req.headers.cookie
  if (cookieHeader) {
    for (const part of cookieHeader.split(';')) {
      const [key, ...rest] = part.trim().split('=')
      if (key) vercelReq.cookies![key] = decodeURIComponent(rest.join('='))
    }
  }
  return vercelReq
}

function checkInterviewEnv(): string[] {
  const missing: string[] = []
  if (!process.env.INTERVIEW_APP_PASSWORD) missing.push('INTERVIEW_APP_PASSWORD')
  if (!process.env.INTERVIEW_SESSION_SECRET) missing.push('INTERVIEW_SESSION_SECRET')
  if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) missing.push('POSTGRES_URL')
  return missing
}

async function handleApi(
  server: ViteDevServer,
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  const match = matchApiRoute(pathname)
  if (!match) return false

  if (pathname.startsWith('/api/interview/')) {
    const missing = checkInterviewEnv()
    if (missing.length) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({
        error: `Lokaal .env.local ontbreekt: ${missing.join(', ')}. Kopieer .env.example naar .env.local en vul de waarden in.`,
      }))
      return true
    }
  }

  const body = req.method === 'GET' || req.method === 'HEAD' ? {} : await readBody(req)
  const url = new URL(pathname, 'http://localhost')
  const vercelReq = createVercelRequest(req, url, body, match.query)
  const vercelRes = createVercelResponse(res)

  const mod = await server.ssrLoadModule(match.modulePath)
  const handler = mod.default as (req: VercelRequest, res: VercelResponse) => void | Promise<void>
  await handler(vercelReq, vercelRes)
  return true
}

export function localApiPlugin(): Plugin {
  return {
    name: 'vite-local-api',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      Object.assign(process.env, env)

      const missing = checkInterviewEnv()
      if (missing.length) {
        console.warn(
          `\n⚠️  Interview App API: mist ${missing.join(', ')} in .env of .env.local.\n` +
          '   Login werkt lokaal pas na invullen. Zie .env.example of: vercel env pull .env.local\n',
        )
      } else {
        console.log('\n✓ Interview App API: lokaal actief via Vite (geen proxy naar productie).\n')
      }

      server.middlewares.use(async (req, res, next) => {
        try {
          if (!req.url?.startsWith('/api/')) return next()
          const url = new URL(req.url, 'http://localhost')
          const handled = await handleApi(server, req, res, url.pathname)
          if (!handled) next()
        } catch (err) {
          console.error('Local API error:', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Lokale API-fout. Zie terminal voor details.' }))
          }
        }
      })
    },
  }
}
