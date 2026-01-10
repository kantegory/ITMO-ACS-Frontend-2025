let filters = new Map();

function buildCardHTML(property) {
    const newCard = document.createElement("div");
    newCard.className = "card";

    const img = document.createElement("img");
    img.src = (property.feed_img !== undefined) ? property.feed_img : DEFAULT_PICTURE_URL;

    const info = document.createElement("div");
    info.className = "card-info";

    const price = document.createElement("div");
    price.className = "price";
    price.innerHTML = `${property.price} ₽ / `;
    let frequency = "месяц";

    if (property.is_daily_payment)
        frequency = "день";

    price.innerHTML += frequency;

    const link = document.createElement("div");
    link.innerHTML = `<a class="card-link" href="property.html?id=${property.id}">${property.address}</a>`;

    const description = document.createElement("p");
    description.innerHTML = `${property.area} м², ${property.rooms} комнат(-ы)`;
    if (property.floor !== undefined) 
        description.innerHTML += `, ${property.floor}-й этаж`;
    description.innerHTML += `<br>${property.description}`;

    info.append(price, link, description);
    newCard.append(img, info);

    return newCard;
}

function collectFilters() {
    filters.clear();

    document.querySelectorAll(".filter").forEach(filter => {
        const key = filter.dataset.filter;

        const select = filter.querySelector("select");
        if (select) {
            const value = select.value;
            if (value !== "" && value !== DEFAULT_SELECT) 
                filters.set(key, value);
            return; 
        }

        const checkboxes = filter.querySelectorAll("input[type=checkbox]");
        if (checkboxes.length > 0) {
            const checkedValues = [];
            checkboxes.forEach(ch => {
                if (ch.checked) checkedValues.push(ch.value);
            });

            if (checkedValues.length > 0) {
                filters.set(key, checkedValues);
            }
        }
    });
}

async function filterProperties() {
    collectFilters();
    const query = buildQuery(filters);

    response = await fetch(PROPERIES_URL + query);
    
    if (!response.ok) {
        console.error(`Failed to load properties list; response status = ${response.status}`);
        return;
    }

    data = await response.json();
    const cards = document.getElementById("cards");
    cards.innerHTML = "";

    if (data.length == 0) {
        return;
    }

    data.forEach((prop) => {
        cards.append(buildCardHTML(prop));
    });

    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", async function() {
    await filterProperties();
});
