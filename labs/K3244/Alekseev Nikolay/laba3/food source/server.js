import jsonServer from "json-server"
import auth from "json-server-auth"

const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

server.db = router.db

if (server.db.get("session").value() === undefined) {
  server.db.set("session", null).write()
}

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.get("/session", (req, res) => {
  const session = server.db.get("session").value()
  if (!session?.userId) return res.status(204).end()

  const user = server.db.get("users").find({ id: session.userId }).value()
  if (!user) return res.status(204).end()

  return res.json({ user })
})

server.post("/session", (req, res) => {
  const userId = Number(req.body?.userId)
  if (!userId) return res.status(400).json({ error: "userId is required" })

  server.db.set("session", { userId, at: Date.now() }).write()
  server.db.get("users").find({ id: userId }).assign({ lastLoginAt: Date.now() }).write()

  return res.json({ ok: true })
})

server.delete("/session", (req, res) => {
  server.db.set("session", null).write()
  return res.json({ ok: true })
})

server.use(auth)
server.use(router)

server.listen(3001, () => {
  console.log("API running on http://localhost:3001")
})
