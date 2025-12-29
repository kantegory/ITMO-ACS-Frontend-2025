import fs from "node:fs/promises"

function pickIngredients(m) {
  const out = []
  for (let i = 1; i <= 20; i++) {
    const v = (m[`strIngredient${i}`] || "").trim()
    if (v) out.push(v)
  }
  return out
}

function mapType(category) {
  const c = (category || "").toLowerCase()
  if (c.includes("dessert")) return 4
  if (c.includes("breakfast")) return 1
  if (c.includes("starter")) return 2
  if (c.includes("side")) return 2
  if (c.includes("pasta")) return 3
  if (c.includes("seafood")) return 3
  if (c.includes("chicken")) return 3
  if (c.includes("beef")) return 3
  return 2
}

function mapDifficulty(ingredientsCount) {
  if (ingredientsCount <= 6) return 1
  if (ingredientsCount <= 12) return 2
  return 3
}

async function fetchMealsByLetter(letter) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  const r = await fetch(url)
  const j = await r.json()
  return j.meals || []
}

async function main() {
  const letters = ["a", "b", "c", "d"]
  const all = []
  for (const l of letters) {
    const part = await fetchMealsByLetter(l)
    all.push(...part)
  }

  const recipes = all.map(m => {
    const ingredients = pickIngredients(m)
    const text = (m.strInstructions || "").replace(/\s+/g, " ").trim().slice(0, 180)
    return {
      id: Number(m.idMeal),
      name: m.strMeal || "Без названия",
      text: text || "Описание отсутствует",
      photo: m.strMealThumb || "",
      ingredients,
      difficulty: mapDifficulty(ingredients.length),
      type: mapType(m.strCategory),
      authorId: 1000,
      author: "TheMealDB",
      likes: 0
    }
  })

  const unique = new Map()
  for (const r of recipes) unique.set(r.id, r)

  const raw = await fs.readFile("./db.json", "utf-8").catch(() => `{"users":[],"recipes":[]}`)
  const db = JSON.parse(raw)
  if (!Array.isArray(db.users)) db.users = []
  if (!db.users.some(u => Number(u.id) === 1000)) {
    db.users.push({
      id: 1000,
      name: "TheMealDB",
      email: "TheMealDB",
      theme: "light",
      subscriptions: [],
      savedRecipeIds: [],
      likedRecipeIds: []
    })
  }

  db.recipes = Array.from(unique.values())
  if (!Array.isArray(db.users)) db.users = []

  await fs.writeFile("./db.json", JSON.stringify(db, null, 2), "utf-8")
  console.log(`Seeded recipes: ${db.recipes.length}`)
}

main()
