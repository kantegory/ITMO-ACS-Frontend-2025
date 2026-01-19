import jsonServer from "json-server"
import auth from "json-server-auth"

const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser)

const THEMEALDB_USER_ID = 1000

if (server.db.get("sessions").value() === undefined) {
  server.db.set("sessions", []).write()
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
  const type = req.query.type != null && req.query.type !== "any" ? Number(req.query.type) : null
  const difficulty = req.query.difficulty != null && req.query.difficulty !== "any" ? Number(req.query.difficulty) : null

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

  if (type != null) {
    list = list.filter(r => Number(r?.type) === type)
  }

  if (difficulty != null) {
    list = list.filter(r => Number(r?.difficulty) === difficulty)
  }

  if (ingredients.length) {
    list = list.filter(r => {
      const have = (Array.isArray(r?.ingredients) ? r.ingredients : []).map(x => String(x).toLowerCase())
      return ingredients.every(need => have.includes(need))
    })
  }

  return res.json(list)
})

function nextRecipeId() {
  const list = server.db.get("recipes").value() || []
  const maxId = list.reduce((m, r) => Math.max(m, Number(r?.id || 0)), 0)
  return maxId + 1
}

server.get("/recipes/mealdb-proxy/:mealId", (req, res) => {
  const mealId = String(req.params.mealId)
  let r = server.db.get("recipes").find({ source: "mealdb", mealId }).value()
  if (!r) return res.status(204).end()

  if (!r.authorId) {
    server.db.get("recipes").find({ id: r.id }).assign({ authorId: THEMEALDB_USER_ID }).write()
    r = server.db.get("recipes").find({ id: r.id }).value()
  }

  return res.json(r)
})


server.post("/recipes/mealdb-upsert", (req, res) => {
  const mealId = String(req.body?.mealId || "").trim()
  if (!mealId) return res.status(400).json({ error: "mealId is required" })

  const payload = {
    mealId,
    name: String(req.body?.name || "").trim(),
    photo: String(req.body?.photo || "").trim(),
    category: String(req.body?.category || "").trim(),
    area: String(req.body?.area || "").trim()
  }

  let existing = server.db.get("recipes").find({ source: "mealdb", mealId }).value()

  if (existing) {
    server.db
      .get("recipes")
      .find({ id: existing.id })
      .assign({
        ...payload,
        source: "mealdb",
        authorId: THEMEALDB_USER_ID
      })
      .write()

    existing = server.db.get("recipes").find({ id: existing.id }).value()
    return res.json(existing)
  }

  const created = {
    id: nextRecipeId(),
    source: "mealdb",
    likes: 0,
    authorId: THEMEALDB_USER_ID,
    ...payload
  }

  server.db.get("recipes").push(created).write()
  return res.status(201).json(created)
})

server.use(auth)
server.use(router)

server.listen(3001, () => {
  console.log("API running on http://localhost:3001")
})
