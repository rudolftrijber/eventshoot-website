import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { VercelRequest } from '@vercel/node'

export type InterviewRole = 'crew' | 'client'

export interface SessionPayload {
  role: InterviewRole
  productionIds: string[]
  nonce: string
}

export interface AuthContext {
  authenticated: boolean
  role: InterviewRole | null
  productionIds: string[]
  skipAuth: boolean
}

const INTAKE_LOCK_TYPES = new Set(['Keynote speaker', 'Executive', 'Sponsor'])

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

export function hashClientPassword(password: string): string {
  return sign(`client:${password}`)
}

export function verifyClientPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false
  const expected = hashClientPassword(password)
  if (expected.length !== hash.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(hash))
  } catch {
    return false
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

export function createSessionToken(payload: Omit<SessionPayload, 'nonce'> & { nonce?: string }): string {
  const full: SessionPayload = {
    role: payload.role,
    productionIds: payload.productionIds || [],
    nonce: payload.nonce || randomBytes(16).toString('hex'),
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
    return payload
  } catch {
    return null
  }
}

export function skipAuth(): boolean {
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
