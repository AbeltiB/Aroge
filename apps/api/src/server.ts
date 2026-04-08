import { Hono } from 'hono'
import auth from './modules/auth/auth.route'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'API is running 🚀' })
})

app.get('/hello', (c) => {
  return c.json({ message: 'Hello from Hono API 👋' })
})

app.route('/auth', auth)

export default app