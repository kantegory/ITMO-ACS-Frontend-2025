import { users, saveUserToStorage } from "./data.js"
import User from "./User.js"
import { applyTheme, setTheme, getInitialTheme } from "./theme.js"

applyTheme()

const savedUser = localStorage.getItem("currentUser")

if (savedUser) window.location.href = "index.html"

document.getElementById("registerBtn").addEventListener("click", () => {
  const name = document.getElementById("registerName").value.trim()
  if (!name) return
  if (users.some(u => u.name === name)) {
    alert("Такое имя уже существует")
    return
  }
  const newUser = new User({
    id: Date.now(),
    name,
    savedRecipes: [],
    myRecipes: [],
    likedRecipes: [],
    subscriptions: [],
    theme: getInitialTheme()
  })
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  saveUserToStorage(newUser)
  setTheme(newUser.theme)
  window.location.href = "index.html"
})