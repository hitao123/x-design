# Switch 开关

表示两种相互对立的状态间的切换，多用于触发「开/关」。

<script setup>
import { ref } from 'vue';
import { XSwitch } from '@x-design/components';

const value1 = ref(true);
const value2 = ref(false);
const value3 = ref(true);
const value4 = ref(false);
const value5 = ref(true);
const value6 = ref(true);
const loading1 = ref(true);
const loading2 = ref(false);
</script>

## 基础用法

绑定 `v-model` 到一个 `boolean` 类型的变量。

<div class="demo-block">
  <XSwitch v-model="value1" />
</div>

```vue
<script setup>
import { ref } from 'vue';

const value = ref(true);
</script>

<template>
  <XSwitch v-model="value" />
</template>
```

## 禁用状态

设置 `disabled` 属性禁用开关。

<div class="demo-block">
  <XSwitch v-model="value2" disabled />
  <XSwitch v-model="value3" disabled />
</div>

```vue
<XSwitch v-model="value1" disabled />
<XSwitch v-model="value2" disabled />
```

## 不同尺寸

提供三种尺寸的开关。

<div class="demo-block">
  <div style="display: flex; align-items: center; gap: 16px;">
    <XSwitch v-model="value1" size="small" />
    <XSwitch v-model="value1" size="medium" />
    <XSwitch v-model="value1" size="large" />
  </div>
</div>

```vue
<XSwitch v-model="value" size="small" />
<XSwitch v-model="value" size="medium" />
<XSwitch v-model="value" size="large" />
```

## 文字描述

使用 `active-text` 和 `inactive-text` 属性设置开关的文字描述。

<div class="demo-block">
  <XSwitch v-model="value4" active-text="开启" inactive-text="关闭" />
</div>

```vue
<XSwitch v-model="value" active-text="开启" inactive-text="关闭" />
```

## 自定义颜色

使用 `active-color` 和 `inactive-color` 属性自定义开关颜色。

<div class="demo-block">
  <XSwitch v-model="value5" active-color="#13ce66" inactive-color="#ff4949" />
</div>

```vue
<XSwitch v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
```

## 加载状态

设置 `loading` 属性可以让开关处于加载状态，加载中时不可切换。

<div class="demo-block">
  <XSwitch v-model="loading1" loading />
  <XSwitch v-model="loading2" loading />
</div>

```vue
<XSwitch v-model="value1" loading />
<XSwitch v-model="value2" loading />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| active-color | 激活时的颜色 | `string` | — |
| inactive-color | 未激活时的颜色 | `string` | — |
| active-text | 激活时的文字 | `string` | — |
| inactive-text | 未激活时的文字 | `string` | — |
| name | 原生 name 属性 | `string` | — |
| loading | 是否加载中 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| change | 状态变化时触发 | `(value: boolean) => void` |
