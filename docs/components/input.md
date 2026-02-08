# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
</script>

<div class="demo-block">
  <XInput v-model="input1" placeholder="请输入内容" />
  <div style="margin-top: 12px">输入值: {{ input1 }}</div>
</div>

```vue
<template>
  <XInput v-model="input" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue';
import { XInput } from '@x-design/components';

const input = ref('');
</script>
```

## 不同尺寸

<div class="demo-block">
  <XInput v-model="input1" size="small" placeholder="小尺寸" />
  <div style="margin-top: 12px">
    <XInput v-model="input2" size="medium" placeholder="中等尺寸" />
  </div>
  <div style="margin-top: 12px">
    <XInput v-model="input3" size="large" placeholder="大尺寸" />
  </div>
</div>

```vue
<XInput v-model="input1" size="small" placeholder="小尺寸" />
<XInput v-model="input2" size="medium" placeholder="中等尺寸" />
<XInput v-model="input3" size="large" placeholder="大尺寸" />
```

## 禁用状态

<div class="demo-block">
  <XInput v-model="input1" disabled placeholder="禁用状态" />
</div>

```vue
<XInput v-model="input" disabled placeholder="禁用状态" />
```

## 只读状态

<div class="demo-block">
  <XInput v-model="input1" readonly placeholder="只读状态" />
</div>

```vue
<XInput v-model="input" readonly placeholder="只读状态" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 绑定值 | `string` | `''` |
| type | 类型 | `string` | `'text'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| placeholder | 占位文本 | `string` | `''` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| maxlength | 最大输入长度 | `number` | - |
| clearable | 是否可清空 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| input | 输入时触发 | `(value: string) => void` |
| change | 值改变时触发 | `(value: string) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |

### Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使输入框获取焦点 | `() => void` |
| blur | 使输入框失去焦点 | `() => void` |
