import apiInstance from './instance'

export const getComments = (commentableType, commentableId) => {
  return apiInstance.get('/comments', {
    params: {commentableType, commentableId}
  })
}

export const createComment = (commentData) => {
  return apiInstance.post('/comments', commentData)
}

export const updateComment = (id, content) => {
  return apiInstance.put(`/comments/${id}`, {content})
}

export const deleteComment = (id) => {
  return apiInstance.delete(`/comments/${id}`)
}
