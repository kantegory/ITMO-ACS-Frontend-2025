import apiInstance from './instance'

export const getPosts = (authorId) => {
  return apiInstance.get('/post', {
    params: authorId ? {authorId} : {}
  })
}

export const getPost = (id) => {
  return apiInstance.get(`/post/${id}`)
}

export const createPost = (postData) => {
  return apiInstance.post('/post', postData)
}

export const updatePost = (id, postData) => {
  return apiInstance.put(`/post/${id}`, postData)
}

export const deletePost = (id) => {
  return apiInstance.delete(`/post/${id}`)
}

export const addPostToFavorites = (postId, userId) => {
  return apiInstance.post(`/post/${postId}/favorite`, {userId})
}

export const removePostFromFavorites = (postId, userId) => {
  return apiInstance.delete(`/post/${postId}/favorite`, {
    data: {userId}
  })
}
