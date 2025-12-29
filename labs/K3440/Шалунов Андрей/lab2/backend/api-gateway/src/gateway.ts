import { Express } from 'express'
import proxy from 'express-http-proxy'
import SETTINGS from './config/settings'

function createProxy(target: string, stripPrefix: string) {
  return proxy(target, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const authHeader = srcReq.headers['authorization']
      if (authHeader) {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          authorization: authHeader,
        }
      }
      return proxyReqOpts
    },

    proxyErrorHandler: (err, res) => {
      console.error(err)
      if (!res.headersSent) {
        res.status(502).json({ error: 'Bad gateway', details: err.message })
      }
    },

    proxyReqPathResolver: (req) => {
      const path = req.originalUrl.replace(stripPrefix, '')
      return path.length ? path : '/'
    },
  })
}

export function setupProxy(app: Express) {
  app.use('/api/auth', createProxy(SETTINGS.AUTH_SERVICE_URL, '/api/auth'))
  app.use('/api/users', createProxy(SETTINGS.USER_SERVICE_URL, '/api/users'))
  app.use('/api/properties', createProxy(SETTINGS.PROPERTY_SERVICE_URL, '/api/properties'))
  app.use('/api/photos', createProxy(SETTINGS.PHOTO_SERVICE_URL, '/api/photos'))
  app.use('/api/bookings', createProxy(SETTINGS.BOOKING_SERVICE_URL, '/api/bookings'))
  app.use('/api/messages', createProxy(SETTINGS.MESSAGE_SERVICE_URL, '/api/messages'))
}