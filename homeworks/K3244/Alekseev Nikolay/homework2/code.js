import { recipes } from "./src/data.js"

if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html"
}

const searchInput = document.getElementById("searchInput")
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
      <a href="recipe.html?id=${r.id}" class="text-decoration-none text-dark">
        <div class="card shadow-sm h-100" style="cursor:pointer;">
          <img src="${r.photo}" class="card-img-top object-fit-cover" alt="${r.name}" style="height: 200px; width: 100%;">
          <div class="card-body">
            <h1 class="h4 card-title">${r.name}</h1>
            <p class="card-text small text-muted">${r.text}</p>
            <p><strong>Ингредиенты:</strong> ${r.ingredients.join(", ")}</p>
            <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][r.difficulty - 1]}</p>
            <p><strong>Тип:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][r.type - 1]}</p>
            <p><strong>Автор:</strong> ${r.author}</p>
            <div class="d-flex align-items-center gap-3">
              <p class="d-inline mb-0"> ${r.likes} </p>
              <svg fill="#cc2424" width="30px" height="30px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#cc2424"><g id="SVGRepo_bgCarrier"
              stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
              <path d="M220.3457,136.50781l-81.03125,81.03125a16.013,16.013,0,0,1-22.625,0L33.58008,134.42969a59.974,59.974,0,0,1,2.34375-87.07031c23.28125-21.01563,
              61.25-19.05469,84.57812,4.29687l7.5,7.49219,9.57813-9.57813a60.69786,60.69786,0,0,1,43.98437-17.55469A59.54956,59.54956,0,0,1,224.627,51.90625C245.61133,
              75.20312,243.68945,113.15625,220.3457,136.50781Z"></path> </g></svg>
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
})

