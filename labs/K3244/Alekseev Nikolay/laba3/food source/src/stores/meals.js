// src/stores/meals.js — ЗАМЕНИ action loadFiltered на этот (он грузит ВСЕ блюда, если фильтры пустые)
import { defineStore } from "pinia"
import { mealdbApi } from "@/api/mealDB"

function toFullMeals(meals) {
  return Array.isArray(meals) ? meals : []
}

function intersectIds(lists) {
  const valid = lists.filter(arr => Array.isArray(arr))
  if (!valid.length) return []
  const sets = valid.map(arr => new Set(arr.map(x => x.idMeal)))
  const first = [...sets[0]]
  return first.filter(id => sets.every(s => s.has(id)))
}

async function loadAllMeals() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("")
  const chunks = await Promise.all(
    letters.map(l => mealdbApi.getMealsByFirstLetter(l).then(r => r.data?.meals ?? []).catch(() => []))
  )
  const map = new Map()
  for (const arr of chunks) {
    for (const m of toFullMeals(arr)) {
      if (m?.idMeal && !map.has(m.idMeal)) map.set(m.idMeal, m)
    }
  }
  return Array.from(map.values())
}

export const useMealsStore = defineStore("meals", {
  state: () => ({
    list: [],
    loading: false
  }),

  actions: {
    async loadFiltered({ q, category, area, ingredients }) {
      this.loading = true
      try {
        const qNorm = String(q || "").trim()
        const cat = String(category || "").trim()
        const ar = String(area || "").trim()
        const ings = Array.isArray(ingredients) ? ingredients.filter(Boolean) : []

        // ✅ ПУСТЫЕ ФИЛЬТРЫ => грузим все блюда из TheMealDB
        if (!qNorm && !cat && !ar && ings.length === 0) {
          this.list = await loadAllMeals()
          return
        }

        const tasks = []

        // search.php?s=... возвращает full meals, но для пересечения берём только id
        if (qNorm) tasks.push(mealdbApi.searchByName(qNorm).then(r => (r.data?.meals ?? []).map(m => ({ idMeal: m.idMeal }))).catch(() => []))
        if (cat) tasks.push(mealdbApi.filterByCategory(cat).then(r => r.data?.meals ?? []).catch(() => []))
        if (ar) tasks.push(mealdbApi.filterByArea(ar).then(r => r.data?.meals ?? []).catch(() => []))
        for (const ing of ings) {
          tasks.push(mealdbApi.filterByIngredient(ing).then(r => r.data?.meals ?? []).catch(() => []))
        }

        const results = await Promise.all(tasks)
        const ids = intersectIds(results)

        // filter.php возвращает short-объекты => добираем полные по id
        const full = await Promise.all(
          ids.slice(0, 60).map(id =>
            mealdbApi.lookupById(id).then(r => r.data?.meals?.[0]).catch(() => null)
          )
        )

        this.list = full.filter(Boolean)
      } finally {
        this.loading = false
      }
    }
  }
})
