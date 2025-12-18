export function advertsToCards(data) {
  return data.map((advert) => {
    const livingType = advert.property?.living?.livingType || "";
    const location = advert.property?.location || "";

    return {
      id: advert.id,
      type: livingType,
      price: advert.pricePerPeriod ?? 0,
      priceText: `${(advert.pricePerPeriod ?? 0).toLocaleString("ru-RU")} ₽/мес.`,
      location,
      title: advert.title || "Объявление",
      description: advert.description || "",
      image: advert.property?.photos?.[0]?.path || "https://picsum.photos/400/250",
    };
  });
}
