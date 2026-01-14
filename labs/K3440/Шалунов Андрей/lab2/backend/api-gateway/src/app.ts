import express from 'express'
import cors from 'cors'
import SETTINGS from './config/settings'
import { loggingMiddleware } from './middlewares/logging.middleware'
import { errorMiddleware } from './middlewares/error.middleware'
import { setupProxy } from './gateway'

async function start() {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(loggingMiddleware)

    app.get('/health', (_req, res) => {
        res.json({ status: 'OK' })
    })

    setupProxy(app)

    app.use(errorMiddleware)

    app.listen(SETTINGS.PORT, () => {
        console.log(`API Gateway listening on http://localhost:${SETTINGS.PORT}`)
    })
}

start()