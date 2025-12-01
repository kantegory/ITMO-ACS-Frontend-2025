import Recipe from "./Recipe.js"
import User from "./User.js"

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
    authorId: 1,
    author: "Николай",
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

// временный “вошедший” пользователь
const currentUser = users[0]

export { recipes, users, currentUser }
