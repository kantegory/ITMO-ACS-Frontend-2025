const API_URL = "http://localhost:3000/register"

async function signUp({ firstName, lastName, email }) {
	const jsonBody = {
		firstName,
		lastName,
		email,
		password: "password",
	}

	const response = await fetch(API_URL, {
		method: "POST",
		body: JSON.stringify(jsonBody),
		headers: {
			"Content-Type": "application/json",
		},
	})

	const jsonResponse = await response.json()
	if (!response.ok) {
		return alert(jsonResponse)
	}

	localStorage.setItem("accessToken", jsonResponse.accessToken)
	window.location.href = "restaurant-list.html"
}

async function onSignUp(e) {
	e.preventDefault()

	const firstName = document.querySelector(".first-name-input").value
	const lastName = document.querySelector(".last-name-input").value
	const email = document.querySelector(".email-input").value

	if (!firstName || !lastName || !email) {
		return
	}

	await signUp({ firstName, lastName, email })
}

window.onload = () => document.querySelector(".sign-up-btn").addEventListener("click", onSignUp)
