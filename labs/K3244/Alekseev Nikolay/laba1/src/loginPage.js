import { users, saveUserToStorage } from "./data.js"

const savedUser = localStorage.getItem("currentUser")
console.log(localStorage.getItem("currentUser"));
if (savedUser) window.location.href = "index.html"

document.getElementById("loginBtn").addEventListener("click", () => {
  const name = document.getElementById("loginName").value.trim()
  if (!name) return
  let user = users.find(u => u.name === name)
  if (!user) {
    alert("Пользователь не найден. Зарегистрируйтесь.")
    return
  }
  saveUserToStorage(user)
  window.location.href = "index.html"
})