class BlogApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/posts'
    })
  }

  createPost = async (data) => {
    return this.API({
      method: 'POST',
      url: '/posts',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default BlogApi
