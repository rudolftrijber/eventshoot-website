import emailjs from '@emailjs/browser'

const serviceId = () => import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const publicKey = () => import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

export function useEmailJS() {
  async function send(templateId: string, params: Record<string, string>) {
    await emailjs.send(serviceId(), templateId, params, publicKey())
  }

  return { send }
}
