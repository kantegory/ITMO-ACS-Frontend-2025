import apiInstance from './instance'
import * as auth from './auth'
import * as users from './users'
import * as recipes from './recipes'
import * as posts from './posts'
import * as comments from './comments'
import * as references from './references'

export default function useApi() {
  return {
    ...auth,
    ...users,
    ...recipes,
    ...posts,
    ...comments,
    ...references
  }
}

export {apiInstance}
