import { Context } from 'hono'
import { redis } from '../../lib/redis'
import { generateOTP } from './auth.utils'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import { signAccessToken, signRefreshToken } from './auth.tokens'


export const sendOtp = async (c: Context) => {
  const { phone } = await c.req.json()

  const rateKey = `otp:rate:${phone}`
  const otpKey = `otp:${phone}`

  // 🔒 Rate limit (3 per 10 min)
  const attempts = await redis.incr(rateKey)

  if (attempts === 1) {
    await redis.expire(rateKey, 600)
  }

  if (attempts > 3) {
    return c.json({ error: 'Too many requests' }, 429)
  }

  const otp = generateOTP()

  await redis.set(otpKey, otp, 'EX', 300) // 5 min TTL

  // TODO: integrate Africa's Talking
  console.log(`OTP for ${phone}: ${otp}`)

  return c.json({ success: true })
}


export const verifyOtp = async (c: Context) => {
  const { phone, code } = await c.req.json()

  const otpKey = `otp:${phone}`
  const stored = await redis.get(otpKey)

  if (!stored || stored !== code) {
    return c.json({ error: 'Invalid OTP' }, 400)
  }

  await redis.del(otpKey)

  // ✅ UPSERT USER
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone }
  })

  // ✅ TOKENS
  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  // ✅ STORE SESSION
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return c.json({ accessToken, refreshToken })
}


export const refresh = async (c: Context) => {
  const { refreshToken } = await c.req.json()

  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    )

    const session = await prisma.session.findUnique({
      where: { refreshToken }
    })

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401)
    }

    const newAccess = signAccessToken(payload.userId)
    const newRefresh = signRefreshToken(payload.userId)

    // rotate token
    await prisma.session.update({
      where: { refreshToken },
      data: { refreshToken: newRefresh }
    })

    return c.json({
      accessToken: newAccess,
      refreshToken: newRefresh
    })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
}