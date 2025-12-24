import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
    ...pluginVue.configs['flat/recommended'],
    {
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }],
            'vue/html-indent': ['error', 4],
        },
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.browser
            }
        }
    },
]