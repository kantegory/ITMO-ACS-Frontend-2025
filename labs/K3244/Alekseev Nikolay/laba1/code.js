import Recipe from "./src/Recipe.js"

const recipes = [
  new Recipe({
    name: "Блины с мёдом",
    text: "Смешайте муку, яйца, молоко и щепотку соли. Обжарьте блины с обеих сторон и подавайте с мёдом.",
    ingredients: ["Мука", "Яйца", "Молоко", "Мёд", "Соль"],
    difficulty: 1,
    type: 1,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 128,
    subscribed: true,
    author: "Надежда"
  }),
  new Recipe({
    name: "Паста с курицей и сливками",
    text: "Обжарьте курицу, добавьте сливки и чеснок. Смешайте с макаронами и посыпьте сыром.",
    ingredients: ["Курица", "Чеснок", "Сливки", "Паста", "Сыр"],
    difficulty: 2,
    type: 2,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 214,
    subscribed: false,
    author: "Александр"
  }),
  new Recipe({
    name: "Шоколадный торт",
    text: "Смешайте муку, сахар, яйца и какао. Выпекайте при 180°C в течение 40 минут. Украсьте глазурью.",
    ingredients: ["Мука", "Яйца", "Сахар", "Шоколад", "Масло"],
    difficulty: 3,
    type: 4,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 312,
    subscribed: false,
    author: "Николай"
  })
]

const searchInput = document.querySelector("input[type='text']")
const typeSelect = document.getElementById("typeSelect")
const difficultySelect = document.getElementById("difficultySelect")

const ingredientsSet = new Set()
recipes.forEach(r => r.ingredients.forEach(i => ingredientsSet.add(i)))

const resultsContainer = document.createElement("div")
resultsContainer.classList.add("container", "mt-4")
document.body.appendChild(resultsContainer)

function renderRecipes(list) {
  resultsContainer.innerHTML = ""
  if (list.length === 0) {
    resultsContainer.innerHTML = `<p class="text-muted text-center">Ничего не найдено 😔</p>`
    return
  }
  const row = document.createElement("div")
  row.classList.add("row", "g-3")
  list.forEach(r => {
    const card = document.createElement("div")
    card.classList.add("col-md-4")
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${r.photo}" class="card-img-top" alt="${r.name}">
        <div class="card-body">
          <h5 class="card-title">${r.name}</h5>
          <p><strong>Ингредиенты:</strong> ${r.ingredients.join(", ")}</p>
          <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][r.difficulty - 1]}</p>
          <p><strong>Тип:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][r.type - 1]}</p>
          <p>❤️ ${r.likes} ${r.subscribed ? "Подписан" : ""}</p>
          <p>${r.author}</p>
        </div>
      </div>
    `
    row.appendChild(card)
  })
  resultsContainer.appendChild(row)
}

function applyFilters() {
  let filtered = [...recipes]
  const query = searchInput.value.trim().toLowerCase()
  const type = typeSelect.value
  const difficulty = difficultySelect.value
  const selectedIngredients = Array.from(document.querySelectorAll("#ingredientsContainer input:checked")).map(i => i.value)
  if (query) filtered = filtered.filter(r => r.name.toLowerCase().includes(query))
  if (type !== "Любой") filtered = filtered.filter(r => r.type == type)
  if (difficulty !== "Любая") filtered = filtered.filter(r => r.difficulty == difficulty)
  if (selectedIngredients.length > 0) filtered = filtered.filter(r => selectedIngredients.every(ing => r.ingredients.includes(ing)))
  renderRecipes(filtered)
}

searchInput.addEventListener("input", applyFilters)
typeSelect.addEventListener("change", applyFilters)
difficultySelect.addEventListener("change", applyFilters)

renderRecipes(recipes)

const ingredientsContainer = document.getElementById("ingredientsContainer")
Array.from(ingredientsSet).sort().forEach(ingredient => {
  const label = document.createElement("label")
  label.classList.add("form-check", "form-check-inline", "border", "rounded", "px-2", "py-1", "user-select-none")
  label.style.cursor = "pointer"

  const input = document.createElement("input")
  input.type = "checkbox"
  input.classList.add("form-check-input", "me-1")
  input.value = ingredient

  const span = document.createElement("span")
  span.textContent = ingredient

  label.appendChild(input)
  label.appendChild(span)

  label.addEventListener("click", e => {
    e.preventDefault()
    input.checked = !input.checked
    applyFilters()
  })

  ingredientsContainer.appendChild(label)
})

