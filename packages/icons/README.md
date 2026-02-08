# @x-design/icons

X Design 图标库，参考 Ant Design Icons 的设计模式。

## 特性

- 🎨 SVG 图标，支持自定义大小和颜色
- 🔄 支持旋转和动画效果
- 📦 按需引入，Tree-shakable
- 💪 TypeScript 支持

## 安装

```bash
npm install @x-design/icons
# or
pnpm add @x-design/icons
```

## 使用

```vue
<template>
  <IconClose :size="24" color="red" />
  <IconCheck :size="20" color="green" />
  <IconArrowLeft :rotate="90" />
  <IconArrowRight :spin="true" />
</template>

<script setup>
import { IconClose, IconCheck, IconArrowLeft, IconArrowRight } from '@x-design/icons';
</script>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 图标大小 | string \| number | '1em' |
| color | 图标颜色 | string | 'currentColor' |
| rotate | 旋转角度 | number | - |
| spin | 是否旋转动画 | boolean | false |

## 图标生成

实际项目中，可通过脚本批量生成图标组件：

1. 准备 SVG 文件放入 `svg/` 目录
2. 运行生成脚本自动创建 Vue 组件
3. 更新 `index.ts` 导出列表

类似 `@ant-design/icons` 的工作流程。
