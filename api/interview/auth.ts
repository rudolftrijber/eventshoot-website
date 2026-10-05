import { createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import type { VercelRequest } from '@vercel/node'

export type InterviewRole = 'crew' | 'client' | 'set'

export interface SessionPayload {
  role: InterviewRole
  productionIds: string[]
  /** Set when a named crew member logs in */
  crewName?: string
  /** HMAC of current credentials; changes when a password is rotated. */
  cred: string
  nonce: string
  /** Unix timestamp (seconds) when the session expires. */
  exp: number
}

export interface AuthContext {
  authenticated: boolean
  role: InterviewRole | null
  productionIds: string[]
  crewName: string | null
  skipAuth: boolean
}

const INTAKE_LOCK_TYPES = new Set(['Keynote speaker', 'Executive', 'Sponsor'])
export const SESSION_TTL_SEC = 60 * 60 * 24
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const
const SCRYPT_KEYLEN = 64

export function intakeLockApplies(type: string): boolean {
  return INTAKE_LOCK_TYPES.has(String(type || '').trim())
}

function getSecret(): string {
  return process.env.INTERVIEW_SESSION_SECRET || ''
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('hex')
}

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'))
  } catch {
    return false
  }
}

/** New format: scrypt:<saltHex>:<hashHex> */
export function hashClientPassword(password: string): string {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS)
  return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`
}

/** Fast index for client login; always followed by scrypt verify. */
export function clientPasswordLookup(password: string): string {
  const secret = getSecret()
  if (!secret || !password) return ''
  return createHmac('sha256', secret).update(`client-lookup:${password}`).digest('hex')
}

function verifyLegacyClientPassword(password: string, hash: string): boolean {
  if (!getSecret()) return false
  const expected = sign(`client:${password}`)
  return safeEqualHex(expected, hash)
}

export function verifyClientPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false
  if (hash.startsWith('scrypt:')) {
    const parts = hash.split(':')
    if (parts.length !== 3) return false
    const saltHex = parts[1]
    const hashHex = parts[2]
    if (!saltHex || !hashHex) return false
    try {
      const derived = scryptSync(password, Buffer.from(saltHex, 'hex'), SCRYPT_KEYLEN, SCRYPT_PARAMS)
      const expected = Buffer.from(hashHex, 'hex')
      if (derived.length !== expected.length) return false
      return timingSafeEqual(derived, expected)
    } catch {
      return false
    }
  }
  return verifyLegacyClientPassword(password, hash)
}

export function clientPasswordNeedsRehash(hash: string): boolean {
  return Boolean(hash) && !hash.startsWith('scrypt:')
}

function clientPasswordEncKey(): Buffer | null {
  const secret = getSecret()
  if (!secret) return null
  return createHash('sha256').update(`client-pw:${secret}`).digest()
}

/** One-time migration of previously recoverable passwords. Do not store new ciphertext. */
export function decryptClientPassword(payload: string | null | undefined): string {
  const key = clientPasswordEncKey()
  if (!key || !payload || !payload.startsWith('enc:')) return ''
  const parts = payload.split(':')
  if (parts.length !== 4) return ''
  try {
    const iv = Buffer.from(parts[1], 'hex')
    const tag = Buffer.from(parts[2], 'hex')
    const data = Buffer.from(parts[3], 'hex')
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
  } catch {
    return ''
  }
}

export function verifyCrewPassword(password: string): boolean {
  const expected = process.env.INTERVIEW_APP_PASSWORD || ''
  if (!expected || !password) return false
  if (password.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

/** Only these two run interviews and can open the full app. */
export const INTERVIEWER_NAMES = [
  'Rolf Trijber',
  'Maurice Antenbrink',
] as const

export const SET_CREW_NAME = 'Set'

export function parseCrewPasswordMap(): Record<string, string> {
  const raw = process.env.INTERVIEW_CREW_PASSWORDS || ''
  if (!raw.trim()) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) out[key.trim()] = value
    }
    return out
  } catch {
    return {}
  }
}

export function hasCrewAuthConfigured(): boolean {
  return Object.keys(parseCrewPasswordMap()).length > 0 || Boolean(process.env.INTERVIEW_APP_PASSWORD)
}

function safeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

/** Per-crew password from INTERVIEW_CREW_PASSWORDS; no shared fallback once personal is set. */
export function verifyCrewMemberLogin(crewName: string, password: string): boolean {
  if (!crewName || !password) return false
  if (!(INTERVIEWER_NAMES as readonly string[]).includes(crewName)) return false
  const personal = parseCrewPasswordMap()[crewName]
  if (personal) return safeEqualString(password, personal)
  return verifyCrewPassword(password)
}

export function crewSessionCred(crewName: string): string {
  const personal = parseCrewPasswordMap()[crewName] || ''
  const shared = process.env.INTERVIEW_APP_PASSWORD || ''
  return sign(`crew-cred:${crewName}:${personal || shared}`)
}

export function verifyCrewSessionCred(crewName: string, cred: string): boolean {
  if (!crewName || !cred) return false
  return safeEqualHex(cred, crewSessionCred(crewName))
}

export function createSessionToken(payload: Omit<SessionPayload, 'nonce' | 'exp'> & { nonce?: string; exp?: number }): string {
  const full: SessionPayload = {
    role: payload.role,
    productionIds: payload.productionIds || [],
    crewName: payload.crewName || undefined,
    cred: payload.cred,
    nonce: payload.nonce || randomBytes(16).toString('hex'),
    exp: payload.exp ?? Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
  }
  const encoded = toBase64Url(JSON.stringify(full))
  return `${encoded}.${sign(encoded)}`
}

export function parseSessionToken(token: string | null): SessionPayload | null {
  if (!token) return null
  const secret = getSecret()
  if (!secret) return null
  const [encoded, sig] = token.split('.')
  if (!encoded || !sig) return null
  const expected = sign(encoded)
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload
    if (payload.role !== 'crew' && payload.role !== 'client' && payload.role !== 'set') return null
    if (!Array.isArray(payload.productionIds)) payload.productionIds = []
    if (typeof payload.cred !== 'string' || !payload.cred) return null
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    if (payload.role === 'crew') {
      if (!payload.crewName || !(INTERVIEWER_NAMES as readonly string[]).includes(payload.crewName)) return null
      if (!verifyCrewSessionCred(payload.crewName, payload.cred)) return null
    }
    if (payload.role === 'set') {
      if (payload.crewName !== SET_CREW_NAME) return null
      if (payload.productionIds.length !== 1) return null
      const productionId = payload.productionIds[0]
      if (!productionId || !verifySetSessionCred(productionId, payload.cred)) return null
    }
    return payload
  } catch {
    return null
  }
}

const AMSTERDAM = 'Europe/Amsterdam'

export function amsterdamDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: AMSTERDAM,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** Unix seconds when the current Amsterdam calendar day ends. */
export function endOfAmsterdamDayUnix(now = new Date()): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: AMSTERDAM,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const bag: Record<string, string> = {}
  for (const part of fmt.formatToParts(now)) bag[part.type] = part.value
  let hour = Number(bag.hour)
  let day = Number(bag.day)
  if (hour === 24) {
    hour = 0
    day += 1
  }
  const asUtc = Date.UTC(Number(bag.year), Number(bag.month) - 1, day, hour, Number(bag.minute), Number(bag.second))
  const offsetMs = asUtc - now.getTime()
  const nextMidnight = Date.UTC(Number(bag.year), Number(bag.month) - 1, day + 1, 0, 0, 0)
  return Math.floor((nextMidnight - offsetMs) / 1000)
}

export function setSessionCred(productionId: string, date: string): string {
  return sign(`set-cred:${productionId}:${date}`)
}

export function verifySetSessionCred(productionId: string, cred: string): boolean {
  if (!productionId || !cred) return false
  return safeEqualHex(cred, setSessionCred(productionId, amsterdamDate()))
}

export type SetTokenState =
  | { ok: true; productionId: string; date: string }
  | { ok: false; reason: 'invalid' | 'expired' }

/** Long, unguessable link for one production, valid only on this Amsterdam day. */
export function createSetToken(productionId: string, now = new Date()): string {
  const date = amsterdamDate(now)
  const body = Buffer.from(JSON.stringify({ id: productionId, d: date }), 'utf8').toString('base64url')
  const sig = createHmac('sha256', getSecret()).update(`set-link:${body}`).digest('hex').slice(0, 32)
  return `${body}.${sig}`
}

export function readSetToken(token: string, now = new Date()): SetTokenState {
  const raw = String(token || '').trim()
  if (!raw || raw.length > 512 || raw === 'live') return { ok: false, reason: 'invalid' }
  const dot = raw.lastIndexOf('.')
  if (dot <= 0) return { ok: false, reason: 'invalid' }
  const body = raw.slice(0, dot)
  const sig = raw.slice(dot + 1)
  if (!/^[a-f0-9]{32}$/.test(sig)) return { ok: false, reason: 'invalid' }
  const expected = createHmac('sha256', getSecret()).update(`set-link:${body}`).digest('hex').slice(0, 32)
  if (!safeEqualHex(sig, expected)) return { ok: false, reason: 'invalid' }
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { id?: unknown; d?: unknown }
    const productionId = String(parsed.id || '').trim()
    const date = String(parsed.d || '').trim()
    if (!productionId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, reason: 'invalid' }
    if (date !== amsterdamDate(now)) return { ok: false, reason: 'expired' }
    return { ok: true, productionId, date }
  } catch {
    return { ok: false, reason: 'invalid' }
  }
}

export function setAppPath(token: string): string {
  return `/interview-app/live/${token}`
}

export function skipAuth(): boolean {
  // Never bypass auth on any Vercel deployment (production or preview).
  if (process.env.VERCEL) return false
  const v = process.env.INTERVIEW_SKIP_AUTH || ''
  return v === '1' || v === 'true'
}

export function getAuthContext(req: VercelRequest, token: string | null): AuthContext {
  if (skipAuth()) {
    return { authenticated: true, role: 'crew', productionIds: [], crewName: null, skipAuth: true }
  }
  const payload = parseSessionToken(token)
  if (!payload) {
    return { authenticated: false, role: null, productionIds: [], crewName: null, skipAuth: false }
  }
  return {
    authenticated: true,
    role: payload.role,
    productionIds: payload.productionIds,
    crewName: payload.crewName || null,
    skipAuth: false,
  }
}

export function isCrew(ctx: AuthContext): boolean {
  return ctx.skipAuth || ctx.role === 'crew'
}

export function isSet(ctx: AuthContext): boolean {
  return !ctx.skipAuth && ctx.role === 'set'
}

export function isClient(ctx: AuthContext): boolean {
  return !ctx.skipAuth && ctx.role === 'client'
}

export function clientProductionFilter(ctx: AuthContext, productionIds: string[]): string[] {
  if (isCrew(ctx)) return productionIds
  return productionIds.filter((id) => ctx.productionIds.includes(id))
}

export function getRequestIp(req: VercelRequest): string {
  const vercel = String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0]?.trim()
  if (vercel) return vercel
  const realIp = String(req.headers['x-real-ip'] || '').trim()
  if (realIp) return realIp
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0]?.trim()
  if (forwarded && !process.env.VERCEL) return forwarded
  return 'unknown'
}
