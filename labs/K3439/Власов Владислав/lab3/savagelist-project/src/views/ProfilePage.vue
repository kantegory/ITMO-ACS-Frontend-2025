<script setup>
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia'
    import useUserStore from '@/stores/user'
    import useSkillsStore from '@/stores/skills';
    import BaseLayout from '@/layouts/BaseLayout.vue';
    import UserCard from '@/components/UserCard.vue';
    import UserStats from '@/components/UserStats.vue';
    import EditProfileModal from '@/components/EditProfileModal.vue';


    const skillsStore = useSkillsStore();
    const { skillsCount } = storeToRefs(skillsStore)

    const isModalOpen = ref(false);

    const userStore = useUserStore()
    const { name, email } = storeToRefs(userStore)
    
    async function handleUpdateUser(formData) {
        await userStore.updateUser(formData)
    }

</script>
    
<template>
    <BaseLayout>
        <div class="profile-wrapper">
            <UserCard
                @open-edit="isModalOpen = true"
                :user-email="email"
                :user-name="name"
            />
            <UserStats 
                :total-skills="skillsCount"
            />
        </div>
        <EditProfileModal
            :is-open="isModalOpen"
            :user-email="name"
            :user-name="email"
            @close="isModalOpen = false" 
            @save="handleUpdateUser"
        />
    </BaseLayout>
</template>

<style scoped>

    .profile-wrapper {
        display: flex;
        justify-content: space-around; 
        align-items: flex-start;
        padding: 40px 20px;
        gap: 20px;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
    }

</style>