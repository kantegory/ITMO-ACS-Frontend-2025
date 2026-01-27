const API_URL = "http://localhost:3000"

async function fetchMenus({ restaurantId }) {
	const response = await fetch(`${API_URL}/menus?restaurantId=${restaurantId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})

	if (!response.ok) {
		return []
	}

	return await response.json()
}

function renderMenuCard({ dishName, description, price }) {
	if (description.length > 40) {
		description = description.substring(0, 40) + "..."
	}

	const container = document.querySelector(".menu-cards")
	const card = `
        <div class="col">
            <div class="card">
                <img 
                    src="https://zefirka.club/uploads/posts/2023-01/1673355119_22-zefirka-club-p-znak-voprosa-na-chernom-fone-46.jpg"
                    class="card-img-top" 
                    alt="${dishName}"
                >
                <div class="card-body">
                    <h5 class="card-title">${dishName}</h5>
                    <p class="card-text">${description}</p>
                    <p class="card-text"><small class="text-muted">${price} рублей</small></p>
                </div>
            </div>
        </div>`

	container.innerHTML += card
}

function renderReviewCard({ text }) {
	const date = new Date()
	const container = document.querySelector(".reviews")
	const card = `
        <div class="d-flex justify-content-between p-3">
            <div class="d-flex">
                <img 
                    src="https://avatars.mds.yandex.net/i?id=18ce000868abd0be3ba1dbb160f69940_l-11953023-images-thumbs&n=13" 
                    alt="Anonym" 
                    class="avatar">
                <div class="row">
                    <div class="mb-2">Anonym</div>
                    <p>${text}</p>
                </div>
            </div>
            <div>${date.toLocaleString()}</div>
        </div>`

	container.innerHTML += card
}

function onAddReview(e) {
	e.preventDefault()
	const text = document.querySelector(".review-input").value
	if (text) {
		renderReviewCard({ text })
	}
}

window.onload = async () => {
	const params = new URLSearchParams(window.location.search)
	const restaurantId = params.get("id")
	const restaurantName = params.get("name")
	document.querySelector(".restaurant-name").textContent = restaurantName

	const menus = await fetchMenus({ restaurantId })
	menus.forEach((menu) => renderMenuCard(menu))
	document.querySelector(".review-btn").addEventListener("click", onAddReview)
}
