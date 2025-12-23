import apiInstance from './instance'

export const getUsers = () => {
  return apiInstance.get('/user')
}

export const getUser = (id) => {
  return apiInstance.get(`/user/${id}`)
}

export const findUser = (params) => {
  return apiInstance.post('/user/find', params)
}

export const getUserFavoriteRecipes = (userId) => {
  return apiInstance.get(`/user/${userId}/recipe_favorites`)
}

export const getUserFavoritePosts = (userId) => {
  return apiInstance.get(`/user/${userId}/post_favorites`)
}

export const getUserFollowers = (userId) => {
  return apiInstance.get(`/user/${userId}/followers`)
}

export const getUserFollowing = (userId) => {
  return apiInstance.get(`/user/${userId}/following`)
}

export const subscribeToUser = (targetUserId, currentUserId) => {
  return apiInstance.post(`/user/${targetUserId}/subscribe`, {currentUserId})
}

export const unsubscribeFromUser = (targetUserId, currentUserId) => {
  return apiInstance.delete(`/user/${targetUserId}/subscribe`, {
    data: {currentUserId}
  })
}

export const updateUser = (userId, userData) => {
  return apiInstance.put(`/user/${userId}`, userData)
}
