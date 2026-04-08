import { Hono } from 'hono'
import { sendOtp, verifyOtp } from './auth.controller'

const auth = new Hono()

auth.post('/send-otp', sendOtp)
auth.post('/verify-otp', verifyOtp)

export default auth