const API_URL = "http://localhost:3000/login"

function generateAuthCode() {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

async function requestAuthCode({ email }) {
	const jsonBody = {
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

	const accessToken = jsonResponse.accessToken
	const authCode = generateAuthCode()

	return [accessToken, authCode]
}

function openAuthCodeModal() {
	const myModal = new bootstrap.Modal(document.querySelector(".modal"))
	myModal.show()
}

async function signIn({ email }) {
	const response = await requestAuthCode({ email })
	if (!response) {
		return
	}

	const [accessToken, authCode] = response
	console.log("code", authCode)
	openAuthCodeModal()

	document.querySelector(".sign-in-btn").addEventListener("click", (e) => {
		e.preventDefault()
		const inputAuthCode = document.querySelector(".auth-code-input").value

		if (inputAuthCode !== authCode) {
			return alert("Incorrect code")
		}

		localStorage.setItem("accessToken", accessToken)
		window.location.href = "restaurant-list.html"
	})
}

async function onSignIn(e) {
	e.preventDefault()

	const email = document.querySelector(".email-input").value
	if (!email) {
		return
	}

	await signIn({ email })
}

window.onload = () =>
	document.querySelector(".request-code-btn").addEventListener("click", onSignIn)
