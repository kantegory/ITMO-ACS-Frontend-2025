<script setup>
  import { onMounted, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import SkillItem from '@/components/SkillItem.vue';
  import SkillDetail from '@/components/SkillDetail.vue';
  import CreateSkillForm from '@/components/CreateSkillForm.vue';
  import useSkillsStore from '@/stores/skills';
  import useUserStore from '@/stores/user';

  const userStore = useUserStore()
  const { token } = storeToRefs(userStore)

  const skillsStore = useSkillsStore();

  const selectedSkill = ref(null);
  const isCreating = ref(false);

  const selectSkill = (skill) => {
    skill['description'] = "Описание из БД"
    selectedSkill.value = skill;
    isCreating.value = false;
  };

  const startCreating = () => {
    selectedSkill.value = null;
    isCreating.value = true;
  };

  const cancelCreating = () => {
    isCreating.value = false;
  };

  async function handleCreateSkill(newSkill) {
    await skillsStore.createSkill(newSkill, token.value)
    isCreating.value = false;
  };

  onMounted(async () => {
    await skillsStore.getSkills(token.value);
  });
</script>

<template>
  <BaseLayout>
    <div class="skills-page">
      <div :class="['skills-layout', { 'is-split': selectedSkill || isCreating }]">
        
        <div class="skills-list-container">
          <div class="list-header">
            <h1>Навыки</h1>
          </div>
          
          <div class="list-items">
            <SkillItem 
              v-for="skill in skillsStore.skills" 
              :key="skill.id"
              :name="skill.name"
              @select="selectSkill(skill)"
            />
          </div>

          <button class="add-skill-btn" @click="startCreating">
            <span class="plus-icon">+</span>
            Создать новый навык
          </button>
        </div>

        <div class="skills-detail-container">
          
          <SkillDetail 
            v-if="selectedSkill" 
            :title="selectedSkill.name"
            :description="selectedSkill.description" 
            @hide="selectedSkill = null"
          />

          <CreateSkillForm 
            v-else-if="isCreating"
            @cancel="cancelCreating"
            @create="handleCreateSkill"
          />
          
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
    .skills-page {
      max-width: 1200px;
      margin: 0 auto;
    }
    .skills-layout {
      display: flex;
      gap: 40px; 
      min-height: 400px;
      transition: all 0.3s ease;
    }
    .skills-list-container {
      flex: 1; 
      display: flex;
      flex-direction: column;
    }
    .skills-detail-container { 
      flex: 0;
      width: 0;
      opacity: 0;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .skills-layout.is-split .skills-detail-container {
        flex: 1;
        width: auto;
        opacity: 1;
    }

    .add-skill-btn {
        margin-top: 20px;
        background: transparent;
        border: 2px dashed #d4c183;
        color: #666;
        padding: 15px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .add-skill-btn:hover {
        background: rgba(212, 193, 131, 0.05);
        border-style: solid;
    }
</style>