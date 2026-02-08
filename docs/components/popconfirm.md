# Popconfirm 气泡确认框

点击元素，弹出气泡确认框。

## 基础用法

Popconfirm 的基本用法。

<script setup>
import { XPopconfirm, XButton } from '@x-design/components';

const handleConfirm = () => {
  console.log('confirmed');
};

const handleCancel = () => {
  console.log('canceled');
};
</script>

<div class="demo-block">
  <XPopconfirm
    title="确定要删除吗？"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <XButton type="danger">删除</XButton>
  </XPopconfirm>
</div>

```vue
<template>
  <XPopconfirm
    title="确定要删除吗？"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <XButton type="danger">删除</XButton>
  </XPopconfirm>
</template>

<script setup>
import { XPopconfirm, XButton } from '@x-design/components';

const handleConfirm = () => {
  console.log('confirmed');
};

const handleCancel = () => {
  console.log('canceled');
};
</script>
```

## 自定义按钮文字

通过 `confirm-button-text` 和 `cancel-button-text` 自定义按钮文字。

<div class="demo-block">
  <XPopconfirm
    title="确定要提交吗？"
    confirm-button-text="提交"
    cancel-button-text="放弃"
    @confirm="handleConfirm"
  >
    <XButton type="primary">提交</XButton>
  </XPopconfirm>
</div>

```vue
<XPopconfirm
  title="确定要提交吗？"
  confirm-button-text="提交"
  cancel-button-text="放弃"
  @confirm="handleConfirm"
>
  <XButton type="primary">提交</XButton>
</XPopconfirm>
```

## 自定义按钮类型

通过 `confirm-button-type` 和 `cancel-button-type` 自定义按钮类型。

<div class="demo-block">
  <XPopconfirm
    title="确定要执行此操作吗？"
    confirm-button-type="success"
    cancel-button-type="info"
    @confirm="handleConfirm"
  >
    <XButton>执行操作</XButton>
  </XPopconfirm>
</div>

```vue
<XPopconfirm
  title="确定要执行此操作吗？"
  confirm-button-type="success"
  cancel-button-type="info"
  @confirm="handleConfirm"
>
  <XButton>执行操作</XButton>
</XPopconfirm>
```

## 隐藏图标

设置 `hide-icon` 可以隐藏提示图标。

<div class="demo-block">
  <XPopconfirm
    title="确定要继续吗？"
    hide-icon
    @confirm="handleConfirm"
  >
    <XButton>继续</XButton>
  </XPopconfirm>
</div>

```vue
<XPopconfirm
  title="确定要继续吗？"
  hide-icon
  @confirm="handleConfirm"
>
  <XButton>继续</XButton>
</XPopconfirm>
```

## 不同方向

通过 `placement` 属性设置弹出位置。

<div class="demo-block">
  <div style="display: flex; gap: 10px;">
    <XPopconfirm title="确定删除吗？" placement="top" @confirm="handleConfirm">
      <XButton>Top</XButton>
    </XPopconfirm>
    <XPopconfirm title="确定删除吗？" placement="bottom" @confirm="handleConfirm">
      <XButton>Bottom</XButton>
    </XPopconfirm>
    <XPopconfirm title="确定删除吗？" placement="left" @confirm="handleConfirm">
      <XButton>Left</XButton>
    </XPopconfirm>
    <XPopconfirm title="确定删除吗？" placement="right" @confirm="handleConfirm">
      <XButton>Right</XButton>
    </XPopconfirm>
  </div>
</div>

```vue
<XPopconfirm title="确定删除吗？" placement="top" @confirm="handleConfirm">
  <XButton>Top</XButton>
</XPopconfirm>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 确认框标题 | `string` | `''` |
| confirm-button-text | 确认按钮文字 | `string` | `'确定'` |
| cancel-button-text | 取消按钮文字 | `string` | `'取消'` |
| confirm-button-type | 确认按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| cancel-button-type | 取消按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| icon-color | 图标颜色 | `string` | `'#f90'` |
| hide-icon | 是否隐藏图标 | `boolean` | `false` |
| placement | 出现位置 | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| disabled | 是否禁用 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| confirm | 点击确认按钮时触发 | `() => void` |
| cancel | 点击取消按钮时触发 | `() => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 触发 Popconfirm 的元素 |
| title | 自定义标题内容 |
