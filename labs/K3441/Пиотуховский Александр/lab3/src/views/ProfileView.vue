<template>
  <main id="main-content">
    <div v-if="loading" class="container py-5">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>

    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">{{ error }}</div>
    </div>

    <div v-else-if="user" class="profile-page">
      <section class="profile-header py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-auto text-center text-md-start mb-3 mb-md-0">
              <img
                :src="user.photoUrl || 'https://placehold.co/150x150/ff6b6b/ffffff?text=' + user.username.charAt(0).toUpperCase()"
                :alt="user.username"
                class="profile-avatar"
              />
            </div>
            <div class="col-md">
              <div
                class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <div>
                  <h1 class="fw-bold mb-1 h2">{{ user.firstName || user.username }}
                    {{ user.lastName || '' }}</h1>
                  <p v-if="user.email" class="text-muted mb-0">
                    {{ user.email }}
                  </p>
                </div>
                <button
                  v-if="!isOwnProfile && authStore.isLoggedIn"
                  class="btn btn-outline-primary mt-3 mt-md-0"
                  @click="toggleFollow"
                >
                  {{ isFollowing ? 'Отписаться' : 'Подписаться' }}
                </button>
              </div>

              <div class="profile-stats">
                <div class="stat-item">
                  <div class="stat-number">{{ userRecipes.length }}</div>
                  <div class="stat-label">Рецептов</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ followers.length }}</div>
                  <div class="stat-label">Подписчиков</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ following.length }}</div>
                  <div class="stat-label">Подписок</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="profile-content py-4">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'recipes' }"
                    @click="activeTab = 'recipes'"
                  >
                    Рецепты
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'posts' }"
                    @click="activeTab = 'posts'"
                  >
                    Посты
                  </button>
                </li>
                <li v-if="isOwnProfile" class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'favorites' }"
                    @click="activeTab = 'favorites'"
                  >
                    Избранное
                  </button>
                </li>
              </ul>

              <div class="tab-content">
                <div v-if="activeTab === 'recipes'" class="tab-pane active">
                  <div v-if="userRecipes.length === 0" class="text-center py-5 text-muted">
                    Рецептов пока нет
                  </div>
                  <div v-else class="recipes-grid">
                    <RecipeCard
                      v-for="recipe in userRecipes"
                      :key="recipe.id"
                      :recipe="recipe"
                      :author="user"
                    />
                  </div>
                </div>

                <div v-if="activeTab === 'posts'" class="tab-pane active">
                  <div v-if="userPosts.length === 0" class="text-center py-5 text-muted">
                    Постов пока нет
                  </div>
                  <div v-else>
                    <PostCard
                      v-for="post in userPosts"
                      :key="post.id"
                      :post="post"
                      :author="user"
                    />
                  </div>
                </div>

                <div v-if="activeTab === 'favorites' && isOwnProfile" class="tab-pane active">
                  <div class="mb-4">
                    <h3 class="h5 mb-3">Избранные рецепты</h3>
                    <div v-if="favoriteRecipes.length === 0" class="text-muted">
                      Избранных рецептов пока нет
                    </div>
                    <div v-else class="recipes-grid">
                      <RecipeCard
                        v-for="recipe in favoriteRecipes"
                        :key="recipe.id"
                        :recipe="recipe"
                        :author="getAuthor(recipe.authorId)"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 class="h5 mb-3">Избранные посты</h3>
                    <div v-if="favoritePosts.length === 0" class="text-muted">
                      Избранных постов пока нет
                    </div>
                    <div v-else>
                      <PostCard
                        v-for="post in favoritePosts"
                        :key="post.id"
                        :post="post"
                        :author="getAuthor(post.authorId)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, RouterLink} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useApi} from '@/composables/useApi'
import {useFormatters} from '@/composables/useFormatters'
import {useToast} from '@/composables/useToast'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import PostCard from '@/components/posts/PostCard.vue'

const route = useRoute()
const authStore = useAuthStore()
const api = useApi()
const {formatDate} = useFormatters()
const {showToast} = useToast()

const user = ref(null)
const userRecipes = ref([])
const userPosts = ref([])
const favoriteRecipes = ref([])
const favoritePosts = ref([])
const followers = ref([])
const following = ref([])
const allUsers = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('recipes')
const isFollowing = ref(false)

const isOwnProfile = computed(() => {
  return authStore.currentUser?.id === user.value?.id
})

const getAuthor = (authorId) => {
  return allUsers.value.find((u) => u.id === authorId)
}

const toggleFollow = async () => {
  if (!authStore.currentUser) return

  try {
    if (isFollowing.value) {
      await api.unsubscribeFromUser(user.value.id, authStore.currentUser.id)
      isFollowing.value = false
      showToast('Вы отписались от пользователя', 'success')
    } else {
      await api.subscribeToUser(user.value.id, authStore.currentUser.id)
      isFollowing.value = true
      showToast('Вы подписались на пользователя', 'success')
    }

    const followersRes = await api.getUserFollowers(user.value.id)
    followers.value = followersRes.data
  } catch (err) {
    showToast('Ошибка при обновлении подписки', 'error')
  }
}

onMounted(async () => {
  const userId = route.params.id
    ? parseInt(route.params.id)
    : authStore.currentUser?.id

  if (!userId) {
    error.value = 'Пользователь не найден'
    loading.value = false
    return
  }

  try {
    const [
      userRes,
      recipesRes,
      postsRes,
      followersRes,
      followingRes,
      usersRes
    ] = await Promise.all([
      api.getUser(userId),
      api.getRecipes(userId).catch(() => ({data: []})),
      api.getPosts(userId).catch(() => ({data: []})),
      api.getUserFollowers(userId).catch(() => ({data: []})),
      api.getUserFollowing(userId).catch(() => ({data: []})),
      api.getUsers().catch(() => ({data: []}))
    ])

    user.value = userRes.data
    userRecipes.value = recipesRes.data
    userPosts.value = postsRes.data
    followers.value = followersRes.data
    following.value = followingRes.data
    allUsers.value = usersRes.data

    if (isOwnProfile.value) {
      const [favoriteRecipesRes, favoritePostsRes] = await Promise.all([
        api.getUserFavoriteRecipes(userId).catch(() => ({data: []})),
        api.getUserFavoritePosts(userId).catch(() => ({data: []}))
      ])

      favoriteRecipes.value = favoriteRecipesRes.data
      favoritePosts.value = favoritePostsRes.data
    }

    if (authStore.currentUser && !isOwnProfile.value) {
      isFollowing.value = followers.value.some(
        (f) => f.id === authStore.currentUser.id
      )
    }
  } catch (err) {
    error.value = 'Не удалось загрузить профиль'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--bs-secondary);
}
</style>
