<script setup>
import { ref } from 'vue';
import { XButton } from '@x-design/components';
import { IconCheck } from '@x-design/icons';

const btnLoading = ref(false);

const handleLoadingClick = () => {
  btnLoading.value = true;
  setTimeout(() => {
    btnLoading.value = false;
  }, 2000);
};
</script>

# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type` 属性来定义按钮的样式。

<div class="demo-block">
  <div class="button-row">
    <XButton>默认按钮</XButton>
    <XButton type="primary">主要按钮</XButton>
    <XButton type="success">成功按钮</XButton>
    <XButton type="warning">警告按钮</XButton>
    <XButton type="danger">危险按钮</XButton>
    <XButton type="info">信息按钮</XButton>
  </div>
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
  <div class="button-row">
    <XButton size="small">小型按钮</XButton>
    <XButton size="medium">中等按钮</XButton>
    <XButton size="large">大型按钮</XButton>
  </div>
</div>

```vue
<XButton size="small">小型按钮</XButton>
<XButton size="medium">中等按钮</XButton>
<XButton size="large">大型按钮</XButton>
```

## 朴素按钮

使用 `plain` 属性创建朴素按钮。

<div class="demo-block">
  <div class="button-row">
    <XButton type="primary" plain>主要按钮</XButton>
    <XButton type="success" plain>成功按钮</XButton>
    <XButton type="warning" plain>警告按钮</XButton>
    <XButton type="danger" plain>危险按钮</XButton>
  </div>
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
  <div class="button-row">
    <XButton type="primary" round>圆角按钮</XButton>
    <XButton type="primary" circle>圆</XButton>
  </div>
</div>

```vue
<XButton type="primary" round>圆角按钮</XButton>
<XButton type="primary" circle>圆</XButton>
```

## 禁用状态

使用 `disabled` 属性控制按钮禁用状态。

<div class="demo-block">
  <div class="button-row">
    <XButton disabled>默认按钮</XButton>
    <XButton type="primary" disabled>主要按钮</XButton>
    <XButton type="success" disabled>成功按钮</XButton>
  </div>
</div>

```vue
<XButton disabled>默认按钮</XButton>
<XButton type="primary" disabled>主要按钮</XButton>
<XButton type="success" disabled>成功按钮</XButton>
```

## 图标按钮

通过 `icon` 属性传入图标名称，图标将显示在文字左侧。搭配 `circle` 属性可创建纯图标按钮。

<div class="demo-block">
  <div class="button-row">
    <XButton type="primary" icon="check">确认</XButton>
    <XButton type="danger" icon="close">删除</XButton>
    <XButton type="info" icon="info-filled">详情</XButton>
    <XButton type="primary" icon="check" circle />
    <XButton type="danger" icon="close" circle />
  </div>
</div>

```vue
<XButton type="primary" icon="check">确认</XButton>
<XButton type="danger" icon="close">删除</XButton>
<XButton type="info" icon="info-filled">详情</XButton>
<XButton type="primary" icon="check" circle />
<XButton type="danger" icon="close" circle />
```

也可以通过 `icon` 具名插槽传入自定义图标：

<div class="demo-block">
  <div class="button-row">
    <XButton type="primary">
      <template #icon><IconCheck /></template>
      自定义图标
    </XButton>
  </div>
</div>

```vue
<script setup>
import { XButton } from '@x-design/components';
import { IconCheck } from '@x-design/icons';
</script>

<XButton type="primary">
  <template #icon><IconCheck /></template>
  自定义图标
</XButton>
```

## 加载状态

使用 `loading` 属性控制按钮的加载状态。加载中的按钮不可点击。

<div class="demo-block">
  <div class="button-row">
    <XButton type="primary" :loading="true">加载中</XButton>
    <XButton type="primary" :loading="btnLoading" @click="handleLoadingClick">点击加载</XButton>
  </div>
</div>

```vue
<script setup>
import { ref } from 'vue';
import { XButton } from '@x-design/components';

const loading = ref(false);

const handleLoadingClick = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<XButton type="primary" loading>加载中</XButton>
<XButton type="primary" :loading="loading" @click="handleLoadingClick">
  点击加载
</XButton>
```

## API

### Props

| 参数         | 说明               | 类型                                                                     | 默认值      |
| ------------ | ------------------ | ------------------------------------------------------------------------ | ----------- |
| type         | 按钮类型           | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size         | 按钮尺寸           | `'small' \| 'medium' \| 'large'`                                         | `'medium'`  |
| plain        | 是否朴素按钮       | `boolean`                                                                | `false`     |
| round        | 是否圆角按钮       | `boolean`                                                                | `false`     |
| circle       | 是否圆形按钮       | `boolean`                                                                | `false`     |
| disabled     | 是否禁用           | `boolean`                                                                | `false`     |
| loading      | 是否加载状态       | `boolean`                                                                | `false`     |
| icon         | 图标名称           | `string`                                                                 | —           |
| loading-icon | 自定义加载图标名称 | `string`                                                                 | —           |
| native-type  | 原生 type 属性     | `'button' \| 'submit' \| 'reset'`                                        | `'button'`  |

### Events

| 事件名 | 说明     | 类型                          |
| ------ | -------- | ----------------------------- |
| click  | 点击事件 | `(event: MouseEvent) => void` |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 按钮内容       |
| icon    | 自定义图标内容 |
