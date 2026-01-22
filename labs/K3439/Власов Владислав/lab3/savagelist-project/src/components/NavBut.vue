<script setup>
     
    const props = defineProps({
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ''
        },
        to: {
            type: [String, Object],
            default: '#'
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        isAction: {
            type: Boolean,
            default: false
        }
    });
    
    const buttonClasses = {
        'nav-btn': true,
        'nav-btn--disabled': props.isDisabled,
        'nav-btn--action': props.isAction
    };
</script>
    
<template>
    <component
        :is="isDisabled ? 'span' : 'RouterLink'"
        :to="to"
        :class="buttonClasses"
    >
        <span class="nav-btn__label">{{ label }}</span>
    </component>
</template>
    
<style scoped>

  .nav-btn {
    text-decoration: none;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
  }

  .nav-btn:hover {
    color: #dccc94;
    background: rgba(255, 255, 255, 0.05);
  }


  .nav-btn--action {
    color: #dccc94; 
    border: 1px solid #dccc94;
  }

  .nav-btn--action:hover {
    background: #dccc94;
    color: #1e2329;
  }


  .nav-btn--disabled {
    color: #5f6368;
    cursor: not-allowed;
    pointer-events: none;
  }

 
  .nav-btn__label {
    display: inline-block;
  }

  .router-link-active.nav-btn {
    border-bottom: 2px solid #dccc94;
    border-radius: 0;
  }
</style>