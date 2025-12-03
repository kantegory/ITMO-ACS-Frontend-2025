<template>
  <div class="messages-page">
    <div class="container py-4" style="margin-top: 80px;">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Messages</h1>

          <!-- Empty State -->
          <div v-if="conversations.length === 0" class="text-center py-5">
            <i class="fas fa-envelope fa-4x text-muted mb-4"></i>
            <h3>No messages yet</h3>
            <p class="text-muted">Your conversations with property hosts will appear here.</p>
            <RouterLink to="/search" class="btn btn-primary">
              <i class="fas fa-search me-2"></i>Browse Properties
            </RouterLink>
          </div>

          <!-- Conversations List -->
          <div v-else class="row">
            <div class="col-lg-4">
              <div class="conversations-list">
                <h4 class="mb-3">Conversations</h4>

                <div
                  v-for="conversation in conversations"
                  :key="conversation.id"
                  class="conversation-item"
                  :class="{ active: selectedConversation?.id === conversation.id }"
                  @click="selectConversation(conversation)"
                >
                  <div class="d-flex">
                    <div class="avatar-small">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <div class="d-flex justify-content-between">
                        <h6 class="mb-1">{{ conversation.hostName }}</h6>
                        <small class="text-muted">{{ formatDate(conversation.lastActivity) }}</small>
                      </div>
                      <p class="mb-1 text-muted small">{{ conversation.propertyName }}</p>
                      <small class="text-muted">{{ conversation.lastMessage }}</small>
                    </div>
                    <div v-if="conversation.unread > 0" class="unread-badge">
                      {{ conversation.unread }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-8">
              <div v-if="selectedConversation" class="message-thread">
                <div class="thread-header">
                  <h5>{{ selectedConversation.hostName }}</h5>
                  <p class="text-muted mb-0">{{ selectedConversation.propertyName }}</p>
                </div>

                <div class="messages-container">
                  <div
                    v-for="message in selectedConversation.messages"
                    :key="message.id"
                    class="message"
                    :class="{ 'message-sent': message.isFromGuest, 'message-received': !message.isFromGuest }"
                  >
                    <div class="message-content">
                      <p class="mb-1">{{ message.text }}</p>
                      <small class="text-muted">{{ formatTime(message.timestamp) }}</small>
                    </div>
                  </div>
                </div>

                <div class="message-input">
                  <form @submit.prevent="sendMessage">
                    <div class="input-group">
                      <input
                        v-model="newMessage"
                        type="text"
                        class="form-control"
                        placeholder="Type your message..."
                        required
                      >
                      <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div v-else class="text-center py-5">
                <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                <h4>Select a conversation</h4>
                <p class="text-muted">Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Message {
  id: number
  text: string
  isFromGuest: boolean
  timestamp: string
}

interface Conversation {
  id: number
  hostName: string
  propertyName: string
  lastMessage: string
  lastActivity: string
  unread: number
  messages: Message[]
}

const conversations = ref<Conversation[]>([])
const selectedConversation = ref<Conversation | null>(null)
const newMessage = ref('')

onMounted(() => {
  // Mock data - in a real app this would come from an API
  conversations.value = [
    {
      id: 1,
      hostName: 'Anna Kovač',
      propertyName: 'Cozy Belgrade Apartment',
      lastMessage: 'Welcome! Looking forward to your stay.',
      lastActivity: '2024-12-03T10:30:00Z',
      unread: 1,
      messages: [
        {
          id: 1,
          text: 'Hi! I\'m interested in booking your apartment for next weekend.',
          isFromGuest: true,
          timestamp: '2024-12-03T09:00:00Z'
        },
        {
          id: 2,
          text: 'Hello! Thank you for your interest. The apartment is available for those dates.',
          isFromGuest: false,
          timestamp: '2024-12-03T09:15:00Z'
        },
        {
          id: 3,
          text: 'Great! I\'ve made the booking. Could you please share check-in details?',
          isFromGuest: true,
          timestamp: '2024-12-03T09:30:00Z'
        },
        {
          id: 4,
          text: 'Welcome! Looking forward to your stay.',
          isFromGuest: false,
          timestamp: '2024-12-03T10:30:00Z'
        }
      ]
    }
  ]
})

const selectConversation = (conversation: Conversation) => {
  selectedConversation.value = conversation
  conversation.unread = 0
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  const message: Message = {
    id: Date.now(),
    text: newMessage.value,
    isFromGuest: true,
    timestamp: new Date().toISOString()
  }

  selectedConversation.value.messages.push(message)
  selectedConversation.value.lastMessage = newMessage.value
  selectedConversation.value.lastActivity = new Date().toISOString()

  newMessage.value = ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.conversations-list {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  max-height: 70vh;
  overflow-y: auto;
}

.conversation-item {
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f9fa;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e3f2fd;
}

.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.unread-badge {
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.message-thread {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.thread-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.messages-container {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.message {
  margin-bottom: 1rem;
  display: flex;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
}

.message-sent .message-content {
  background-color: #007bff;
  color: white;
}

.message-received .message-content {
  background-color: #f8f9fa;
  color: #333;
}

.message-input {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}
</style>