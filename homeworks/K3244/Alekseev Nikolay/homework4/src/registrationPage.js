import { applyTheme } from "./theme.js"
import { registerByName } from "./api.js"

applyTheme()

const savedUser = localStorage.getItem("accessToken")
if (savedUser) window.location.href = "index.html"

document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = document.getElementById("registerName").value.trim()
  if (!name) return
  try {
    await registerByName(name)
    window.location.href = "index.html"
  } catch (e) {
    alert("Такое имя уже существует")
  }
})