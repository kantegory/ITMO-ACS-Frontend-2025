import instance from "@/api/instance"
import RentalsApi from "@/api/rentals"

const rentalsApi = new RentalsApi(instance)

export {
  rentalsApi
}
