export async function renderCards(cardsData) {
  const container = document.getElementById("results");
  if (!container) return;
  const templateHtml = await fetch("../component/property-card.html").then(r => r.text());
  container.innerHTML = "";
  cardsData.forEach(data => {
    let card = templateHtml;
    card = card.replaceAll("{type}", data.type);
    card = card.replaceAll("{price}", data.price);
    card = card.replaceAll("{location}", data.location);
    card = card.replaceAll("{image}", data.image);
    card = card.replaceAll("{title}", data.title);
    card = card.replaceAll("{address}", data.address);
    card = card.replaceAll("{priceText}", data.priceText);
    card = card.replaceAll("{description}", data.description);
    container.insertAdjacentHTML("beforeend", card);
  });
}
