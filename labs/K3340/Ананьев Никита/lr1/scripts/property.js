const typeMapper = new Map([
    ["flat", "Квартира"], 
    ["house", "Дом"], 
    ["room", "Комната"],
    ["garage", "Гараж"]
]);

async function loadProperty() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Missing property id in URL");
        return;
    }

    const response = await fetch(`${PROPERIES_URL}?id=${id}`);

    if (!response.ok) {
        console.error("Failed to fetch property data");
        return;
    }

    const propertyData = await response.json();

    if (propertyData.length === 0) {
        //TODO: 404 logic here
        return;
    }

    return propertyData[0];
}

function fillPropertyContent(property) {
    const carousel = document.getElementById("carouselInner");
    const images = (property.images !== undefined && property.images.length !== 0) ? property.images : [DEFAULT_PICTURE_URL];

    images.forEach((img, i) => {
        imgDiv = document.createElement("div");
        imgDiv.className = "carousel-item" + (i === 0 ? " active" : "");
        imgDiv.innerHTML = `<img alt="image ${i + 1} of ${property.address}" src="${img}" class="d-block w-100">`;
        carousel.append(imgDiv);
    });

    const title = document.getElementById("propertyTitle");
    title.textContent = property.title;

    const price = document.getElementById("propertyPrice");
    price.textContent = `${property.price} ₽ / `;
    let frequency = "месяц";

    if (property.is_daily_payment)
        frequency = "день";

    price.textContent += frequency;

    const address = document.getElementById("propertyAddress");
    address.innerHTML = `<svg class="icon">
                            <use href="#icon-address"></use>
                        </svg> 
                        ${property.address}`;

    const specs = document.getElementById("propertySpecs");
    let floor = (property.floor !== undefined) ? property.floor + "-й" : "-";

    specs.innerHTML = `
        <h5 class="mb-3">Характеристики</h5>
        <p><b>Площадь:</b> ${property.area} м²</p>
        <p><b>Этаж:</b> ${floor}</p>
        <p><b>Тип:</b> ${typeMapper.get(property.type)}</p>
        <p><b>Комнат:</b> ${property.rooms}</p>
        <p><b>Расположение:</b> Рядом с метро</p>
        <p><b>Особенности:</b> С балконом, с животными</p>
    `;

    const description = document.getElementById("propertyDescription");
    description.innerHTML = `
        <h5 class="mb-3">Описание</h5>
        ${property.description}
    `;
}

function fillLandlordContent(landlord) {
    const info = document.getElementById("landlordInfo");
    const name = (landlord !== undefined) ? landlord.name : "Василий Петрович";
    const phone = (landlord !== undefined) ? landlord.phone : "+7 900 555-44-33";
    const email = (landlord !== undefined) ? landlord.email : "owner@example.com";

    info.innerHTML = `
        <h5 class="mb-3">Контакты владельца</h5>

        <p>${name}</p>
        <p>
            <svg class="icon">
                <use href="#icon-phone"></use>
            </svg> 
            ${phone}
        </p>
        <p>
            <svg class="icon">
                <use href="#icon-email"></use>
            </svg> 
            ${email}
        </p>

        <button>Написать владельцу</button>
    `;
}

document.addEventListener("DOMContentLoaded", async function() {
    const property = await loadProperty();
    fillPropertyContent(property);
    
    const landlord = await getUserById(property.owner_id);
    fillLandlordContent(landlord);
});
