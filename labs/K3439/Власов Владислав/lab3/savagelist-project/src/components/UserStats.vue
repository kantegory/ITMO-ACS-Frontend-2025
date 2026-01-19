<script setup>
    import { ref } from 'vue';
    
    const props = defineProps({
      totalCharacters: { type: Number, default: 0 },
      totalSkills: { type: Number, default: 0 },
      totalEgdes: { type: Number, default: 0 },
      totalItems: { type: Number, default: 0 },
    });

</script>
    
    <template>
      <div class="stats-card">
        <h3 class="stats-title">Создано</h3>
        
        <ul class="stats-list">
          <li class="stats-item">
            <span class="stats-label">Персонажей:</span>
            <span class="stats-value">{{ totalCharacters }}</span>
          </li>
          <li class="stats-item">
            <span class="stats-label">Навыков:</span>
            <span class="stats-value">{{ totalSkills }}</span>
          </li>
          <li class="stats-item">
            <span class="stats-label">Черт:</span>
            <span class="stats-value">{{ totalEgdes }}</span>
          </li>
          <li class="stats-item">
            <span class="stats-label">Предметов:</span>
            <span class="stats-value">{{ totalItems }}</span>
          </li>
        </ul>
      </div>
    </template>
    
    <style scoped>
    .stats-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px 24px;
      width: 100%;
      max-width: 300px;
      height: fit-content;
    }
    
    .stats-title {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #000;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 10px;
    }
    
    .stats-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .stats-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #555;
    }
    
    .stats-value {
      font-weight: 600;
      color: #000;
    }
</style>