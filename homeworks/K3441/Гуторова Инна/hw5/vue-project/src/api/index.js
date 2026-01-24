import instance from '@/api/instance'
import BlogApi from '@/api/blog'

const blogApi = new BlogApi(instance)

export {
  blogApi
}
