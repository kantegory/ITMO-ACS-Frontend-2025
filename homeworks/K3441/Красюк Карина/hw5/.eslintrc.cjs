/* eslint-env node */
require('@eslint/js')
const vue = require('eslint-plugin-vue')
module.exports = {
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: {
    vue
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}

