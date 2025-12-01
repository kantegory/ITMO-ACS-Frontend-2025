import { recipes, currentUser, saveUserToStorage, saveRecipeToStorage, authors, saveAuthorToStorage, saveCommentToStorage } from "./data.js"

const params = new URLSearchParams(window.location.search)
const id = parseInt(params.get("id"))
const recipe = recipes.find(r => r.id === id)
const container = document.getElementById("recipeContent")

if (!recipe) {
  container.innerHTML = "<p class='text-center text-muted'>Рецепт не найден</p>"
} else {
  container.innerHTML = `
    <img src="${recipe.photo}" class="object-fit-cover" alt="${recipe.name}" style="width: 100%;">
    <div class="card-body">
      <h5 class="card-title">${recipe.name}</h5>
      <p class="card-text small text-muted">${recipe.text}</p>
      <p><strong>Ингредиенты:</strong> ${recipe.ingredients.join(", ")}</p>
      <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][recipe.difficulty - 1]}</p>
      <p><strong>Тип:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][recipe.type - 1]}</p>
      ${recipe.video ? `
      <div class="ratio ratio-16x9 mt-4">
        <iframe src="${recipe.video}" allowfullscreen></iframe>
      </div>` : ""}
      <p><strong>Автор:</strong> ${recipe.author}</p>
      <div class="d-flex align-items-center gap-3">
        <p class="d-inline mb-0"> ${recipe.likes} </p>
        <svg fill="#cc2424" width="30px" height="30px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#cc2424"><g id="SVGRepo_bgCarrier"
        stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
        <path d="M220.3457,136.50781l-81.03125,81.03125a16.013,16.013,0,0,1-22.625,0L33.58008,134.42969a59.974,59.974,0,0,1,2.34375-87.07031c23.28125-21.01563,
        61.25-19.05469,84.57812,4.29687l7.5,7.49219,9.57813-9.57813a60.69786,60.69786,0,0,1,43.98437-17.55469A59.54956,59.54956,0,0,1,224.627,51.90625C245.61133,
        75.20312,243.68945,113.15625,220.3457,136.50781Z"></path> </g></svg>
      </div>
    </div>
  `

  const saveBtn = document.createElement("button")
  saveBtn.classList.add("btn", currentUser.isRecipeSaved(recipe.id) ? "btn-success" : "btn-outline-success")
  saveBtn.textContent = currentUser.isRecipeSaved(recipe.id) ? "Сохранено" : "Сохранить"
  container.append(saveBtn)
  saveBtn.addEventListener("click", () => {
    if (currentUser.isRecipeSaved(recipe.id)) {
      currentUser.unsaveRecipe(recipe.id)
      saveBtn.textContent = "Сохранить"
      saveBtn.classList.remove("btn-success")
      saveBtn.classList.add("btn-outline-success")
    } else {
      currentUser.saveRecipe(recipe.id)
      saveBtn.textContent = "Сохранено"
      saveBtn.classList.remove("btn-outline-success")
      saveBtn.classList.add("btn-success")
    }
    saveUserToStorage(currentUser)
  })

  const likeBtn = document.createElement("button")
  likeBtn.classList.add("btn", currentUser.isRecipeLiked(recipe.id) ? "btn-danger" : "btn-outline-danger")
  likeBtn.textContent = currentUser.isRecipeLiked(recipe.id) ? "Убрать лайк" : "Поставить лайк"
  container.append(likeBtn)
  likeBtn.addEventListener("click", () => {
    if (currentUser.isRecipeLiked(recipe.id)) {
      currentUser.unlikeRecipe(recipe.id)
      likeBtn.textContent = "Поставить лайк"
      likeBtn.classList.remove("btn-danger")
      likeBtn.classList.add("btn-outline-danger")
      recipe.likes--
    } else {
      currentUser.likeRecipe(recipe.id)
      likeBtn.textContent = "Убрать лайк"
      likeBtn.classList.remove("btn-outline-danger")
      likeBtn.classList.add("btn-danger")
      recipe.likes++
    }
    saveRecipeToStorage(recipe)
    saveUserToStorage(currentUser)
    container.querySelector("p.d-inline").textContent = recipe.likes
  })

  const author = authors.find(a => a.id === recipe.authorId)
  const subBtn = document.createElement("button")
  const isSubscribed = author.isSubscribed(currentUser.id)
  subBtn.classList.add("btn", isSubscribed ? "btn-primary" : "btn-outline-primary")
  subBtn.textContent = isSubscribed ? "Отписаться" : "Подписаться"
  container.append(subBtn)
  subBtn.addEventListener("click", () => {
    if (author.isSubscribed(currentUser.id)) {
      author.removeSubscriber(currentUser.id)
      subBtn.textContent = "Подписаться"
      subBtn.classList.remove("btn-primary")
      subBtn.classList.add("btn-outline-primary")
    } else {
      author.addSubscriber(currentUser.id)
      subBtn.textContent = "Отписаться"
      subBtn.classList.remove("btn-outline-primary")
      subBtn.classList.add("btn-primary")
    }
    saveAuthorToStorage(author)
  })

  const commentsSection = document.createElement("div")
  commentsSection.classList.add("mt-4")
  const commentsTitle = document.createElement("h5")
  commentsTitle.textContent = "Комментарии"
  commentsSection.append(commentsTitle)

  const commentsList = document.createElement("div")
  commentsList.classList.add("mb-3")
  if (!recipe.comments) recipe.comments = []
  recipe.comments.forEach(c => {
    const commentItem = document.createElement("div")
    commentItem.classList.add("border", "rounded", "p-2", "mb-2")
    commentItem.innerHTML = `<strong>${c.user}:</strong> ${c.text}`
    commentsList.append(commentItem)
  })
  commentsSection.append(commentsList)

  const commentForm = document.createElement("div")
  commentForm.classList.add("d-flex", "gap-2")
  const commentInput = document.createElement("input")
  commentInput.type = "text"
  commentInput.placeholder = "Введите комментарий"
  commentInput.classList.add("form-control")
  const commentBtn = document.createElement("button")
  commentBtn.classList.add("btn", "btn-outline-primary")
  commentBtn.textContent = "Отправить"
  commentForm.append(commentInput, commentBtn)
  commentsSection.append(commentForm)
  container.append(commentsSection)

  commentBtn.addEventListener("click", () => {
    const text = commentInput.value.trim()
    if (!text) return
    const newComment = { user: currentUser.name, text }
    recipe.comments.push(newComment)
    const commentItem = document.createElement("div")
    commentItem.classList.add("border", "rounded", "p-2", "mb-2")
    commentItem.innerHTML = `<strong>${newComment.user}:</strong> ${newComment.text}`
    commentsList.append(commentItem)
    commentInput.value = ""
    saveCommentToStorage(recipe)
  })
}