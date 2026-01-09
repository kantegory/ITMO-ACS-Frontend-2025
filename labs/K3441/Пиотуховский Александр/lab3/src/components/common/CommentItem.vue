<template>
  <div>
    <div class="comment-item" :class="{ 'nested-comment': isNested }">
      <img
        :src="author?.photoUrl || 'https://placehold.co/40x40/999/fff?text=?'"
        :alt="author?.username || 'User'"
        class="comment-avatar"
      />
      <div class="comment-content">
        <div class="comment-header">
          <RouterLink
            v-if="author"
            :to="`/profile/${author.id}`"
            class="comment-author"
          >
            {{ author.firstName || 'Пользователь' }} {{ author.lastName || '' }}
          </RouterLink>
          <span v-else class="comment-author">Пользователь</span>
          <span class="comment-time">{{ formattedDate }}</span>
        </div>

        <div v-if="isEditing">
          <textarea
            v-model="editContent"
            class="form-control"
            rows="3"
          ></textarea>
          <div class="mt-2">
            <button
              class="btn btn-sm btn-primary me-2"
              @click="saveEdit"
            >
              Сохранить
            </button>
            <button
              class="btn btn-sm btn-secondary"
              @click="cancelEdit"
            >
              Отмена
            </button>
          </div>
        </div>

        <div v-else>
          <p class="comment-text">{{ comment.content }}</p>
          <div v-if="canReply" class="comment-actions">
            <button
              class="btn btn-link btn-sm p-0 comment-reply-btn"
              @click="$emit('reply', comment)"
            >
              Ответить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Вложенные комментарии -->
    <div v-if="replies && replies.length > 0" class="nested-comments">
      <CommentItem
        v-for="reply in replies"
        :key="reply.id"
        :comment="reply"
        :author="getReplyAuthor(reply.userId)"
        :current-user-id="currentUserId"
        :all-comments="allComments"
        :all-users="allUsers"
        is-nested
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {RouterLink} from 'vue-router'
import {useFormatters} from '@/composables/useFormatters'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  author: {
    type: Object,
    default: null
  },
  currentUserId: {
    type: Number,
    default: null
  },
  isNested: {
    type: Boolean,
    default: false
  },
  allComments: {
    type: Array,
    default: () => []
  },
  allUsers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['reply', 'edit', 'delete'])

const {formatDate} = useFormatters()

const isEditing = ref(false)
const editContent = ref('')

const formattedDate = computed(() => {
  return formatDate(props.comment.createdAt)
})

const canEdit = computed(() => {
  return props.currentUserId && props.comment.userId === props.currentUserId
})

const canDelete = computed(() => {
  return props.currentUserId && props.comment.userId === props.currentUserId
})

const canReply = computed(() => {
  return props.currentUserId && !props.isNested
})

const replies = computed(() => {
  if (!props.allComments || props.allComments.length === 0) return []
  return props.allComments.filter(c => c.parentId === props.comment.id)
})

const getReplyAuthor = (userId) => {
  if (!props.allUsers || props.allUsers.length === 0) return null
  return props.allUsers.find(u => u.id === userId)
}

const startEdit = () => {
  editContent.value = props.comment.content
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

const saveEdit = () => {
  emit('edit', {id: props.comment.id, content: editContent.value})
  isEditing.value = false
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.comment-item.nested-comment {
  margin-left: 0;
  border-bottom: none;
  padding-bottom: 10px;
}

.nested-comments {
  margin-left: 55px;
  margin-top: 10px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  margin-right: 0.5rem;
}

.comment-time {
  color: var(--bs-secondary);
  font-size: 0.875rem;
}

.comment-text {
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
}

.comment-reply-btn {
  color: var(--primary-color);
  text-decoration: none;
}

.comment-reply-btn:hover {
  text-decoration: underline;
}
</style>
