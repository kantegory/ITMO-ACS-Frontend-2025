const MOCK_RESTAURANTS = [
  { id: '1', name: 'La Famiglia', city: 'Санкт-Петербург', cuisine: 'italian', price: 'moderate', rating: 4.6, address: 'Невский пр., 10', hours: '12:00–23:00' },
  { id: '2', name: 'Sakura', city: 'Санкт-Петербург', cuisine: 'japanese', price: 'expensive', rating: 4.8, address: 'Литейный, 5', hours: '13:00–22:00' },
  { id: '3', name: 'Хинкальная', city: 'Москва', cuisine: 'georgian', price: 'budget', rating: 4.3, address: 'Тверская, 25', hours: '11:00–23:00' },
]

export function fetchRestaurants() {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESTAURANTS), 250))
}

export function fetchRestaurantById(id) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const item = MOCK_RESTAURANTS.find(r => r.id === id)
      if (!item) reject(new Error('Not found'))
      else resolve(item)
    }, 200),
  )
}
