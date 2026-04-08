import jwt from 'jsonwebtoken'
import { Context, Next } from 'hono'

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    )

    c.set('userId', payload.userId)

    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
}