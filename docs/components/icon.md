# Icon 图标

X Design 提供了一套常用的图标集合。

## 安装

图标库作为独立包发布：

::: code-group

```bash [pnpm]
pnpm add @x-design/icons
```

```bash [npm]
npm install @x-design/icons
```

:::

## 基础用法

<script setup>
import { IconClose, IconCheck, IconArrowLeft, IconArrowRight } from '@x-design/icons';
</script>

<div class="demo-block">
  <IconClose />
  <IconCheck />
  <IconArrowLeft />
  <IconArrowRight />
</div>

```vue
<template>
  <IconClose />
  <IconCheck />
  <IconArrowLeft />
  <IconArrowRight />
</template>

<script setup>
import { IconClose, IconCheck, IconArrowLeft, IconArrowRight } from '@x-design/icons';
</script>
```

## 自定义大小

<div class="demo-block">
  <IconClose :size="16" />
  <IconClose :size="24" />
  <IconClose :size="32" />
  <IconClose size="3em" />
</div>

```vue
<IconClose :size="16" />
<IconClose :size="24" />
<IconClose :size="32" />
<IconClose size="3em" />
```

## 自定义颜色

<div class="demo-block">
  <IconCheck color="#409eff" :size="24" />
  <IconCheck color="#67c23a" :size="24" />
  <IconCheck color="#e6a23c" :size="24" />
  <IconCheck color="#f56c6c" :size="24" />
</div>

```vue
<IconCheck color="#409eff" :size="24" />
<IconCheck color="#67c23a" :size="24" />
<IconCheck color="#e6a23c" :size="24" />
<IconCheck color="#f56c6c" :size="24" />
```

## 旋转

<div class="demo-block">
  <IconArrowRight :rotate="0" :size="24" />
  <IconArrowRight :rotate="90" :size="24" />
  <IconArrowRight :rotate="180" :size="24" />
  <IconArrowRight :rotate="270" :size="24" />
</div>

```vue
<IconArrowRight :rotate="0" :size="24" />
<IconArrowRight :rotate="90" :size="24" />
<IconArrowRight :rotate="180" :size="24" />
<IconArrowRight :rotate="270" :size="24" />
```

## 旋转动画

<div class="demo-block">
  <IconArrowRight :spin="true" :size="24" />
</div>

```vue
<IconArrowRight :spin="true" :size="24" />
```

## 图标列表

目前提供以下图标（更多图标持续添加中）：

<div class="demo-block" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
  <div style="text-align: center;">
    <IconClose :size="24" />
    <div style="margin-top: 8px; font-size: 12px;">IconClose</div>
  </div>
  <div style="text-align: center;">
    <IconCheck :size="24" />
    <div style="margin-top: 8px; font-size: 12px;">IconCheck</div>
  </div>
  <div style="text-align: center;">
    <IconArrowLeft :size="24" />
    <div style="margin-top: 8px; font-size: 12px;">IconArrowLeft</div>
  </div>
  <div style="text-align: center;">
    <IconArrowRight :size="24" />
    <div style="margin-top: 8px; font-size: 12px;">IconArrowRight</div>
  </div>
</div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 图标大小 | `string \| number` | `'1em'` |
| color | 图标颜色 | `string` | `'currentColor'` |
| rotate | 旋转角度 | `number` | - |
| spin | 是否旋转动画 | `boolean` | `false` |

## 扩展图标

X Design Icons 参考了 Ant Design Icons 的设计模式，支持自定义扩展：

1. 准备 SVG 文件
2. 使用脚本批量生成 Vue 组件
3. 按需引入使用

详见 [@x-design/icons](https://github.com/your-org/x-design/tree/main/packages/icons) 文档。
