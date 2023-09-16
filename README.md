# 联创团队SSO系统-前端

## 🚀技术栈

```
vue3 + typescript + vite + pinia
arcodesign + tailwindcss
```

## ✨features

* 使用`vue-i18n`支持多语言。
* 支持夜间模式。

## 开发指南

### 开发规范

#### 样式规范

* 使用 less （arcodesign官方支持less）。
* 使用 tailwindcss和css类选择器的依据：
  1. 是否设计到组件内的样式修改。
  2. 是否使用tailwindcss达到预期效果的复杂度过高。
  3. 是否是较为庞大的组件，考虑作用域问题。

### 开发技巧

* 在.ts文件中使用vue-i8n
  ```typescript
  import i18n from '@/locale';
  i18n.global.t('');
  ```


