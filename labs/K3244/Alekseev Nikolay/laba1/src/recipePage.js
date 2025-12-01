import { recipes } from "./data.js"

const params = new URLSearchParams(window.location.search)
const id = parseInt(params.get("id"))
const recipe = recipes.find(r => r.id === id)
const container = document.getElementById("recipeContent")

if (!recipe) {
  container.innerHTML = "<p class='text-center text-muted'>Рецепт не найден 😔</p>"
} else {
  container.innerHTML = `
    <h2 class="mb-3">${recipe.name}</h2>
    <p class="text-muted mb-2">Автор: <strong>${recipe.author}</strong></p>
    <img src="${recipe.photo}" alt="${recipe.name}" class="img-fluid rounded mb-4">
    <p>${recipe.text}</p>
    <p><strong>Ингредиенты:</strong> ${recipe.ingredients.join(", ")}</p>
    <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][recipe.difficulty - 1]}</p>
    <p><strong>Тип блюда:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][recipe.type - 1]}</p>
    ${recipe.video ? `
      <div class="ratio ratio-16x9 mt-4">
        <iframe src="${recipe.video}" allowfullscreen></iframe>
      </div>` : ""}
    <p class="mt-4">❤️ ${recipe.likes} ${recipe.subscribed ? "⭐ Подписан" : ""}</p>
  `
}