<template>
  <main class="container py-4" role="main">
    <section class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3" aria-labelledby="messagesHeading">
      <div>
        <h1 id="messagesHeading" class="h3 mb-1">Сообщения и платежи</h1>
        <p class="text-muted mb-0">Следите за диалогами с владельцами и историей транзакций.</p>
      </div>
      <div class="mt-3 mt-md-0">
        <RouterLink to="/dashboard" class="btn btn-outline-secondary">К объявлениям</RouterLink>
      </div>
    </section>

    <div class="row" aria-live="polite">
      <section class="col-md-6" aria-labelledby="conversationsHeading">
        <h2 id="conversationsHeading" class="h5">Диалоги</h2>
        <div role="list">
          <div 
            v-for="conv in conversations" 
            :key="conv.id"
            class="list-item"
            role="listitem"
          >
            <div class="flex-fill">
              <div class="d-flex justify-content-between">
                <div>
                  <strong>{{ conv.with }}</strong>
                  <div class="text-muted small">{{ getPropertyTitle(conv.propertyId) }}</div>
                </div>
                <div class="text-muted small">{{ conv.date }}</div>
              </div>
              <div class="mt-2 text-muted small">{{ conv.lastMessage || '' }}</div>
            </div>
          </div>
          <div v-if="conversations.length === 0" class="text-muted">Нет сообщений.</div>
        </div>
      </section>
      <section class="col-md-6" aria-labelledby="transactionsHeading">
        <h2 id="transactionsHeading" class="h5">История транзакций</h2>
        <div role="list">
          <div 
            v-for="tx in transactions" 
            :key="tx.id"
            class="list-item"
            role="listitem"
          >
            <div class="flex-fill d-flex justify-content-between">
              <div>
                <strong>{{ getPropertyTitle(tx.propertyId) }}</strong>
                <div class="text-muted small">{{ tx.date }}</div>
              </div>
              <div class="text-end">
                <div class="fw-semibold">₽{{ tx.amount }}</div>
                <small class="text-muted">{{ tx.status || '' }}</small>
              </div>
            </div>
          </div>
          <div v-if="transactions.length === 0" class="text-muted">Транзакции отсутствуют.</div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataService } from '@/composables/useDataService'

const router = useRouter()
const { currentUser } = useAuth()
const { fetchAdvertisement, fetchConversations, fetchTransactions, normalizeId } = useDataService()

const conversations = ref([])
const transactions = ref([])
const properties = ref([])

function getPropertyTitle(propertyId) {
  const prop = properties.value.find(p => normalizeId(p.id) === normalizeId(propertyId))
  return prop ? prop.title : 'Объявление удалено'
}

onMounted(async () => {
  const user = currentUser.value
  if (!user) {
    router.push('/login')
    return
  }
  
  const [convs, txs, props] = await Promise.all([
    fetchConversations(user.id),
    fetchTransactions(user.id),
    fetchAdvertisement()
  ])
  
  conversations.value = convs
  transactions.value = txs
  properties.value = Array.isArray(props) ? props : []
})
</script>

