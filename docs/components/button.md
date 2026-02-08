# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type` 属性来定义按钮的样式。

<script setup>
import { XButton } from '@x-design/components';
</script>

<div class="demo-block">
  <XButton>默认按钮</XButton>
  <XButton type="primary">主要按钮</XButton>
  <XButton type="success">成功按钮</XButton>
  <XButton type="warning">警告按钮</XButton>
  <XButton type="danger">危险按钮</XButton>
  <XButton type="info">信息按钮</XButton>
</div>

```vue
<XButton>默认按钮</XButton>
<XButton type="primary">主要按钮</XButton>
<XButton type="success">成功按钮</XButton>
<XButton type="warning">警告按钮</XButton>
<XButton type="danger">危险按钮</XButton>
<XButton type="info">信息按钮</XButton>
```

## 不同尺寸

提供三种尺寸的按钮。

<div class="demo-block">
  <XButton size="small">小型按钮</XButton>
  <XButton size="medium">中等按钮</XButton>
  <XButton size="large">大型按钮</XButton>
</div>

```vue
<XButton size="small">小型按钮</XButton>
<XButton size="medium">中等按钮</XButton>
<XButton size="large">大型按钮</XButton>
```

## 朴素按钮

使用 `plain` 属性创建朴素按钮。

<div class="demo-block">
  <XButton type="primary" plain>主要按钮</XButton>
  <XButton type="success" plain>成功按钮</XButton>
  <XButton type="warning" plain>警告按钮</XButton>
  <XButton type="danger" plain>危险按钮</XButton>
</div>

```vue
<XButton type="primary" plain>主要按钮</XButton>
<XButton type="success" plain>成功按钮</XButton>
<XButton type="warning" plain>警告按钮</XButton>
<XButton type="danger" plain>危险按钮</XButton>
```

## 圆角按钮

使用 `round` 和 `circle` 属性设置圆角。

<div class="demo-block">
  <XButton type="primary" round>圆角按钮</XButton>
  <XButton type="primary" circle>圆</XButton>
</div>

```vue
<XButton type="primary" round>圆角按钮</XButton>
<XButton type="primary" circle>圆</XButton>
```

## 禁用状态

使用 `disabled` 属性控制按钮禁用状态。

<div class="demo-block">
  <XButton disabled>默认按钮</XButton>
  <XButton type="primary" disabled>主要按钮</XButton>
  <XButton type="success" disabled>成功按钮</XButton>
</div>

```vue
<XButton disabled>默认按钮</XButton>
<XButton type="primary" disabled>主要按钮</XButton>
<XButton type="success" disabled>成功按钮</XButton>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| plain | 是否朴素按钮 | `boolean` | `false` |
| round | 是否圆角按钮 | `boolean` | `false` |
| circle | 是否圆形按钮 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| native-type | 原生 type 属性 | `'button' \| 'submit' \| 'reset'` | `'button'` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击事件 | `(event: MouseEvent) => void` |
