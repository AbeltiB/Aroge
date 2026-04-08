import { z } from 'zod'

export const phoneSchema = z.object({
  phone: z.string().regex(/^\+251\d{9}$/)
})

export const verifyOtpSchema = z.object({
  phone: z.string(),
  code: z.string().length(6)
})