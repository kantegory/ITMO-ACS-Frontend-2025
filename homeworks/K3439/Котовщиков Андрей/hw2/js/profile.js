const API_URL = "http://localhost:3000/600"

async function fetchProfile({ accessToken }) {
	const response = await fetch(`${API_URL}/users/1`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	})

	if (response.status === 401) {
		window.location.href = "sign-in.html"
		return
	}

	return await response.json()
}

async function fetchBookings({ accessToken }) {
	const response = await fetch(`${API_URL}/bookings`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	})

	if (!response.ok) {
		return []
	}

	return await response.json()
}

function onSaveProfile(e) {
	e.preventDefault()

	const firstName = document.querySelector(".first-name-input").value
	const lastName = document.querySelector(".last-name-input").value

	document.querySelector(".greeting").textContent = `Добро пожаловать, ${firstName}`
	document.querySelector(".username").textContent = `${lastName} ${firstName}`
}

function openProfileEditModal() {
	const myModal = new bootstrap.Modal(document.querySelector(".modal"))
	myModal.show()
}

function onProfileEdit(e) {
	e.preventDefault()
	openProfileEditModal()

	const firstNameInput = document.querySelector(".first-name-input")
	const lastNameInput = document.querySelector(".last-name-input")

	const [lastName, firstName] = document.querySelector(".username").textContent.split(" ", 2)
	firstNameInput.placeholder = firstName
	lastNameInput.placeholder = lastName
}

function renderBookingCard({ restaurantName, date, totalAmount }) {
	const dateObj = new Date(date)
	const container = document.querySelector(".booking-cards")
	const card = `
		<div class="list-group-item d-flex justify-content-between align-items-center">
			<div>
				<h6 class="mb-1">${restaurantName}</h6>
				<small>${dateObj.toLocaleString()}</small>
			</div>
			<span class="badge bg-danger rounded-pill">${totalAmount} ₽</span>
		</div>`

	container.innerHTML += card
}

window.onload = async () => {
	const accessToken = localStorage.getItem("accessToken")
	if (!accessToken) {
		window.location.href = "sign-in.html"
		return
	}

	const { firstName, lastName, email } = await fetchProfile({ accessToken })
	document.querySelector(".greeting").textContent = `Добро пожаловать, ${firstName}`
	document.querySelector(".username").textContent = `${lastName} ${firstName}`
	document.querySelector(".email").textContent = email

	const bookings = await fetchBookings({ accessToken })
	bookings.forEach((booking) => renderBookingCard(booking))

	document.querySelector(".edit-profile-btn").addEventListener("click", onProfileEdit)
	document.querySelector(".save-profile-btn").addEventListener("click", onSaveProfile)
}
