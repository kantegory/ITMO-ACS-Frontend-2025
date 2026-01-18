<template>
    <li class="list-group-item d-flex justify-content-between align-items-start mb-2">
        <div class="me-3">
            <div class="fw-bold">{{ otherName }}</div>
            <div class="small text-muted mb-1">{{ propertyTitle }}</div>
            <div>{{ lastText }}</div>
        </div>
        <small class="text-muted">{{ dateText }}</small>
    </li>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    chat: { type: Object, required: true },
    myId: { type: Number, required: true }
});

const otherName = computed(() => {
    const u1 = props.chat.user1;
    const u2 = props.chat.user2;
    const other = (u1?.user_id === props.myId)
        ? u2
        : (u2?.user_id === props.myId ? u1 : (u1 || u2));
    return other?.name || "Собеседник";
});

const propertyTitle = computed(() => {
    return props.chat.property?.title || `Объект #${props.chat.property_id ?? "—"}`;
});

const lastText = computed(() => props.chat.lastMessage?.text || "(сообщений пока нет)");

const dateText = computed(() => {
    const d = props.chat.lastMessage?.sent_at;
    return d ? new Date(d).toLocaleDateString("ru-RU") : "";
});
</script>