import { users, saveUserToStorage } from "./data.js"
import { applyTheme, setTheme, getInitialTheme } from "./theme.js"

applyTheme()

const savedUser = localStorage.getItem("currentUser")
if (savedUser) window.location.href = "index.html"

document.getElementById("loginBtn").addEventListener("click", () => {
  const name = document.getElementById("loginName").value.trim()
  if (!name) return
  let user = users.find(u => u.name === name)
  if (!user) {
    alert("Пользователь не найден. Зарегистрируйтесь.")
    return
  }
  if (user.theme !== "light" && user.theme !== "dark") user.theme = getInitialTheme()
  saveUserToStorage(user)
  setTheme(user.theme)
  window.location.href = "index.html"
})