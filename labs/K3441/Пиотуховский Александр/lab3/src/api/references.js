import apiInstance from './instance'

export const getDishTypes = () => {
  return apiInstance.get('/dish_type')
}

export const getIngredients = () => {
  return apiInstance.get('/ingredient')
}

export const getRoles = () => {
  return apiInstance.get('/role')
}

export const getPermissions = () => {
  return apiInstance.get('/permissions')
}
