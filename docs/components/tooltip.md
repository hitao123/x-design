# Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

## 基础用法

悬停时显示提示信息。

<script setup>
import { ref } from 'vue';
import { XTooltip, XButton } from '@x-design/components';
const tooltipRef = ref(null);
</script>

<div class="demo-block">
  <XTooltip content="这是一段提示文字">
    <XButton>Hover me</XButton>
  </XTooltip>
  <span style="margin-left: 16px;" />
  <XTooltip ref="tooltipRef" content="手动触发测试">
    <XButton>Manual Test</XButton>
  </XTooltip>
  <span style="margin-left: 16px;" />
  <XButton @click="tooltipRef?.show?.()">Show</XButton>
  <XButton @click="tooltipRef?.hide?.()">Hide</XButton>
</div>

```vue
<template>
  <XTooltip content="这是一段提示文字">
    <XButton>Hover me</XButton>
  </XTooltip>
</template>

<script setup>
import { XTooltip, XButton } from '@x-design/components';
</script>
```

## 不同方向

通过 `placement` 属性设置 Tooltip 的显示方向，支持 12 个方向。

<div class="demo-block">
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <XTooltip content="Top Start" placement="top-start">
      <XButton>top-start</XButton>
    </XTooltip>
    <XTooltip content="Top" placement="top">
      <XButton>top</XButton>
    </XTooltip>
    <XTooltip content="Top End" placement="top-end">
      <XButton>top-end</XButton>
    </XTooltip>
    <XTooltip content="Left" placement="left">
      <XButton>left</XButton>
    </XTooltip>
    <XTooltip content="Right" placement="right">
      <XButton>right</XButton>
    </XTooltip>
    <XTooltip content="Bottom Start" placement="bottom-start">
      <XButton>bottom-start</XButton>
    </XTooltip>
    <XTooltip content="Bottom" placement="bottom">
      <XButton>bottom</XButton>
    </XTooltip>
    <XTooltip content="Bottom End" placement="bottom-end">
      <XButton>bottom-end</XButton>
    </XTooltip>
  </div>
</div>

```vue
<XTooltip content="Top" placement="top">
  <XButton>top</XButton>
</XTooltip>
<XTooltip content="Bottom" placement="bottom">
  <XButton>bottom</XButton>
</XTooltip>
<XTooltip content="Left" placement="left">
  <XButton>left</XButton>
</XTooltip>
<XTooltip content="Right" placement="right">
  <XButton>right</XButton>
</XTooltip>
```

## 触发方式

通过 `trigger` 属性设置触发方式，支持 `hover`、`click`、`focus`。

<div class="demo-block">
  <XTooltip content="Hover 触发" trigger="hover">
    <XButton>Hover</XButton>
  </XTooltip>
  <XTooltip content="Click 触发" trigger="click">
    <XButton>Click</XButton>
  </XTooltip>
  <XTooltip content="Focus 触发" trigger="focus">
    <XButton>Focus</XButton>
  </XTooltip>
</div>

```vue
<XTooltip content="Hover 触发" trigger="hover">
  <XButton>Hover</XButton>
</XTooltip>
<XTooltip content="Click 触发" trigger="click">
  <XButton>Click</XButton>
</XTooltip>
<XTooltip content="Focus 触发" trigger="focus">
  <XButton>Focus</XButton>
</XTooltip>
```

## 自定义内容

可以通过 `content` 插槽自定义 Tooltip 内容。

<div class="demo-block">
  <XTooltip>
    <template #content>
      <div>
        <strong>自定义内容</strong>
        <p>可以包含更复杂的结构</p>
      </div>
    </template>
    <XButton>自定义内容</XButton>
  </XTooltip>
</div>

```vue
<XTooltip>
  <template #content>
    <div>
      <strong>自定义内容</strong>
      <p>可以包含更复杂的结构</p>
    </div>
  </template>
  <XButton>自定义内容</XButton>
</XTooltip>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 显示的内容 | `string` | `''` |
| placement | 出现位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| trigger | 触发方式 | `'hover' \| 'click' \| 'focus'` | `'hover'` |
| disabled | 是否禁用 | `boolean` | `false` |
| show-arrow | 是否显示箭头 | `boolean` | `true` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | Tooltip 的触发元素 |
| content | 自定义 Tooltip 内容 |

### Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| show | 显示 Tooltip | `() => void` |
| hide | 隐藏 Tooltip | `() => void` |
