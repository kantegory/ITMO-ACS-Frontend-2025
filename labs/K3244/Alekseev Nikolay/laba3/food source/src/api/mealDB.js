import axios from "axios"

const mealdb = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1"
})

export const mealdbApi = {
  // списки для фильтров
  getCategories: () => mealdb.get("/categories.php"),
  getIngredientsList: () => mealdb.get("/list.php", { params: { i: "list" } }),
  getAreasList: () => mealdb.get("/list.php", { params: { a: "list" } }),

  // данные по блюдам
  searchByName: (q) => mealdb.get("/search.php", { params: { s: q } }),
  filterByCategory: (category) => mealdb.get("/filter.php", { params: { c: category } }),
  filterByIngredient: (ingredient) => mealdb.get("/filter.php", { params: { i: ingredient } }),
  filterByArea: (area) => mealdb.get("/filter.php", { params: { a: area } }),

  lookupById: (id) => mealdb.get("/lookup.php", { params: { i: id } }),
  getMealsByFirstLetter: (letter) => mealdb.get("/search.php", { params: { f: letter } })
}
