import { currentUser, saveUserToStorage, saveRecipeToStorage, saveCommentToStorage } from "./data.js"
import { getRecipe, patchMe, toggleSubscription, getUser, patchRecipe } from "./api.js"
import { applyTheme } from "./theme.js"
applyTheme(JSON.parse(localStorage.getItem("currentUser") || "null")?.theme)

const params = new URLSearchParams(window.location.search)
const id = params.get("id")
const recipe = await getRecipe(id)
const container = document.getElementById("recipeContent")

if (!recipe) {
  container.innerHTML = "<p class='text-center text-muted'>Рецепт не найден</p>"
} else {
  container.innerHTML = `
    <img src="${recipe.photo}" class="object-fit-cover" alt="${recipe.name}" style="width: 100%;">
    <div class="card-body">
      <h2 class="h4 card-title">${recipe.name}</h2>
      <p class="card-text small text-muted">${recipe.text}</p>
      <p><strong>Ингредиенты:</strong> ${recipe.ingredients.join(", ")}</p>
      <p><strong>Сложность:</strong> ${["Легко", "Средне", "Сложно"][recipe.difficulty - 1]}</p>
      <p><strong>Тип:</strong> ${["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"][recipe.type - 1]}</p>
      ${recipe.video ? `
      <div class="ratio ratio-16x9 mt-4">
        <iframe src="${recipe.video}" allowfullscreen></iframe>
      </div>` : ""}
      <p id="authorLine"><strong>Автор:</strong> ${recipe.author}</p>
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

  const me = JSON.parse(localStorage.getItem("currentUser") || "null")

  const saveBtn = document.createElement("button")
  const savedIds = new Set(
    (me?.savedRecipeIds || me?.savedRecipes || []).map(Number)
  )
  
  saveBtn.classList.add("btn", savedIds.has(Number(recipe.id))
    ? "btn-success"
    : "btn-outline-success"
  )
  
  saveBtn.textContent = savedIds.has(Number(recipe.id))
    ? "Сохранено"
    : "Сохранить"
  container.append(saveBtn)
  saveBtn.addEventListener("click", async () => {
    const me = JSON.parse(localStorage.getItem("currentUser") || "null")
    const key = Array.isArray(me?.savedRecipeIds) ? "savedRecipeIds" : "savedRecipes"
    const current = Array.isArray(me?.[key]) ? me[key] : []
    const id = Number(recipe.id)
  
    const set = new Set(current.map(Number))
  
    if (set.has(id)) {
      set.delete(id)
      saveBtn.textContent = "Сохранить"
      saveBtn.classList.remove("btn-success")
      saveBtn.classList.add("btn-outline-success")
    } else {
      set.add(id)
      saveBtn.textContent = "Сохранено"
      saveBtn.classList.remove("btn-outline-success")
      saveBtn.classList.add("btn-success")
    }
  
    const updated = await patchMe({ [key]: Array.from(set) })
    localStorage.setItem("currentUser", JSON.stringify(updated))
  })

  const authorId = Number(recipe.authorId)

  if (me && authorId && Number(me.id) !== authorId) {
    const subBtn = document.createElement("button")
    subBtn.type = "button"
    subBtn.className = "btn btn-outline-primary ms-2"

    const setBtn = () => {
      const subs = new Set((me.subscriptions || []).map(Number))
      subBtn.textContent = subs.has(authorId) ? "Отписаться" : "Подписаться"
    }

    setBtn()

    subBtn.addEventListener("click", async () => {
      const updated = await toggleSubscription(authorId)
      me.subscriptions = updated.subscriptions || []
      setBtn()
    })

    const authorLine = document.getElementById("authorLine")
    if (authorLine) authorLine.appendChild(subBtn)
  }

  const likeBtn = document.createElement("button")
  const likedIds = new Set(
    (me?.likedRecipeIds || me?.likedRecipes || []).map(Number)
  )
  
  likeBtn.classList.add("btn", likedIds.has(Number(recipe.id))
    ? "btn-danger"
    : "btn-outline-danger"
  )
  
  likeBtn.textContent = likedIds.has(Number(recipe.id))
    ? "Убрать лайк"
    : "Поставить лайк"
  
  container.append(likeBtn)
  likeBtn.addEventListener("click", async () => {
    const me = JSON.parse(localStorage.getItem("currentUser") || "null")
    const key = Array.isArray(me?.likedRecipeIds) ? "likedRecipeIds" : "likedRecipes"
    const current = Array.isArray(me?.[key]) ? me[key] : []
    const rid = Number(recipe.id)
  
    const set = new Set(current.map(Number))
  
    let nextLikes = Number(recipe.likes) || 0
  
    if (set.has(rid)) {
      set.delete(rid)
      likeBtn.textContent = "Поставить лайк"
      likeBtn.classList.remove("btn-danger")
      likeBtn.classList.add("btn-outline-danger")
      nextLikes = Math.max(0, nextLikes - 1)
      currentUser.unlikeRecipe(rid)
    } else {
      set.add(rid)
      likeBtn.textContent = "Убрать лайк"
      likeBtn.classList.remove("btn-outline-danger")
      likeBtn.classList.add("btn-danger")
      nextLikes = nextLikes + 1
      currentUser.likeRecipe(rid)
    }
  
    const [updated] = await Promise.all([
      patchMe({ [key]: Array.from(set) }),
      patchRecipe(rid, { likes: nextLikes })
    ])
  
    if (Array.isArray(updated?.likedRecipeIds)) currentUser.likedRecipeIds = updated.likedRecipeIds
    if (Array.isArray(updated?.likedRecipes)) currentUser.likedRecipes = updated.likedRecipes
  
    recipe.likes = nextLikes
    container.querySelector("p.d-inline").textContent = recipe.likes
  })
  const commentsSection = document.createElement("div")
  commentsSection.classList.add("mt-4")
  const commentsTitle = document.createElement("h3")
  commentsTitle.classList.add("h5")  
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
    commentInput.setAttribute("aria-label", "Комментарий")
    saveCommentToStorage(recipe)
  })
}