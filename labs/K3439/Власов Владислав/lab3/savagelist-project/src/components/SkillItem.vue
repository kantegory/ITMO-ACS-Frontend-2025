<script setup>
    defineProps({
      name: String
    });
    defineEmits(['select']);
</script>
    
    <template>
      <div class="skill-item" @click="$emit('select')">
        <span class="skill-item__name">{{ name }}</span>
      </div>
    </template>
    
<style scoped>
    .skill-item {
    padding: 20px 15px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;
    }

    .skill-item:hover {
    background-color: rgba(212, 193, 131, 0.1);
    padding-left: 20px;
    }

    .skill-item__name {
    color: #222831;
    font-weight: 500;
    }
</style>