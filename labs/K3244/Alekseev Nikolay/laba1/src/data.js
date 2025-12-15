import Recipe from "./Recipe.js"
import User from "./User.js"
import Author from "./Author.js"

function loadUserFromStorage() {
  const data = localStorage.getItem("currentUser")
  return data ? Object.assign(new User({}), JSON.parse(data)) : null
}

function saveUserToStorage(user) {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

const recipes = [
  new Recipe({
    id: 1,
    authorId: 3,
    author: "Надежда",
    name: "Блины с мёдом",
    text: "Смешайте муку, яйца, молоко и щепотку соли. Обжарьте блины с обеих сторон и подавайте с мёдом.",
    ingredients: ["Мука", "Яйца", "Молоко", "Мёд", "Соль"],
    difficulty: 1,
    type: 1,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 128,
    subscribed: true,
    saved: false
  }),
  new Recipe({
    id: 2,
    authorId: 2,
    author: "Александр",
    name: "Паста с курицей и сливками",
    text: "Обжарьте курицу, добавьте сливки и чеснок. Смешайте с макаронами и посыпьте сыром.",
    ingredients: ["Курица", "Чеснок", "Сливки", "Паста", "Сыр"],
    difficulty: 2,
    type: 2,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 214,
    subscribed: false,
    saved: false
  }),
  new Recipe({
    id: 3,
    authorId: 3,
    author: "Надежда",
    name: "Шоколадный торт",
    text: "Смешайте муку, сахар, яйца и какао. Выпекайте при 180°C в течение 40 минут. Украсьте глазурью.",
    ingredients: ["Мука", "Яйца", "Сахар", "Шоколад", "Масло"],
    difficulty: 3,
    type: 4,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    likes: 312,
    subscribed: false,
    saved: false
  })
]

const users = [
  new User({
    id: 1,
    name: "Николай",
    savedRecipes: [],
    myRecipes: [3]
  }),
]

const authors = [
  new Author({
    id: 3,
    name: "Надежда",
    subscribers: []
  }),
  new Author({
    id: 2,
    name: "Александр",
    subscribers: []
  })
]

let currentUser = loadUserFromStorage() || null
if (currentUser) saveUserToStorage(currentUser)

function loadRecipesFromStorage(recipes) {
  const data = localStorage.getItem("recipes")
  if (data) {
    const saved = JSON.parse(data)
    for (let i = 0; i < recipes.length; i++) {
      const stored = saved.find(r => r.id === recipes[i].id)
      if (stored) Object.assign(recipes[i], stored)
    }
  }
}

function saveRecipeToStorage(recipe) {
  const data = localStorage.getItem("recipes")
  let stored = data ? JSON.parse(data) : []
  const index = stored.findIndex(r => r.id === recipe.id)
  if (index !== -1) {
    stored[index] = recipe
  } else {
    stored.push(recipe)
  }
  localStorage.setItem("recipes", JSON.stringify(stored))
}

loadRecipesFromStorage(recipes)

function loadCommentsFromStorage(recipes) {
  const data = localStorage.getItem("comments")
  if (data) {
    const saved = JSON.parse(data)
    for (let i = 0; i < recipes.length; i++) {
      const stored = saved.find(r => r.id === recipes[i].id)
      if (stored) recipes[i].comments = stored.comments || []
    }
  }
}

function saveCommentToStorage(recipe) {
  const data = localStorage.getItem("comments")
  let stored = data ? JSON.parse(data) : []
  const index = stored.findIndex(r => r.id === recipe.id)
  if (index !== -1) {
    stored[index] = { id: recipe.id, comments: recipe.comments }
  } else {
    stored.push({ id: recipe.id, comments: recipe.comments })
  }
  localStorage.setItem("comments", JSON.stringify(stored))
}

loadCommentsFromStorage(recipes)


function loadAuthorsFromStorage(authors) {
  const data = localStorage.getItem("authors")
  if (data) {
    const saved = JSON.parse(data)
    for (let i = 0; i < authors.length; i++) {
      const stored = saved.find(a => a.id === authors[i].id)
      if (stored) Object.assign(authors[i], stored)
    }
  }
}

function saveAuthorToStorage(author) {
  const data = localStorage.getItem("authors")
  let stored = data ? JSON.parse(data) : []
  const index = stored.findIndex(a => a.id === author.id)
  if (index !== -1) {
    stored[index] = author
  } else {
    stored.push(author)
  }
  localStorage.setItem("authors", JSON.stringify(stored))
}

loadAuthorsFromStorage(authors)


export { users, recipes, currentUser, saveUserToStorage, saveRecipeToStorage, authors, saveAuthorToStorage, saveCommentToStorage }
