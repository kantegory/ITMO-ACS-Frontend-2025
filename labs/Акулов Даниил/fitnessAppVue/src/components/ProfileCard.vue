<template>
    <div class="card auto-height">
        <div class="card-body text-center">
            <img src="https://ui-avatars.com/api/?name=User&background=0d6efd&color=fff&size=128" class="rounded-circle mb-3" alt="Avatar">
            <h4 class="card-title">{{ user?.name || 'Пользователь' }}</h4>
            <p class="text">{{ user?.email || '' }}</p>
            <p class="text-muted">Начинающий атлет</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProfileCard",

    props: {
        user: {
            name: {
                type: String,
                required: false,
            },
            email: {
                type: String,
                required: false,
            }
        }
    },
};
</script>