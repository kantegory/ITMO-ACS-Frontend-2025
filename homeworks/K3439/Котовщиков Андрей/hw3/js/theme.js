function changeTheme({ theme }) {
	const themeLink = document.querySelector(".theme")
	themeLink.href = `../css/${theme}.css`
	themeLink.media = "all"
}

document.addEventListener("DOMContentLoaded", () => {
	const theme = localStorage.getItem("theme") ?? "light"
	changeTheme({ theme })
})
