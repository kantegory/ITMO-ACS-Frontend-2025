import { applyTheme } from "./theme.js"
import { loginByName } from "./api.js"

applyTheme()

const savedUser = localStorage.getItem("accessToken")
if (savedUser) window.location.href = "index.html"

document.getElementById("loginBtn").addEventListener("click", async () => {
  const name = document.getElementById("loginName").value.trim()
  if (!name) return
  try {
    await loginByName(name)
    window.location.href = "index.html"
  } catch (e) {
    alert("Пользователь не найден. Зарегистрируйтесь.")
  }
})