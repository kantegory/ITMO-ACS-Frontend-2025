export default class Author {
  constructor({ id, name, subscribers = [] }) {
    this.id = id
    this.name = name
    this.subscribers = subscribers
  }

  addSubscriber(userId) {
    if (!this.subscribers.includes(userId)) this.subscribers.push(userId)
  }

  removeSubscriber(userId) {
    this.subscribers = this.subscribers.filter(id => id !== userId)
  }

  isSubscribed(userId) {
    return this.subscribers.includes(userId)
  }
}
