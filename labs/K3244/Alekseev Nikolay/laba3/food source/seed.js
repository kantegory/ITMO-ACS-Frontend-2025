import fs from "node:fs/promises"

const MEALDB_USER_ID = 1000

function pickIngredients(m) {
  const out = []
  for (let i = 1; i <= 20; i++) {
    const v = String(m?.[`strIngredient${i}`] ?? "").trim()
    if (v) out.push(v)
  }
  return out
}

function normalizeText(s) {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function fetchMealsByLetter(letter) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  const r = await fetch(url)
  const j = await r.json()
  return j?.meals || []
}

function ensureArray(db, key) {
  if (!Array.isArray(db[key])) db[key] = []
}

async function main() {
  const raw = await fs.readFile("./db.json", "utf-8").catch(() => "{}")
  const db = JSON.parse(raw || "{}")

  ensureArray(db, "users")
  ensureArray(db, "recipes")
  ensureArray(db, "comments")
  ensureArray(db, "sessions")

  if (!db.users.some(u => Number(u.id) === MEALDB_USER_ID)) {
    db.users.push({
      id: MEALDB_USER_ID,
      name: "TheMealDB",
      email: "themealdb@local",
      theme: "light",
      subscriptions: [],
      savedRecipeIds: [],
      likedRecipeIds: []
    })
  }

  const letters = "abcdefghijklmnopqrstuvwxyz".split("")
  const all = []

  for (const l of letters) {
    const part = await fetchMealsByLetter(l)
    all.push(...part)
  }

  const now = Date.now()
  const incoming = all
    .map(m => {
      const id = Number(m?.idMeal)
      if (!id) return null

      const ingredients = pickIngredients(m)

      return {
        id,
        name: (m?.strMeal || "Без названия").trim(),
        photo: (m?.strMealThumb || "").trim(),
        category: (m?.strCategory || "").trim(),
        area: (m?.strArea || "").trim(),
        ingredients,
        text: normalizeText(m?.strInstructions || ""),
        likes: 0,
        authorId: MEALDB_USER_ID,
        createdAt: now
      }
    })
    .filter(Boolean)

  const existingById = new Map((db.recipes || []).map(r => [Number(r?.id), r]))
  const mealdbIds = new Set(incoming.map(r => Number(r.id)))

  for (const r of incoming) {
    const id = Number(r.id)
    const prev = existingById.get(id)

    if (prev) {
      const keptLikes = Number(prev.likes || 0)
      const keptCreatedAt = prev.createdAt ?? r.createdAt

      existingById.set(id, {
        ...prev,
        ...r,
        likes: keptLikes,
        createdAt: keptCreatedAt
      })
    } else {
      existingById.set(id, r)
    }
  }

  const merged = Array.from(existingById.values())
    .filter(r => {
      const id = Number(r?.id)
      if (!id) return false
      if (Number(r?.authorId) !== MEALDB_USER_ID) return true
      return mealdbIds.has(id)
    })

  db.recipes = merged

  await fs.writeFile("./db.json", JSON.stringify(db, null, 2), "utf-8")
  console.log(`Seeded/merged recipes: ${db.recipes.length}`)
}

main()
