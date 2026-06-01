import emailjs from '@emailjs/browser'

let initialized = false

function ensureInit() {
  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!key) throw new Error('VITE_EMAILJS_PUBLIC_KEY ontbreekt in Vercel')
  if (!initialized) {
    emailjs.init({ publicKey: key })
    initialized = true
  }
}

export function useEmailJS() {
  async function send(templateId: string, params: Record<string, string>) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    if (!serviceId) throw new Error('VITE_EMAILJS_SERVICE_ID ontbreekt in Vercel')
    if (!templateId) throw new Error('VITE_EMAILJS_TEMPLATE_ID ontbreekt in Vercel')

    ensureInit()
    return emailjs.send(serviceId, templateId, params)
  }

  return { send }
}
