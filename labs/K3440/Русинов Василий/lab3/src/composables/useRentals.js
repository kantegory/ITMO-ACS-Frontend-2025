import { http } from "@/api/instance";

export function useRentals() {
  async function rent(item) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    const { data: existing } = await http.get(
      `/rentals?userId=${userId}&title=${encodeURIComponent(item.title)}`
    );

    if (existing.length > 0) {
      alert("Вы уже забронировали этот объект");
      return;
    }

    await http.post("/rentals", {
      title: item.title,
      price: item.price,
      img: item.img,
      location: item.location,
      type: item.type,
      userId
    });

    alert("Заявка отправлена");
  }

  async function getUserRentals(userId) {
    const { data } = await http.get(`/rentals?userId=${userId}`);
    return data;
  }

  return { rent, getUserRentals };
}
