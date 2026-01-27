<template>
  <div class="resume card shadow-sm">
    <div class="card-body">
      <div class="d-flex align-items-center gap-3">
        <div class="avatar">{{ initials }}</div>
        <div class="min-w-0">
          <p class="text-muted mb-1">Моё резюме</p>
          <h4 class="resume__title">{{ title }}</h4>
          <p class="resume__meta">{{ meta }}</p>
        </div>
      </div>
    </div>
    <div class="resume__skills mt-3">
      <span v-for="(skill, idx) in skills" :key="skill" :class="skillClass(idx)">
        {{ skill }}
      </span>
      <span v-if="!skills.length" class="pill pill--muted">Навыки не указаны</span>
    </div>
    <p class="resume__text">
      {{ aboutText }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ResumeCard',
  props: {
    profile: {
      type: Object,
      default: null,
    },
  },
  computed: {
    title() {
      return this.profile?.position || this.profile?.fullName || 'Моё резюме'
    },
    meta() {
      return this.profile?.skills || 'Навыки не указаны'
    },
    aboutText() {
      return this.profile?.about || 'Добавьте описание в профиле'
    },
    initials() {
      const source = this.profile?.fullName || 'Моё резюме'
      return source
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    },
    skills() {
      return (this.profile?.skills || '')
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter(Boolean)
    },
  },
  methods: {
    skillClass(index) {
      if (index === 0) return 'pill pill--accent'
      return 'pill pill--muted'
    },
  },
}
</script>
