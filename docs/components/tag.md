# Tag 标签

用于标记和选择。

<script setup>
import { ref } from 'vue';
import { XTag } from '@x-design/components';

const tags = ref(['标签一', '标签二', '标签三']);

function handleClose(tag) {
  tags.value = tags.value.filter(t => t !== tag);
}
</script>

## 基础用法

由 `type` 属性来选择 Tag 的类型。

<div class="demo-block">
  <XTag>默认</XTag>
  <XTag type="success">成功</XTag>
  <XTag type="info">信息</XTag>
  <XTag type="warning">警告</XTag>
  <XTag type="danger">危险</XTag>
</div>

```vue
<template>
  <XTag>默认</XTag>
  <XTag type="success">成功</XTag>
  <XTag type="info">信息</XTag>
  <XTag type="warning">警告</XTag>
  <XTag type="danger">危险</XTag>
</template>
```

## 可移除标签

设置 `closable` 属性可以定义一个标签是否可移除。

<div class="demo-block">
  <XTag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
    {{ tag }}
  </XTag>
</div>

```vue
<script setup>
import { ref } from 'vue';

const tags = ref(['标签一', '标签二', '标签三']);

function handleClose(tag) {
  tags.value = tags.value.filter(t => t !== tag);
}
</script>

<template>
  <XTag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
    {{ tag }}
  </XTag>
</template>
```

## 不同尺寸

提供三种尺寸的标签。

<div class="demo-block">
  <XTag size="small">小型</XTag>
  <XTag size="medium">中等</XTag>
  <XTag size="large">大型</XTag>
</div>

```vue
<XTag size="small">小型</XTag>
<XTag size="medium">中等</XTag>
<XTag size="large">大型</XTag>
```

## 主题

Tag 组件提供了三种不同的主题：`dark`、`light` 和 `plain`。

<div class="demo-block">
  <div style="margin-bottom: 12px;">
    <span style="margin-right: 8px; font-size: 14px; color: var(--x-color-text-secondary);">Dark：</span>
    <XTag effect="dark">默认</XTag>
    <XTag type="success" effect="dark">成功</XTag>
    <XTag type="info" effect="dark">信息</XTag>
    <XTag type="warning" effect="dark">警告</XTag>
    <XTag type="danger" effect="dark">危险</XTag>
  </div>
  <div style="margin-bottom: 12px;">
    <span style="margin-right: 8px; font-size: 14px; color: var(--x-color-text-secondary);">Light：</span>
    <XTag effect="light">默认</XTag>
    <XTag type="success" effect="light">成功</XTag>
    <XTag type="info" effect="light">信息</XTag>
    <XTag type="warning" effect="light">警告</XTag>
    <XTag type="danger" effect="light">危险</XTag>
  </div>
  <div>
    <span style="margin-right: 8px; font-size: 14px; color: var(--x-color-text-secondary);">Plain：</span>
    <XTag effect="plain">默认</XTag>
    <XTag type="success" effect="plain">成功</XTag>
    <XTag type="info" effect="plain">信息</XTag>
    <XTag type="warning" effect="plain">警告</XTag>
    <XTag type="danger" effect="plain">危险</XTag>
  </div>
</div>

```vue
<XTag effect="dark">默认</XTag>
<XTag type="success" effect="dark">成功</XTag>

<XTag effect="light">默认</XTag>
<XTag type="success" effect="light">成功</XTag>

<XTag effect="plain">默认</XTag>
<XTag type="success" effect="plain">成功</XTag>
```

## 圆形标签

设置 `round` 属性使标签变为圆形。

<div class="demo-block">
  <XTag round>默认</XTag>
  <XTag type="success" round>成功</XTag>
  <XTag type="info" round>信息</XTag>
  <XTag type="warning" round>警告</XTag>
  <XTag type="danger" round>危险</XTag>
</div>

```vue
<XTag round>默认</XTag>
<XTag type="success" round>成功</XTag>
<XTag type="info" round>信息</XTag>
<XTag type="warning" round>警告</XTag>
<XTag type="danger" round>危险</XTag>
```

## 自定义颜色

通过 `color` 属性自定义标签颜色，会根据 `effect` 自动适配样式。

<div class="demo-block">
  <XTag color="#8e44ad" effect="dark">Dark</XTag>
  <XTag color="#8e44ad" effect="light">Light</XTag>
  <XTag color="#8e44ad" effect="plain">Plain</XTag>
</div>

```vue
<XTag color="#8e44ad" effect="dark">Dark</XTag>
<XTag color="#8e44ad" effect="light">Light</XTag>
<XTag color="#8e44ad" effect="plain">Plain</XTag>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'default' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'default'` |
| closable | 是否可关闭 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| effect | 主题 | `'dark' \| 'light' \| 'plain'` | `'light'` |
| round | 是否圆形 | `boolean` | `false` |
| color | 自定义颜色 | `string` | — |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击标签时触发 | `(event: MouseEvent) => void` |
| close | 关闭标签时触发 | `(event: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 标签内容 |
