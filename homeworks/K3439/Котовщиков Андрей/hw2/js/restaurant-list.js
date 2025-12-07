const API_URL = "http://localhost:3000/restaurants"

async function fetchRestaurants({ city, cuisine, priceFrom }) {
	const url = new URL(API_URL)
	if (city) {
		url.searchParams.append("city", city)
	}

	console.log(cuisine)
	if (cuisine) {
		url.searchParams.append("cuisines_like", cuisine)
	}

	if (priceFrom) {
		url.searchParams.append("priceFrom_gte", priceFrom)
	}

	const response = await fetch(url, {
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

function clearRestaurantCards() {
	const container = document.querySelector(".card-list")
	container.innerHTML = ""
}

function renderRestaurantCard({ id, name, description, city, cuisines, priceFrom }) {
	let cuisinesString = cuisines.join(", ")
	if (cuisinesString.length > 15) {
		cuisinesString = cuisinesString.substring(0, 15) + "..."
	}

	const container = document.querySelector(".card-list")
	const card = `
            <div class="col">
                <div class="card">
                    <img
                        src="https://zefirka.club/uploads/posts/2023-01/1673355119_22-zefirka-club-p-znak-voprosa-na-chernom-fone-46.jpg",
                        class="restaurant-image card-img-top"
                        alt="${name}"
                    >
                    <div class="card-body">
                        <h3 class="restaurant-card-title card-title">${name}</h3>
                        <p class="card-text">${description}</p>
                        <ul class="list-group list-group-flush mb-3">
                            <li class="list-group-item">Город: ${city}</li>
                            <li class="list-group-item">Кухня: ${cuisinesString}</li>
                            <li class="list-group-item">Цена: От ${priceFrom} рублей</li>
                        </ul>
                        <a href="restaurant-detail.html?id=${id}&name=${name}" class="btn btn-primary text-white">Подробнее</a>
                    </div>
                </div>
            </div>
        `

	container.innerHTML += card
}

async function onFilterRestaurants(e) {
	e.preventDefault()

	const city = document.querySelector(".city-filter").value
	const cuisine = document.querySelector(".cuisine-filter").value
	const priceFrom = document.querySelector(".price-filter").value

	const restaurants = await fetchRestaurants({
		city: city === "any" ? null : city,
		cuisine: cuisine === "any" ? null : cuisine,
		priceFrom: priceFrom === "any" ? null : priceFrom,
	})

	clearRestaurantCards()
	restaurants.forEach((restaurant) => renderRestaurantCard(restaurant))
}

async function onResetFilter(e) {
	e.preventDefault()

	const anyCity = document.querySelector(".city-filter option[value='any']")
	anyCity.selected = true

	const anyCuisine = document.querySelector(".cuisine-filter option[value='any']")
	anyCuisine.selected = true

	const anyPriceFrom = document.querySelector(".price-filter option[value='any']")
	anyPriceFrom.selected = true

	const restaurants = await fetchRestaurants({ city: null, cuisine: null, priceFrom: null })
	clearRestaurantCards()
	restaurants.forEach((restaurant) => renderRestaurantCard(restaurant))
}

window.onload = async () => {
	const restaurants = await fetchRestaurants({ city: null, cuisine: null, priceFrom: null })
	restaurants.forEach((restaurant) => renderRestaurantCard(restaurant))

	document.querySelector(".filter-btn").addEventListener("click", onFilterRestaurants)
	document.querySelector(".reset-filter-btn").addEventListener("click", onResetFilter)
}
