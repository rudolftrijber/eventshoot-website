import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import type { VercelRequest } from '@vercel/node'

export type InterviewRole = 'crew' | 'client'

export interface SessionPayload {
  role: InterviewRole
  productionIds: string[]
  nonce: string
  /** Unix timestamp (seconds) when the session expires. */
  exp: number
}

export interface AuthContext {
  authenticated: boolean
  role: InterviewRole | null
  productionIds: string[]
  skipAuth: boolean
}

const INTAKE_LOCK_TYPES = new Set(['Keynote speaker', 'Executive', 'Sponsor'])
export const SESSION_TTL_SEC = 60 * 60 * 24 * 7
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

export function createSessionToken(payload: Omit<SessionPayload, 'nonce' | 'exp'> & { nonce?: string; exp?: number }): string {
  const full: SessionPayload = {
    role: payload.role,
    productionIds: payload.productionIds || [],
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
    if (payload.role !== 'crew' && payload.role !== 'client') return null
    if (!Array.isArray(payload.productionIds)) payload.productionIds = []
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function skipAuth(): boolean {
  // Never allow auth bypass on Vercel Production.
  if (process.env.VERCEL_ENV === 'production') return false
  const v = process.env.INTERVIEW_SKIP_AUTH || ''
  return v === '1' || v === 'true'
}

export function getAuthContext(req: VercelRequest, token: string | null): AuthContext {
  if (skipAuth()) {
    return { authenticated: true, role: 'crew', productionIds: [], skipAuth: true }
  }
  const payload = parseSessionToken(token)
  if (!payload) {
    return { authenticated: false, role: null, productionIds: [], skipAuth: false }
  }
  return {
    authenticated: true,
    role: payload.role,
    productionIds: payload.productionIds,
    skipAuth: false,
  }
}

export function isCrew(ctx: AuthContext): boolean {
  return ctx.skipAuth || ctx.role === 'crew'
}

export function isClient(ctx: AuthContext): boolean {
  return !ctx.skipAuth && ctx.role === 'client'
}

export function clientProductionFilter(ctx: AuthContext, productionIds: string[]): string[] {
  if (isCrew(ctx)) return productionIds
  return productionIds.filter((id) => ctx.productionIds.includes(id))
}

export function getRequestIp(req: VercelRequest): string {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0]?.trim()
  if (forwarded) return forwarded
  const realIp = String(req.headers['x-real-ip'] || '').trim()
  if (realIp) return realIp
  return 'unknown'
}
