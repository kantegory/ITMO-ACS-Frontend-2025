import { recipes, currentUser } from "./data.js"

document.getElementById("profileName").textContent = `Профиль: ${currentUser.name}`

function renderRecipeCard(recipe) {
  const card = document.createElement("div")
  card.classList.add("col-md-4")
  card.innerHTML = `
    <a href="recipe.html?id=${recipe.id}" class="text-decoration-none text-dark">
      <div class="card shadow-sm h-100">
        <img src="${recipe.photo}" class="card-img-top object-fit-cover" style="height:200px;width:100%">
        <div class="card-body">
          <h5 class="card-title">${recipe.name}</h5>
          <p class="card-text small text-muted">${recipe.text}</p>
        </div>
      </div>
    </a>
  `
  return card
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "login.html"
})

const myRecipesContainer = document.getElementById("myRecipes")
const savedContainer = document.getElementById("savedRecipes")

currentUser.getMyRecipes(recipes).forEach(r => myRecipesContainer.appendChild(renderRecipeCard(r)))
console.log(currentUser.getMyRecipes(recipes));

currentUser.getSavedRecipes(recipes).forEach(r => savedContainer.appendChild(renderRecipeCard(r)))