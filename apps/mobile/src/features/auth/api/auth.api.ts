import { api } from '../../../lib/api'

export const sendOtp = (phone: string) =>
  api.post('/auth/send-otp', { phone })

export const verifyOtp = (phone: string, code: string) =>
  api.post('/auth/verify-otp', { phone, code })