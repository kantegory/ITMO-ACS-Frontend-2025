export function renderMyAdverts(adverts) {
  const container = document.getElementById("my-properties");
  if (!container) return;

  container.innerHTML = "";

  adverts.forEach((a) => {
    const div = document.createElement("div");
    div.className = "card mb-2";
    div.innerHTML = `
      <div class="card-body">
        <h2>${a.title}</h2>
        <p>${a.price} ₽</p>
      </div>
    `;
    container.appendChild(div);
  });
}
