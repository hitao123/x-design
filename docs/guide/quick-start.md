# 快速开始

本节介绍如何在项目中安装和使用 X Design。

## 安装

::: code-group

```bash [pnpm]
pnpm add @x-design/components
```

```bash [npm]
npm install @x-design/components
```

```bash [yarn]
yarn add @x-design/components
```

:::

## 完整引入

在 `main.ts` 中引入所有组件：

```typescript
import { createApp } from 'vue';
import XDesign from '@x-design/components';
import '@x-design/components/dist/style.css';
import App from './App.vue';

const app = createApp(App);
app.use(XDesign);
app.mount('#app');
```

## 按需引入

为了减少包体积，推荐按需引入组件：

```vue
<template>
  <XButton type="primary">主要按钮</XButton>
  <XInput v-model="value" placeholder="请输入" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { XButton, XInput } from '@x-design/components';
import '@x-design/theme/index.scss';

const value = ref('');
</script>
```

## 使用图标

图标库作为独立包发布，需单独安装：

::: code-group

```bash [pnpm]
pnpm add @x-design/icons
```

```bash [npm]
npm install @x-design/icons
```

:::

使用示例：

```vue
<template>
  <IconClose :size="24" color="red" />
  <IconCheck :size="20" color="green" />
</template>

<script setup lang="ts">
import { IconClose, IconCheck } from '@x-design/icons';
</script>
```

## 开始使用

恭喜你！🎉 现在可以开始使用 X Design 开发项目了。

建议查看：
- [Button 按钮](/components/button)
- [Input 输入框](/components/input)
- [Icon 图标](/components/icon)
- [主题定制](/guide/theme)
