import instance from "./instance"

export const filtersApi = {
  getAll: () => instance.get("/filters")
}
