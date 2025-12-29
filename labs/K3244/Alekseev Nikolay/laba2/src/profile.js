import { recipes, currentUser, saveUserToStorage } from "./data.js"
import { applyTheme, setTheme } from "./theme.js"

if (!localStorage.getItem("accessToken")) {
  window.location.href = "login.html"
}


applyTheme(currentUser?.theme)

document.getElementById("profileName").textContent = `Профиль: ${currentUser.name}`

const toolbar = document.createElement("div")
toolbar.className = "d-flex gap-2 mb-4"

const themeBtn = document.createElement("button")
themeBtn.type = "button"
themeBtn.className = "btn btn-outline-secondary"
themeBtn.textContent = currentUser.theme === "dark" ? "Тема: тёмная" : "Тема: светлая"

toolbar.appendChild(themeBtn)

document.getElementById("profileName").insertAdjacentElement("beforebegin", toolbar)

themeBtn.addEventListener("click", () => {
  currentUser.theme = currentUser.theme === "dark" ? "light" : "dark"
  saveUserToStorage(currentUser)
  setTheme(currentUser.theme)
  themeBtn.textContent = currentUser.theme === "dark" ? "Тема: тёмная" : "Тема: светлая"
})

function renderRecipeCard(recipe) {
  const card = document.createElement("div")
  card.classList.add("col-md-4")
  card.innerHTML = `
    <a href="recipe.html?id=${recipe.id}" class="text-decoration-none text-dark">
      <div class="card shadow-sm h-100">
        <img src="${recipe.photo}" class="card-img-top object-fit-cover" style="height:200px;width:100%">
        <div class="card-body">
          <h1 class="h4 card-title">${recipe.name}</h1>
          <p class="card-text small text-muted">${recipe.text}</p>
        </div>
      </div>
    </a>
  `
  return card
}

document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault()
  localStorage.removeItem("accessToken")
  localStorage.removeItem("currentUser")
  window.location.href = "login.html"
})

const myRecipesContainer = document.getElementById("myRecipes")
const savedContainer = document.getElementById("savedRecipes")

currentUser.getMyRecipes(recipes).forEach(r => myRecipesContainer.appendChild(renderRecipeCard(r)))

currentUser.getSavedRecipes(recipes).forEach(r => savedContainer.appendChild(renderRecipeCard(r)))