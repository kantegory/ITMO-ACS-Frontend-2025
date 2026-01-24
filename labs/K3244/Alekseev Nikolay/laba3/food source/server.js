import jsonServer from "json-server"
import auth from "json-server-auth"

const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser)

if (server.db.get("sessions").value() === undefined) {
  server.db.set("sessions", []).write()
}

if (server.db.get("comments").value() === undefined) {
  server.db.set("comments", []).write()
}

server.get("/session", (req, res) => {
  const s = server.db.get("sessions").value()?.[0]
  if (!s?.userId) return res.status(204).end()

  const user = server.db.get("users").find({ id: Number(s.userId) }).value()
  if (!user) return res.status(204).end()

  return res.json({ user })
})

server.post("/session", (req, res) => {
  const userId = Number(req.body?.userId)
  if (!userId) return res.status(400).json({ error: "userId is required" })

  server.db.set("sessions", [{ id: 1, userId, at: Date.now() }]).write()
  server.db.get("users").find({ id: userId }).assign({ lastLoginAt: Date.now() }).write()

  return res.json({ ok: true })
})

server.delete("/session", (req, res) => {
  server.db.set("sessions", []).write()
  return res.json({ ok: true })
})

server.get("/recipes/search", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase()

  const category =
    req.query.category != null && req.query.category !== "any" ? String(req.query.category) : null

  const area = req.query.area != null && req.query.area !== "any" ? String(req.query.area) : null

  let ingredients = req.query.ingredient ?? req.query.ingredients ?? []
  ingredients = Array.isArray(ingredients) ? ingredients : [ingredients]
  ingredients = ingredients
    .flatMap(x => String(x).split(","))
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toLowerCase())

  let list = server.db.get("recipes").value()

  if (q) {
    list = list.filter(r => String(r?.name || "").toLowerCase().includes(q))
  }

  if (category != null) {
    list = list.filter(r => String(r?.category || "") === category)
  }

  if (area != null) {
    list = list.filter(r => String(r?.area || "") === area)
  }

  if (ingredients.length) {
    list = list.filter(r => {
      const have = (Array.isArray(r?.ingredients) ? r.ingredients : []).map(x => String(x).toLowerCase())
      return ingredients.every(need => have.includes(need))
    })
  }

  return res.json(list)
})

server.get("/filters", (req, res) => {
  const recipes = server.db.get("recipes").value() || []

  const categories = Array.from(
    new Set(recipes.map(r => String(r?.category || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "ru"))

  const areas = Array.from(
    new Set(recipes.map(r => String(r?.area || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "ru"))

  const ingredients = Array.from(
    new Set(
      recipes
        .flatMap(r => (Array.isArray(r?.ingredients) ? r.ingredients : []))
        .map(x => String(x || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "ru"))

  return res.json({ categories, areas, ingredients })
})

server.use(auth)
server.use(router)

server.listen(3001, () => {
  console.log("API running on http://localhost:3001")
})
