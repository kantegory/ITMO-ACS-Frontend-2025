import jsonServer from "json-server"
import auth from "json-server-auth"

const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(auth)

server.use(router)

server.listen(3000, () => {
  console.log("API running on http://localhost:3000")
})
