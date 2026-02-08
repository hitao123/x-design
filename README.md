# X Design

<p align="center">
  <img src="https://img.shields.io/badge/vue-3.3+-brightgreen.svg" alt="vue">
  <img src="https://img.shields.io/badge/typescript-5.3+-blue.svg" alt="typescript">
  <img src="https://img.shields.io/npm/v/@x-design/components.svg" alt="npm">
  <img src="https://img.shields.io/github/license/your-org/x-design.svg" alt="license">
</p>

> 企业级 Vue 3 组件库，专为 PC 端打造

[English](./README.md) | 简体中文

## ✨ 特性

- 🎨 **精美设计** - 遵循现代设计规范，提供美观且一致的用户体验
- 🔧 **开箱即用** - 高质量的 Vue 3 组件，满足企业级应用需求
- 🎯 **TypeScript** - 完整的 TypeScript 类型定义
- 🎨 **主题定制** - 基于 SCSS 的主题系统，轻松定制品牌风格
- 📦 **按需引入** - 支持 Tree Shaking，减少包体积
- 🌍 **国际化** - 内置多语言支持

## 📦 安装

```bash
# pnpm (推荐)
pnpm add @x-design/components

# npm
npm install @x-design/components

# yarn
yarn add @x-design/components
```

## 🔨 使用

### 完整引入

```typescript
import { createApp } from 'vue';
import XDesign from '@x-design/components';
import '@x-design/components/dist/style.css';
import App from './App.vue';

const app = createApp(App);
app.use(XDesign);
app.mount('#app');
```

### 按需引入

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

## 📖 文档

完整文档请访问：[https://x-design.example.com](https://x-design.example.com)

本地预览文档：

```bash
pnpm install
pnpm dev
```

## 🛠️ 技术栈

- **框架**：Vue 3 (Composition API)
- **语言**：TypeScript
- **构建**：Vite
- **样式**：SCSS
- **测试**：Vitest
- **文档**：VitePress
- **包管理**：pnpm (Monorepo)

## 📦 包结构

```
x-design/
├── packages/
│   ├── components/      # 组件库主包
│   ├── icons/          # 图标库（独立包）
│   ├── theme/          # SCSS 主题系统
│   └── utils/          # 工具函数库
├── docs/               # VitePress 文档
└── ...
```

## 🤝 贡献

欢迎贡献代码！请阅读 [贡献指南](./CONTRIBUTING.md)。

```bash
# 克隆项目
git clone https://github.com/your-org/x-design.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

## 📄 开源协议

[MIT](./LICENSE)

Copyright © 2024-present X Design Team
