import { getRecipes } from "./src/api.js"
import { applyTheme } from "./src/theme.js"
applyTheme()

if (!localStorage.getItem("accessToken")) {
  window.location.href = "login.html"
}

const searchInput = document.getElementById("searchInput")
const typeSelect = document.getElementById("typeSelect")
const difficultySelect = document.getElementById("difficultySelect")

applyTheme()

let recipes = []
const ingredientsSet = new Set()

recipes = await getRecipes()
recipes.forEach(r => (r.ingredients || []).forEach(i => ingredientsSet.add(i)))

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
      <a href="recipe.html?id=${r.id}" class="text-decoration-none text-dark">
        <div class="card shadow-sm h-100" style="cursor:pointer;">
          <img src="${r.photo}" class="card-img-top object-fit-cover" alt="${r.name}" style="height: 200px; width: 100%;">
          <div class="card-body">
            <h5 class="card-title">${r.name}</h5>
            <p class="card-text small text-muted">${r.text}</p>
            <p><strong>Ингредиенты:</strong> ${r.ingredients.join(", ")}</p>
            <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][r.difficulty - 1]}</p>
            <p><strong>Тип:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][r.type - 1]}</p>
            <p><strong>Автор:</strong> ${r.author}</p>
            <div class="d-flex align-items-center gap-3">
              <p class="d-inline mb-0"> ${r.likes} </p>
              <svg class="svg-icon fill icon-heart" aria-hidden="true">
                <use href="./src/sprite.svg#icon-heart"></use>
              </svg>
            </div>
          </div>
        </div>
      </a>
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
  input.classList.add("me-3")
  input.style.cursor = "pointer"
  input.value = ingredient

  const span = document.createElement("span")
  span.textContent = ingredient

  label.appendChild(input)
  label.appendChild(span)

  input.addEventListener("change", applyFilters)
  label.addEventListener("click", () => {
    setTimeout(applyFilters, 0)
  })

  ingredientsContainer.appendChild(label)

  ingredientsContainer.classList.add("ingredients-filter")

  let ingredientsToggle = document.getElementById("ingredientsToggle")
  if (!ingredientsToggle) {
    ingredientsToggle = document.createElement("button")
    ingredientsToggle.id = "ingredientsToggle"
    ingredientsToggle.type = "button"
    ingredientsToggle.className = "mt-2"
    ingredientsContainer.insertAdjacentElement("afterend", ingredientsToggle)
  }

  const syncIngredientsToggle = () => {
    const items = ingredientsContainer.querySelectorAll("label")
    const shouldCollapse = items.length > 3
    if (!shouldCollapse) {
      ingredientsContainer.classList.remove("collapsed")
      ingredientsToggle.classList.add("d-none")
      return
    }
    ingredientsToggle.classList.remove("d-none")
    if (!ingredientsContainer.classList.contains("collapsed")) ingredientsContainer.classList.add("collapsed")
    ingredientsToggle.textContent = ingredientsContainer.classList.contains("collapsed") ? "Показать ещё" : "Скрыть"
  }
  

  if (!ingredientsToggle.dataset.bound) {
    ingredientsToggle.dataset.bound = "1"
    ingredientsToggle.addEventListener("click", () => {
      ingredientsContainer.classList.toggle("collapsed")
      ingredientsToggle.textContent = ingredientsContainer.classList.contains("collapsed") ? "Показать ещё" : "Скрыть"
    })
  }

  syncIngredientsToggle()

})
