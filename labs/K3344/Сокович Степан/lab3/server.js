const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

const server = jsonServer.create()
const dbPath = path.join(__dirname, 'db.json')
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

const customMiddleware = require('./middleware.js')

server.use(middlewares)
server.use(customMiddleware)
server.use(router)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`Watching ${dbPath}`)
})

