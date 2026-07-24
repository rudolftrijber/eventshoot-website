import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Gast, Productie } from './types.js'
import { getAuthContext, intakeLockApplies, isClient, isCrew, type AuthContext } from './auth.js'
import { getSessionToken } from './session.js'

export function resolveAuth(req: VercelRequest): AuthContext {
  return getAuthContext(req, getSessionToken(req))
}

export function requireLogin(req: VercelRequest, res: VercelResponse): AuthContext | null {
  const ctx = resolveAuth(req)
  if (!ctx.authenticated) {
    res.status(401).json({ error: 'Not logged in' })
    return null
  }
  return ctx
}

export function requireCrew(req: VercelRequest, res: VercelResponse): AuthContext | null {
  const ctx = requireLogin(req, res)
  if (!ctx) return null
  if (!isCrew(ctx)) {
    res.status(403).json({ error: 'Crew access only' })
    return null
  }
  return ctx
}

export function filterProductionsForAuth(ctx: AuthContext, list: Productie[]): Productie[] {
  const scoped = isCrew(ctx) ? list : list.filter((p) => ctx.productionIds.includes(p.id))
  if (isCrew(ctx)) return scoped
  // Never send recoverable client passwords to clients
  return scoped.map((p) => {
    const { clientPasswordStored: _omit, ...rest } = p
    return rest
  })
}

export function filterGuestsForAuth(ctx: AuthContext, guests: Gast[], productions: Productie[]): Gast[] {
  if (isCrew(ctx)) return guests
  const names = new Set(
    productions
      .filter((p) => ctx.productionIds.includes(p.id))
      .map((p) => p.naam),
  )
  return guests.filter((g) => names.has(g.productieNaam))
}

export function productionNameAllowed(
  ctx: AuthContext,
  productions: Productie[],
  productieNaam: string,
): boolean {
  if (isCrew(ctx)) return true
  const prod = productions.find((p) => p.naam === productieNaam)
  return Boolean(prod && ctx.productionIds.includes(prod.id))
}

export function guestEditableByClient(guest: Gast, patch: Record<string, unknown>): string | null {
  if (!guest.intakeComplete) return null

  const allowedKeys = new Set(['intakeComplete'])
  const keys = Object.keys(patch).filter((k) => patch[k] !== undefined)
  const onlyUnlock = keys.length === 1 && keys[0] === 'intakeComplete' && patch.intakeComplete === false
  if (onlyUnlock) return null

  const blocked = keys.some((k) => !allowedKeys.has(k))
  if (blocked) return 'Intake complete — unlock before editing'
  return null
}

export function sanitizeGuestPatchForClient(
  guest: Gast,
  patch: Record<string, unknown>,
): Record<string, unknown> | string {
  const blocked = [
    'status', 'regienummer', 'datum', 'tijd', 'action',
  ]
  for (const key of blocked) {
    if (patch[key] !== undefined) return 'Clients cannot change crew fields'
  }

  if (patch.intakeComplete === true && !intakeLockApplies(String(patch.type ?? guest.type))) {
    return 'Intake complete only applies to Keynote speakers, Executives and Sponsors'
  }

  const lockError = guestEditableByClient(guest, patch)
  if (lockError) return lockError

  return patch
}

export function sanitizeGuestCreateForClient(
  payload: Record<string, unknown>,
): Record<string, unknown> | string {
  if (payload.intakeComplete) {
    const type = String(payload.type || '')
    if (!intakeLockApplies(type)) {
      return 'Intake complete only applies to Keynote speakers, Executives and Sponsors'
    }
  }
  return payload
}

/** Clients may only update default Participant questions on their own production. */
export function sanitizeProductionPatchForClient(
  ctx: AuthContext,
  productionId: string,
  patch: Record<string, unknown>,
): Record<string, unknown> | string {
  if (!ctx.productionIds.includes(productionId)) {
    return 'Production not allowed'
  }
  const keys = Object.keys(patch).filter((k) => patch[k] !== undefined)
  if (!keys.length) return 'Nothing to update'
  if (keys.some((k) => k !== 'vragen')) {
    return 'Clients can only edit default Participant questions'
  }
  return { vragen: patch.vragen }
}
