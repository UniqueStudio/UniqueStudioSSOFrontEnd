// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'browser': true,
    'node': true,
    'vue/setup-compiler-macros': true,
  },
  // 要主动启用
  // plugins": ["@typescript-eslint"] 中包含的检查项 要多于 extends": ["plugin:@typescript-eslint/recommended"]
  plugins: ['@typescript-eslint'],
  // 需要覆盖
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 1,
    'no-console': 1,
    // vue的一些覆盖配置
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-useless-template-attributes': 0,
    // vue的一些额外配置
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    // ts的一些覆盖配置
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    // 避免enum的循环引用
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 2,
    // 临时解决 defindModel问题
    'no-undef': 0,
    // import的一些配置
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': 0,
    // airbnb-base中的一些配置
    // 生产环境需要启用
    'no-debugger': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 'off',
    'prefer-regex-literals': 0,
    'camelcase': 0,
  },
  // 用来解析@
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
  },
};
