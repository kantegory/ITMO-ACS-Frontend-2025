import jsonServer from 'json-server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import customMiddleware from './middleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = jsonServer.create()
const dbPath = join(__dirname, 'db.json')
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(customMiddleware)
server.use(router)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`Watching ${dbPath}`)
})

